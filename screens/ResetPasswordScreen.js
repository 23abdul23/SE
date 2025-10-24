import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios'; // Or your commonAPI helper

// IMPORTANT: Replace with your server's IP
const API_URL = 'http://192.168.31.65:3000/api/auth';

// This component gets 'route' prop from React Navigation
// which contains the 'token' from the URL
const ResetPasswordScreen = ({ route, navigation }) => {
  const { token } = route.params; // Get the token from the deep link
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (newPassword.length < 6) {
      return Alert.alert('Error', 'Password must be at least 6 characters long.');
    }
    if (newPassword !== confirmPassword) {
      return Alert.alert('Error', 'Passwords do not match.');
    }
    setLoading(true);
    try {
      // Call the /reset-password/:token route
      const response = await axios.post(`${API_URL}/reset-password/${token}`, {
        newPassword,
      });
      setLoading(false);
      Alert.alert('Success', response.data.message, [
        { text: 'OK', onPress: () => navigation.navigate('Login') } // Send user to Login
      ]);
    } catch (error) {
      setLoading(false);
      const message = error.response?.data?.message || 'An error occurred.';
      Alert.alert('Error', message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set New Password</Text>
      <TextInput
        style={styles.input}
        placeholder="New Password"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm New Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <Button title="Save New Password" onPress={handleResetPassword} />
      )}
    </View>
  );
};

// You can reuse styles from ForgotPasswordScreen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
});

export default ResetPasswordScreen;
