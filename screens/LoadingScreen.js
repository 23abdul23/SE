import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LoadingSpinner from '../components/LoadingSpinner';
import { COLORS, FONTS, SIZES } from '../utils/constants';

export default function LoadingScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Aegis ID</Text>
      <Text style={styles.subtitle}>Digital Campus Pass</Text>
      <LoadingSpinner />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
  },
  title: {
    fontSize: SIZES.xxxl,
    fontFamily: FONTS.bold,
    color: COLORS.white,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: SIZES.md,
    fontFamily: FONTS.regular,
    color: COLORS.white,
    marginBottom: 32,
    opacity: 0.8,
  },
});
