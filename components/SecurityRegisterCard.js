import React from 'react';
import { View, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SecurityRegisterCard({ formData, updateFormData, colors }) {
  return (
    <>
      {/* Security-specific fields */}
      <View style={{ marginBottom: 10 }}>
        <Ionicons name="mail-outline" size={20} color={colors.text} />
        <TextInput
          placeholder="Email Address *"
          value={formData.email}
          onChangeText={value => updateFormData('email', value)}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      <View style={{ marginBottom: 10 }}>
        <Ionicons name="shield-outline" size={20} color={colors.text} />
        <TextInput
          placeholder="Security Post/Area *"
          value={formData.securityPost || ''}
          onChangeText={value => updateFormData('securityPost', value)}
        />
      </View>
    </>
  );
}
