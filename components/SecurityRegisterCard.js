
import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SecurityRegisterCard({ formData, updateFormData, colors }) {
  return (
    <>
      <View style={[styles.inputContainer, { backgroundColor: colors.card, borderColor: colors.text }]}> 
        <Ionicons name="shield-outline" size={20} color={colors.text} style={styles.inputIcon} />
        <TextInput
          style={[styles.input, { color: colors.text }]}
          placeholder="Security Post/Area *"
          placeholderTextColor={colors.text}
          value={formData.securityPost || ''}
          onChangeText={value => updateFormData('securityPost', value)}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
  },
});
