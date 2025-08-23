"use client"

import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { COLORS, FONTS, SIZES, SPACING } from "../utils/constants"

export default function LocationCard({ location, loading, onRefresh }) {
  const formatCoordinates = (lat, lng) => {
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`
  }

  const getLocationStatus = () => {
    if (loading) return { text: "Getting location...", color: COLORS.warning, icon: "time" }
    if (location) return { text: "Location available", color: COLORS.success, icon: "checkmark-circle" }
    return { text: "Location unavailable", color: COLORS.error, icon: "close-circle" }
  }

  const status = getLocationStatus()

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.statusContainer}>
          <Ionicons name={status.icon} size={20} color={status.color} />
          <Text style={[styles.statusText, { color: status.color }]}>{status.text}</Text>
        </View>
        <TouchableOpacity style={styles.refreshButton} onPress={onRefresh} disabled={loading}>
          <Ionicons name="refresh" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {location && (
        <View style={styles.locationInfo}>
          <View style={styles.coordinatesContainer}>
            <Ionicons name="location" size={16} color={COLORS.gray[600]} />
            <Text style={styles.coordinates}>{formatCoordinates(location.latitude, location.longitude)}</Text>
          </View>
          <Text style={styles.timestamp}>Updated: {new Date(location.timestamp).toLocaleTimeString()}</Text>
        </View>
      )}

      <View style={styles.infoContainer}>
        <Ionicons name="information-circle-outline" size={16} color={COLORS.primary} />
        <Text style={styles.infoText}>
          Your location will be shared with emergency responders when you send an alert
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusText: {
    fontSize: SIZES.md,
    fontFamily: FONTS.bold,
    marginLeft: SPACING.xs,
  },
  refreshButton: {
    backgroundColor: COLORS.primary + "20",
    padding: SPACING.xs,
    borderRadius: 6,
  },
  locationInfo: {
    marginBottom: SPACING.sm,
  },
  coordinatesContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.xs,
  },
  coordinates: {
    fontSize: SIZES.sm,
    fontFamily: FONTS.regular,
    color: COLORS.gray[800],
    marginLeft: SPACING.xs,
  },
  timestamp: {
    fontSize: SIZES.xs,
    fontFamily: FONTS.regular,
    color: COLORS.gray[500],
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: COLORS.primary + "10",
    padding: SPACING.sm,
    borderRadius: 8,
  },
  infoText: {
    fontSize: SIZES.xs,
    fontFamily: FONTS.regular,
    color: COLORS.primary,
    marginLeft: SPACING.xs,
    flex: 1,
    lineHeight: 16,
  },
})
