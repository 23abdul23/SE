
import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AllLocations from '../constants/SecuityLocations.json';
import { Picker } from '@react-native-picker/picker';

console.log("Loaded security locations:", AllLocations['Locations']);

export default function SecurityRegisterCard({ formData, updateFormData, colors }) {
  return (
    <>
      <View style={[styles.inputContainer, { backgroundColor: colors.card, borderColor: colors.text }]}> 
        <Ionicons name="mail-outline" size={20} color={colors.text} style={styles.inputIcon} />
        <TextInput
          style={[styles.input, { color: colors.text }]}
          placeholder="Email Address *"
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
          placeholder="Guard ID*"
          placeholderTextColor={colors.text}
          value={formData.guardId}
          onChangeText={value => updateFormData('guardId', value)}
          autoCapitalize="characters"
        />
      </View>
      <View style={[styles.inputContainer, { backgroundColor: colors.card, borderColor: colors.text }]}> 
        <Ionicons name="shield-outline" size={20} color={colors.text} style={styles.inputIcon} />
        
        

        <Picker
          selectedValue={formData.securityPost}
          onValueChange={(value) => updateFormData('securityPost', value)}
          style={{ width: 310 }}
        >
          {AllLocations['Locations'].map((loc, index) => <Picker.Item key={index} label={loc} value={loc} />)}
        </Picker>
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
