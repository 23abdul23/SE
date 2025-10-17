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
import { useTheme } from "../context/ThemeContext"
import { useAuth } from "../context/AuthContext"
import { COLORS, FONTS, SIZES, SPACING } from "../utils/constants"
import LoadingSpinner from "../components/LoadingSpinner"

export default function LoginScreen({ navigation }) {
  const { isDarkMode, toggleTheme, colors } = useTheme();
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("student")
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
    const result = await login(email, password, role)    
    setLoading(false)

    if (!result.success) {
      Alert.alert("Login Failed", result.error)
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <KeyboardAvoidingView style={[styles.container, { backgroundColor: colors.background }]} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', width: '100%' }}>
          <TouchableOpacity onPress={toggleTheme} style={{ padding: 8, alignSelf: 'flex-end' }}>
            <Ionicons name={isDarkMode ? 'sunny' : 'moon'} size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Aegis ID</Text>
          <Text style={[styles.subtitle, { color: colors.text }]}>Digital Campus Pass</Text>
        </View>



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

          <TouchableOpacity style={[styles.loginButton, { backgroundColor: isDarkMode ? '#2196f3' : '#2196f3' }]} onPress={handleLogin}>
            <Text style={[styles.loginButtonText, { color: colors.text }]}>Sign In</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={() => Alert.alert("Info", "Contact admin to reset password")}
          >
            <Text style={[styles.forgotPasswordText, { color: colors.text }]}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.text }]}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}> 
            <Text style={[styles.signUpText, { color: colors.text }]}>Sign Up</Text>
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
