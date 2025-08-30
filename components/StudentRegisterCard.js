import React from 'react';
import { View, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';

export default function StudentRegisterCard({ formData, updateFormData, departments, years, hostels, colors }) {
  return (
    <>
      {/* Student-specific fields */}
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
        <Ionicons name="school-outline" size={20} color={colors.text} />
        <TextInput
          placeholder="Student ID *"
          value={formData.studentId}
          onChangeText={value => updateFormData('studentId', value)}
          autoCapitalize="characters"
        />
      </View>
      <View style={{ marginBottom: 10 }}>
        <Ionicons name="library-outline" size={20} color={colors.text} />
        <Picker
          selectedValue={formData.department}
          onValueChange={value => updateFormData('department', value)}>
          <Picker.Item label="Select Department *" value="" />
          {departments.map(dept => (
            <Picker.Item key={dept} label={dept} value={dept} />
          ))}
        </Picker>
      </View>
      <View style={{ marginBottom: 10 }}>
        <Ionicons name="calendar-outline" size={20} color={colors.text} />
        <Picker
          selectedValue={formData.year}
          onValueChange={value => updateFormData('year', value)}>
          <Picker.Item label="Select Year *" value="" />
          {years.map(year => (
            <Picker.Item key={year} label={year} value={year} />
          ))}
        </Picker>
      </View>
      <View style={{ marginBottom: 10 }}>
        <Ionicons name="home-outline" size={20} color={colors.text} />
        <Picker
          selectedValue={formData.hostel}
          onValueChange={value => updateFormData('hostel', value)}>
          <Picker.Item label="Select Hostel *" value="" />
          {hostels.map(hostel => (
            <Picker.Item key={hostel} label={hostel} value={hostel} />
          ))}
        </Picker>
      </View>
      <View style={{ marginBottom: 10 }}>
        <Ionicons name="bed-outline" size={20} color={colors.text} />
        <TextInput
          placeholder="Room Number"
          value={formData.roomNumber}
          onChangeText={value => updateFormData('roomNumber', value)}
        />
      </View>
    </>
  );
}
