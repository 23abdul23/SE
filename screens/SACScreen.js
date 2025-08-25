import React from 'react';
import { View, Text } from "react-native";
import styles from '../styles/SACStyles'

export default function SAC() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Aegis ID</Text>
      <Text style={styles.subtitle}>SAC</Text>
    </View>
  );
}
