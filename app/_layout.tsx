import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  
  useEffect(() => {
    // Hide splash screen immediately since we aren't loading fonts anymore
    SplashScreen.hideAsync();
  }, []);

  return (
    <Stack>
      {/* 1. Intro / Onboarding Screen */}
      <Stack.Screen name="index" options={{ headerShown: false }} />
      
      {/* 2. Login Screen */}
      <Stack.Screen name="login" options={{ headerShown: false }} />
      
      {/* 3. Main Map Screen (Updated from 'tabs' to 'home') */}
      <Stack.Screen name="home" options={{ headerShown: false }} />
    </Stack>
  );
}





// import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
// import { Stack } from 'expo-router';
// import { StatusBar } from 'expo-status-bar';
// import 'react-native-reanimated';

// import { useColorScheme } from '@/hooks/use-color-scheme';

// export const unstable_settings = {
//   anchor: '(tabs)',
// };

// export default function RootLayout() {
//   const colorScheme = useColorScheme();

//   return (
//     <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
//       <Stack>
//         <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
//         <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
//       </Stack>
//       <StatusBar style="auto" />
//     </ThemeProvider>
//   );
// }
