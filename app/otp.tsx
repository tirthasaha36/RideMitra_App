import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function OTPVerification() {
  const router = useRouter();
  const { type } = useLocalSearchParams();
  const [otp, setOtp] = useState(['', '', '', '', '']);
  const inputs = useRef<Array<TextInput | null>>([]);

  const handleChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Move to next input if text is entered
    if (text && index < 4) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && index > 0) {
      const newOtp = [...otp];
      if (!otp[index]) {
        // If current box is empty, clear the previous one and move back
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputs.current[index - 1]?.focus();
      } else {
        // If current box is filled (like the last box), clear it and move back
        newOtp[index] = '';
        setOtp(newOtp);
        inputs.current[index - 1]?.focus();
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {type === 'email' ? 'Email verification' : 'Phone verification'}
            </Text>
            <Text style={styles.subtitle}>Enter your OTP code</Text>
          </View>

          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <View
                key={index}
                style={[
                  styles.otpBox,
                  digit ? styles.otpBoxActive : null
                ]}
              >
                <TextInput
                  ref={(ref) => { inputs.current[index] = ref; }}
                  style={styles.otpInput}
                  keyboardType="number-pad"
                  maxLength={1}
                  value={digit}
                  onChangeText={(text) => handleChange(text, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  autoFocus={index === 0}
                />
              </View>
            ))}
          </View>

          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Didn't receive code? </Text>
            <TouchableOpacity onPress={() => console.log('Resend OTP')}>
              <Text style={styles.resendLink}>Resend again</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.verifyButton}
            onPress={() => router.push('/home')}
          >
            <Text style={styles.verifyButtonText}>Verify</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#999',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 32,
  },
  otpBox: {
    width: 56,
    height: 56,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  otpBoxActive: {
    borderColor: '#F1B31C',
    backgroundColor: '#FFFBE6',
  },
  otpInput: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    width: '100%',
    height: '100%',
  },
  resendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 48,
  },
  resendText: {
    fontSize: 14,
    color: '#666',
  },
  resendLink: {
    fontSize: 14,
    color: '#F1B31C',
    fontWeight: '600',
  },
  verifyButton: {
    backgroundColor: '#F1B31C',
    width: '100%',
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
  verifyButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});
