"use client"

import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { commonAPI } from "../services/api"
import { COLORS, FONTS, SIZES, SPACING, OUTPASS_STATUS } from "../utils/constants"

export default function OutpassCard({ outpass, onUpdate }) {
  const getStatusColor = (status) => {
    switch (status) {
      case OUTPASS_STATUS.PENDING:
        return COLORS.warning
      case OUTPASS_STATUS.APPROVED:
        return COLORS.success
      case OUTPASS_STATUS.REJECTED:
        return COLORS.error
      case OUTPASS_STATUS.ACTIVE:
        return COLORS.primary
      case OUTPASS_STATUS.COMPLETED:
        return COLORS.gray[500]
      default:
        return COLORS.gray[400]
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case OUTPASS_STATUS.PENDING:
        return "time-outline"
      case OUTPASS_STATUS.APPROVED:
        return "checkmark-circle-outline"
      case OUTPASS_STATUS.REJECTED:
        return "close-circle-outline"
      case OUTPASS_STATUS.ACTIVE:
        return "play-circle-outline"
      case OUTPASS_STATUS.COMPLETED:
        return "checkmark-done-outline"
      default:
        return "help-circle-outline"
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  const handleCancel = () => {
    Alert.alert("Cancel Outpass", "Are you sure you want to cancel this outpass request?", [
      { text: "No", style: "cancel" },
      {
        text: "Yes, Cancel",
        style: "destructive",
        onPress: async () => {
          try {
            const response = await commonAPI.updateOutpass(outpass._id, { status: "cancelled" })
            onUpdate(response.data)
            Alert.alert("Success", "Outpass cancelled successfully")
          } catch (error) {
            Alert.alert("Error", "Failed to cancel outpass")
          }
        },
      },
    ])
  }

  const canCancel = outpass.status === OUTPASS_STATUS.PENDING || outpass.status === OUTPASS_STATUS.APPROVED

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.statusContainer}>
          <Ionicons name={getStatusIcon(outpass.status)} size={20} color={getStatusColor(outpass.status)} />
          <Text style={[styles.statusText, { color: getStatusColor(outpass.status) }]}>
            {outpass.status.toUpperCase()}
          </Text>
        </View>
        {canCancel && (
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Ionicons name="close" size={16} color={COLORS.error} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.cardContent}>
        {/* ✅ backend sends "reason", so fallback to that if "purpose" missing */}
        <Text style={styles.purpose}>{outpass.purpose || outpass.reason}</Text>
        <Text style={styles.destination}>{outpass.destination}</Text>

        <View style={styles.timeContainer}>
          <View style={styles.timeItem}>
            <Ionicons name="calendar-outline" size={16} color={COLORS.gray[600]} />
            <Text style={styles.timeLabel}>From</Text>
            <Text style={styles.timeValue}>
              {formatDate(outpass.fromDate || outpass.outDate)} at{" "}
              {formatTime(outpass.fromTime || outpass.outDate)}
            </Text>
          </View>

          <View style={styles.timeItem}>
            <Ionicons name="calendar-outline" size={16} color={COLORS.gray[600]} />
            <Text style={styles.timeLabel}>To</Text>
            <Text style={styles.timeValue}>
              {formatDate(outpass.toDate || outpass.expectedReturnDate)} at{" "}
              {formatTime(outpass.toTime || outpass.expectedReturnDate)}
            </Text>
          </View>
        </View>

        {outpass.emergencyContact && (
          <View style={styles.contactContainer}>
            <Ionicons name="call-outline" size={16} color={COLORS.gray[600]} />
            <Text style={styles.contactText}>
              Emergency:{" "}
              {typeof outpass.emergencyContact === "object"
                ? `${outpass.emergencyContact.name} (${outpass.emergencyContact.phone})`
                : outpass.emergencyContact}
            </Text>
          </View>
        )}

        {outpass.remarks && (
          <View style={styles.remarksContainer}>
            <Text style={styles.remarksLabel}>Remarks:</Text>
            <Text style={styles.remarksText}>{outpass.remarks}</Text>
          </View>
        )}
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.createdAt}>Requested on {formatDate(outpass.createdAt)}</Text>
        {outpass.approvedBy && <Text style={styles.approvedBy}>Approved by {outpass.approvedBy.name}</Text>}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusText: {
    fontSize: SIZES.sm,
    fontFamily: FONTS.bold,
    marginLeft: SPACING.xs,
  },
  cancelButton: {
    backgroundColor: COLORS.error + "20",
    padding: SPACING.xs,
    borderRadius: 4,
  },
  cardContent: {
    marginBottom: SPACING.md,
  },
  purpose: {
    fontSize: SIZES.lg,
    fontFamily: FONTS.bold,
    color: COLORS.gray[800],
    marginBottom: SPACING.xs,
  },
  destination: {
    fontSize: SIZES.md,
    fontFamily: FONTS.regular,
    color: COLORS.gray[600],
    marginBottom: SPACING.md,
  },
  timeContainer: {
    marginBottom: SPACING.md,
  },
  timeItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.xs,
  },
  timeLabel: {
    fontSize: SIZES.sm,
    fontFamily: FONTS.regular,
    color: COLORS.gray[600],
    marginLeft: SPACING.xs,
    marginRight: SPACING.xs,
    minWidth: 30,
  },
  timeValue: {
    fontSize: SIZES.sm,
    fontFamily: FONTS.regular,
    color: COLORS.gray[800],
  },
  contactContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  contactText: {
    fontSize: SIZES.sm,
    fontFamily: FONTS.regular,
    color: COLORS.gray[700],
    marginLeft: SPACING.xs,
  },
  remarksContainer: {
    backgroundColor: COLORS.gray[50],
    padding: SPACING.sm,
    borderRadius: 8,
  },
  remarksLabel: {
    fontSize: SIZES.sm,
    fontFamily: FONTS.bold,
    color: COLORS.gray[700],
    marginBottom: SPACING.xs,
  },
  remarksText: {
    fontSize: SIZES.sm,
    fontFamily: FONTS.regular,
    color: COLORS.gray[600],
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[200],
    paddingTop: SPACING.sm,
  },
  createdAt: {
    fontSize: SIZES.xs,
    fontFamily: FONTS.regular,
    color: COLORS.gray[500],
  },
  approvedBy: {
    fontSize: SIZES.xs,
    fontFamily: FONTS.regular,
    color: COLORS.success,
    marginTop: SPACING.xs,
  },
})
