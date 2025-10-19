"use client"

import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Alert } from "react-native"
import { useState, useEffect } from "react"
import { useTheme } from "../context/ThemeContext"
import { Ionicons } from "@expo/vector-icons"
import { useAuth } from "../context/AuthContext"
import styles from "../styles/DashboardStyles"

import QRCode from "react-native-qrcode-svg"
import { COLORS, FONTS, SIZES, SPACING } from "../utils/constants"

import { Picker } from "@react-native-picker/picker"
import AllLocations from "../constants/SecuityLocations.json"

import api from "../services/api"
import LoadingSpinner from "../components/LoadingSpinner"
import PasskeyCard from "../components/PasskeyCard"

export default function GuardDashboardScreen({ navigation }) {
  const { isDarkMode, toggleTheme, colors } = useTheme();
  const { user, logout } = useAuth()

  const [profile, setProfile] = useState(null)
  const [loc, setLoc] = useState("")
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  
  useEffect(() => {
    loadDashboardData()
  }, [])
  
  // Ensure a default location is selected (use profile.location if available,
  // otherwise fall back to the first entry in AllLocations)
  useEffect(() => {
    if (!loc) {
      if (profile?.location) {
        setLoc(profile.location)
      } else if (Array.isArray(AllLocations?.Locations) && AllLocations.Locations.length > 0) {
        setLoc(AllLocations.Locations[0])
      }
    }
  }, [profile, loc])
  
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

      <View style={[styles.content, localStyles.centerContent]}>
        {/* Centered quick action card */}
        <View style={localStyles.centerRow}>
          <TouchableOpacity
            style={[localStyles.actionCard, { backgroundColor: isDarkMode ? '#e8f5e9' : '#f1f8f3' }]}
            onPress={() => navigation.navigate("Scan")}
            activeOpacity={0.8}
          >
            <View style={[localStyles.actionIcon, { backgroundColor: isDarkMode ? '#4caf50' : '#4caf50' }]}>
              <Ionicons name="scan" size={24} color="#fff" />
            </View>
            <Text style={[localStyles.actionText, { color: colors.subText }]}>Scan</Text>
          </TouchableOpacity>
        </View>

        {/* Picker wrapped in a subtle card and centered */}
        <View style={localStyles.pickerWrapper}>
          <Text style={[localStyles.sectionTitle, { color: colors.text }]}>QR For Location</Text>
          <View style={[localStyles.pickerCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Picker
              selectedValue={loc}
              onValueChange={(value) => setLoc(value)}
              style={{ width: '100%' }}
            >
              {Array.isArray(AllLocations?.Locations) && AllLocations.Locations.map((location, index) => (
                <Picker.Item
                  key={`${location}-${index}`}
                  label={location}
                  value={location}
                />
              ))}
            </Picker>
          </View>
        </View>

        {/* QR card centered and styled like PasskeyCard */}
        <View style={localStyles.qrWrapper}>
          <View style={[localStyles.qrCard, { backgroundColor: COLORS.white }]}>
            <QRCode
              value={JSON.stringify({
                guardName: user?.name,
                guardId: user?.guardId,
                location: loc
              })}
              size={150}
              color={COLORS.gray[800]}
              backgroundColor={COLORS.white}
            />
            <Text style={localStyles.qrNote}>Scan this QR at entry/exit</Text>
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

const localStyles = StyleSheet.create({
  centerContent: {
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  centerRow: {
    width: '100%',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    minWidth: 160,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  actionText: {
    fontSize: 16,
    fontFamily: FONTS.medium,
  },
  pickerWrapper: {
    width: '100%',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    alignSelf: 'flex-start',
    marginBottom: 8,
    fontSize: 14,
    fontFamily: FONTS.medium,
  },
  pickerCard: {
    width: '100%',
    borderRadius: 12,
    paddingHorizontal: 8,
    borderWidth: 1,
  },
  qrWrapper: {
    width: '100%',
    alignItems: 'center',
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
  },
  qrCard: {
    alignItems: 'center',
    borderRadius: 16,
    padding: SPACING.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  qrNote: {
    fontSize: SIZES.xs,
    fontFamily: FONTS.regular,
    color: COLORS.gray[600],
    textAlign: 'center',
    marginTop: SPACING.sm,
    maxWidth: 220,
  },
})

