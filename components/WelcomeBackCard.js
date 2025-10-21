import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, FONTS } from "../utils/constants";

export default function WelcomeBackCard({ onClose , location}) {
  return (
    <View style={{
      backgroundColor: "#fffde7",
      borderRadius: 24,
      padding: 32,
      alignItems: "center",
      shadowColor: "#ffd600",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
      minWidth: 260,
      minHeight: 220,
      justifyContent: "center",
    }}>
        <Text style={{ fontSize: 23 , color: "#ffaa00ff"}}>Entry From : {location}</Text>
      <Ionicons name="happy" size={48} color="#ffd600" style={{ marginBottom: 12 }} />
      <Text style={{
        fontSize: 24,
        fontFamily: FONTS.bold,
        color: "#ffb300",
        marginBottom: 8,
        textAlign: "center",
      }}>
        Welcome Back!
      </Text>
      <Text style={{
        fontSize: 16,
        fontFamily: FONTS.regular,
        color: "#ff8f00",
        textAlign: "center",
      }}>
      </Text>
      <TouchableOpacity
        onPress={onClose}
        style={{
          backgroundColor: "#ffd600",
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