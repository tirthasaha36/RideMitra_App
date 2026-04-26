import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function HomeWeb() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/profile')}>
          <Ionicons name="menu" size={26} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Cab Booking (Web)</Text>
      </View>
      
      <View style={styles.content}>
        <Ionicons name="map-outline" size={100} color="#ccc" />
        <Text style={styles.message}>
          The interactive map is optimized for mobile devices. 
          Please open the app on an Android or iOS emulator/device to use the full booking features.
        </Text>
        
        <TouchableOpacity style={styles.button} onPress={() => router.replace('/welcome')}>
          <Text style={styles.buttonText}>Back to Welcome Screen</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#eee' },
  title: { fontSize: 20, fontWeight: 'bold', marginLeft: 15 },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  message: { textAlign: 'center', fontSize: 16, color: '#666', marginTop: 20, lineHeight: 24 },
  button: { backgroundColor: '#F1B31C', paddingVertical: 15, paddingHorizontal: 30, borderRadius: 10, marginTop: 30 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
