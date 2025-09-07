"use client"

import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  SafeAreaView,   // ✅ Add this
} from "react-native"
import { useState, useEffect } from "react"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../context/ThemeContext"
import { COLORS, FONTS } from "../utils/constants"
import LoadingSpinner from "../components/LoadingSpinner"
import styles from "../styles/ScannerStyles"
import { CameraView, useCameraPermissions } from "expo-camera"

export default function Scanner({ navigation }) {
  const { isDarkMode, toggleTheme, colors } = useTheme()
  const [permission, requestPermission] = useCameraPermissions()
  const [scanned, setScanned] = useState(false)
  const [scanResult, setScanResult] = useState(null)

  useEffect(() => {
    if (!permission) {
      requestPermission()
    }
  }, [permission])

  const handleBarCodeScanned = ({ type, data }) => {
    if (!scanned) {
      setScanned(true)
      setScanResult(data)
      Alert.alert("Scanned!", `Type: ${type}\nData: ${data}`)
    }
  }

  if (!permission) {
    return <LoadingSpinner />
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background, flex: 1 }]}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={{ color: colors.text }}>No access to camera</Text>
          <TouchableOpacity
            onPress={requestPermission}
            style={{ padding: 8, marginTop: 12, backgroundColor: colors.card, borderRadius: 8 }}
          >
            <Text style={{ color: colors.text }}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 16,
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 8 }}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text
          style={{
            color: colors.text,
            fontSize: 20,
            fontFamily: FONTS.bold,
            flex: 1,
            textAlign: "center",
          }}
        >
          Scan QR/Barcode
        </Text>
        <TouchableOpacity onPress={toggleTheme} style={{ padding: 8 }}>
          <Ionicons name={isDarkMode ? "sunny" : "moon"} size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Camera Scanner */}
      <View
        style={{
          flex: 1,
          overflow: "hidden",
          borderRadius: 16,
          margin: 16,
          borderWidth: 2,
          borderColor: colors.text,
        }}
      >
        <CameraView
          style={{ flex: 1 }}
          barcodeScannerSettings={{
            barcodeTypes: ["qr", "ean13", "ean8", "code128"], // specify types
          }}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        />
      </View>

      {/* Buttons & Result */}
      {scanned && (
        <TouchableOpacity
          onPress={() => {
            setScanned(false)
            setScanResult(null)
          }}
          style={{
            backgroundColor: colors.card,
            padding: 16,
            borderRadius: 12,
            alignSelf: "center",
            marginBottom: 24,
          }}
        >
          <Text style={{ color: colors.text, fontFamily: FONTS.bold }}>Tap to Scan Again</Text>
        </TouchableOpacity>
      )}
      {scanResult && (
        <View style={{ alignItems: "center", marginBottom: 16 }}>
          <Text style={{ color: colors.text, fontFamily: FONTS.regular }}>
            Result: {scanResult}
          </Text>
        </View>
      )}
    </SafeAreaView>
  )
}
