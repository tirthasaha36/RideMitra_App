import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

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
        
        {/* Call Button */}
        <TouchableOpacity style={styles.callButton}>
          <Text style={styles.callIcon}>📞</Text>
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
  
  callButton: { backgroundColor: '#f0f0f0', padding: 10, borderRadius: 25 },
  callIcon: { fontSize: 20 },

  cancelBtn: { backgroundColor: '#ffebee', padding: 15, borderRadius: 10, alignItems: 'center' },
  cancelText: { color: '#d32f2f', fontWeight: 'bold', fontSize: 16 },
});