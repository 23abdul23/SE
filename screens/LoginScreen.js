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
import { useAuth } from "../context/AuthContext"
import { COLORS, FONTS, SIZES, SPACING } from "../utils/constants"
import LoadingSpinner from "../components/LoadingSpinner"

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields")
      return
    }

    setLoading(true)
    const result = await login(email, password)
    setLoading(false)

    if (!result.success) {
      Alert.alert("Login Failed", result.error)
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Aegis ID</Text>
          <Text style={styles.subtitle}>Digital Campus Pass</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color={COLORS.gray[400]} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color={COLORS.gray[400]} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoComplete="password"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
              <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color={COLORS.gray[400]} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Sign In</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={() => Alert.alert("Info", "Contact admin to reset password")}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.signUpText}>Sign Up</Text>
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
    justifyContent: "center",
    padding: SPACING.lg,
  },
  header: {
    alignItems: "center",
    marginBottom: SPACING.xxl,
  },
  title: {
    fontSize: SIZES.xxxl,
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
    marginBottom: SPACING.xl,
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
  eyeIcon: {
    padding: SPACING.xs,
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginTop: SPACING.md,
  },
  loginButtonText: {
    color: COLORS.white,
    fontSize: SIZES.lg,
    fontFamily: FONTS.bold,
  },
  forgotPassword: {
    alignItems: "center",
    marginTop: SPACING.md,
  },
  forgotPasswordText: {
    color: COLORS.primary,
    fontSize: SIZES.sm,
    fontFamily: FONTS.regular,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    fontSize: SIZES.md,
    fontFamily: FONTS.regular,
    color: COLORS.gray[600],
  },
  signUpText: {
    fontSize: SIZES.md,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
  },
})
