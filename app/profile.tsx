import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Profile() {
  const router = useRouter();
  const [rides, setRides] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      const loadHistory = async () => {
        try {
          const storedRides = await AsyncStorage.getItem('rideHistory');
          if (storedRides) setRides(JSON.parse(storedRides));
        } catch (e) { console.error("Failed to load history"); }
      };
      loadHistory();
    }, [])
  );

  const clearHistory = async () => {
    await AsyncStorage.removeItem('rideHistory');
    setRides([]);
  };

  return (
    <View style={styles.container}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* USER CARD */}
        <View style={styles.userCard}>
          <Image source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }} style={styles.avatar} />
          <View>
            <Text style={styles.userName}>Tirtha Jyoti</Text>
            <Text style={styles.userPhone}>+91 98765 43210</Text>
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={12} color="white" />
              <Text style={styles.ratingText}>4.9</Text>
            </View>
          </View>
        </View>

        {/* MENU OPTIONS (Updated) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          {/* LINK TO WALLET */}
          <MenuOption 
            icon="wallet-outline" 
            title="Wallet & Payment" 
            onPress={() => router.push('/wallet')} 
          />
          
          <MenuOption icon="location-outline" title="Saved Places" onPress={() => {}} />
          <MenuOption icon="settings-outline" title="Settings" onPress={() => {}} />
        </View>

        {/* RIDE HISTORY */}
        <View style={styles.section}>
          <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
            <Text style={styles.sectionTitle}>Recent Rides</Text>
            {rides.length > 0 && (
              <TouchableOpacity onPress={clearHistory}>
                <Text style={{color:'red', fontSize:12}}>Clear All</Text>
              </TouchableOpacity>
            )}
          </View>
          
          {rides.length === 0 ? (
            <Text style={{color:'gray', fontStyle:'italic', marginTop:10}}>No rides yet.</Text>
          ) : (
            rides.map((ride: any) => (
              <View key={ride.id} style={styles.rideRow}>
                <View style={styles.rideIcon}>
                  <Ionicons name="car" size={20} color="#555" />
                </View>
                <View style={{ flex: 1, marginLeft: 15 }}>
                  <Text style={styles.rideDest} numberOfLines={1}>{ride.place}</Text>
                  <Text style={styles.rideDate}>{ride.date}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.ridePrice}>{ride.price}</Text>
                  <Text style={[styles.rideStatus, { color: 'green' }]}>Completed</Text>
                </View>
              </View>
            ))
          )}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={() => router.replace('/login')}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

// Updated MenuOption to accept onPress
function MenuOption({ icon, title, onPress }: { icon: any, title: string, onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.menuRow} onPress={onPress}>
      <View style={styles.menuIconBox}>
        <Ionicons name={icon} size={22} color="black" />
      </View>
      <Text style={styles.menuText}>{title}</Text>
      <Ionicons name="chevron-forward" size={20} color="#ccc" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F9F9', paddingTop: 50 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 20 },
  backButton: { padding: 10, backgroundColor: 'white', borderRadius: 20, elevation: 2 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', marginLeft: 20 },
  userCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', marginHorizontal: 20, padding: 20, borderRadius: 15, elevation: 3, marginBottom: 25 },
  avatar: { width: 70, height: 70, borderRadius: 35, marginRight: 15 },
  userName: { fontSize: 20, fontWeight: 'bold' },
  userPhone: { color: 'gray', marginTop: 2, marginBottom: 5 },
  ratingBadge: { flexDirection: 'row', backgroundColor: 'black', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, alignSelf: 'flex-start', alignItems: 'center' },
  ratingText: { color: 'white', fontWeight: 'bold', marginLeft: 4, fontSize: 12 },
  section: { paddingHorizontal: 20, marginBottom: 25 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#333' },
  menuRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 15, borderRadius: 12, marginBottom: 10 },
  menuIconBox: { width: 40, height: 40, backgroundColor: '#F0F0F0', borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 15 },
  menuText: { flex: 1, fontSize: 16, fontWeight: '500' },
  rideRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 15, borderRadius: 12, marginBottom: 10 },
  rideIcon: { width: 40, height: 40, backgroundColor: '#EEE', borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  rideDest: { fontSize: 16, fontWeight: '600' },
  rideDate: { fontSize: 12, color: 'gray', marginTop: 2 },
  ridePrice: { fontSize: 16, fontWeight: 'bold' },
  rideStatus: { fontSize: 12, fontWeight: 'bold', marginTop: 2 },
  logoutButton: { margin: 20, backgroundColor: '#FFC107', padding: 15, borderRadius: 10, alignItems: 'center' },
  logoutText: { fontSize: 16, fontWeight: 'bold', color: 'black' },
});