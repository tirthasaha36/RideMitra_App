import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function Welcome() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* 1. Big Image / Logo */}
      <Image 
        source={{ uri: 'https://links.papareact.com/gzs' }} // Uber-like car image
        style={styles.image}
      />

      {/* 2. Intro Text */}
      <View style={styles.content}>
        <Text style={styles.title}>Move with safety</Text>
        <Text style={styles.subtitle}>
          Choose your ride, set your location, and book a cab in seconds.
        </Text>
      </View>

      {/* 3. Get Started Button */}
      <TouchableOpacity 
        style={styles.button}
        onPress={() => router.push('/login')} // Go to Login Page
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#286EF0', justifyContent: 'space-between' }, // Blue Background
  image: { width: '100%', height: 350, resizeMode: 'contain', marginTop: 50 },
  content: { padding: 20 },
  title: { fontSize: 36, color: 'white', fontWeight: 'bold' },
  subtitle: { fontSize: 16, color: 'white', marginTop: 10, opacity: 0.8 },
  button: { 
    backgroundColor: 'black', 
    padding: 20, 
    margin: 20, 
    borderRadius: 10, 
    alignItems: 'center' 
  },
  buttonText: { color: 'white', fontSize: 20, fontWeight: 'bold' },
});