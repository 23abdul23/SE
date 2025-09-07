"use client"

import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Alert } from "react-native"
import { useState, useEffect } from "react"
import { useTheme } from "../context/ThemeContext"
import { Ionicons } from "@expo/vector-icons"
import { useAuth } from "../context/AuthContext"
import { outpass, studentAPI } from "../services/api"
import styles from "../styles/DashboardStyles"

import LoadingSpinner from "../components/LoadingSpinner"
import PasskeyCard from "../components/PasskeyCard"

export default function DashboardScreen({ navigation }) {
  const { isDarkMode, toggleTheme, colors } = useTheme();
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
        outpass.getOutpasses(),
      ])

      setPasskey(passkeyResponse.data)

      if (outpassesResponse.data.outpass){
        const outpasses = outpassesResponse.data.outpass.auditTrail
        setStats({
          totalOutpasses: outpasses.length,
          activeOutpasses: outpasses.filter((op) => op.status === "approved").length,
          pendingOutpasses: outpasses.filter((op) => op.status === "pending").length,
        })
      }
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
      style={[styles.container, { backgroundColor: colors.background }]}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={[styles.header, { backgroundColor: colors.card }]}> 
        
        
        <View style={styles.headerContent}>

          <View>
            <Text style={[styles.greeting, { color: colors.text }]}>Good {getGreeting()}</Text>
            <Text style={[styles.userName, { color: colors.text }]}>{user?.name}</Text>
            <Text style={[styles.studentId, { color: colors.text }]}>{user?.studentId}</Text>
          </View>

          <View>
            <TouchableOpacity onPress={toggleTheme}>
              <Ionicons name={isDarkMode ? 'sunny' : 'moon'} size={24} color={colors.text} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={28} color={isDarkMode ? '#f44336' : '#f44336'} />
            </TouchableOpacity>
          </View>

        </View>
      </View>

      <View style={styles.content}>
        {/* Daily Passkey Card */}
        <PasskeyCard passkey={passkey.passkey} onRefresh={loadDashboardData} />

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate("Scan")}> 
              <View style={[styles.actionIcon, { backgroundColor: isDarkMode ? '#4caf5020' : '#4caf5020' }]}> 
                <Ionicons name="scan" size={24} color={isDarkMode ? '#4caf50' : '#4caf50'} />
              </View>
              <Text style={[styles.actionText, { color: colors.subText }]}>Scan</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate("Library")}> 
              <View style={[styles.actionIcon, { backgroundColor: isDarkMode ? '#2196f320' : '#2196f320' }]}> 
                <Ionicons name="book" size={24} color={isDarkMode ? '#2196f3' : '#2196f3'} />
              </View>
              <Text style={[styles.actionText, { color: colors.subText }]}>Library</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate("SAC")}> 
              <View style={[styles.actionIcon, { backgroundColor: isDarkMode ? '#f4433620' : '#f4433620' }]}> 
                <Ionicons name="bicycle" size={24} color={isDarkMode ? '#ff9800' : '#ff9800'} />
              </View>
              <Text style={[styles.actionText, { color: colors.subText }]}>SAC</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate("Profile")}> 
              <View style={[styles.actionIcon, { backgroundColor: isDarkMode ? '#4caf5020' : '#4caf5020' }]}> 
                <Ionicons name="person" size={24} color={isDarkMode ? '#4caf50' : '#4caf50'} />
              </View>
              <Text style={[styles.actionText, { color: colors.subText }]}>Profile</Text>
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

