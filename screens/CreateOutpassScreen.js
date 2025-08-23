"use client"

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native"
import { useState } from "react"
import { Ionicons } from "@expo/vector-icons"
import DateTimePicker from "@react-native-community/datetimepicker"
import { studentAPI } from "../services/api"
import { COLORS, FONTS, SIZES, SPACING } from "../utils/constants"
import LoadingSpinner from "../components/LoadingSpinner"

export default function CreateOutpassScreen({ navigation }) {
  const [formData, setFormData] = useState({
    purpose: "",
    destination: "",
    fromDate: new Date(),
    fromTime: new Date(),
    toDate: new Date(),
    toTime: new Date(),
    emergencyContact: "",
    remarks: "",
  })
  const [showDatePicker, setShowDatePicker] = useState(null)
  const [loading, setLoading] = useState(false)

  const updateFormData = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const handleDateChange = (event, selectedDate, field) => {
    setShowDatePicker(null)
    if (selectedDate) {
      updateFormData(field, selectedDate)
    }
  }

  const validateForm = () => {
    const { purpose, destination, fromDate, toDate, emergencyContact } = formData

    if (!purpose.trim()) {
      Alert.alert("Error", "Please enter the purpose of outpass")
      return false
    }

    if (!destination.trim()) {
      Alert.alert("Error", "Please enter the destination")
      return false
    }

    if (!emergencyContact.trim()) {
      Alert.alert("Error", "Please enter emergency contact number")
      return false
    }

    if (fromDate >= toDate) {
      Alert.alert("Error", "Return date must be after departure date")
      return false
    }

    return true
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setLoading(true)
    try {
      await studentAPI.createOutpass(formData)
      Alert.alert("Success", "Outpass request submitted successfully", [
        { text: "OK", onPress: () => navigation.goBack() },
      ])
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Failed to create outpass")
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Outpass</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Purpose *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Medical appointment, Family visit"
              value={formData.purpose}
              onChangeText={(value) => updateFormData("purpose", value)}
              multiline
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Destination *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., City Hospital, Home"
              value={formData.destination}
              onChangeText={(value) => updateFormData("destination", value)}
            />
          </View>

          <View style={styles.dateTimeContainer}>
            <Text style={styles.sectionTitle}>Departure</Text>
            <View style={styles.dateTimeRow}>
              <TouchableOpacity style={styles.dateTimeButton} onPress={() => setShowDatePicker("fromDate")}>
                <Ionicons name="calendar-outline" size={20} color={COLORS.primary} />
                <Text style={styles.dateTimeText}>{formatDate(formData.fromDate)}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.dateTimeButton} onPress={() => setShowDatePicker("fromTime")}>
                <Ionicons name="time-outline" size={20} color={COLORS.primary} />
                <Text style={styles.dateTimeText}>{formatTime(formData.fromTime)}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.dateTimeContainer}>
            <Text style={styles.sectionTitle}>Return</Text>
            <View style={styles.dateTimeRow}>
              <TouchableOpacity style={styles.dateTimeButton} onPress={() => setShowDatePicker("toDate")}>
                <Ionicons name="calendar-outline" size={20} color={COLORS.primary} />
                <Text style={styles.dateTimeText}>{formatDate(formData.toDate)}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.dateTimeButton} onPress={() => setShowDatePicker("toTime")}>
                <Ionicons name="time-outline" size={20} color={COLORS.primary} />
                <Text style={styles.dateTimeText}>{formatTime(formData.toTime)}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Emergency Contact *</Text>
            <TextInput
              style={styles.input}
              placeholder="Phone number to contact in emergency"
              value={formData.emergencyContact}
              onChangeText={(value) => updateFormData("emergencyContact", value)}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Additional Remarks</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Any additional information..."
              value={formData.remarks}
              onChangeText={(value) => updateFormData("remarks", value)}
              multiline
              numberOfLines={4}
            />
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit Request</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {showDatePicker && (
        <DateTimePicker
          value={formData[showDatePicker]}
          mode={showDatePicker.includes("Date") ? "date" : "time"}
          display="default"
          onChange={(event, selectedDate) => handleDateChange(event, selectedDate, showDatePicker)}
          minimumDate={new Date()}
        />
      )}
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    paddingTop: 50,
    paddingBottom: SPACING.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  backButton: {
    padding: SPACING.xs,
  },
  headerTitle: {
    fontSize: SIZES.lg,
    fontFamily: FONTS.bold,
    color: COLORS.gray[800],
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  form: {
    padding: SPACING.lg,
  },
  inputContainer: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: SIZES.md,
    fontFamily: FONTS.bold,
    color: COLORS.gray[800],
    marginBottom: SPACING.sm,
  },
  input: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.gray[300],
    borderRadius: 8,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: SIZES.md,
    fontFamily: FONTS.regular,
    color: COLORS.gray[800],
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  dateTimeContainer: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: SIZES.md,
    fontFamily: FONTS.bold,
    color: COLORS.gray[800],
    marginBottom: SPACING.sm,
  },
  dateTimeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dateTimeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.gray[300],
    borderRadius: 8,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginHorizontal: SPACING.xs,
  },
  dateTimeText: {
    fontSize: SIZES.md,
    fontFamily: FONTS.regular,
    color: COLORS.gray[800],
    marginLeft: SPACING.sm,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: SPACING.md,
    alignItems: "center",
    marginTop: SPACING.lg,
  },
  submitButtonText: {
    fontSize: SIZES.lg,
    fontFamily: FONTS.bold,
    color: COLORS.white,
  },
})
