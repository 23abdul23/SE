
import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';

export default function StudentRegisterCard({ formData, updateFormData, departments, years, hostels, colors }) {
  return (
    <>
      <View style={[styles.inputContainer, { backgroundColor: colors.card, borderColor: colors.text }]}> 
        <Ionicons name="mail-outline" size={20} color={colors.text} style={styles.inputIcon} />
        <TextInput
          style={[styles.input, { color: colors.text }]}
          placeholder="Email Address*"
          placeholderTextColor={colors.text}
          value={formData.email}
          onChangeText={value => updateFormData('email', value)}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      <View style={[styles.inputContainer, { backgroundColor: colors.card, borderColor: colors.text }]}> 
        <Ionicons name="school-outline" size={20} color={colors.text} style={styles.inputIcon} />
        <TextInput
          style={[styles.input, { color: colors.text }]}
          placeholder="Student ID*"
          placeholderTextColor={colors.text}
          value={formData.studentId}
          onChangeText={value => updateFormData('studentId', value)}
          autoCapitalize="characters"
        />
      </View>
      <View style={[styles.pickerContainer, { backgroundColor: colors.card, borderColor: colors.text }]}> 
        <Ionicons name="library-outline" size={20} color={colors.text} style={styles.inputIcon} />
        <Picker
          selectedValue={formData.department}
          style={styles.picker}
          onValueChange={value => updateFormData('department', value)}>
          <Picker.Item label="Select Department *" value="" />
          {departments.map(dept => (
            <Picker.Item key={dept} label={dept} value={dept} />
          ))}
        </Picker>
      </View>
      <View style={[styles.pickerContainer, { backgroundColor: colors.card, borderColor: colors.text }]}> 
        <Ionicons name="calendar-outline" size={20} color={colors.text} style={styles.inputIcon} />
        <Picker
          selectedValue={formData.year}
          style={styles.picker}
          onValueChange={value => updateFormData('year', value)}>
          <Picker.Item label="Select Year *" value="" />
          {years.map(year => (
            <Picker.Item key={year} label={year} value={year} />
          ))}
        </Picker>
      </View>
      <View style={[styles.pickerContainer, { backgroundColor: colors.card, borderColor: colors.text }]}> 
        <Ionicons name="home-outline" size={20} color={colors.text} style={styles.inputIcon} />
        <Picker
          selectedValue={formData.hostel}
          style={styles.picker}
          onValueChange={value => updateFormData('hostel', value)}>
          <Picker.Item label="Select Hostel *" value="" />
          {hostels.map(hostel => (
            <Picker.Item key={hostel} label={hostel} value={hostel} />
          ))}
        </Picker>
      </View>
      <View style={[styles.inputContainer, { backgroundColor: colors.card, borderColor: colors.text }]}> 
        <Ionicons name="bed-outline" size={20} color={colors.text} style={styles.inputIcon} />
        <TextInput
          style={[styles.input, { color: colors.text }]}
          placeholder="Room Number"
          placeholderTextColor={colors.text}
          value={formData.roomNumber}
          onChangeText={value => updateFormData('roomNumber', value)}
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
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#eee',
    height: 50,
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
  picker: {
    flex: 1,
    height: 50,
  },
});

