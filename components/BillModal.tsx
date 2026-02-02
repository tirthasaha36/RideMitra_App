import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface BillModalProps {
  price: number;
  onClose: () => void;
}

export default function BillModal({ price, onClose }: BillModalProps) {
  return (
    <View style={styles.container}>
      
      <View style={styles.successIcon}>
         <Ionicons name="checkmark-circle" size={80} color="#2ecc71" />
      </View>

      <Text style={styles.header}>Ride Completed!</Text>
      <Text style={styles.subText}>Hope you had a safe journey.</Text>

      {/* Bill Card */}
      <View style={styles.billCard}>
        <View style={styles.row}>
          <Text style={styles.label}>Total Fare</Text>
          <Text style={styles.price}>
            {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(price)}
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.row}>
          <Text style={styles.label}>Payment</Text>
          <Text style={styles.value}>Cash</Text>
        </View>
      </View>

      {/* Rating */}
      <Text style={styles.rateText}>Rate your Driver</Text>
      <View style={styles.stars}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons key={star} name="star" size={30} color="#FFC107" style={{ marginHorizontal: 5 }} />
        ))}
      </View>

      <TouchableOpacity onPress={onClose} style={styles.homeButton}>
        <Text style={styles.buttonText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
    shadowColor: "#000",
    elevation: 10,
    paddingBottom: 40
  },
  successIcon: { marginBottom: 10 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 5 },
  subText: { color: 'gray', marginBottom: 20 },
  
  billCard: {
    width: '100%',
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  divider: { height: 1, backgroundColor: '#e0e0e0', marginVertical: 10 },
  label: { fontSize: 16, color: '#555' },
  price: { fontSize: 18, fontWeight: 'bold', color: 'black' },
  value: { fontSize: 16, fontWeight: '600' },

  rateText: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  stars: { flexDirection: 'row', marginBottom: 20 },

  homeButton: {
    backgroundColor: 'black',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center'
  },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' }
});