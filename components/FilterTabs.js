"use client"

import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native"
import { useMemo } from "react"
import { COLORS, FONTS, SIZES, SPACING } from "../utils/constants"

export default function FilterTabs({ options, activeFilter, onFilterChange }) {
  const totalWidth = useMemo(() => options.length * 120, [options.length])

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { minWidth: totalWidth }]}
      >
        {options.map((option) => (
          <TouchableOpacity
            key={option.key}
            style={[styles.tab, activeFilter === option.key && styles.activeTab]}
            onPress={() => onFilterChange(option.key)}
          >
            <Text style={[styles.tabText, activeFilter === option.key && styles.activeTabText]}>{option.label}</Text>
            {option.count > 0 && (
              <View style={[styles.badge, activeFilter === option.key && styles.activeBadge]}>
                <Text style={[styles.badgeText, activeFilter === option.key && styles.activeBadgeText]}>
                  {option.count}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginRight: SPACING.sm,
    borderRadius: 20,
    backgroundColor: COLORS.gray[100],
  },
  activeTab: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: SIZES.sm,
    fontFamily: FONTS.regular,
    color: COLORS.gray[600],
  },
  activeTabText: {
    color: COLORS.white,
    fontFamily: FONTS.bold,
  },
  badge: {
    backgroundColor: COLORS.gray[300],
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: SPACING.xs,
    minWidth: 20,
    alignItems: "center",
  },
  activeBadge: {
    backgroundColor: COLORS.white + "30",
  },
  badgeText: {
    fontSize: SIZES.xs,
    fontFamily: FONTS.bold,
    color: COLORS.gray[700],
  },
  activeBadgeText: {
    color: COLORS.white,
  },
})
