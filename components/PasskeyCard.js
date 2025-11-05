"use client"

import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native"
import { useState } from "react"
import { Ionicons } from "@expo/vector-icons"
import QRCode from "react-native-qrcode-svg"
import { COLORS, FONTS, SIZES, SPACING } from "../utils/constants"

export default function PasskeyCard({ passkey, onRefresh }) {
  const [showQR, setShowQR] = useState(false)

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getTimeRemaining = () => {
    if (!passkey?.expiresAt) return "N/A"

    const now = new Date()
    const expiry = new Date(passkey.expiresAt)
    const diff = expiry - now

    if (diff <= 0) return "Expired"

    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    return `${hours}h ${minutes}m`
  }

  const handleRefresh = () => {
    Alert.alert("Refresh Passkey", "This will generate a new passkey. Continue?", [
      { text: "Cancel", style: "cancel" },
      { text: "Refresh", onPress: onRefresh },
    ])
  }

  if (!passkey) {
    return (
      <View style={styles.card}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={COLORS.warning} />
          <Text style={styles.errorTitle}>QR To Be Shown</Text>
          <Text style={styles.errorText}>Contact admin to activate your account</Text>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.cardTitle}>Today's Passkey</Text>
          <Text style={styles.validUntil}>Valid until {formatTime(passkey.expiresAt)}</Text>
        </View>
        <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
          <Ionicons name="refresh-outline" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.passkeyContainer}>
        <Text style={styles.passkeyLabel}>Secure Code</Text>
        <Text style={styles.passkeyCode}>{passkey.hash? passkey.hash.substring(0, 8).toUpperCase() : ""}</Text>
        <Text style={styles.timeRemaining}>Expires in {getTimeRemaining()}</Text>
      </View>

      <View style={styles.qrSection}>
        <TouchableOpacity style={styles.qrToggle} onPress={() => setShowQR(!showQR)}>
          <Ionicons name={showQR ? "eye-off-outline" : "qr-code-outline"} size={20} color={COLORS.primary} />
          <Text style={styles.qrToggleText}>{showQR ? "Hide QR Code" : "Show QR Code"}</Text>
        </TouchableOpacity>

        {showQR && (
          <View style={styles.qrContainer}>
            <QRCode
              value={JSON.stringify({
                studentId: passkey.studentId,
                hash: passkey.hash,
                timestamp: passkey.createdAt,
              })}
              size={150}
              color={COLORS.gray[800]}
              backgroundColor={COLORS.white}
            />
            <Text style={styles.qrNote}>Show this QR code to security for entry/exit</Text>
          </View>
        )}
      </View>

      <View style={styles.statusIndicator}>
        <View style={[styles.statusDot, { backgroundColor: COLORS.success }]} />
        <Text style={styles.statusText}>Active & Valid</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: SPACING.lg,
  },
  cardTitle: {
    fontSize: SIZES.lg,
    fontFamily: FONTS.bold,
    color: COLORS.gray[800],
  },
  validUntil: {
    fontSize: SIZES.sm,
    fontFamily: FONTS.regular,
    color: COLORS.gray[600],
    marginTop: SPACING.xs,
  },
  refreshButton: {
    backgroundColor: COLORS.primary + "20",
    padding: SPACING.sm,
    borderRadius: 8,
  },
  passkeyContainer: {
    alignItems: "center",
    marginBottom: SPACING.lg,
    paddingVertical: SPACING.lg,
    backgroundColor: COLORS.gray[50],
    borderRadius: 12,
  },
  passkeyLabel: {
    fontSize: SIZES.sm,
    fontFamily: FONTS.regular,
    color: COLORS.gray[600],
    marginBottom: SPACING.xs,
  },
  passkeyCode: {
    fontSize: SIZES.xxxl,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
    letterSpacing: 2,
    marginBottom: SPACING.xs,
  },
  timeRemaining: {
    fontSize: SIZES.sm,
    fontFamily: FONTS.regular,
    color: COLORS.warning,
  },
  qrSection: {
    alignItems: "center",
    marginBottom: SPACING.lg,
  },
  qrToggle: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary + "10",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
    marginBottom: SPACING.md,
  },
  qrToggleText: {
    fontSize: SIZES.sm,
    fontFamily: FONTS.regular,
    color: COLORS.primary,
    marginLeft: SPACING.xs,
  },
  qrContainer: {
    alignItems: "center",
  },
  qrNote: {
    fontSize: SIZES.xs,
    fontFamily: FONTS.regular,
    color: COLORS.gray[600],
    textAlign: "center",
    marginTop: SPACING.sm,
    maxWidth: 200,
  },
  statusIndicator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: SPACING.xs,
  },
  statusText: {
    fontSize: SIZES.sm,
    fontFamily: FONTS.regular,
    color: COLORS.success,
  },
  errorContainer: {
    alignItems: "center",
    paddingVertical: SPACING.xl,
  },
  errorTitle: {
    fontSize: SIZES.lg,
    fontFamily: FONTS.bold,
    color: COLORS.gray[800],
    marginTop: SPACING.md,
    marginBottom: SPACING.xs,
  },
  errorText: {
    fontSize: SIZES.sm,
    fontFamily: FONTS.regular,
    color: COLORS.gray[600],
    textAlign: "center",
  },
})
