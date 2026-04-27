import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, FontAwesome, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import { Image } from 'expo-image';

export default function SignUp() {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);
  const [gender, setGender] = useState('');
  const [isGenderModalVisible, setIsGenderModalVisible] = useState(false);

  const genderOptions = ['Male', 'Female', 'Prefer not to say'];

  const selectGender = (option: string) => {
    setGender(option);
    setIsGenderModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <Text style={styles.title}>Sign up</Text>

            <View style={styles.form}>
              {/* Name Input */}
              <View style={styles.inputWrapper}>
                <TextInput
                  placeholder="Name"
                  placeholderTextColor="#C7C7CD"
                  style={styles.input}
                />
              </View>

              {/* Email Input */}
              <View style={styles.inputWrapper}>
                <TextInput
                  placeholder="Email"
                  placeholderTextColor="#C7C7CD"
                  style={styles.input}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              {/* Phone Input */}
              <View style={styles.inputWrapper}>
                <TextInput
                  placeholder="Phone number"
                  placeholderTextColor="#C7C7CD"
                  style={styles.input}
                  keyboardType="phone-pad"
                  maxLength={10}
                />
              </View>

              {/* Gender Dropdown */}
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => setIsGenderModalVisible(true)}
              >
                <Text style={[styles.dropdownText, gender ? styles.dropdownTextSelected : null]}>
                  {gender || 'Gender'}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#666" />
              </TouchableOpacity>

              {/* Terms Checkbox */}
              <View style={styles.termsContainer}>
                <TouchableOpacity
                  onPress={() => setAgreed(!agreed)}
                  activeOpacity={0.7}
                  style={[styles.checkbox, agreed && styles.checkboxChecked]}
                >
                  {agreed && <Ionicons name="checkmark" size={14} color="#fff" />}
                </TouchableOpacity>
                <Text style={styles.termsText}>
                  By signing up, you agree to the{' '}
                  <Text
                    style={styles.linkText}
                    onPress={() => console.log('Navigate to Terms of service')}
                  >
                    Terms of service
                  </Text>{' '}
                  and{' '}
                  <Text
                    style={styles.linkText}
                    onPress={() => console.log('Navigate to Privacy policy')}
                  >
                    Privacy policy.
                  </Text>
                </Text>
              </View>

              {/* Sign Up Button */}
              <TouchableOpacity
                style={styles.signUpButton}
                onPress={() => router.push('/otp')}
              >
                <Text style={styles.signUpButtonText}>Sign Up</Text>
              </TouchableOpacity>

              {/* Or Divider */}
              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Social Login */}
              <View style={styles.socialContainer}>
                <TouchableOpacity style={styles.socialButton}>
                  <Image
                    source="https://img.icons8.com/color/48/000000/google-logo.png"
                    style={styles.socialIcon}
                    contentFit="contain"
                  />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}>
                  <Image
                    source="https://img.icons8.com/color/48/000000/facebook-new.png"
                    style={styles.socialIcon}
                    contentFit="contain"
                  />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}>
                  <FontAwesome name="apple" size={28} color="#000" />
                </TouchableOpacity>
              </View>

              {/* Footer */}
              <View style={styles.footer}>
                <Text style={styles.footerText}>Already have an account? </Text>
                <TouchableOpacity onPress={() => router.push('/login')}>
                  <Text style={styles.footerLink}>Sign in</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Gender Modal */}
      <Modal
        visible={isGenderModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsGenderModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsGenderModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Gender</Text>
            {genderOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.modalOption}
                onPress={() => selectGender(option)}
              >
                <Text style={styles.modalOptionText}>{option}</Text>
                {gender === option && (
                  <Ionicons name="checkmark-circle" size={20} color="#F1B31C" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 32,
  },
  form: {
    gap: 16,
  },
  inputWrapper: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    height: 56,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  input: {
    fontSize: 16,
    color: '#333',
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    height: 56,
    paddingHorizontal: 16,
  },
  dropdownText: {
    fontSize: 16,
    color: '#C7C7CD',
  },
  dropdownTextSelected: {
    color: '#333',
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 8,
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: '#4CAF50',
  },
  termsText: {
    flex: 1,
    fontSize: 13,
    color: '#999',
    lineHeight: 18,
  },
  linkText: {
    color: '#F1B31C',
    fontWeight: '600',
  },
  signUpButton: {
    backgroundColor: '#F1B31C',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#F1B31C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  signUpButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#999',
    fontSize: 14,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 32,
  },
  socialButton: {
    width: 60,
    height: 60,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialIcon: {
    width: 28,
    height: 28,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 15,
    color: '#666',
  },
  footerLink: {
    fontSize: 15,
    color: '#F1B31C',
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 20,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#333',
  },
});

