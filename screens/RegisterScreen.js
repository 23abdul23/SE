
import React from 'react';

"use client"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native"
import { useState } from "react"
import { Ionicons } from "@expo/vector-icons"
import { Picker } from "@react-native-picker/picker"
import { useAuth } from "../context/AuthContext"
import { COLORS, FONTS, SIZES, SPACING } from "../utils/constants"
import LoadingSpinner from "../components/LoadingSpinner"

import * as Device from "expo-device";
import * as Application from "expo-application";

export default function RegisterScreen({ navigation }) {

  const randomDeviceId = Math.floor(100000 + Math.random() * 900000);

  const [formData, setFormData] = useState({
    name: "Abdul Azeem",
    email: "23abdul23@gmail.com",
    password: "123456",
    confirmPassword: "123456",
    studentId: "iit2024243",
    department: "IT",
    year: "2nd Year",
    hostel: "Hostel A",
    roomNumber: "818",
    phone: "9876543210",
    gender: "male",
    profilePhoto: "",
    deviceId : randomDeviceId
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()

  const departments = ["IT","Computer Science", "Electronics", "Mechanical", "Civil", "Chemical", "Electrical"]

  const years = ["1st Year", "2nd Year", "3rd Year", "4th Year"]

  const hostels = ["Hostel A", "Hostel B", "Hostel C", "Hostel D"]

  const updateFormData = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const validateForm = () => {
    const { name, email, password, confirmPassword, studentId, department, year, hostel, phone, gender, deviceId } = formData

    if (!name || !email || !password || !studentId || !department || !year || !hostel || !phone || !gender) {
      Alert.alert("Error", "Please fill in all required fields")
      return false
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match")
      return false
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long")
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address")
      return false
    }

    return true
  }

  const handleRegister = async () => {
    if (!validateForm()) return

    setLoading(true)
    // Map phone to phoneNumber for backend
    const payload = {
      ...formData,
      phoneNumber: formData.phone,
    }
    delete payload.phone
    const result = await register(payload)
    setLoading(false)

    if (result.success) {
      Alert.alert("Registration Successful", "Your account has been created. Please wait for admin approval.", [
        { text: "OK", onPress: () => navigation.navigate("Login") },
      ])
    } else {
      console.log(result)
      Alert.alert("Registration Failed", result.error)
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join Aegis ID Campus Pass</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color={COLORS.gray[400]} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Full Name *"
              value={formData.name}
              onChangeText={(value) => updateFormData("name", value)}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color={COLORS.gray[400]} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email Address *"
              value={formData.email}
              onChangeText={(value) => updateFormData("email", value)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="school-outline" size={20} color={COLORS.gray[400]} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Student ID *"
              value={formData.studentId}
              onChangeText={(value) => updateFormData("studentId", value)}
              autoCapitalize="characters"
            />
          </View>

          <View style={styles.pickerContainer}>
            <Ionicons name="library-outline" size={20} color={COLORS.gray[400]} style={styles.inputIcon} />
            <Picker
              selectedValue={formData.department}
              style={styles.picker}
              onValueChange={(value) => updateFormData("department", value)}
            >
              <Picker.Item label="Select Department *" value="" />
              {departments.map((dept) => (
                <Picker.Item key={dept} label={dept} value={dept} />
              ))}
            </Picker>
          </View>

          <View style={styles.pickerContainer}>
            <Ionicons name="calendar-outline" size={20} color={COLORS.gray[400]} style={styles.inputIcon} />
            <Picker
              selectedValue={formData.year}
              style={styles.picker}
              onValueChange={(value) => updateFormData("year", value)}
            >
              <Picker.Item label="Select Year *" value="" />
              {years.map((year) => (
                <Picker.Item key={year} label={year} value={year} />
              ))}
            </Picker>
          </View>

          <View style={styles.pickerContainer}>
            <Ionicons name="home-outline" size={20} color={COLORS.gray[400]} style={styles.inputIcon} />
            <Picker
              selectedValue={formData.hostel}
              style={styles.picker}
              onValueChange={(value) => updateFormData("hostel", value)}
            >
              <Picker.Item label="Select Hostel *" value="" />
              {hostels.map((hostel) => (
                <Picker.Item key={hostel} label={hostel} value={hostel} />
              ))}
            </Picker>
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="bed-outline" size={20} color={COLORS.gray[400]} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Room Number"
              value={formData.roomNumber}
              onChangeText={(value) => updateFormData("roomNumber", value)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="call-outline" size={20} color={COLORS.gray[400]} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Phone Number *"
              value={formData.phone}
              onChangeText={(value) => updateFormData("phone", value)}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.pickerContainer}>
            <Ionicons name="male-female-outline" size={20} color={COLORS.gray[400]} style={styles.inputIcon} />
            <Picker
              selectedValue={formData.gender}
              style={styles.picker}
              onValueChange={(value) => updateFormData("gender", value)}
            >
              <Picker.Item label="Select Gender *" value="" />
              <Picker.Item label="Male" value="male" />
              <Picker.Item label="Female" value="female" />
              <Picker.Item label="Other" value="other" />
            </Picker>
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="image-outline" size={20} color={COLORS.gray[400]} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Profile Photo URL (optional)"
              value={formData.profilePhoto}
              onChangeText={(value) => updateFormData("profilePhoto", value)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color={COLORS.gray[400]} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password *"
              value={formData.password}
              onChangeText={(value) => updateFormData("password", value)}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
              <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color={COLORS.gray[400]} />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color={COLORS.gray[400]} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password *"
              value={formData.confirmPassword}
              onChangeText={(value) => updateFormData("confirmPassword", value)}
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
              <Ionicons
                name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                size={20}
                color={COLORS.gray[400]}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
            <Text style={styles.registerButtonText}>Create Account</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.signInText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: SPACING.lg,
  },
  header: {
    alignItems: "center",
    marginBottom: SPACING.xl,
    marginTop: SPACING.xl,
  },
  backButton: {
    position: "absolute",
    left: 0,
    top: 0,
    padding: SPACING.xs,
  },
  title: {
    fontSize: SIZES.xxl,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: SIZES.md,
    fontFamily: FONTS.regular,
    color: COLORS.gray[600],
  },
  form: {
    marginBottom: SPACING.lg,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
  },
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
    height: 50,
  },
  inputIcon: {
    marginRight: SPACING.sm,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: SIZES.md,
    fontFamily: FONTS.regular,
    color: COLORS.gray[800],
  },
  picker: {
    flex: 1,
    height: 50,
  },
  eyeIcon: {
    padding: SPACING.xs,
  },
  registerButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginTop: SPACING.md,
  },
  registerButtonText: {
    color: COLORS.white,
    fontSize: SIZES.lg,
    fontFamily: FONTS.bold,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: SPACING.md,
  },
  footerText: {
    fontSize: SIZES.md,
    fontFamily: FONTS.regular,
    color: COLORS.gray[600],
  },
  signInText: {
    fontSize: SIZES.md,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
  },
})
