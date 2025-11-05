import React from 'react';
import { ScrollView, Platform, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext'; // Make sure to import ThemeProvider
import MainTabNavigator from './navigation/MainTabNavigator';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import LoadingScreen from './screens/LoadingScreen';
import SACScreen from './screens/SACScreen';
import CreateOutpassScreen from "./screens/CreateOutpassScreen"
import Scanner from './screens/ScannerScreen';
import LibraryScreen from './screens/LibraryScreen';
import { StackScreen } from 'react-native-screens';
import GuardDashboardScreen from './screens/GuardScreen';
import LogBook from './screens/LogBookScreen';
const Stack = createStackNavigator();

function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        user.role == 'student' ? (
        <>
          <Stack.Screen name="Main" component={MainTabNavigator} />
          <Stack.Screen name="SAC" component={SACScreen} />
          <Stack.Screen name="CreateOutpass" component={CreateOutpassScreen} />
          <Stack.Screen name="Scan" component={Scanner} />  
          <Stack.Screen name="Library" component={LibraryScreen} /> 
        </>
        ):
        (<>
          <Stack.Screen name="GuardMain" component={GuardDashboardScreen} />
          <Stack.Screen name="SAC" component={SACScreen} />
          <Stack.Screen name="CreateOutpass" component={CreateOutpassScreen} />
          <Stack.Screen name="Scan" component={Scanner} /> 
          <Stack.Screen name = "Logbook" component={LogBook} />
          <Stack.Screen name="Library" component={LibraryScreen} /> 
        </>)  
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}

    </Stack.Navigator>
  );
}

export default function App() {
  const content = (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
  
  if (Platform.OS === 'web') {
    return (
      <ThemeProvider>
        <ScrollView contentContainerStyle={styles.webContainer} style={{ flex: 1 }}>
          <View style={styles.inner}>{content}</View>
        </ScrollView>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      {content}
    </ThemeProvider>
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