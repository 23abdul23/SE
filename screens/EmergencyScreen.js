"use client"

import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Linking } from "react-native"
import { useState, useEffect } from "react"
import { Ionicons } from "@expo/vector-icons"
import * as Location from "expo-location"
import { emergencyAPI } from "../services/api"
import { useAuth } from "../context/AuthContext"
import { COLORS, FONTS, SIZES, SPACING, EMERGENCY_TYPES } from "../utils/constants"
import LoadingSpinner from "../components/LoadingSpinner"
import EmergencyButton from "../components/EmergencyButton"
import LocationCard from "../components/LocationCard"

export default function EmergencyScreen() {
  const { user } = useAuth()
  const [location, setLocation] = useState(null)
  const [emergencyContacts, setEmergencyContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [locationLoading, setLocationLoading] = useState(false)

  const emergencyTypes = [
    {
      type: EMERGENCY_TYPES.MEDICAL,
      title: "Medical Emergency",
      description: "Health issues, accidents, injuries",
      icon: "medical",
      color: COLORS.error,
      backgroundColor: COLORS.error + "20",
    },
    {
      type: EMERGENCY_TYPES.SECURITY,
      title: "Security Emergency",
      description: "Threats, harassment, unsafe situations",
      icon: "shield",
      color: COLORS.warning,
      backgroundColor: COLORS.warning + "20",
    },
    {
      type: EMERGENCY_TYPES.FIRE,
      title: "Fire Emergency",
      description: "Fire, smoke, evacuation needed",
      icon: "flame",
      color: COLORS.error,
      backgroundColor: COLORS.error + "20",
    },
    {
      type: EMERGENCY_TYPES.OTHER,
      title: "Other Emergency",
      description: "Any other urgent situation",
      icon: "alert-circle",
      color: COLORS.primary,
      backgroundColor: COLORS.primary + "20",
    },
  ]

  useEffect(() => {
    loadEmergencyData()
    getCurrentLocation()
  }, [])

  const loadEmergencyData = async () => {
    try {
      const response = await emergencyAPI.getEmergencyContacts()
      setEmergencyContacts(response.data)
    } catch (error) {
      console.log("Emergency contacts load error:", error)
    } finally {
      setLoading(false)
    }
  }

  const getCurrentLocation = async () => {
    setLocationLoading(true)
    try {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location permission is required for emergency services")
        return
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      })

      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      console.log("Location error:", error)
      Alert.alert("Location Error", "Unable to get current location")
    } finally {
      setLocationLoading(false)
    }
  }

  const handleEmergencyAlert = (emergencyType) => {
    Alert.alert(
      "Emergency Alert",
      `Are you sure you want to send a ${emergencyType.title.toLowerCase()}? This will notify campus security and emergency contacts.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Send Alert",
          style: "destructive",
          onPress: () => sendEmergencyAlert(emergencyType.type),
        },
      ],
    )
  }

  const sendEmergencyAlert = async (type) => {
    try {
      const alertData = {
        type,
        location: location || null,
        timestamp: new Date().toISOString(),
        studentInfo: {
          name: user?.name,
          studentId: user?.studentId,
          phone: user?.phone,
          hostel: user?.hostel,
          roomNumber: user?.roomNumber,
        },
      }

      await emergencyAPI.createAlert(alertData)

      Alert.alert(
        "Emergency Alert Sent",
        "Your emergency alert has been sent to campus security. Help is on the way. Stay calm and follow safety protocols.",
        [{ text: "OK" }],
      )
    } catch (error) {
      Alert.alert("Error", "Failed to send emergency alert. Please try calling directly.")
    }
  }

  const handleCallEmergency = (contact) => {
    Alert.alert("Call Emergency Contact", `Call ${contact.name} at ${contact.phone}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Call",
        onPress: () => Linking.openURL(`tel:${contact.phone}`),
      },
    ])
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Ionicons name="warning" size={32} color={COLORS.error} />
          <Text style={styles.headerTitle}>Emergency Services</Text>
          <Text style={styles.headerSubtitle}>Quick access to emergency help</Text>
        </View>
      </View>

      <View style={styles.content}>
        {/* Location Card */}
        <LocationCard location={location} loading={locationLoading} onRefresh={getCurrentLocation} />

        {/* Emergency Alert Buttons */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Emergency Alerts</Text>
          <Text style={styles.sectionDescription}>
            Tap any button below to send an immediate alert to campus security with your location
          </Text>

          <View style={styles.emergencyGrid}>
            {emergencyTypes.map((emergency, index) => (
              <EmergencyButton
                key={index}
                emergency={emergency}
                onPress={() => handleEmergencyAlert(emergency)}
                disabled={!location}
              />
            ))}
          </View>
        </View>

        {/* Emergency Contacts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Emergency Contacts</Text>
          <Text style={styles.sectionDescription}>Direct contact numbers for immediate assistance</Text>

          {emergencyContacts.map((contact, index) => (
            <TouchableOpacity key={index} style={styles.contactCard} onPress={() => handleCallEmergency(contact)}>
              <View style={styles.contactInfo}>
                <Ionicons name="call" size={24} color={COLORS.primary} />
                <View style={styles.contactDetails}>
                  <Text style={styles.contactName}>{contact.name}</Text>
                  <Text style={styles.contactRole}>{contact.role}</Text>
                  <Text style={styles.contactPhone}>{contact.phone}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.gray[400]} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Safety Tips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Safety Tips</Text>
          <View style={styles.tipsContainer}>
            <View style={styles.tipItem}>
              <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
              <Text style={styles.tipText}>Stay calm and assess the situation</Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
              <Text style={styles.tipText}>Move to a safe location if possible</Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
              <Text style={styles.tipText}>Follow instructions from security personnel</Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
              <Text style={styles.tipText}>Keep your phone charged and accessible</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.error + "10",
    paddingTop: 50,
    paddingBottom: SPACING.lg,
    paddingHorizontal: SPACING.lg,
  },
  headerContent: {
    alignItems: "center",
  },
  headerTitle: {
    fontSize: SIZES.xl,
    fontFamily: FONTS.bold,
    color: COLORS.error,
    marginTop: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  headerSubtitle: {
    fontSize: SIZES.md,
    fontFamily: FONTS.regular,
    color: COLORS.gray[600],
    textAlign: "center",
  },
  content: {
    padding: SPACING.lg,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: SIZES.lg,
    fontFamily: FONTS.bold,
    color: COLORS.gray[800],
    marginBottom: SPACING.xs,
  },
  sectionDescription: {
    fontSize: SIZES.sm,
    fontFamily: FONTS.regular,
    color: COLORS.gray[600],
    marginBottom: SPACING.md,
  },
  emergencyGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  contactCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: 12,
    marginBottom: SPACING.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contactInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  contactDetails: {
    marginLeft: SPACING.md,
    flex: 1,
  },
  contactName: {
    fontSize: SIZES.md,
    fontFamily: FONTS.bold,
    color: COLORS.gray[800],
  },
  contactRole: {
    fontSize: SIZES.sm,
    fontFamily: FONTS.regular,
    color: COLORS.gray[600],
    marginTop: SPACING.xs,
  },
  contactPhone: {
    fontSize: SIZES.sm,
    fontFamily: FONTS.regular,
    color: COLORS.primary,
    marginTop: SPACING.xs,
  },
  tipsContainer: {
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: 12,
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  tipText: {
    fontSize: SIZES.sm,
    fontFamily: FONTS.regular,
    color: COLORS.gray[700],
    marginLeft: SPACING.sm,
    flex: 1,
  },
})
