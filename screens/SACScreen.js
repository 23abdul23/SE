import React from 'react';
import { View, Text, TouchableOpacity } from "react-native";
import styles from '../styles/SACStyles'
import { useTheme } from "../context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

export default function SAC({ navigation }) {
  const { isDarkMode, toggleTheme, colors } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', width: '100%' }}>
        <TouchableOpacity onPress={toggleTheme} style={{ padding: 8, alignSelf: 'flex-end' }}>
          <Ionicons name={isDarkMode ? 'sunny' : 'moon'} size={24} color={colors.text} />
        </TouchableOpacity>
      </View>
      <Text style={[styles.title, { color: colors.text }]}>Aegis ID</Text>
      <Text style={[styles.subtitle, { color: colors.text }]}>SAC</Text>
    </View>
  );
}
