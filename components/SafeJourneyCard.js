import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, FONTS } from "../utils/constants";

export default function SafeJourneyCard({ onClose, location }) {
  return (
    <View style={{
      backgroundColor: "#e0f7fa",
      borderRadius: 24,
      padding: 32,
      alignItems: "center",
      shadowColor: "#00bcd4",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
      minWidth: 260,
      minHeight: 220,
      justifyContent: "center",
    }}>
      <Text style={{ fontSize: 23 , color: "#06adafff"}}>Exit From : {location}</Text>
      <Ionicons name="walk" size={48} color="#00bcd4" style={{ marginBottom: 12 }} />
      <Text style={{
        fontSize: 24,
        fontFamily: FONTS.bold,
        color: "#00796b",
        marginBottom: 8,
        textAlign: "center",
      }}>
        Have a Safe Journey!
      </Text>
      <Text style={{
        fontSize: 16,
        fontFamily: FONTS.regular,
        color: "#009688",
        textAlign: "center",
      }}>
      </Text>
      <TouchableOpacity
        onPress={onClose}
        style={{
          backgroundColor: "#00bcd4",
          paddingVertical: 10,
          paddingHorizontal: 32,
          borderRadius: 16,
        }}
      >
        <Text style={{
          color: "#fff",
          fontFamily: FONTS.bold,
          fontSize: 16,
        }}>Close</Text>
      </TouchableOpacity>
    </View>
  );
}