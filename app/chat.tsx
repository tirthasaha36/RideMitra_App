import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Chat() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const driverName = params.name || "Driver";
  
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([
    { id: '1', text: "I'm on my way!", sender: 'driver' },
  ]);

  const flatListRef = useRef<FlatList>(null);

  // --- AUTOMATIC DRIVER REPLY LOGIC ---
  const handleSend = () => {
    if (text.trim().length === 0) return;

    // 1. Add User Message
    const userMsg = { id: Date.now().toString(), text: text, sender: 'user' };
    setMessages((prev) => [...prev, userMsg]);
    setText('');

    // 2. Simulate Driver Reply after 2 seconds
    setTimeout(() => {
      let reply = "Ok, reaching in 2 mins.";
      if (text.toLowerCase().includes("where")) reply = "Just taking a turn nearby.";
      if (text.toLowerCase().includes("late")) reply = "Sorry, traffic is heavy.";
      if (text.toLowerCase().includes("call")) reply = "Driving right now, can't pick up.";

      const driverMsg = { id: Date.now().toString(), text: reply, sender: 'driver' };
      setMessages((prev) => [...prev, driverMsg]);
    }, 2000);
  };

  return (
    <View style={styles.container}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Image 
          source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }} 
          style={styles.avatar} 
        />
        <View>
          <Text style={styles.headerTitle}>{driverName}</Text>
          <Text style={styles.subTitle}>Toyota Etios • WB 02 AK 4921</Text>
        </View>
        <TouchableOpacity style={styles.phoneBtn}>
           <Ionicons name="call" size={20} color="black" />
        </TouchableOpacity>
      </View>

      {/* CHAT MESSAGES */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        renderItem={({ item }) => (
          <View style={[
            styles.bubble, 
            item.sender === 'user' ? styles.userBubble : styles.driverBubble
          ]}>
            <Text style={[
               styles.msgText, 
               item.sender === 'user' ? styles.userText : styles.driverText
            ]}>
              {item.text}
            </Text>
          </View>
        )}
        style={styles.chatArea}
      />

      {/* INPUT AREA */}
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <View style={styles.inputContainer}>
          <TextInput 
            style={styles.input} 
            placeholder="Message driver..." 
            value={text}
            onChangeText={setText}
          />
          <TouchableOpacity onPress={handleSend} style={styles.sendBtn}>
            <Ionicons name="send" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f2' },
  header: { 
    flexDirection: 'row', alignItems: 'center', paddingTop: 50, paddingBottom: 15, 
    paddingHorizontal: 15, backgroundColor: 'white', elevation: 2 
  },
  backButton: { marginRight: 15 },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  subTitle: { fontSize: 12, color: 'gray' },
  phoneBtn: { marginLeft: 'auto', padding: 8, backgroundColor: '#eee', borderRadius: 20 },

  chatArea: { flex: 1, padding: 15 },
  bubble: { maxWidth: '75%', padding: 12, borderRadius: 15, marginBottom: 10 },
  driverBubble: { alignSelf: 'flex-start', backgroundColor: 'white', borderTopLeftRadius: 2 },
  userBubble: { alignSelf: 'flex-end', backgroundColor: 'black', borderBottomRightRadius: 2 },
  msgText: { fontSize: 16 },
  driverText: { color: 'black' },
  userText: { color: 'white' },

  inputContainer: { 
    flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: 'white',
    borderTopWidth: 1, borderColor: '#ddd' 
  },
  input: { flex: 1, backgroundColor: '#f9f9f9', padding: 12, borderRadius: 20, fontSize: 16 },
  sendBtn: { marginLeft: 10, backgroundColor: 'black', padding: 12, borderRadius: 20 },
});