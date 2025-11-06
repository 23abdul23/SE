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
  Modal,
  SafeAreaView,
  StatusBar,
} from "react-native"
import { useState, useRef } from "react"
import { Ionicons } from "@expo/vector-icons"
import { Picker } from "@react-native-picker/picker"
import { useTheme } from "../context/ThemeContext"
import { useAuth } from "../context/AuthContext"
import { COLORS, FONTS, SIZES, SPACING } from "../utils/constants"
import LoadingSpinner from "../components/LoadingSpinner"
import api from "../services/api"

export default function LoginScreen({ navigation }) {
  const { isDarkMode, toggleTheme, colors } = useTheme()
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("student")
  const [password, setPassword] = useState("123456")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()

  const [forgotModalVisible, setForgotModalVisible] = useState(false)
  const [forgotEmail, setForgotEmail] = useState("")
  const [sendingForgot, setSendingForgot] = useState(false)
  const forgotInputRef = useRef(null)

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields")
      return
    }
    setLoading(true)
    const result = await login(email, password, role)
    setLoading(false)

    if (!result.success) {
      Alert.alert("Login Failed", result.error)
    }
  }

  const openForgotModal = () => {
    setForgotEmail(email || "")
    setForgotModalVisible(true)
  }

  const sendForgotEmail = async () => {
    if (!forgotEmail) {
      Alert.alert("Error", "Please enter your email")
      return
    }
    try {
      setSendingForgot(true)
      const res = await api.post("/forgot", { email: forgotEmail })
      setSendingForgot(false)
      setForgotModalVisible(false)
      Alert.alert("Success", res.data?.message || "Password reset email sent")
    } catch (err) {
      setSendingForgot(false)
      const msg = err?.response?.data?.message || err.message || "Failed to send reset email"
      Alert.alert("Error Sending", msg)
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <SafeAreaView style={[styles.safeContainer, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: colors.background }]}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Floating Theme Toggle */}
        <TouchableOpacity
          onPress={toggleTheme}
          style={[
            styles.themeButton,
            {
              backgroundColor: colors.card + "99",
            },
          ]}
        >
          <Ionicons name={isDarkMode ? "sunny" : "moon"} size={24} color={colors.text} />
        </TouchableOpacity>

        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>Aegis ID</Text>
            <Text style={[styles.subtitle, { color: colors.text }]}>Digital Campus Pass</Text>
          </View>

          {/* Role Picker */}
          <View style={[styles.inputContainer, { backgroundColor: colors.card, borderColor: colors.text }]}>
            <Ionicons name="person-outline" size={20} color={colors.text} style={styles.inputIcon} />
            <Picker
              selectedValue={role}
              style={[styles.input, { color: colors.text, flex: 1 }]}
              onValueChange={(itemValue) => setRole(itemValue)}
              dropdownIconColor={colors.text}
            >
              <Picker.Item label="Student" value="student" />
              <Picker.Item label="Warden" value="warden" />
              <Picker.Item label="Security" value="security" />
            </Picker>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={[styles.inputContainer, { backgroundColor: colors.card, borderColor: colors.text }]}>
              <Ionicons name="mail-outline" size={20} color={colors.text} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Email Address"
                placeholderTextColor={colors.text}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>

            <View style={[styles.inputContainer, { backgroundColor: colors.card, borderColor: colors.text }]}>
              <Ionicons name="lock-closed-outline" size={20} color={colors.text} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Password"
                placeholderTextColor={colors.text}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoComplete="password"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color={colors.text} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.loginButton, { backgroundColor: isDarkMode ? "#2196f3" : "#2196f3" }]}
              onPress={handleLogin}
            >
              <Text style={[styles.loginButtonText, { color: colors.text }]}>Sign In</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.forgotPassword} onPress={openForgotModal}>
              <Text style={[styles.forgotPasswordText, { color: colors.text }]}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          {/* Forgot Password Modal */}
          <Modal
            visible={forgotModalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setForgotModalVisible(false)}
            onShow={() => setTimeout(() => forgotInputRef.current?.focus?.(), 100)}
          >
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0,0,0,0.5)",
              }}
            >
              <View style={{ width: "90%", backgroundColor: colors.card, borderRadius: 12, padding: 16 }}>
                <Text style={{ fontSize: 18, fontFamily: FONTS.bold, color: colors.text, marginBottom: 8 }}>
                  Reset Password
                </Text>
                <Text style={{ color: colors.text, marginBottom: 12 }}>Enter Email to receive new password.</Text>

                <TextInput
                  ref={forgotInputRef}
                  autoFocus={true}
                  value={forgotEmail}
                  onChangeText={setForgotEmail}
                  placeholder="Email Address"
                  placeholderTextColor={colors.text}
                  style={{
                    backgroundColor: "white",
                    color: "black",
                    height: 44,
                    borderRadius: 8,
                    paddingHorizontal: 10,
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />

                <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 12 }}>
                  <TouchableOpacity onPress={() => setForgotModalVisible(false)} style={{ padding: 10, marginRight: 8 }}>
                    <Text style={{ color: colors.text }}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={sendForgotEmail} style={{ padding: 10 }}>
                    <Text style={{ color: colors.text }}>{sendingForgot ? "Sending..." : "Send"}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAvoidingView>
          </Modal>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.text }]}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text style={[styles.signUpText, { color: colors.text }]}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 8 : 0,
  },
  container: {
    flex: 1,
    position: "relative",
  },
  themeButton: {
    position: "absolute",
    top: -10,
    right: 16,
    zIndex: 100,
    padding: 1,
    borderRadius: 20,
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
  form: { marginBottom: SPACING.xl },
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
  inputIcon: { marginRight: SPACING.sm },
  input: {
    flex: 1,
    height: 50,
    fontSize: SIZES.md,
    fontFamily: FONTS.regular,
    color: COLORS.gray[800],
  },
  eyeIcon: { padding: SPACING.xs },
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
  forgotPassword: { alignItems: "center", marginTop: SPACING.md },
  forgotPasswordText: { fontSize: SIZES.sm },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: SPACING.lg,
  },
  footerText: { fontSize: SIZES.md },
  signUpText: { fontSize: SIZES.md },
})
