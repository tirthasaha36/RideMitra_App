import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { useRouter } from 'expo-router';

export default function Login() {
  const router = useRouter();
  const [phone, setPhone] = useState('');

  const handleLogin = () => {
    // Navigate to the Main App (Tabs)
    router.replace('/home');
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      {/* Top Graphic */}
      <View style={styles.header}>
        <Image 
        source={require('../assets/images/login-img.png')} 
        style={styles.image}
        />
      </View>

      <Text style={styles.title}>RideMitra</Text>
      <Text style={styles.subtitle}>Enter your number to continue</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.prefix}>+91</Text>
        <TextInput 
          style={styles.input}
          placeholder="00000 00000"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
          selectionColor="#FFC107"
        />
      </View>

      <TouchableOpacity onPress={handleLogin} style={styles.button}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white', padding: 20, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 30 },
  image: { width: 200, height: 200, resizeMode: 'contain' },
  title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', color: '#333' },
  subtitle: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 40 },
  
  inputContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: '#E0E0E0', 
    borderRadius: 12, 
    padding: 15, 
    marginBottom: 20,
    backgroundColor: '#F9F9F9'
  },
  prefix: { fontSize: 18, fontWeight: 'bold', marginRight: 10, color: '#333' },
  input: { flex: 1, fontSize: 18 },
  
  button: { 
    backgroundColor: '#FFC107', 
    padding: 18, 
    borderRadius: 12, 
    alignItems: 'center',
    shadowColor: '#FFC107',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  buttonText: { color: 'black', fontSize: 18, fontWeight: 'bold' },
});