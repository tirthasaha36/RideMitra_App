import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; // Import Router

interface Driver {
  name: string;
  carModel: string;
  plate: string;
}

interface DriverModalProps {
  driver: Driver;
  onCancel: () => void;
}

export default function DriverModal({ driver, onCancel }: DriverModalProps) {
  const router = useRouter(); // Initialize Router

  if (!driver) return null;

  const handleCall = () => {
    const phoneNumber = '+919876543210'; 
    Linking.openURL(`tel:${phoneNumber}`).catch(() => 
      Alert.alert("Error", "Unable to open dialer")
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
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
        
        {/* ACTION BUTTONS */}
        <View style={styles.actionButtons}>
          
          {/* 1. MESSAGE BUTTON */}
          <TouchableOpacity 
            style={[styles.iconBtn, { backgroundColor: '#E3F2FD', marginRight: 10 }]}
            onPress={() => router.push({ pathname: '/chat', params: { name: driver.name } })}
          >
            <Ionicons name="chatbubble" size={22} color="#2196F3" />
          </TouchableOpacity>

          {/* 2. CALL BUTTON */}
          <TouchableOpacity 
            style={[styles.iconBtn, { backgroundColor: '#E8F5E9' }]} 
            onPress={handleCall}
          >
            <Ionicons name="call" size={22} color="#2ecc71" />
          </TouchableOpacity>

        </View>
      </View>

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
  
  actionButtons: { flexDirection: 'row' },
  
  iconBtn: { 
    width: 45, height: 45, borderRadius: 25, 
    alignItems: 'center', justifyContent: 'center' 
  },

  cancelBtn: { backgroundColor: '#ffebee', padding: 15, borderRadius: 10, alignItems: 'center' },
  cancelText: { color: '#d32f2f', fontWeight: 'bold', fontSize: 16 },
});