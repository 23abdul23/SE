"use client"

import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Alert } from "react-native"
import { useState, useEffect } from "react"
import { Ionicons } from "@expo/vector-icons"
import { useAuth } from "../context/AuthContext"
import { studentAPI } from "../services/api"
import { COLORS, FONTS, SIZES, SPACING } from "../utils/constants"
import LoadingSpinner from "../components/LoadingSpinner"
import PasskeyCard from "../components/PasskeyCard"
import QuickStatsCard from "../components/QuickStatsCard"

export default function DashboardScreen({ navigation }) {
  const { user, logout } = useAuth()
  const [passkey, setPasskey] = useState(null)
  const [stats, setStats] = useState({
    totalOutpasses: 0,
    activeOutpasses: 0,
    pendingOutpasses: 0,
  })
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const [passkeyResponse, outpassesResponse] = await Promise.all([
        studentAPI.getDailyPasskey(),
        studentAPI.getOutpasses(),
      ])

      setPasskey(passkeyResponse.data)

      const outpasses = outpassesResponse.data
      setStats({
        totalOutpasses: outpasses.length,
        activeOutpasses: outpasses.filter((op) => op.status === "active").length,
        pendingOutpasses: outpasses.filter((op) => op.status === "pending").length,
      })
    } catch (error) {
      console.log("Dashboard load error:", error)
      Alert.alert("Error", "Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await loadDashboardData()
    setRefreshing(false)
  }

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: logout },
    ])
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Good {getGreeting()}</Text>
            <Text style={styles.userName}>{user?.name}</Text>
            <Text style={styles.studentId}>{user?.studentId}</Text>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color={COLORS.error} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        {/* Daily Passkey Card */}
        <PasskeyCard passkey={passkey} onRefresh={loadDashboardData} />

        {/* Quick Stats */}
        <QuickStatsCard stats={stats} />

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate("Outpass")}>
              <View style={[styles.actionIcon, { backgroundColor: COLORS.primary + "20" }]}>
                <Ionicons name="document-text" size={24} color={COLORS.primary} />
              </View>
              <Text style={styles.actionText}>Request Outpass</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate("Emergency")}>
              <View style={[styles.actionIcon, { backgroundColor: COLORS.error + "20" }]}>
                <Ionicons name="warning" size={24} color={COLORS.error} />
              </View>
              <Text style={styles.actionText}>Emergency</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate("Profile")}>
              <View style={[styles.actionIcon, { backgroundColor: COLORS.success + "20" }]}>
                <Ionicons name="person" size={24} color={COLORS.success} />
              </View>
              <Text style={styles.actionText}>Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => Alert.alert("Info", "Contact security for assistance")}
            >
              <View style={[styles.actionIcon, { backgroundColor: COLORS.warning + "20" }]}>
                <Ionicons name="help-circle" size={24} color={COLORS.warning} />
              </View>
              <Text style={styles.actionText}>Help</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return "Morning"
  if (hour < 17) return "Afternoon"
  return "Evening"
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 50,
    paddingBottom: SPACING.lg,
    paddingHorizontal: SPACING.lg,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  greeting: {
    fontSize: SIZES.md,
    fontFamily: FONTS.regular,
    color: COLORS.white,
    opacity: 0.8,
  },
  userName: {
    fontSize: SIZES.xl,
    fontFamily: FONTS.bold,
    color: COLORS.white,
    marginTop: SPACING.xs,
  },
  studentId: {
    fontSize: SIZES.sm,
    fontFamily: FONTS.regular,
    color: COLORS.white,
    opacity: 0.8,
    marginTop: SPACING.xs,
  },
  logoutButton: {
    backgroundColor: COLORS.white + "20",
    padding: SPACING.sm,
    borderRadius: 8,
  },
  content: {
    padding: SPACING.lg,
  },
  sectionTitle: {
    fontSize: SIZES.lg,
    fontFamily: FONTS.bold,
    color: COLORS.gray[800],
    marginBottom: SPACING.md,
  },
  quickActions: {
    marginTop: SPACING.lg,
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  actionCard: {
    width: "48%",
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  actionText: {
    fontSize: SIZES.sm,
    fontFamily: FONTS.regular,
    color: COLORS.gray[700],
    textAlign: "center",
  },
})
