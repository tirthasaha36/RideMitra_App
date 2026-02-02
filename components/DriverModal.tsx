import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Better icons

// 1. Define what a "Driver" looks like
interface Driver {
  name: string;
  carModel: string;
  plate: string;
}

// 2. Define the props this component expects
interface DriverModalProps {
  driver: Driver;
  onCancel: () => void;
}

export default function DriverModal({ driver, onCancel }: DriverModalProps) {
  if (!driver) return null;

  // --- FUNCTION TO OPEN DIALER ---
  const handleCall = () => {
    const phoneNumber = '+919876543210'; // Dummy Driver Number
    
    // Attempt to open the dialer
    Linking.canOpenURL(`tel:${phoneNumber}`)
      .then((supported) => {
        if (!supported) {
          Alert.alert("Error", "Phone calls are not supported on this simulator/device");
        } else {
          return Linking.openURL(`tel:${phoneNumber}`);
        }
      })
      .catch((err) => console.error('An error occurred', err));
  };

  return (
    <View style={styles.container}>
      {/* Header: Meet at... */}
      <View style={styles.header}>
        <Text style={styles.timeText}>Arriving in 4 mins</Text>
        <Text style={styles.otpText}>OTP: 4921</Text>
      </View>

      {/* Driver Info Row */}
      <View style={styles.driverRow}>
        <Image 
          source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }} 
          style={styles.avatar} 
        />
        <View style={styles.driverInfo}>
          <Text style={styles.name}>{driver.name}</Text>
          <Text style={styles.car}>{driver.carModel} • {driver.plate}</Text>
          <Text style={styles.rating}>⭐ 4.8 (1,204 rides)</Text>
        </View>
        
        {/* Call Button (UPDATED) */}
        <TouchableOpacity style={styles.callButton} onPress={handleCall}>
          <Ionicons name="call" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Cancel Button */}
      <TouchableOpacity onPress={onCancel} style={styles.cancelBtn}>
        <Text style={styles.cancelText}>Cancel Ride</Text>
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  timeText: { fontSize: 16, fontWeight: 'bold', color: '#2ecc71' },
  otpText: { fontSize: 16, fontWeight: 'bold', color: 'black' },
  
  driverRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  avatar: { width: 60, height: 60, borderRadius: 30, marginRight: 15 },
  driverInfo: { flex: 1 },
  name: { fontSize: 18, fontWeight: 'bold' },
  car: { color: 'gray', marginTop: 2 },
  rating: { fontSize: 12, color: 'gray', marginTop: 4 },
  
  // Updated Call Button Style
  callButton: { 
    backgroundColor: '#2ecc71', // Green color
    width: 50,
    height: 50,
    borderRadius: 25, 
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5
  },

  cancelBtn: { backgroundColor: '#ffebee', padding: 15, borderRadius: 10, alignItems: 'center' },
  cancelText: { color: '#d32f2f', fontWeight: 'bold', fontSize: 16 },
});