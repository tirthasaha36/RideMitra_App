import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface BillModalProps {
  price: number;
  onClose: () => void;
}

export default function BillModal({ price, onClose }: BillModalProps) {
  const [selectedMethod, setSelectedMethod] = useState('cash');
  const [walletBalance, setWalletBalance] = useState(0);

  // Load Wallet Balance to show it in the option
  useEffect(() => {
    const loadBalance = async () => {
      try {
        const stored = await AsyncStorage.getItem('walletBalance');
        if (stored) setWalletBalance(parseFloat(stored));
      } catch (e) { console.error(e); }
    };
    loadBalance();
  }, []);

  const handlePayment = async () => {
    if (selectedMethod === 'wallet') {
      if (walletBalance < price) {
        Alert.alert("Insufficient Balance", "Please add money to your wallet or choose Cash.");
        return;
      }
      // Deduct from Wallet
      const newBal = walletBalance - price;
      await AsyncStorage.setItem('walletBalance', newBal.toString());
      
      // Add 'Debit' Transaction
      const prevTxns = await AsyncStorage.getItem('walletTxns');
      const txns = prevTxns ? JSON.parse(prevTxns) : [];
      const newTxn = {
        id: Date.now().toString(),
        title: 'Ride Payment',
        date: new Date().toLocaleDateString(),
        amount: price,
        type: 'debit'
      };
      await AsyncStorage.setItem('walletTxns', JSON.stringify([newTxn, ...txns]));
    }
    
    // Proceed to Rating
    onClose();
  };

  return (
    <View style={styles.container}>
      
      {/* SUCCESS ICON */}
      <View style={styles.iconContainer}>
        <Ionicons name="checkmark-circle" size={60} color="#4CAF50" />
      </View>

      <Text style={styles.title}>Ride Completed</Text>
      <Text style={styles.price}>₹{price}</Text>

      <Text style={styles.sectionTitle}>Select Payment Method</Text>

      {/* PAYMENT OPTIONS */}
      <View style={styles.paymentMethods}>
        
        {/* 1. WALLET OPTION */}
        <TouchableOpacity 
          style={[styles.option, selectedMethod === 'wallet' && styles.optionSelected]}
          onPress={() => setSelectedMethod('wallet')}
        >
          <View style={{flexDirection:'row', alignItems:'center'}}>
            <View style={[styles.iconBox, {backgroundColor: '#E3F2FD'}]}>
              <Ionicons name="wallet" size={20} color="#2196F3" />
            </View>
            <View style={{marginLeft: 10}}>
              <Text style={styles.optionTitle}>App Wallet</Text>
              <Text style={styles.optionSub}>Balance: ₹{walletBalance}</Text>
            </View>
          </View>
          {selectedMethod === 'wallet' && <Ionicons name="radio-button-on" size={24} color="#2196F3" />}
        </TouchableOpacity>

        {/* 2. CASH OPTION */}
        <TouchableOpacity 
          style={[styles.option, selectedMethod === 'cash' && styles.optionSelected]}
          onPress={() => setSelectedMethod('cash')}
        >
          <View style={{flexDirection:'row', alignItems:'center'}}>
            <View style={[styles.iconBox, {backgroundColor: '#E8F5E9'}]}>
              <Ionicons name="cash" size={20} color="#4CAF50" />
            </View>
            <Text style={[styles.optionTitle, {marginLeft: 10}]}>Cash</Text>
          </View>
          {selectedMethod === 'cash' && <Ionicons name="radio-button-on" size={24} color="#4CAF50" />}
        </TouchableOpacity>

        {/* 3. UPI OPTION (Mock) */}
        <TouchableOpacity 
          style={[styles.option, selectedMethod === 'upi' && styles.optionSelected]}
          onPress={() => setSelectedMethod('upi')}
        >
          <View style={{flexDirection:'row', alignItems:'center'}}>
            <View style={[styles.iconBox, {backgroundColor: '#FFF3E0'}]}>
              <Ionicons name="qr-code" size={20} color="#FF9800" />
            </View>
            <Text style={[styles.optionTitle, {marginLeft: 10}]}>UPI / Scan QR</Text>
          </View>
          {selectedMethod === 'upi' && <Ionicons name="radio-button-on" size={24} color="#FF9800" />}
        </TouchableOpacity>

      </View>

      {/* PAY BUTTON */}
      <TouchableOpacity style={styles.payBtn} onPress={handlePayment}>
        <Text style={styles.payText}>Pay ₹{price}</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 25,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 20,
  },
  iconContainer: { marginBottom: 10 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  price: { fontSize: 40, fontWeight: 'bold', color: 'black', marginBottom: 20 },
  
  sectionTitle: { width: '100%', fontSize: 14, color: 'gray', marginBottom: 10, textAlign: 'left' },
  
  paymentMethods: { width: '100%', marginBottom: 20 },
  option: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 15, borderRadius: 12, backgroundColor: '#f9f9f9', marginBottom: 10,
    borderWidth: 1, borderColor: 'transparent'
  },
  optionSelected: { borderColor: 'black', backgroundColor: '#fff' },
  
  iconBox: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  optionTitle: { fontSize: 16, fontWeight: '600' },
  optionSub: { fontSize: 12, color: 'gray' },

  payBtn: {
    backgroundColor: 'black',
    width: '100%',
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 5, elevation: 5
  },
  payText: { color: 'white', fontSize: 18, fontWeight: 'bold' }
});