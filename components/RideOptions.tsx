import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image, Dimensions } from 'react-native';

interface RideOptionsProps {
  distance: number;
  travelTime: number;
  onBook: (vehicle: any) => void;
}

const rides = [
  {
    id: 'Moto-123',
    title: 'MotoGo',
    multiplier: 0.5,
    image: 'https://cdn-icons-png.flaticon.com/512/171/171254.png', 
    desc: 'Zip through traffic',
    isPromo: false
  },
  {
    id: 'Auto-456',
    title: 'TukTuk',
    multiplier: 0.7,
    image: 'https://cdn-icons-png.flaticon.com/512/2312/2312953.png', 
    desc: 'Open air breeze',
    isPromo: true
  },
  {
    id: 'Lite-789',
    title: 'GoLite',
    multiplier: 1,
    image: 'https://cdn-icons-png.flaticon.com/512/3202/3202926.png', 
    desc: 'Pocket friendly AC ride',
    isPromo: false
  },
  {
    id: 'Plus-101',
    title: 'Ride+',
    multiplier: 1.2,
    image: 'https://cdn-icons-png.flaticon.com/512/75/75780.png', 
    desc: 'Comfy sedan for you',
    isPromo: false
  },
  {
    id: 'Smooth-112',
    title: 'SmoothGo',
    multiplier: 1.5,
    image: 'https://cdn-icons-png.flaticon.com/512/55/55283.png', 
    desc: 'Premium experience',
    isPromo: false
  },
  {
    id: 'Max-131',
    title: 'MaxCab',
    multiplier: 1.8,
    image: 'https://cdn-icons-png.flaticon.com/512/846/846296.png', 
    desc: 'For the whole gang',
    isPromo: false
  },
];

export default function RideOptions({ distance, travelTime, onBook }: RideOptionsProps) {
  const [selected, setSelected] = useState<any>(null); 

  const getPrice = (multiplier: number) => {
    const baseRate = 50;
    const ratePerKm = 12;
    const price = (baseRate + (distance * ratePerKm)) * multiplier;
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);
  };

  return (
    <View style={styles.container}>
      
      {/* Header Info */}
      <View style={styles.header}>
        <Text style={styles.title}>Select a Ride</Text>
        <Text style={styles.distance}>{distance.toFixed(1)} km • {Math.round(travelTime)} min</Text>
      </View>

      <FlatList
        data={rides}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={[
              styles.rideCard, 
              selected?.id === item.id && styles.selectedCard 
            ]}
            onPress={() => setSelected(item)}
          >
            <Image
              style={styles.image}
              source={{ uri: item.image }}
              resizeMode="contain"
            />
            <View style={styles.details}>
              <Text style={styles.rideTitle}>{item.title}</Text>
              <Text style={styles.rideDesc}>{item.desc}</Text>
              {item.isPromo && (
                <View style={styles.promoBadge}>
                  <Text style={styles.promoText}>Best Value</Text>
                </View>
              )}
            </View>
            <Text style={styles.price}>
              {getPrice(item.multiplier)}
            </Text>
          </TouchableOpacity>
        )}
        style={styles.list}
      />

      {/* Book Button */}
      <TouchableOpacity 
        disabled={!selected} 
        style={[styles.bookButton, !selected && { backgroundColor: '#e0e0e0', opacity: 0.5 }]}
        onPress={() => onBook(selected)}
      >
        <Text style={[styles.bookText, !selected && { color: '#999' }]}>
          {selected ? `Book ${selected.title}` : 'Select a Ride'}
        </Text>
      </TouchableOpacity>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 20,
    
    // IMPORTANT FIX: Strict height limit
    height: 400, // Fixed height in pixels (safe for most screens)
    // Or you can use maxHeight: '40%' if you prefer percentage
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 10
  },
  title: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  distance: { fontSize: 14, color: 'gray', fontWeight: '600' },

  list: {
    flex: 1, // Ensures list takes remaining space inside the fixed height
  },

  // CARD STYLES
  rideCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12, 
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#f0f0f0' 
  },
  selectedCard: {
    borderColor: '#FFC107', 
    backgroundColor: '#FFF8E1', 
  },
  image: {
    width: 50, 
    height: 50,
    marginRight: 10
  },
  details: {
    flex: 1,
  },
  rideTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  rideDesc: {
    fontSize: 12,
    color: 'gray',
    marginTop: 2,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  
  promoBadge: {
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 4
  },
  promoText: {
    color: '#2e7d32',
    fontSize: 10,
    fontWeight: 'bold'
  },

  bookButton: {
    backgroundColor: '#FFC107', 
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  bookText: {
    color: 'black', 
    fontSize: 18,
    fontWeight: 'bold',
  }
});