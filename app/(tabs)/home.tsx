import React, { useState, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapViewDirections from 'react-native-maps-directions';

// Make sure RideOptions.tsx is in the same folder, or adjust path: './components/RideOptions'
import RideOptions from './RideOptions'; 

// ⚠️ SECURITY NOTE: In a real app, store this in an .env file.
const GOOGLE_API_KEY = "AIzaSyCUP16Q90k7YigrYF-jgxLSUWGAVo9yjdo"; 

export default function App() {
  const mapRef = useRef<MapView>(null);

  // 1. MY LOCATION (Fixed Origin)
  const [myLocation, setMyLocation] = useState({
    latitude: 28.6139,
    longitude: 77.2090,
  });

  // 2. THE CAMERA VIEW (Movable Region)
  const [region, setRegion] = useState({
    latitude: 28.6139,
    longitude: 77.2090,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  // 3. DESTINATION (Drop-off point)
  const [destination, setDestination] = useState<{latitude: number, longitude: number} | null>(null);

  // 4. RIDE STATS (Distance/Duration)
  // We use <any> here to prevent the TypeScript error you were seeing
  const [rideDetails, setRideDetails] = useState<any>(null);

  return (
    <View style={styles.container}>
      
      {/* --- MAP SECTION --- */}
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={region} 
        onRegionChangeComplete={(r) => setRegion(r)}
      >
        {/* User's Location (Origin) */}
        <Marker coordinate={myLocation} title="Pickup Location" />

        {/* Destination (Drop) */}
        {destination && (
          <Marker 
            coordinate={destination} 
            title="Drop Location" 
            pinColor="blue" 
          />
        )}

        {/* Route Line */}
        {destination && (
          <MapViewDirections
            origin={myLocation} 
            destination={destination}
            apikey={GOOGLE_API_KEY}
            strokeWidth={4}
            strokeColor="hotpink"
            mode="DRIVING"
            onReady={(result) => {
              // Save the details (distance/duration) to State
              setRideDetails(result);

              // Auto-zoom map to fit both markers
              mapRef.current?.fitToCoordinates(result.coordinates, {
                edgePadding: { top: 100, right: 50, bottom: 350, left: 50 }, // Added bottom padding for the sheet
                animated: true,
              });
            }}
            onError={(errorMessage) => {
              console.error("Route Error:", errorMessage);
            }}
          />
        )}
      </MapView>

      {/* --- SEARCH BAR SECTION --- */}
      {/* We hide the search bar if a ride is selected to clear up the screen, 
          or you can keep it. I left it visible. */}
      <SafeAreaView style={styles.searchContainer}>
        <View style={styles.inputWrapper}>
            <GooglePlacesAutocomplete
            placeholder="Where do you want to go?"
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
                    fontSize: 18, 
                    backgroundColor: '#f0f0f0', 
                    borderRadius: 10,
                    height: 50,
                },
            }}
            />
        </View>
      </SafeAreaView>

      {/* --- VEHICLE SELECTION BOTTOM SHEET --- */}
      {rideDetails && (
        <View style={styles.bottomSheet}>
          <RideOptions 
            distance={rideDetails.distance}
            travelTime={rideDetails.duration} 
          />
        </View>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: '#fff',
  },
  map: { 
    width: '100%', 
    height: '100%',
  },
  searchContainer: {
    position: 'absolute',
    top: 10,
    width: '100%',
    alignItems: 'center',
    zIndex: 1, 
  },
  inputWrapper: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    zIndex: 2, // Ensures it sits on top of the map
  },
});