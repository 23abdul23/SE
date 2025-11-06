"use client"

import { View, Text, TouchableOpacity, RefreshControl, Alert, FlatList } from "react-native"
import { useState, useEffect, useMemo } from "react"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../context/ThemeContext"
import { useNavigation } from "@react-navigation/native"
import { outpass } from "../services/api"
import { COLORS } from "../utils/constants"

import styles from "../styles/OutpassStyles"

import LoadingSpinner from "../components/LoadingSpinner"
import OutpassCard from "../components/OutpassCard"
import FilterTabs from "../components/FilterTabs"

export default function OutpassScreen() {
  const { isDarkMode, toggleTheme, colors } = useTheme()
  const navigation = useNavigation()
  const [outpasses, setOutpasses] = useState([])
  const [filteredOutpasses, setFilteredOutpasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [activeFilter, setActiveFilter] = useState("all")

  const statusCounts = useMemo(() => {
    const counts = {
      pending: 0,
      approved: 0,
      expired: 0,
      cancelled: 0,
      rejected: 0,
    }

    outpasses.forEach((item) => {
      if (counts[item.status] !== undefined) {
        counts[item.status] += 1
      }
    })

    return counts
  }, [outpasses])

  const filterOptions = useMemo(
    () => [
      { key: "all", label: "All", count: outpasses.length },
      { key: "pending", label: "Pending", count: statusCounts.pending },
      { key: "approved", label: "Active", count: statusCounts.approved },
      { key: "expired", label: "Expired", count: statusCounts.expired },
      { key: "cancelled", label: "Cancelled", count: statusCounts.cancelled },
      { key: "rejected", label: "Rejected", count: statusCounts.rejected },
    ],
    [outpasses.length, statusCounts],
  )

  useEffect(() => {
    loadOutpasses()
  }, [])

  useEffect(() => {
    filterOutpasses()
  }, [outpasses, activeFilter])

  const loadOutpasses = async () => {
    try {
      const [todayResponse, historyResponse] = await Promise.all([
        outpass.getOutpasses(),
        outpass.getHistory({ limit: 50 }),
      ])

      let historyList = []
      if (Array.isArray(historyResponse.data?.outpasses)) {
        historyList = historyResponse.data.outpasses
      } else if (Array.isArray(historyResponse.data)) {
        historyList = historyResponse.data
      }

      const todayOutpass = todayResponse.data?.outpass
      if (todayOutpass) {
        const exists = historyList.some((item) => item._id === todayOutpass._id)
        historyList = exists ? historyList : [todayOutpass, ...historyList]
      }

      setOutpasses(historyList)
    } catch (error) {
      console.log("Outpass load error:", error)
      Alert.alert("Error", "Failed to load outpasses")
    } finally {
      setLoading(false)
    }
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await loadOutpasses()
    setRefreshing(false)
  }

  const filterOutpasses = () => {
    if (activeFilter === "all") {
      setFilteredOutpasses(outpasses)
    } else {
      setFilteredOutpasses(outpasses.filter((outpass) => outpass.status === activeFilter))
    }
  }

  const handleCreateOutpass = () => {
    navigation.navigate("CreateOutpass")
  }

  const handleOutpassUpdate = (updatedOutpass) => {
    setOutpasses((prev) => prev.map((op) => (op._id === updatedOutpass._id ? updatedOutpass : op)))
  }

  const renderOutpassCard = ({ item }) => <OutpassCard outpass={item} onUpdate={handleOutpassUpdate} />

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="document-text-outline" size={64} color={COLORS.gray[400]} />
      <Text style={styles.emptyTitle}>
        {activeFilter === "all" ? "No Outpasses Yet" : `No ${activeFilter} outpasses`}
      </Text>
      <Text style={styles.emptyText}>
        {activeFilter === "all"
          ? "Create your first outpass request to get started"
          : `You don't have any ${activeFilter} outpasses`}
      </Text>
      {activeFilter === "all" && (
        <TouchableOpacity style={styles.createButton} onPress={handleCreateOutpass}>
          <Text style={styles.createButtonText}>Create Outpass</Text>
        </TouchableOpacity>
      )}
    </View>
  )

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          { backgroundColor: colors.card, flexDirection: "row", alignItems: "center", justifyContent: "center" },
        ]}
      >
        <View style={{ flex: 1 }} />
        <Text style={[styles.headerTitle, { color: colors.text, textAlign: "center", flex: 2 }]}>
          Outpass Management
        </Text>
        <View style={{ flex: 1, alignItems: "flex-end" }}>
          <TouchableOpacity onPress={toggleTheme} style={{ padding: 8 }}>
            <Ionicons name={isDarkMode ? "sunny" : "moon"} size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <FilterTabs options={filterOptions} activeFilter={activeFilter} onFilterChange={setActiveFilter} />

      <FlatList
        data={filteredOutpasses}
        renderItem={renderOutpassCard}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity
        style={styles.floatingCreateButton}
        onPress={handleCreateOutpass}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={28} color={COLORS.white} />
        <Text style={styles.floatingCreateLabel}>Create Outpass</Text>
      </TouchableOpacity>
    </View>
  )
}
