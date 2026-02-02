import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Wallet() {
  const router = useRouter();
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState('');
  const [transactions, setTransactions] = useState<any[]>([]);

  // --- LOAD WALLET DATA ---
  useEffect(() => {
    loadWallet();
  }, []);

  const loadWallet = async () => {
    try {
      const storedBalance = await AsyncStorage.getItem('walletBalance');
      const storedTxns = await AsyncStorage.getItem('walletTxns');
      
      if (storedBalance) setBalance(parseFloat(storedBalance));
      else setBalance(500); // Default Starting Bonus

      if (storedTxns) setTransactions(JSON.parse(storedTxns));
      else setTransactions([
        { id: '1', title: 'Welcome Bonus', date: 'Joined', amount: 500, type: 'credit' }
      ]);
    } catch (e) {
      console.error("Failed to load wallet");
    }
  };

  // --- ADD MONEY FUNCTION ---
  const handleAddMoney = async () => {
    const value = parseFloat(amount);
    if (!value || value <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid amount to add.");
      return;
    }

    const newBalance = balance + value;
    const newTxn = {
      id: Date.now().toString(),
      title: 'Money Added',
      date: new Date().toLocaleDateString(),
      amount: value,
      type: 'credit'
    };

    const newTxns = [newTxn, ...transactions];

    setBalance(newBalance);
    setTransactions(newTxns);
    setAmount('');

    // Save to Storage
    await AsyncStorage.setItem('walletBalance', newBalance.toString());
    await AsyncStorage.setItem('walletTxns', JSON.stringify(newTxns));

    Alert.alert("Success", `₹${value} added to your wallet!`);
  };

  return (
    <View style={styles.container}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Wallet</Text>
      </View>

      {/* BALANCE CARD */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Available Balance</Text>
        <Text style={styles.balanceAmount}>
          {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(balance)}
        </Text>
        <View style={styles.chipRow}>
          <View style={styles.chip}><Text style={styles.chipText}>Safe</Text></View>
          <View style={styles.chip}><Text style={styles.chipText}>Secure</Text></View>
        </View>
      </View>

      {/* ADD MONEY SECTION */}
      <View style={styles.addSection}>
        <Text style={styles.sectionTitle}>Add Money</Text>
        <View style={styles.inputRow}>
          <Text style={styles.currencySymbol}>₹</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Enter Amount" 
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
        </View>
        <View style={styles.quickAddRow}>
          {[100, 200, 500].map((val) => (
            <TouchableOpacity key={val} style={styles.quickBtn} onPress={() => setAmount(val.toString())}>
              <Text style={styles.quickBtnText}>+ ₹{val}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={styles.payButton} onPress={handleAddMoney}>
          <Text style={styles.payButtonText}>Add Money</Text>
        </TouchableOpacity>
      </View>

      {/* TRANSACTIONS LIST */}
      <Text style={[styles.sectionTitle, { marginLeft: 20, marginTop: 20 }]}>Recent Transactions</Text>
      <FlatList 
        data={transactions}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <View style={styles.txnRow}>
            <View style={[styles.iconBox, { backgroundColor: item.type === 'credit' ? '#e8f5e9' : '#ffebee' }]}>
              <Ionicons 
                name={item.type === 'credit' ? "arrow-down" : "arrow-up"} 
                size={20} 
                color={item.type === 'credit' ? "green" : "red"} 
              />
            </View>
            <View style={{ flex: 1, marginLeft: 15 }}>
              <Text style={styles.txnTitle}>{item.title}</Text>
              <Text style={styles.txnDate}>{item.date}</Text>
            </View>
            <Text style={[styles.txnAmount, { color: item.type === 'credit' ? 'green' : 'black' }]}>
              {item.type === 'credit' ? '+' : '-'} ₹{item.amount}
            </Text>
          </View>
        )}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F9F9', paddingTop: 50 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 20 },
  backButton: { padding: 10, backgroundColor: 'white', borderRadius: 20, elevation: 2 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', marginLeft: 20 },

  balanceCard: { backgroundColor: '#212121', margin: 20, padding: 25, borderRadius: 20, shadowColor: '#000', elevation: 10 },
  balanceLabel: { color: '#ccc', fontSize: 16 },
  balanceAmount: { color: 'white', fontSize: 36, fontWeight: 'bold', marginVertical: 10 },
  chipRow: { flexDirection: 'row', marginTop: 10 },
  chip: { backgroundColor: '#333', paddingVertical: 5, paddingHorizontal: 12, borderRadius: 15, marginRight: 10 },
  chipText: { color: '#4CAF50', fontSize: 12, fontWeight: 'bold' },

  addSection: { backgroundColor: 'white', padding: 20, marginHorizontal: 20, borderRadius: 15, elevation: 2 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  inputRow: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderColor: '#ddd', paddingBottom: 5 },
  currencySymbol: { fontSize: 24, fontWeight: 'bold', color: 'black', marginRight: 10 },
  input: { flex: 1, fontSize: 24, fontWeight: 'bold', color: 'black' },
  
  quickAddRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 15 },
  quickBtn: { backgroundColor: '#f0f0f0', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 20 },
  quickBtnText: { fontWeight: 'bold' },
  
  payButton: { backgroundColor: 'black', padding: 15, borderRadius: 10, alignItems: 'center' },
  payButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },

  txnRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 15, marginHorizontal: 20, marginBottom: 10, borderRadius: 12 },
  iconBox: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  txnTitle: { fontSize: 16, fontWeight: '600' },
  txnDate: { fontSize: 12, color: 'gray' },
  txnAmount: { fontSize: 16, fontWeight: 'bold' },
});