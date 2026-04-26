import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function SignUp() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Sign up to get started</Text>

        <View style={styles.inputContainer}>
          <TextInput placeholder="Full Name" style={styles.input} />
          <TextInput placeholder="Email" style={styles.input} keyboardType="email-address" />
          <TextInput placeholder="Password" style={styles.input} secureTextEntry />
        </View>

        <TouchableOpacity style={styles.button} onPress={() => router.push('/home')}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/login')}>
            <Text style={styles.footerLink}>Log In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  backButton: { padding: 20 },
  content: { flex: 1, paddingHorizontal: 30, paddingTop: 20 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#333' },
  subtitle: { fontSize: 16, color: '#666', marginTop: 5, marginBottom: 30 },
  inputContainer: { gap: 15 },
  input: { height: 55, backgroundColor: '#F5F5F5', borderRadius: 10, paddingHorizontal: 15, fontSize: 16 },
  button: { backgroundColor: '#F1B31C', height: 55, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginTop: 30 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  footerText: { color: '#666' },
  footerLink: { color: '#F1B31C', fontWeight: 'bold' },
});
