"use client"

import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from "react-native"
import { useState, useEffect } from "react"
import { Ionicons } from "@expo/vector-icons"
import { useAuth } from "../context/AuthContext"
import { studentAPI } from "../services/api"
import { COLORS, FONTS, SIZES, SPACING } from "../utils/constants"
import LoadingSpinner from "../components/LoadingSpinner"

export default function ProfileScreen() {
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
      console.log("user:",user)
      const response = await studentAPI.getProfile()
      setProfile(response.data)
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
      await studentAPI.updateProfile(profile)
      setEditing(false)
      Alert.alert("Success", "Profile updated successfully")
    } catch (error) {
      Alert.alert("Error", "Failed to update profile")
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

  console.log(user.name)
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{profile?.name?.charAt(0)?.toUpperCase() || "U"}</Text>
          </View>
          <Text style={styles.userName}>{profile?.name}</Text>
          <Text style={styles.userRole}>{profile?.role?.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => (editing ? handleSave() : setEditing(true))}
              disabled={saving}
            >
              <Ionicons name={editing ? "checkmark" : "pencil"} size={20} color={COLORS.primary} />
              <Text style={styles.editButtonText}>{editing ? (saving ? "Saving..." : "Save") : "Edit"}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Full Name</Text>
            {editing ? (
              <TextInput
                style={styles.fieldInput}
                value={profile?.name || ""}
                onChangeText={(value) => updateProfile("name", value)}
              />
            ) : (
              <Text style={styles.fieldValue}>{user?.name}</Text>
            )}
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Email</Text>
            <Text style={styles.fieldValue}>{user?.email}</Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Student ID</Text>
            <Text style={styles.fieldValue}>{user?.studentId}</Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Phone Number</Text>
            {editing ? (
              <TextInput
                style={styles.fieldInput}
                value={profile?.phone || ""}
                onChangeText={(value) => updateProfile("phone", value)}
                keyboardType="phone-pad"
              />
            ) : (
              <Text style={styles.fieldValue}>{user?.phone}</Text>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Academic Information</Text>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Department</Text>
            <Text style={styles.fieldValue}>{profile?.department}</Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Year</Text>
            <Text style={styles.fieldValue}>{profile?.year}</Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Hostel</Text>
            <Text style={styles.fieldValue}>{profile?.hostel}</Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Room Number</Text>
            {editing ? (
              <TextInput
                style={styles.fieldInput}
                value={profile?.roomNumber || ""}
                onChangeText={(value) => updateProfile("roomNumber", value)}
              />
            ) : (
              <Text style={styles.fieldValue}>{profile?.roomNumber || "Not specified"}</Text>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Status</Text>

          <View style={styles.statusContainer}>
            <View style={styles.statusItem}>
              <View
                style={[
                  styles.statusDot,
                  {
                    backgroundColor: profile?.isActive ? COLORS.success : COLORS.error,
                  },
                ]}
              />
              <Text style={styles.statusText}>{profile?.isActive ? "Active" : "Inactive"}</Text>
            </View>

            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>Member since</Text>
              <Text style={styles.statusValue}>{new Date(profile?.createdAt).toLocaleDateString()}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Ionicons name="log-out-outline" size={20} color={COLORS.error} />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
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
    backgroundColor: COLORS.primary,
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
    backgroundColor: COLORS.white + "20",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  avatarText: {
    fontSize: SIZES.xxxl,
    fontFamily: FONTS.bold,
    color: COLORS.white,
  },
  userName: {
    fontSize: SIZES.xl,
    fontFamily: FONTS.bold,
    color: COLORS.white,
    marginBottom: SPACING.xs,
  },
  userRole: {
    fontSize: SIZES.sm,
    fontFamily: FONTS.regular,
    color: COLORS.white,
    opacity: 0.8,
  },
  content: {
    padding: SPACING.lg,
  },
  section: {
    backgroundColor: COLORS.white,
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
    color: COLORS.gray[800],
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary + "10",
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 6,
  },
  editButtonText: {
    fontSize: SIZES.sm,
    fontFamily: FONTS.regular,
    color: COLORS.primary,
    marginLeft: SPACING.xs,
  },
  fieldContainer: {
    marginBottom: SPACING.md,
  },
  fieldLabel: {
    fontSize: SIZES.sm,
    fontFamily: FONTS.regular,
    color: COLORS.gray[600],
    marginBottom: SPACING.xs,
  },
  fieldValue: {
    fontSize: SIZES.md,
    fontFamily: FONTS.regular,
    color: COLORS.gray[800],
  },
  fieldInput: {
    fontSize: SIZES.md,
    fontFamily: FONTS.regular,
    color: COLORS.gray[800],
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primary,
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
    color: COLORS.gray[800],
  },
  statusLabel: {
    fontSize: SIZES.sm,
    fontFamily: FONTS.regular,
    color: COLORS.gray[600],
    marginRight: SPACING.xs,
  },
  statusValue: {
    fontSize: SIZES.sm,
    fontFamily: FONTS.regular,
    color: COLORS.gray[800],
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.error + "10",
    paddingVertical: SPACING.md,
    borderRadius: 12,
    marginTop: SPACING.lg,
  },
  logoutButtonText: {
    fontSize: SIZES.md,
    fontFamily: FONTS.bold,
    color: COLORS.error,
    marginLeft: SPACING.xs,
  },
})
