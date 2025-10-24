"use client"

import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from "react-native"
import { useState, useEffect } from "react"
import { useTheme } from "../context/ThemeContext"
import { Ionicons } from "@expo/vector-icons"
import { useAuth } from "../context/AuthContext"
import { commonAPI } from "../services/api"
import { COLORS, FONTS, SIZES, SPACING } from "../utils/constants"
import LoadingSpinner from "../components/LoadingSpinner"

export default function ProfileScreen() {
  const { isDarkMode, toggleTheme, colors } = useTheme();
  const { user, logout } = useAuth()
  const [profile, setProfile] = useState(null)
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const response = await commonAPI.getProfile()
      console.log('front:',response.data)
      setProfile(response.data.userData)
    } catch (error) {
      console.log("Profile load error:", error)
      Alert.alert("Error", "Failed to load profile")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await commonAPI.updateProfile(profile)
      setEditing(false)
      loadProfile();
      Alert.alert("Success", "Profile updated successfully")

    } catch (error) {
      Alert.alert("Error", "Error in Update profile")

    } finally {
      setSaving(false)
    }
  }

  const updateProfile = (key, value) => {
    setProfile((prev) => ({ ...prev, [key]: value }))
  }

  if (loading) {
    return <LoadingSpinner />
  }
  console.log(profile)
  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}> 
      <View style={[styles.header, { backgroundColor: colors.card }]}> 
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', width: '100%' }}>
          <TouchableOpacity onPress={toggleTheme} style={{ padding: 8, alignSelf: 'flex-end' }}>
            <Ionicons name={isDarkMode ? 'sunny' : 'moon'} size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
        <View style={styles.avatarContainer}>
          <View style={[styles.avatar, { backgroundColor: colors.background + '20' }]}> 
            <Text style={[styles.avatarText, { color: colors.text }]}>{profile?.name?.charAt(0)?.toUpperCase() || "U"}</Text>
          </View>
          <Text style={[styles.userName, { color: colors.text }]}>{profile?.name}</Text>
          <Text style={[styles.userRole, { color: colors.text, opacity: 0.8 }]}>{profile?.role?.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={[styles.section, { backgroundColor: colors.card }]}> 
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Personal Information</Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => (editing ? handleSave() : setEditing(true))}
              disabled={saving}
            >
              <Ionicons name={editing ? "checkmark" : "pencil"} size={20} color={colors.text} />
              <Text style={[styles.editButtonText, { color: colors.text }]}>{editing ? (saving ? "Saving..." : "Save") : "Edit"}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={[styles.fieldLabel, { color: colors.text }]}>Full Name</Text>
            {editing ? (
              <TextInput
                style={[styles.fieldInput, { color: colors.text, borderBottomColor: colors.text }]}
                value={profile?.name || ""}
                onChangeText={(value) => updateProfile("name", value)}
              />
            ) : (
              <Text style={[styles.fieldValue, { color: colors.text }]}>{profile?.name}</Text>
            )}
          </View>

          <View style={styles.fieldContainer}>
            <Text style={[styles.fieldLabel, { color: colors.text }]}>Email</Text>
             {editing ? (
              <TextInput
                style={[styles.fieldInput, { color: colors.text, borderBottomColor: colors.text }]}
                value={profile?.email || ""}
                onChangeText={(value) => updateProfile("email", value)}
              />
            ) : (
            <Text style={[styles.fieldValue, { color: colors.text }]}>{profile?.email}</Text>
            )}
          </View>

          <View style={styles.fieldContainer}>
            <Text style={[styles.fieldLabel, { color: colors.text }]}>Password</Text>
            {editing ? (
              <TextInput
                style={[styles.fieldInput, { color: colors.text, borderBottomColor: colors.text }]}
                value={profile?.password || ""}
                onChangeText={(value) => updateProfile("password", value)}
              />
            ) : (
            <Text style={[styles.fieldValue, { color: colors.text }]}>{profile?.password}</Text>
            )}
          </View>

          <View style={styles.fieldContainer}>
            <Text style={[styles.fieldLabel, { color: colors.text }]}>Student ID</Text>
            {editing ? (
              <TextInput
                style={[styles.fieldInput, { color: colors.text, borderBottomColor: colors.text }]}
                value={profile?.studentId || ""}
                onChangeText={(value) => updateProfile("studentId", value)}
              />
            ) : (
            <Text style={[styles.fieldValue, { color: colors.text }]}>{profile?.studentId}</Text>
            )}
          </View>

          <View style={styles.fieldContainer}>
            <Text style={[styles.fieldLabel, { color: colors.text }]}>Phone Number</Text>
            {editing ? (
              <TextInput
                style={[styles.fieldInput, { color: colors.text, borderBottomColor: colors.text }]}
                value={profile?.phoneNumber || ""}
                onChangeText={(value) => updateProfile("phoneNumber", value)}
                keyboardType="phone-pad"
              />
            ) : (
              <Text style={[styles.fieldValue, { color: colors.text }]}>{profile?.phoneNumber}</Text>
            )}
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: colors.card }]}> 
          <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Academic Information</Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={[styles.fieldLabel, { color: colors.text }]}>Department</Text>
             {editing ? (
              <TextInput
                style={[styles.fieldInput, { color: colors.text, borderBottomColor: colors.text }]}
                value={profile?.department || ""}
                onChangeText={(value) => updateProfile("department", value)}
              />
            ) : (
            <Text style={[styles.fieldValue, { color: colors.text }]}>{profile?.department}</Text>
            )}
          </View>

          <View style={styles.fieldContainer}>
            <Text style={[styles.fieldLabel, { color: colors.text }]}>Year</Text>
             {editing ? (
              <TextInput
                style={[styles.fieldInput, { color: colors.text, borderBottomColor: colors.text }]}
                value={profile?.year || ""}
                onChangeText={(value) => updateProfile("year", value)}
              />
            ) : (
            <Text style={[styles.fieldValue, { color: colors.text }]}>{profile?.year}</Text>
            )}
          </View>

          <View style={styles.fieldContainer}>
            <Text style={[styles.fieldLabel, { color: colors.text }]}>Hostel</Text>
             {editing ? (
              <TextInput
                style={[styles.fieldInput, { color: colors.text, borderBottomColor: colors.text }]}
                value={profile?.hostel || ""}
                onChangeText={(value) => updateProfile("hostel", value)}
              />
            ) : (
            <Text style={[styles.fieldValue, { color: colors.text }]}>{profile?.hostel}</Text>
            )}
          </View>

          <View style={styles.fieldContainer}>
            <Text style={[styles.fieldLabel, { color: colors.text }]}>Room Number</Text>
            {editing ? (
              <TextInput
                style={[styles.fieldInput, { color: colors.text, borderBottomColor: colors.text }]}
                value={profile?.roomNumber || ""}
                onChangeText={(value) => updateProfile("roomNumber", value)}
              />
            ) : (
              <Text style={[styles.fieldValue, { color: colors.text }]}>{profile?.roomNumber || "Not specified"}</Text>
            )}
          </View>
        </View>

    
        <View style={[styles.section, { backgroundColor: colors.card }]}> 
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Account Status</Text>

          <View style={styles.statusContainer}>
            <View style={styles.statusItem}>
              <View
                style={[
                  styles.statusDot,
                  {
                    backgroundColor: profile?.isActive ? '#4caf50' : '#f44336',
                  },
                ]}
              />
              <Text style={[styles.statusText, { color: colors.text }]}>{profile?.isActive ? "Active" : "Inactive"}</Text>
            </View>

            <View style={styles.statusItem}>
              <Text style={[styles.statusLabel, { color: colors.text }]}>Member since</Text>
              <Text style={[styles.statusValue, { color: colors.text }]}>{new Date(profile?.createdAt).toLocaleDateString()}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={[styles.logoutButton, { backgroundColor: isDarkMode ? '#f4433620' : COLORS.error + '10' }]} onPress={logout}>
          <Ionicons name="log-out-outline" size={20} color={isDarkMode ? '#f44336' : COLORS.error} />
          <Text style={[styles.logoutButtonText, { color: isDarkMode ? '#f44336' : COLORS.error }]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingBottom: SPACING.xl,
    alignItems: "center",
  },
  avatarContainer: {
    alignItems: "center",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  avatarText: {
    fontSize: SIZES.xxxl,
    fontFamily: FONTS.bold,
  },
  userName: {
    fontSize: SIZES.xl,
    fontFamily: FONTS.bold,
    marginBottom: SPACING.xs,
  },
  userRole: {
    fontSize: SIZES.sm,
    fontFamily: FONTS.regular,
    opacity: 0.8,
  },
  content: {
    padding: SPACING.lg,
  },
  section: {
    borderRadius: 12,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: SIZES.lg,
    fontFamily: FONTS.bold,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 6,
  },
  editButtonText: {
    fontSize: SIZES.sm,
    fontFamily: FONTS.regular,
    marginLeft: SPACING.xs,
  },
  fieldContainer: {
    marginBottom: SPACING.md,
  },
  fieldLabel: {
    fontSize: SIZES.sm,
    fontFamily: FONTS.regular,
    marginBottom: SPACING.xs,
  },
  fieldValue: {
    fontSize: SIZES.md,
    fontFamily: FONTS.regular,
  },
  fieldInput: {
    fontSize: SIZES.md,
    fontFamily: FONTS.regular,
    borderBottomWidth: 1,
    paddingVertical: SPACING.xs,
  },
  statusContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: SPACING.xs,
  },
  statusText: {
    fontSize: SIZES.md,
    fontFamily: FONTS.regular,
  },
  statusLabel: {
    fontSize: SIZES.sm,
    fontFamily: FONTS.regular,
    marginRight: SPACING.xs,
  },
  statusValue: {
    fontSize: SIZES.sm,
    fontFamily: FONTS.regular,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.md,
    borderRadius: 12,
    marginTop: SPACING.lg,
  },
  logoutButtonText: {
    fontSize: SIZES.md,
    fontFamily: FONTS.bold,
    marginLeft: SPACING.xs,
  },
})
