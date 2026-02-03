import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';

export default function Radar() {
  const anim1 = useRef(new Animated.Value(0)).current;
  const anim2 = useRef(new Animated.Value(0)).current;

  const animateCircle = (animValue: Animated.Value, delay: number) => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(animValue, {
          toValue: 1,
          duration: 2000,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  useEffect(() => {
    animateCircle(anim1, 0);
    animateCircle(anim2, 1000); // Start second circle halfway through
  }, []);

  const getStyle = (anim: Animated.Value) => ({
    transform: [
      {
        scale: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0.5, 4], // Grow from 0.5x to 4x size
        }),
      },
    ],
    opacity: anim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0.8, 0.5, 0], // Fade out
    }),
  });

  return (
    <View style={styles.container}>
      {/* Center Dot */}
      <View style={styles.centerDot} />

      {/* Pulsing Circles */}
      <Animated.View style={[styles.pulse, getStyle(anim1)]} />
      <Animated.View style={[styles.pulse, getStyle(anim2)]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 100, // Container size
    height: 100,
  },
  centerDot: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: '#FFC107', // AMBER Core
    borderWidth: 2,
    borderColor: 'white',
    zIndex: 2,
  },
  pulse: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 193, 7, 0.4)', // AMBER with transparency
    zIndex: 1,
  },
});