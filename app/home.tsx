import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator, Text, TouchableOpacity, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapViewDirections from 'react-native-maps-directions';
import * as Location from 'expo-location'; 
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

import DriverModal from '../components/DriverModal'; 
import RideOptions from '../components/RideOptions'; 
import BillModal from '../components/BillModal';

const GOOGLE_API_KEY = "AIzaSyCUP16Q90k7YigrYF-jgxLSUWGAVo9yjdo"; 

// --- ICON URLS ---
const CAR_ICON = 'https://cdn-icons-png.flaticon.com/512/75/75780.png';
const BIKE_ICON = 'https://cdn-icons-png.flaticon.com/512/171/171254.png';

export default function Home() {
  const mapRef = useRef<MapView>(null);
  const router = useRouter(); 

  const [myLocation, setMyLocation] = useState({ latitude: 28.6139, longitude: 77.2090 });
  const [region, setRegion] = useState({ latitude: 28.6139, longitude: 77.2090, latitudeDelta: 0.05, longitudeDelta: 0.05 });
  const [destination, setDestination] = useState<{latitude: number, longitude: number} | null>(null);
  const [destinationName, setDestinationName] = useState(""); 
  
  const [rideDetails, setRideDetails] = useState<any>(null);
  const [rideStatus, setRideStatus] = useState<'idle' | 'searching' | 'booked' | 'arrived' | 'completed'>('idle'); 
  const [assignedDriver, setAssignedDriver] = useState<any>(null);
  const [driverLocation, setDriverLocation] = useState<any>(null);
  const [vehicleIcon, setVehicleIcon] = useState(CAR_ICON);
  const [tripCost, setTripCost] = useState(0);

  // 1. NEW STATE: Current Address Text
  const [currentAddress, setCurrentAddress] = useState("Locating...");

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      setMyLocation({ latitude, longitude });
      
      mapRef.current?.animateToRegion({ latitude, longitude, latitudeDelta: 0.01, longitudeDelta: 0.01 });

      // 2. REVERSE GEOCODING (Get Address from Lat/Lng)
      try {
        let addressResponse = await Location.reverseGeocodeAsync({ latitude, longitude });
        
        if (addressResponse.length > 0) {
          const item = addressResponse[0];
          // Construct a simple address string
          const address = `${item.name || item.street}, ${item.city || item.region}`;
          setCurrentAddress(address);
        }
      } catch (e) {
        console.warn("Could not fetch address");
        setCurrentAddress("Unknown Location");
      }
    })();
  }, []);

  useEffect(() => {
    let interval: any;
    if (rideStatus === 'booked' && driverLocation && myLocation) {
      interval = setInterval(() => {
        setDriverLocation((prev: any) => {
          if (!prev) return prev;
          const latDiff = Math.abs(myLocation.latitude - prev.latitude);
          const lngDiff = Math.abs(myLocation.longitude - prev.longitude);
          if (latDiff < 0.0005 && lngDiff < 0.0005) {
            clearInterval(interval);
            setRideStatus('arrived');
            Alert.alert("Driver Arrived!", "Hop in, your ride is starting.");
            setTimeout(() => { setRideStatus('completed'); }, 5000); 
            return prev;
          }
          const newLat = prev.latitude + (myLocation.latitude - prev.latitude) * 0.1;
          const newLng = prev.longitude + (myLocation.longitude - prev.longitude) * 0.1;
          return { latitude: newLat, longitude: newLng };
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [rideStatus, myLocation, driverLocation]);

  const bookRide = (vehicle: any) => {
    setRideStatus('searching');
    if (vehicle.title.includes('Moto')) {
      setVehicleIcon(BIKE_ICON);
    } else {
      setVehicleIcon(CAR_ICON);
    }

    const distanceKm = rideDetails?.distance || 0;
    let basePrice = 50;
    let ratePerKm = 12; 

    if (vehicle.title.includes('Moto')) {
      basePrice = 20;
      ratePerKm = 8; 
    } else if (vehicle.title.includes('Premier')) {
      basePrice = 80;
      ratePerKm = 18; 
    }

    const finalPrice = Math.round(basePrice + (distanceKm * ratePerKm));
    setTripCost(finalPrice); 

    setTimeout(() => {
      setRideStatus('booked');
      setAssignedDriver({ name: "Ramesh Kumar", carModel: vehicle.title, plate: "WB 02 AK 4921" });
      setDriverLocation({ latitude: myLocation.latitude - 0.005, longitude: myLocation.longitude - 0.005 });
    }, 3000); 
  };

  const saveRideToHistory = async () => {
    try {
      const newRide = {
        id: Date.now().toString(),
        place: destinationName || "Unknown Location",
        date: new Date().toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        price: `₹${tripCost}`,
        status: 'Completed'
      };
      const existingRides = await AsyncStorage.getItem('rideHistory');
      const history = existingRides ? JSON.parse(existingRides) : [];
      const updatedHistory = [newRide, ...history];
      await AsyncStorage.setItem('rideHistory', JSON.stringify(updatedHistory));
    } catch (error) {
      console.error("Failed to save ride", error);
    }
  };

  const cancelRide = () => {
    if (rideStatus === 'completed') {
      saveRideToHistory();
    }
    setRideStatus('idle');
    setAssignedDriver(null);
    setDestination(null);
    setRideDetails(null);
    setDriverLocation(null);
    setDestinationName("");
    setTripCost(0); 
  };

  const handleShortcut = (lat: number, lng: number, name: string) => {
    setDestination({ latitude: lat, longitude: lng });
    setDestinationName(name); 
    setTimeout(() => {
      mapRef.current?.fitToCoordinates([myLocation, { latitude: lat, longitude: lng }], {
        edgePadding: { top: 100, right: 50, bottom: 350, left: 50 },
        animated: true,
      });
    }, 500);
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={region} 
        showsUserLocation={true} 
        onRegionChangeComplete={(r) => setRegion(r)}
      >
        {destination && <Marker coordinate={destination} title="Drop Location" pinColor="blue" />}
        
        {rideStatus === 'booked' && driverLocation && (
          <Marker coordinate={driverLocation} title="Your Driver">
            <Image 
              source={{ uri: vehicleIcon }} 
              style={{ width: 40, height: 40, resizeMode: 'contain' }} 
            />
          </Marker>
        )}

        {destination && (
          <MapViewDirections
            origin={myLocation} 
            destination={destination}
            apikey={GOOGLE_API_KEY}
            strokeWidth={4}
            strokeColor="hotpink"
            mode="DRIVING"
            onReady={(result) => {
              setRideDetails(result);
              mapRef.current?.fitToCoordinates(result.coordinates, { edgePadding: { top: 100, right: 50, bottom: 350, left: 50 }, animated: true });
            }}
            onError={(errorMessage) => console.error(errorMessage)}
          />
        )}
      </MapView>

      {rideStatus === 'idle' && (
        <SafeAreaView style={styles.headerContainer}>
          
          {/* 3. CURRENT ADDRESS BADGE */}
          <View style={styles.locationBadge}>
            <Ionicons name="location" size={16} color="#2196F3" />
            <Text style={styles.locationText} numberOfLines={1}>
              {currentAddress}
            </Text>
          </View>

          <View style={styles.topRow}>
            <TouchableOpacity style={styles.menuButton} onPress={() => router.push('/profile')}>
              <Ionicons name="menu" size={28} color="black" />
            </TouchableOpacity>

            <View style={styles.inputWrapper}>
                <GooglePlacesAutocomplete
                  placeholder="Where to?"
                  nearbyPlacesAPI="GooglePlacesSearch"
                  debounce={400}
                  fetchDetails={true}
                  query={{ key: GOOGLE_API_KEY, language: 'en' }}
                  onPress={(data, details = null) => {
                      setDestinationName(data.description); 
                      if (details?.geometry?.location) {
                          const { lat, lng } = details.geometry.location;
                          setDestination({ latitude: lat, longitude: lng });
                      }
                  }}
                  styles={{ container: { flex: 0 }, textInput: { fontSize: 18, backgroundColor: '#f0f0f0', borderRadius: 10, height: 50 } }}
                />
            </View>
          </View>

          <View style={styles.shortcutContainer}>
            <TouchableOpacity style={styles.shortcutBtn} onPress={() => handleShortcut(28.6139, 77.2090, "Home")}>
              <View style={[styles.iconCircle, { backgroundColor: '#2196F3' }]}>
                <Ionicons name="home" size={18} color="white" />
              </View>
              <Text style={styles.shortcutText}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shortcutBtn} onPress={() => handleShortcut(28.4595, 77.0266, "Work")}>
              <View style={[styles.iconCircle, { backgroundColor: '#FF9800' }]}>
                <Ionicons name="briefcase" size={18} color="white" />
              </View>
              <Text style={styles.shortcutText}>Work</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      )}

      <View style={styles.bottomSheet}>
        {rideStatus === 'searching' && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="black" />
            <Text style={styles.loadingText}>Looking for nearby drivers...</Text>
          </View>
        )}
        {(rideStatus === 'booked' || rideStatus === 'arrived') && assignedDriver && (
          <DriverModal driver={assignedDriver} onCancel={cancelRide} />
        )}
        {rideStatus === 'idle' && rideDetails && (
          <RideOptions distance={rideDetails.distance} travelTime={rideDetails.duration} onBook={bookRide} />
        )}
        
        {rideStatus === 'completed' && (
          <BillModal price={tripCost} onClose={cancelRide} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  map: { width: '100%', height: '100%' },
  headerContainer: { position: 'absolute', top: 10, width: '100%', zIndex: 1, paddingHorizontal: 15 },
  
  // NEW STYLES FOR ADDRESS BADGE
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
    maxWidth: '90%',
  },
  locationText: {
    marginLeft: 6,
    fontWeight: '600',
    fontSize: 13,
    color: '#333',
  },

  topRow: { flexDirection: 'row', alignItems: 'flex-start', width: '100%' },
  menuButton: { backgroundColor: 'white', padding: 10, borderRadius: 10, marginTop: 5, marginRight: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 5, elevation: 5, height: 50, width: 50, alignItems: 'center', justifyContent: 'center' },
  inputWrapper: { flex: 1, backgroundColor: 'white', borderRadius: 10, padding: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 5, elevation: 5 },
  shortcutContainer: { flexDirection: 'row', marginTop: 15, paddingLeft: 60 },
  shortcutBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20, marginRight: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 3 },
  iconCircle: { width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  shortcutText: { fontWeight: 'bold', fontSize: 14, color: '#333' },
  bottomSheet: { position: 'absolute', bottom: 0, width: '100%', zIndex: 3 },
  loadingContainer: { padding: 30, backgroundColor: 'white', alignItems: 'center', borderTopLeftRadius: 20, borderTopRightRadius: 20, shadowColor: "#000", shadowOffset: { width: 0, height: -3 }, shadowOpacity: 0.1, shadowRadius: 5, elevation: 10 },
  loadingText: { marginTop: 10, fontWeight: 'bold', fontSize: 16 }
});