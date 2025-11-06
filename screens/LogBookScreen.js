import React, { useCallback, useMemo, useState } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useFocusEffect } from "@react-navigation/native"
import styles from "../styles/LibraryStyles"
import { useTheme } from "../context/ThemeContext"
import { useAuth } from "../context/AuthContext"
import { securityAPI } from "../services/api"

export default function LogBook({ navigation, route }) {
  const { isDarkMode, toggleTheme, colors } = useTheme()
  const { token } = useAuth()

  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState(null)

  const location = route?.params?.location || ""

  const displayedLocation = useMemo(() => {
    return location && location.trim().length > 0 ? location : "All Locations"
  }, [location])

  const fetchLogs = useCallback(async () => {
    if (!token) {
      setError("Authentication token missing. Please log in again.")
      return
    }
    try {
      const params = {}
      if (location && location.trim().length > 0) {
        params.location = location.trim()
      }

      const response = await securityAPI.getLogs(params, token)
      setLogs(response.data?.logs || [])
      setError(null)
    } catch (err) {
      console.log("LogBook fetch error:", err?.response || err)
      const serverMessage = err?.response?.data?.message
      setError(serverMessage || err?.message || "Unable to load logs right now")
    }
  }, [location, token])

  const initialise = useCallback(async () => {
    setLoading(true)
    await fetchLogs()
    setLoading(false)
  }, [fetchLogs])

  useFocusEffect(
    useCallback(() => {
      initialise()
    }, [initialise]),
  )

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await fetchLogs()
    setRefreshing(false)
  }, [fetchLogs])

  const iconColor = colors.icon || colors.text
  const subTextColor = colors.subText || colors.subtext || colors.text

  const renderLog = useCallback(
    ({ item }) => {
      const actionLabel = item.action === "entry" ? "Entry" : item.action === "exit" ? "Exit" : item.action
      const residentName = item?.userId?.name || "Resident"
      const guardOnDuty = item.guardName || "Guard"
      const timestamp = item?.createdAt ? new Date(item.createdAt).toLocaleString() : "Unknown"

      return (
        <View
          style={[
            styles.card,
            styles.shadow,
            {
              backgroundColor: colors.card,
              borderLeftWidth: 4,
              borderLeftColor: item.action === "entry" ? "#22c55e" : "#ef4444",
              marginHorizontal: 16,
            },
          ]}
        >
          <Text style={[styles.sectionTitle, { textAlign: "left", color: colors.text }]}>{actionLabel}</Text>
          <Text style={{ color: subTextColor, marginBottom: 4 }}>Resident: {residentName}</Text>
          <Text style={{ color: subTextColor, marginBottom: 4 }}>Guard: {guardOnDuty}</Text>
          <Text style={{ color: subTextColor, marginBottom: 4 }}>Location: {item.location || "-"}</Text>
          <Text style={{ color: subTextColor, fontSize: 12 }}>Time: {timestamp}</Text>
        </View>
      )
    },
    [colors.card, colors.text, subTextColor],
  )

  const listEmptyComponent = useMemo(() => {
    if (loading) {
      return null
    }
    return (
      <View style={{ padding: 32, alignItems: "center" }}>
        <Ionicons name="document-text-outline" size={36} color={subTextColor} />
        <Text style={{ marginTop: 12, color: subTextColor }}>No logs yet for this location.</Text>
      </View>
    )
  }, [loading, subTextColor])

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Entry Exit Logs</Text>
        <TouchableOpacity onPress={toggleTheme}>
          <Ionicons name={isDarkMode ? "sunny" : "moon"} size={24} color={iconColor} />
        </TouchableOpacity>
      </View>

      <View style={{ paddingHorizontal: 16, paddingBottom: 12 }}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Location: {displayedLocation}</Text>
        <Text style={{ color: subTextColor }}>Showing {logs.length} record(s)</Text>
        {error && <Text style={{ color: "#ef4444", marginTop: 4 }}>{error}</Text>}
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={colors.text} />
        </View>
      ) : (
        <FlatList
          data={logs}
          keyExtractor={(item) => item._id}
          renderItem={renderLog}
          contentContainerStyle={{ paddingBottom: 32 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={listEmptyComponent}
        />
      )}
    </View>
  )
}