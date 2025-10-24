import React from 'react';
import { ScrollView, Platform, StyleSheet, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './context/AuthContext'; // We only import the PROVIDER
import { ThemeProvider } from './context/ThemeContext';
import RootNavigator from './navigation/RootNavigator'; // Import the new navigator file

// This linking config is correct
const linking = {
  prefixes: ['aegisid://'], 
  config: {
    screens: {
      ResetPassword: 'reset-password/:token',
    },
  },
};

// The RootNavigator function has been moved to its own file
export default function App() {
  
  if (Platform.OS === 'web') {
    // Web version
    return (
      <AuthProvider>
        <ThemeProvider>
          <NavigationContainer linking={linking} fallback={<Text>Loading...</Text>}>
              <ScrollView contentContainerStyle={styles.webContainer} style={{ flex: 1 }}>
                <View style={styles.inner}>
                  <RootNavigator />
                </View>
              </ScrollView>
          </NavigationContainer>
        </ThemeProvider>
      </AuthProvider>
    );
  }

  // This is the correct structure for native (iOS/Android)
  return (
    <AuthProvider>
      <ThemeProvider>
        <NavigationContainer linking={linking} fallback={<Text>Loading...</Text>}>
          <RootNavigator />
        </NavigationContainer>
      </ThemeProvider>
    </AuthProvider>
  );
}


const styles = StyleSheet.create({
  webContainer: {
    minHeight: '100vh',
    flexGrow: 1,
    flexDirection: 'column',
  },
  inner: {
    flex: 1,
    minHeight: '100vh',
  },
});

