import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';

export default function Login() {
  const router = useRouter();
  const [phone, setPhone] = useState('');

  const handleLogin = () => {
    // In a real app, you would send an OTP here.
    // For now, we just navigate to the Map (Home).
    router.replace('/home'); 
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Text style={styles.title}>Enter your mobile number</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.prefix}>+91</Text>
        <TextInput 
          style={styles.input}
          placeholder="00000 00000"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
          autoFocus={true}
        />
      </View>

      <TouchableOpacity onPress={handleLogin} style={styles.button}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: 'white', justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 20 },
  prefix: { fontSize: 18, fontWeight: 'bold', marginRight: 10 },
  input: { flex: 1, fontSize: 18 },
  button: { backgroundColor: 'black', padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});