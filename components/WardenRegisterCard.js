import React from 'react';
import { View, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';

export default function WardenRegisterCard({ formData, updateFormData, hostels, colors }) {
  return (
    <>
      {/* Warden-specific fields */}
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
        <Ionicons name="home-outline" size={20} color={colors.text} />
        <Picker
          selectedValue={formData.hostel}
          onValueChange={value => updateFormData('hostel', value)}>
          <Picker.Item label="Select Hostel Assigned *" value="" />
          {hostels.map(hostel => (
            <Picker.Item key={hostel} label={hostel} value={hostel} />
          ))}
        </Picker>
      </View>
    </>
  );
}
