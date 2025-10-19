
"use client"

import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Alert } from "react-native"
import { useState, useEffect } from "react"
import { useTheme } from "../context/ThemeContext"
import { Ionicons } from "@expo/vector-icons"
import { useAuth } from "../context/AuthContext"
import styles from "../styles/DashboardStyles"

import api from "../services/api"
import LoadingSpinner from "../components/LoadingSpinner"
import PasskeyCard from "../components/PasskeyCard"

export default function GuardDashboardScreen({ navigation }) {
  const { isDarkMode, toggleTheme, colors } = useTheme();
  const { user, logout } = useAuth()

  const [profile, setProfile] = useState(null)
  const [passkey, setPasskey] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const res = await api.get("/auth/fetchProfile", {
        headers: { Authorization: `Bearer ${user.token}` },
        params: { 
          user : user
        }
      });

      setProfile(res.data.user)
      
    } 
    catch (error) {
      console.log("Dashboard load error:", error)
      Alert.alert("Error", "Failed to load dashboard data")
    } 
    finally {
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
            <Text style={[styles.userRole, { color: colors.subText }]}>Current Location: {profile?.location}</Text>
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
        

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate("Scan")}> 
              <View style={[styles.actionIcon, { backgroundColor: isDarkMode ? '#4caf5020' : '#4caf5020' }]}> 
                <Ionicons name="scan" size={24} color={isDarkMode ? '#4caf50' : '#4caf50'} />
              </View>
              <Text style={[styles.actionText, { color: colors.subText }]}>Scan</Text>
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

