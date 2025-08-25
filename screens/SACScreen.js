import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, SIZES , SPACING} from '../utils/constants';

export default function SAC() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Aegis ID</Text>
      <Text style={styles.subtitle}>SAC</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  }
})
