"use client"

import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { COLORS, FONTS, SIZES, SPACING } from "../utils/constants"

export default function EmergencyButton({ emergency, onPress, disabled = false }) {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: emergency.backgroundColor }, disabled && styles.disabledButton]}
      onPress={onPress}
      disabled={disabled}
    >
      <View style={[styles.iconContainer, { backgroundColor: emergency.color + "30" }]}>
        <Ionicons name={emergency.icon} size={32} color={emergency.color} />
      </View>
      <Text style={[styles.title, { color: emergency.color }]}>{emergency.title}</Text>
      <Text style={styles.description}>{emergency.description}</Text>
      {disabled && (
        <View style={styles.disabledOverlay}>
          <Ionicons name="location-outline" size={16} color={COLORS.gray[500]} />
          <Text style={styles.disabledText}>Location required</Text>
        </View>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    width: "48%",
    padding: SPACING.md,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: SPACING.md,
    minHeight: 140,
    justifyContent: "center",
  },
  disabledButton: {
    opacity: 0.5,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: SIZES.md,
    fontFamily: FONTS.bold,
    textAlign: "center",
    marginBottom: SPACING.xs,
  },
  description: {
    fontSize: SIZES.xs,
    fontFamily: FONTS.regular,
    color: COLORS.gray[600],
    textAlign: "center",
    lineHeight: 16,
  },
  disabledOverlay: {
    position: "absolute",
    bottom: SPACING.xs,
    flexDirection: "row",
    alignItems: "center",
  },
  disabledText: {
    fontSize: SIZES.xs,
    fontFamily: FONTS.regular,
    color: COLORS.gray[500],
    marginLeft: SPACING.xs,
  },
})
