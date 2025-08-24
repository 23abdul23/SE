
import React from 'react';
import { ScrollView, Platform, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider, useAuth } from './context/AuthContext';
import MainTabNavigator from './navigation/MainTabNavigator';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import LoadingScreen from './screens/LoadingScreen';


const Stack = createStackNavigator();

function RootNavigator() {
  const { user, loading } = useAuth();


  if (loading) {
    return <LoadingScreen />;
  }
  

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>

      {user ? (
        <Stack.Screen name="Main" component={MainTabNavigator} />
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}    

      {/* <Stack.Screen name="Main" component={MainTabNavigator} /> */}
    </Stack.Navigator>
  );
}


export default function App() {
  // For web, wrap in ScrollView to enable scrolling
  const content = (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
  if (Platform.OS === 'web') {
    return (
      <ScrollView contentContainerStyle={styles.webContainer} style={{ flex: 1 }}>
        <View style={styles.inner}>{content}</View>
      </ScrollView>
    );
  }
  return content;
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
