import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image } from 'react-native';

// 1. Define what a "Vehicle" looks like
interface Vehicle {
  id: string;
  title: string;
  multiplier: number;
  image: string;
}

// 2. Define what props this component accepts
interface RideOptionsProps {
  distance: number;
  travelTime: number;
}

const vehicles: Vehicle[] = [
  { id: '1', title: 'Uber Go', multiplier: 1, image: 'https://links.papareact.com/3pn' }, 
  { id: '2', title: 'Uber Moto', multiplier: 0.5, image: 'https://links.papareact.com/5w8' },
  { id: '3', title: 'Uber Premier', multiplier: 1.5, image: 'https://links.papareact.com/7pf' },
];

const SURGE_CHARGE_RATE = 12;

export default function RideOptions({ distance, travelTime }: RideOptionsProps) {
  // 3. FIX: Tell State it can hold a 'Vehicle' OR 'null'
  const [selected, setSelected] = useState<Vehicle | null>(null);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Select a Ride - {distance} km</Text>

      <FlatList
        data={vehicles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => setSelected(item)}
            style={[
              styles.row,
              { backgroundColor: item.id === selected?.id ? '#E0E0E0' : 'white' }
            ]}
          >
            {/* Image */}
            <Image
              style={{ width: 80, height: 80, resizeMode: 'contain' }}
              source={{ uri: item.image }}
            />

            {/* Title & Time */}
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.time}>{Math.round(travelTime)} min travel time</Text>
            </View>

            {/* Price Calculation */}
            <Text style={styles.price}>
              {new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR'
              }).format(
                (travelTime * SURGE_CHARGE_RATE * item.multiplier) / 10
                 + (distance * SURGE_CHARGE_RATE)
              )}
            </Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity 
        disabled={!selected} 
        style={[styles.button, { backgroundColor: selected ? 'black' : 'gray' }]}
      >
        <Text style={styles.buttonText}>Choose {selected?.title}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: 350,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
  },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginBottom: 5,
    borderRadius: 10,
  },
  title: { fontSize: 18, fontWeight: 'bold' },
  time: { color: 'gray' },
  price: { fontSize: 18, fontWeight: 'bold', color: '#2ecc71' },
  button: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});