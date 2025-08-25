"use client"

import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Alert } from "react-native"
import { useState, useEffect } from "react"
import { Ionicons } from "@expo/vector-icons"
import { useAuth } from "../context/AuthContext"
import { studentAPI } from "../services/api"
import { COLORS, FONTS, SIZES, SPACING } from "../utils/constants"

import styles from "../styles/DashboardStyles"

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


        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>


            <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate("Scan")}>
              <View style={[styles.actionIcon, { backgroundColor: COLORS.success + "20" }]}>
                <Ionicons name="scan" size={24} color={COLORS.success} />
              </View>
              <Text style={styles.actionText}>Scan</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate("Library")}>
              <View style={[styles.actionIcon, { backgroundColor: COLORS.primary + "20" }]}>
                <Ionicons name="book" size={24} color={COLORS.primary} />
              </View>
              <Text style={styles.actionText}>Library</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate("SAC")}>
              <View style={[styles.actionIcon, { backgroundColor: COLORS.error + "20" }]}>
                <Ionicons name="bicycle" size={24} color={COLORS.secondary} />
              </View>
              <Text style={styles.actionText}>SAC</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate("Profile")}>
              <View style={[styles.actionIcon, { backgroundColor: COLORS.success + "20" }]}>
                <Ionicons name="person" size={24} color={COLORS.success} />
              </View>
              <Text style={styles.actionText}>Profile</Text>
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

