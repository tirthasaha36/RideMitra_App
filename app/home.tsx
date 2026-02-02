import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator, Text, TouchableOpacity, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapViewDirections from 'react-native-maps-directions';
import * as Location from 'expo-location'; 
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import DriverModal from '../components/DriverModal'; 
import RideOptions from '../components/RideOptions'; 
import BillModal from '../components/BillModal'; // Ensure this exists

const GOOGLE_API_KEY = "AIzaSyCUP16Q90k7YigrYF-jgxLSUWGAVo9yjdo"; 

export default function Home() {
  const mapRef = useRef<MapView>(null);
  const router = useRouter(); 

  // Default to a placeholder (New Delhi) until we get real location
  const [myLocation, setMyLocation] = useState({
    latitude: 28.6139,
    longitude: 77.2090,
  });

  const [region, setRegion] = useState({
    latitude: 28.6139,
    longitude: 77.2090,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  const [destination, setDestination] = useState<{latitude: number, longitude: number} | null>(null);
  const [rideDetails, setRideDetails] = useState<any>(null);
  
  // Updated rideStatus type to include 'arrived' and 'completed'
  const [rideStatus, setRideStatus] = useState<'idle' | 'searching' | 'booked' | 'arrived' | 'completed'>('idle'); 
  
  const [assignedDriver, setAssignedDriver] = useState<any>(null);
  
  // Driver's current position (starts null)
  const [driverLocation, setDriverLocation] = useState<any>(null);

  // --- 1. GET REAL LOCATION ON STARTUP ---
  useEffect(() => {
    (async () => {
      // 1. Ask Permission
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Allow location access to use this app.');
        return;
      }

      // 2. Get Location
      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      // 3. Update State
      setMyLocation({ latitude, longitude });
      
      // 4. Zoom Map to User
      mapRef.current?.animateToRegion({
        latitude,
        longitude,
        latitudeDelta: 0.01, // Zoom level (smaller is closer)
        longitudeDelta: 0.01,
      });
    })();
  }, []);

  // --- 2. SMART DRIVER MOVEMENT & TRIP LOGIC ---
  useEffect(() => {
    let interval: any;

    if (rideStatus === 'booked' && driverLocation && myLocation) {
      interval = setInterval(() => {
        setDriverLocation((prev: any) => {
          if (!prev) return prev;

          // 1. Calculate Distance roughly
          const latDiff = Math.abs(myLocation.latitude - prev.latitude);
          const lngDiff = Math.abs(myLocation.longitude - prev.longitude);

          // 2. CHECK IF DRIVER ARRIVED (Threshold: 0.0005)
          if (latDiff < 0.0005 && lngDiff < 0.0005) {
            clearInterval(interval);
            setRideStatus('arrived'); // <--- New Status
            Alert.alert("Driver Arrived!", "Hop in, your ride is starting.");
            
            // 3. START TRIP SIMULATION (After 2 seconds, move to 'completed')
            setTimeout(() => {
               setRideStatus('completed');
            }, 5000); // Simulate a 5-second trip for demo
            
            return prev; // Stop moving
          }

          // Move closer if not arrived yet
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
    
    setTimeout(() => {
      setRideStatus('booked');
      setAssignedDriver({
        name: "Ramesh Kumar",
        carModel: vehicle.title, 
        plate: "WB 02 AK 4921",
      });

      // 1. Set Driver Start Position (Simulate him being 0.005 degrees away)
      // This places the car slightly offset from your current location
      setDriverLocation({
        latitude: myLocation.latitude - 0.005,
        longitude: myLocation.longitude - 0.005,
      });

    }, 3000); 
  };

  const cancelRide = () => {
    setRideStatus('idle');
    setAssignedDriver(null);
    setDestination(null);
    setRideDetails(null);
    setDriverLocation(null);
  };

  return (
    <View style={styles.container}>
      
      {/* --- MAP SECTION --- */}
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={region} 
        showsUserLocation={true} 
        onRegionChangeComplete={(r) => setRegion(r)}
      >
        {destination && (
          <Marker coordinate={destination} title="Drop Location" pinColor="blue" />
        )}

        {/* DRIVER CAR MARKER */}
        {rideStatus === 'booked' && driverLocation && (
          <Marker coordinate={driverLocation} title="Your Driver">
            <Image 
              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/75/75780.png' }} 
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
              mapRef.current?.fitToCoordinates(result.coordinates, {
                edgePadding: { top: 100, right: 50, bottom: 350, left: 50 },
                animated: true,
              });
            }}
            onError={(errorMessage) => console.error(errorMessage)}
          />
        )}
      </MapView>

      {/* --- HEADER SECTION (Menu + Search) --- */}
      {rideStatus === 'idle' && (
        <SafeAreaView style={styles.headerContainer}>
          
          {/* MENU BUTTON */}
          <TouchableOpacity 
            style={styles.menuButton} 
            onPress={() => router.push('/profile')}
          >
            <Ionicons name="menu" size={28} color="black" />
          </TouchableOpacity>

          {/* SEARCH BAR */}
          <View style={styles.inputWrapper}>
              <GooglePlacesAutocomplete
                placeholder="Where to?"
                nearbyPlacesAPI="GooglePlacesSearch"
                debounce={400}
                fetchDetails={true}
                query={{
                    key: GOOGLE_API_KEY,
                    language: 'en',
                }}
                onPress={(data, details = null) => {
                    if (details?.geometry?.location) {
                        const { lat, lng } = details.geometry.location;
                        setDestination({ latitude: lat, longitude: lng });
                    }
                }}
                styles={{
                    container: { flex: 0 },
                    textInput: { 
                        fontSize: 18, backgroundColor: '#f0f0f0', borderRadius: 10, height: 50,
                    },
                }}
              />
          </View>
        </SafeAreaView>
      )}

      {/* --- BOTTOM SHEET --- */}
      <View style={styles.bottomSheet}>
        
        {rideStatus === 'searching' && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="black" />
            <Text style={styles.loadingText}>Looking for nearby drivers...</Text>
          </View>
        )}

        {/* Show Driver Info when Booked OR Arrived */}
        {(rideStatus === 'booked' || rideStatus === 'arrived') && assignedDriver && (
          <DriverModal driver={assignedDriver} onCancel={cancelRide} />
        )}

        {rideStatus === 'idle' && rideDetails && (
          <RideOptions 
            distance={rideDetails.distance}
            travelTime={rideDetails.duration}
            onBook={bookRide} 
          />
        )}

        {/* NEW: Bill Modal */}
        {rideStatus === 'completed' && (
          <BillModal 
            price={450} // You can calculate this dynamically later
            onClose={cancelRide} 
          />
        )}
        
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  map: { width: '100%', height: '100%' },
  
  // Updated Header Styles
  headerContainer: {
    position: 'absolute',
    top: 10,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: 15,
    zIndex: 1, 
  },
  menuButton: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    marginTop: 5, 
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    height: 50, 
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },

  bottomSheet: { position: 'absolute', bottom: 0, width: '100%', zIndex: 2 },
  loadingContainer: { padding: 30, backgroundColor: 'white', alignItems: 'center', borderTopLeftRadius: 20, borderTopRightRadius: 20, shadowColor: "#000", shadowOffset: { width: 0, height: -3 }, shadowOpacity: 0.1, shadowRadius: 5, elevation: 10 },
  loadingText: { marginTop: 10, fontWeight: 'bold', fontSize: 16 }
});