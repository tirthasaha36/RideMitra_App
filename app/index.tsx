import React, { useState, useRef } from 'react';
import { 
  View, Text, FlatList, StyleSheet, useWindowDimensions, 
  Image, TouchableOpacity, StatusBar 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

// 1. UPDATE: Use 'require' for local images
const slides = [
  {
    id: '1',
    title: 'Anywhere you are',
    description: 'Sell houses easily with the help of Listenoryx and to make this line big I am writing more.',
    // Make sure 'intro1.png' exists in assets/images/
    image: require('../assets/images/intro1.png'), 
  },
  {
    id: '2',
    title: 'At anytime',
    description: 'Book your car at any time and get your destination safely and quickly.',
    image: require('../assets/images/intro2.png'),
  },
  {
    id: '3',
    title: 'Book your car',
    description: 'Just tap, book, and ride - it\'s that simple to get moving.',
    image: require('../assets/images/intro3.png'),
  },
];

export default function Onboarding() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const viewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems && viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      router.replace('/login');
    }
  };

  const handleSkip = () => {
    router.replace('/login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            {/* 2. UPDATE: Removed {uri: ...} because we are using require */}
            <Image 
              source={item.image} 
              style={[styles.image, { width: width * 0.8 }]} 
            />
            <View style={styles.textContainer}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          </View>
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        keyExtractor={(item) => item.id}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
      />

      <View style={styles.footer}>
        <View style={styles.paginator}>
          {slides.map((_, i) => {
            const isActive = i === currentIndex;
            return (
              <View 
                key={i.toString()} 
                style={[
                  styles.dot, 
                  { width: isActive ? 20 : 10, backgroundColor: isActive ? '#FFC107' : '#D3D3D3' }
                ]} 
              />
            );
          })}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonArrow}>
             {currentIndex === slides.length - 1 ? "Go" : "❯"} 
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  header: { width: '100%', paddingHorizontal: 20, paddingTop: 10, alignItems: 'flex-end' },
  skipText: { fontSize: 16, color: '#A0A0A0' },
  slide: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  image: { height: '50%', resizeMode: 'contain', marginBottom: 30 },
  textContainer: { paddingHorizontal: 40, alignItems: 'center' },
  title: { fontWeight: '800', fontSize: 28, marginBottom: 10, color: '#333', textAlign: 'center' },
  description: { fontWeight: '400', fontSize: 16, color: '#666', textAlign: 'center', lineHeight: 22 },
  footer: { width: '100%', height: 150, alignItems: 'center', justifyContent: 'space-between', paddingBottom: 40 },
  paginator: { flexDirection: 'row', height: 64 },
  dot: { height: 10, borderRadius: 5, marginHorizontal: 5 },
  button: { backgroundColor: '#FFC107', width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', shadowColor: '#FFC107', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 5 },
  buttonArrow: { fontSize: 24, fontWeight: 'bold', color: 'black' },
});