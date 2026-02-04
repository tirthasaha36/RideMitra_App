import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface RatingModalProps {
  driverName: string;
  onSubmit: () => void;
}

export default function RatingModal({ driverName, onSubmit }: RatingModalProps) {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  
  // Feedback Tags
  const tags = ["Polite", "Clean Car", "Safe Driving", "Good Music", "Fast Route"];
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        
        {/* DRIVER AVATAR */}
        <View style={styles.avatarContainer}>
          <Image 
            source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }} 
            style={styles.avatar} 
          />
          <View style={styles.checkIcon}>
            <Ionicons name="checkmark-circle" size={24} color="#2ecc71" />
          </View>
        </View>

        <Text style={styles.title}>Rate {driverName}</Text>
        <Text style={styles.subtitle}>How was your ride?</Text>

        {/* 5-STAR SELECTOR */}
        <View style={styles.starRow}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity key={star} onPress={() => setRating(star)} activeOpacity={0.7}>
              <Ionicons 
                name={star <= rating ? "star" : "star-outline"} 
                size={40} 
                color="#FFC107" 
                style={{ marginHorizontal: 5 }}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* FEEDBACK TAGS */}
        <View style={styles.tagRow}>
          {tags.map(tag => (
            <TouchableOpacity 
              key={tag} 
              style={[styles.tag, selectedTags.includes(tag) && styles.tagSelected]}
              onPress={() => toggleTag(tag)}
            >
              <Text style={[styles.tagText, selectedTags.includes(tag) && styles.tagTextSelected]}>
                {tag}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* COMMENT BOX */}
        <TextInput
          style={styles.input}
          placeholder="Additional comments..."
          placeholderTextColor="#999"
          value={feedback}
          onChangeText={setFeedback}
          multiline
        />

        {/* SUBMIT BUTTON */}
        <TouchableOpacity style={styles.submitBtn} onPress={onSubmit}>
          <Text style={styles.submitText}>Submit Review</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0, bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', // Darken background
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  container: {
    backgroundColor: 'white',
    width: '85%',
    borderRadius: 25,
    padding: 25,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
  },
  avatarContainer: { marginBottom: 15, position: 'relative' },
  avatar: { width: 80, height: 80, borderRadius: 40, borderWidth: 3, borderColor: '#f0f0f0' },
  checkIcon: { position: 'absolute', bottom: 0, right: 0, backgroundColor: 'white', borderRadius: 12 },
  
  title: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  subtitle: { fontSize: 14, color: 'gray', marginBottom: 20 },
  
  starRow: { flexDirection: 'row', marginBottom: 20 },
  
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginBottom: 20 },
  tag: { 
    backgroundColor: '#f5f5f5', 
    paddingHorizontal: 12, 
    paddingVertical: 8, 
    borderRadius: 20, 
    margin: 4 
  },
  tagSelected: { backgroundColor: '#FFC107' }, // Amber when selected
  tagText: { fontSize: 12, color: '#555' },
  tagTextSelected: { color: 'black', fontWeight: 'bold' },

  input: {
    width: '100%',
    backgroundColor: '#f9f9f9',
    borderRadius: 15,
    padding: 15,
    height: 80,
    textAlignVertical: 'top', // For multiline text to start at top
    marginBottom: 20,
    fontSize: 14
  },
  
  submitBtn: {
    backgroundColor: 'black',
    width: '100%',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center'
  },
  submitText: { color: 'white', fontSize: 16, fontWeight: 'bold' }
});