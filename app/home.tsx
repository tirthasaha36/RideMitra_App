import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, Image, Animated, Easing } from 'react-native';
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
import Radar from '../components/Radar'; 
import RatingModal from '../components/RatingModal'; // <--- 1. IMPORT RATING MODAL

const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY || ""; 

const CAR_ICON = 'https://cdn-icons-png.flaticon.com/512/75/75780.png';
const BIKE_ICON = 'https://cdn-icons-png.flaticon.com/512/171/171254.png';

export default function Home() {
  const mapRef = useRef<MapView>(null);
  const router = useRouter(); 

  // --- ANIMATION VALUES ---
  const fadeAnim = useRef(new Animated.Value(1)).current; 
  const scaleAnim = useRef(new Animated.Value(1)).current; 
  const slideAnim = useRef(new Animated.Value(0)).current; 

  const [myLocation, setMyLocation] = useState({ latitude: 28.6139, longitude: 77.2090 });
  const [pickupLocation, setPickupLocation] = useState<any>(null);
  const [pickupName, setPickupName] = useState("Locating...");

  const [destination, setDestination] = useState<{latitude: number, longitude: number} | null>(null);
  const [destinationName, setDestinationName] = useState(""); 
  
  const [region, setRegion] = useState({ latitude: 28.6139, longitude: 77.2090, latitudeDelta: 0.05, longitudeDelta: 0.05 });
  
  const [rideDetails, setRideDetails] = useState<any>(null);
  
  // 2. UPDATED STATUS TYPE: Added 'rating'
  const [rideStatus, setRideStatus] = useState<'idle' | 'searching' | 'booked' | 'arrived' | 'completed' | 'rating'>('idle'); 
  
  const [assignedDriver, setAssignedDriver] = useState<any>(null);
  const [driverLocation, setDriverLocation] = useState<any>(null);
  const [vehicleIcon, setVehicleIcon] = useState(CAR_ICON);
  const [tripCost, setTripCost] = useState(0);
  const [riderIdentity, setRiderIdentity] = useState('Myself'); 

  // --- TRIGGER "MORPH" ANIMATION ---
  useEffect(() => {
    fadeAnim.setValue(0);
    scaleAnim.setValue(0.95);
    slideAnim.setValue(10);

    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 250, easing: Easing.out(Easing.back(1.5)), useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 250, useNativeDriver: true })
    ]).start();
  }, [destination]); 

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      const initialPos = { latitude, longitude };
      
      setMyLocation(initialPos);
      setPickupLocation(initialPos); 

      mapRef.current?.animateToRegion({ latitude, longitude, latitudeDelta: 0.01, longitudeDelta: 0.01 });

      try {
        let addressResponse = await Location.reverseGeocodeAsync({ latitude, longitude });
        if (addressResponse.length > 0) {
          const item = addressResponse[0];
          const address = `${item.name || item.street}, ${item.city || item.region}`;
          setPickupName(address);
        }
      } catch (e) {
        setPickupName("Current Location");
      }
    })();
  }, []);

  useEffect(() => {
    let interval: any;
    if (rideStatus === 'booked' && driverLocation && pickupLocation) {
      interval = setInterval(() => {
        setDriverLocation((prev: any) => {
          if (!prev) return prev;
          const latDiff = Math.abs(pickupLocation.latitude - prev.latitude);
          const lngDiff = Math.abs(pickupLocation.longitude - prev.longitude);
          if (latDiff < 0.0005 && lngDiff < 0.0005) {
            clearInterval(interval);
            setRideStatus('arrived');
            Alert.alert("Driver Arrived!", `Picking up ${riderIdentity === 'Myself' ? 'you' : 'your friend'}.`);
            setTimeout(() => { setRideStatus('completed'); }, 5000); 
            return prev;
          }
          const newLat = prev.latitude + (pickupLocation.latitude - prev.latitude) * 0.1;
          const newLng = prev.longitude + (pickupLocation.longitude - prev.longitude) * 0.1;
          return { latitude: newLat, longitude: newLng };
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [rideStatus, pickupLocation, driverLocation]);

  const bookRide = (vehicle: any, bookingFor: string) => {
    setDriverLocation(null); 
    setRideStatus('searching');
    setRiderIdentity(bookingFor); 
    
    if (vehicle.title.includes('Moto')) setVehicleIcon(BIKE_ICON);
    else setVehicleIcon(CAR_ICON);

    const distanceKm = rideDetails?.distance || 0;
    let basePrice = 50;
    let ratePerKm = 12; 

    if (vehicle.title.includes('Moto')) { basePrice = 20; ratePerKm = 8; } 
    else if (vehicle.title.includes('Max')) { basePrice = 80; ratePerKm = 18; }

    const finalPrice = Math.round(basePrice + (distanceKm * ratePerKm) * vehicle.multiplier);
    setTripCost(finalPrice); 

    setTimeout(() => {
      setRideStatus('booked');
      setAssignedDriver({ name: "Ramesh Kumar", carModel: vehicle.title, plate: "WB 02 AK 4921" });
      setDriverLocation({ latitude: pickupLocation.latitude - 0.005, longitude: pickupLocation.longitude - 0.005 });
    }, 4000); 
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

  // 3. CANCEL NOW TRIGGERS RATING INSTEAD OF RESET
  const handleRideEnd = () => {
    if (rideStatus === 'completed') {
      saveRideToHistory();
      setRideStatus('rating'); // <--- Go to Rating Screen
    } else {
      resetApp(); // If cancelling early, just reset
    }
  };

  // 4. FINAL RESET FUNCTION
  const resetApp = () => {
    setRideStatus('idle');
    setAssignedDriver(null);
    setDestination(null);
    setRideDetails(null);
    setDriverLocation(null);
    setDestinationName("");
    setTripCost(0); 
    setPickupLocation(myLocation); 
  };

  const handleShortcut = (lat: number, lng: number, name: string) => {
    setDestination({ latitude: lat, longitude: lng });
    setDestinationName(name); 
    fitMap(pickupLocation, { latitude: lat, longitude: lng });
  };

  const fitMap = (origin: any, dest: any) => {
    setTimeout(() => {
      mapRef.current?.fitToCoordinates([origin, dest], {
        edgePadding: { top: 180, right: 50, bottom: 350, left: 50 },
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
        showsUserLocation={rideStatus !== 'searching'} 
        onRegionChangeComplete={(r) => setRegion(r)}
      >
        {pickupLocation && <Marker coordinate={pickupLocation} title="Pickup" pinColor="green" />}
        {destination && <Marker coordinate={destination} title="Drop" pinColor="red" />}
        
        {rideStatus === 'booked' && driverLocation && (
          <Marker coordinate={driverLocation} title="Your Driver">
            <Image source={{ uri: vehicleIcon }} style={{ width: 40, height: 40, resizeMode: 'contain' }} />
          </Marker>
        )}

        {rideStatus === 'searching' && (
          <Marker coordinate={pickupLocation} anchor={{ x: 0.5, y: 0.5 }}>
            <Radar />
          </Marker>
        )}

        {pickupLocation && destination && (
          <MapViewDirections
            origin={pickupLocation} 
            destination={destination}
            apikey={GOOGLE_API_KEY}
            strokeWidth={4}
            strokeColor="hotpink"
            mode="DRIVING"
            onReady={(result) => {
              setRideDetails(result);
              fitMap(pickupLocation, destination);
            }}
            onError={(errorMessage) => console.error(errorMessage)}
          />
        )}
      </MapView>

      {/* HEADER LOGIC */}
      {rideStatus === 'idle' && (
        <SafeAreaView style={styles.headerContainer} pointerEvents="box-none">
          <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }, { translateY: slideAnim }] }}>
            {!destination ? (
              <View> 
                <View style={styles.locationBadge}>
                  <View style={styles.greenDot} />
                  <Text style={styles.locationText} numberOfLines={1}>{pickupName}</Text>
                </View>
                <View style={styles.topRow}>
                  <TouchableOpacity style={styles.menuButton} onPress={() => router.push('/profile')}>
                    <Ionicons name="menu" size={26} color="black" />
                  </TouchableOpacity>
                  <View style={styles.inputWrapper}>
                      <View style={styles.searchIcon}><Ionicons name="search" size={20} color="black" /></View>
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
                        styles={autoCompleteStyles}
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
              </View>
            ) : (
              <View style={styles.modernInputContainer}>
                <TouchableOpacity onPress={() => setDestination(null)} style={styles.backBtnAbsolute}>
                  <View style={styles.backBtnCircle}>
                    <Ionicons name="arrow-back" size={22} color="black" />
                  </View>
                </TouchableOpacity>
                <View style={styles.inputsColumn}>
                  <View style={styles.inputRow}>
                    <View style={styles.greenDot} />
                    <GooglePlacesAutocomplete
                        placeholder={pickupName}
                        nearbyPlacesAPI="GooglePlacesSearch"
                        debounce={400}
                        fetchDetails={true}
                        query={{ key: GOOGLE_API_KEY, language: 'en' }}
                        onPress={(data, details = null) => {
                            setPickupName(data.description);
                            if (details?.geometry?.location) {
                                const { lat, lng } = details.geometry.location;
                                setPickupLocation({ latitude: lat, longitude: lng });
                            }
                        }}
                        styles={{ container: { flex: 1 }, textInput: { height: 45, color: 'black', fontSize: 16, backgroundColor: '#F3F4F6', borderRadius: 25, paddingLeft: 15 }, listView: { zIndex: 9999 } }}
                      />
                  </View>
                  <View style={styles.connectorContainer}>
                     <View style={styles.connectorLine} />
                  </View>
                  <View style={styles.inputRow}>
                    <View style={styles.redSquare} />
                    <GooglePlacesAutocomplete
                        placeholder={destinationName}
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
                        styles={{ container: { flex: 1 }, textInput: { height: 45, color: 'black', fontSize: 16, backgroundColor: '#F3F4F6', borderRadius: 25, paddingLeft: 15 } }}
                      />
                  </View>
                </View>
              </View>
            )}
          </Animated.View>
        </SafeAreaView>
      )}

      {/* BOTTOM SHEET */}
      <View style={styles.bottomSheet}>
        {rideStatus === 'searching' && (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingTitle}>Connecting nearby drivers...</Text>
            <Text style={styles.loadingSubtitle}>
              {riderIdentity === 'Myself' ? "Finding a ride for you" : "Finding a ride for your friend"}
            </Text>
          </View>
        )}
        
        {(rideStatus === 'booked' || rideStatus === 'arrived') && assignedDriver && (
          <DriverModal driver={assignedDriver} onCancel={resetApp} />
        )}
        
        {rideStatus === 'idle' && rideDetails && (
          <RideOptions distance={rideDetails.distance} travelTime={rideDetails.duration} onBook={bookRide} />
        )}
        
        {/* 5. PASS HANDLE RIDE END TO BILL */}
        {rideStatus === 'completed' && (
          <BillModal price={tripCost} onClose={handleRideEnd} />
        )}
      </View>

      {/* 6. RATING MODAL (SHOWN ON TOP OF EVERYTHING) */}
      {rideStatus === 'rating' && assignedDriver && (
        <RatingModal 
          driverName={assignedDriver.name} 
          onSubmit={() => {
            Alert.alert("Rated!", "Thanks for your feedback.");
            resetApp(); // Back to Start
          }} 
        />
      )}

    </View>
  );
}

const autoCompleteStyles = { 
  container: { flex: 1 }, 
  textInput: { fontSize: 18, backgroundColor: 'transparent', height: 50, marginTop: 0, color: 'black' },
  textInputContainer: { alignItems: 'center' }
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  map: { width: '100%', height: '100%' },
  headerContainer: { position: 'absolute', top: 10, width: '100%', zIndex: 1, paddingHorizontal: 15 },
  modernInputContainer: { backgroundColor: 'white', borderRadius: 25, paddingVertical: 20, paddingHorizontal: 15, marginHorizontal: 5, marginTop: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 10, flexDirection: 'row', alignItems: 'center' },
  backBtnAbsolute: { marginRight: 10 },
  backBtnCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
  inputsColumn: { flex: 1 },
  inputRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  connectorContainer: { paddingLeft: 11, height: 15, justifyContent: 'center' },
  connectorLine: { width: 2, height: '100%', backgroundColor: '#E5E7EB', marginBottom: 5 },
  greenDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#2ecc71', marginRight: 12 },
  redSquare: { width: 8, height: 8, backgroundColor: '#e74c3c', marginRight: 12 },
  locationBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 25, alignSelf: 'center', marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4, maxWidth: '85%' },
  locationText: { fontWeight: '600', fontSize: 14, color: '#333' },
  topRow: { flexDirection: 'row', alignItems: 'flex-start', width: '100%' },
  menuButton: { backgroundColor: 'white', width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center', marginRight: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 5 },
  inputWrapper: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 30, paddingHorizontal: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.12, shadowRadius: 10, elevation: 6, height: 50 },
  searchIcon: { marginLeft: 5, marginRight: 5 },
  shortcutContainer: { flexDirection: 'row', marginTop: 15, paddingLeft: 62 },
  shortcutBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 25, marginRight: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 3 },
  iconCircle: { width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  shortcutText: { fontWeight: 'bold', fontSize: 14, color: '#333' },
  bottomSheet: { position: 'absolute', bottom: 0, width: '100%', zIndex: 3 },
  loadingContainer: { padding: 30, backgroundColor: 'white', alignItems: 'center', borderTopLeftRadius: 20, borderTopRightRadius: 20, shadowColor: "#000", elevation: 10 },
  loadingTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  loadingSubtitle: { fontSize: 14, color: 'gray' },
});