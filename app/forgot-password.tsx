import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ForgotPassword() {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<'sms' | 'email'>('sms');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}

        <View style={styles.headerTextContainer}>
          <Text style={styles.title}>Forgot Password</Text>
          <Text style={styles.subtitle}>
            Select which contact details should we use to reset your password
          </Text>
        </View>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {/* SMS Option */}
          <TouchableOpacity
            style={[
              styles.optionCard,
              selectedMethod === 'sms' && styles.optionCardSelected,
            ]}
            onPress={() => setSelectedMethod('sms')}
            activeOpacity={0.7}
          >
            <View style={styles.iconCircle}>
              <Ionicons 
                name="chatbubble-ellipses" 
                size={24} 
                color="#F1B31C" 
              />
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionLabel}>Via SMS</Text>
              <Text style={styles.optionValue}>***** ***70</Text>
            </View>
          </TouchableOpacity>

          {/* Email Option */}
          <TouchableOpacity
            style={[
              styles.optionCard,
              selectedMethod === 'email' && styles.optionCardSelected,
            ]}
            onPress={() => setSelectedMethod('email')}
            activeOpacity={0.7}
          >
            <View style={styles.iconCircle}>
              <Ionicons 
                name="mail" 
                size={24} 
                color="#F1B31C" 
              />
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionLabel}>Via Email</Text>
              <Text style={styles.optionValue}>**** **** **** xyz@xyz.com</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={() => router.push({ pathname: '/otp', params: { type: selectedMethod } })}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? 80 : 60,
  },
  headerTextContainer: {
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  optionsContainer: {
    gap: 20,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#F5F5F5',
    backgroundColor: '#fff',
  },
  optionCardSelected: {
    borderColor: '#F1B31C',
    backgroundColor: '#FFFBEB',
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFBEB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 14,
    color: '#999',
    marginBottom: 4,
  },
  optionValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 24,
    right: 24,
  },
  continueButton: {
    backgroundColor: '#F1B31C',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#F1B31C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});
