"use client"

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { COLORS, FONTS } from "../utils/constants";
import LoadingSpinner from "../components/LoadingSpinner";
import styles from "../styles/ScannerStyles";
import { CameraView, useCameraPermissions } from "expo-camera";
import { securityAPI } from "../services/api";
import SafeJourneyCard from "../components/SafeJourneyCard";
import WelcomeBackCard from "../components/WelcomeBackCard";

export default function Scanner({ navigation }) {
  const { isDarkMode, toggleTheme, colors } = useTheme();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [action, setAction] = useState("");
  const [loc, setLoc] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [scanMode, setScanMode] = useState("entry"); // "entry" or "exit"

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission]);

  useEffect(() => {
    if (action === "exit" || action === "entry") {
      setShowPopup(true);
      setScanned(true); // Close camera
    }
  }, [action]);

  const handleBarCodeScanned = async ({ type, data }) => {
    if (!scanned) {
      setScanned(true);
      const { guardId, location } = JSON.parse(data);
      setLoc(location);
      const responce = await securityAPI.logEntry({
        action: scanMode,
        guardId: guardId,
        location: location,
      });
      setAction(responce.data.log.action);

    }
  };

  if (!permission) {
    return <LoadingSpinner />;
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
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          top: 20,
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
      {!showPopup && (
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
              barcodeTypes: ["qr", "ean13", "ean8", "code128"],
            }}
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          />
        </View>
      )}

      {/* Popup Cards */}
      <Modal
        visible={showPopup}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowPopup(false)}
      >
        <View style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0,0,0,0.3)",
        }}>
          {action === "exit" && (
            <SafeJourneyCard
              onClose={() => {
                setShowPopup(false);
                setScanned(false);
                setAction(null);
                setScanResult(null);
                navigation.goBack();
              }} location={loc} />
          )}
          {action === "entry" && (
            <WelcomeBackCard
              onClose={() => {
                setShowPopup(false);
                setScanned(false);
                setAction(null);
                setScanResult(null);
                navigation.goBack();
              }} location={loc} />
          )}
        </View>
      </Modal>

      {/* Buttons & Result */}
      {scanned && !showPopup && (
        <TouchableOpacity
          onPress={() => {
            setScanned(false);
            setScanResult(null);
            setAction(null);
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
      
    </SafeAreaView>
  );
}
