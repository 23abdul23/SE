import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext'; // Import useAuth here

// Import all screens relative to this new file location
import MainTabNavigator from './MainTabNavigator';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import LoadingScreen from '../screens/LoadingScreen';
import SACScreen from '../screens/SACScreen';
import CreateOutpassScreen from "../screens/CreateOutpassScreen"
import Scanner from '../screens/ScannerScreen';
import LibraryScreen from '../screens/LibraryScreen';
import GuardDashboardScreen from '../screens/GuardScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';

const Stack = createStackNavigator();

// This is the RootNavigator function, moved from App.js
export default function RootNavigator() {
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
        ) : (
          <>
            <Stack.Screen name="GuardMain" component={GuardDashboardScreen} />
            <Stack.Screen name="SAC" component={SACScreen} />
            <Stack.Screen name="CreateOutpass" component={CreateOutpassScreen} />
            <Stack.Screen name="Scan" component={Scanner} /> 
            <Stack.Screen name="Library" component={LibraryScreen} /> 
          </>
        ) 
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

