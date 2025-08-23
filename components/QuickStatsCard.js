"use client"

import { View, Text, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { COLORS, FONTS, SIZES, SPACING } from "../utils/constants"

export default function QuickStatsCard({ stats }) {
  const statItems = [
    {
      icon: "document-text-outline",
      label: "Total Outpasses",
      value: stats.totalOutpasses,
      color: COLORS.primary,
    },
    {
      icon: "checkmark-circle-outline",
      label: "Active",
      value: stats.activeOutpasses,
      color: COLORS.success,
    },
    {
      icon: "time-outline",
      label: "Pending",
      value: stats.pendingOutpasses,
      color: COLORS.warning,
    },
  ]

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Outpass Summary</Text>
      <View style={styles.statsContainer}>
        {statItems.map((item, index) => (
          <View key={index} style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: item.color + "20" }]}>
              <Ionicons name={item.icon} size={20} color={item.color} />
            </View>
            <Text style={styles.statValue}>{item.value}</Text>
            <Text style={styles.statLabel}>{item.label}</Text>
          </View>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: SIZES.lg,
    fontFamily: FONTS.bold,
    color: COLORS.gray[800],
    marginBottom: SPACING.md,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  statValue: {
    fontSize: SIZES.xl,
    fontFamily: FONTS.bold,
    color: COLORS.gray[800],
    marginBottom: SPACING.xs,
  },
  statLabel: {
    fontSize: SIZES.xs,
    fontFamily: FONTS.regular,
    color: COLORS.gray[600],
    textAlign: "center",
  },
})
