"use client"

import { View, Text, TouchableOpacity, RefreshControl, Alert, FlatList } from "react-native"
import { useState, useEffect } from "react"
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

  const filterOptions = [
    { key: "all", label: "All", count: outpasses.length },
    { key: "pending", label: "Pending", count: outpasses.filter((op) => op.status === "pending").length },
    { key: "approved", label: "Approved", count: outpasses.filter((op) => op.status === "approved").length },
    { key: "active", label: "Active", count: outpasses.filter((op) => op.status === "active").length },
    { key: "completed", label: "Completed", count: outpasses.filter((op) => op.status === "completed").length },
  ]

  useEffect(() => {
    loadOutpasses()
  }, [])

  useEffect(() => {
    filterOutpasses()
  }, [outpasses, activeFilter])

  const loadOutpasses = async () => {
    try {
      const response = await outpass.getOutpasses()

      // ✅ Handle "today" route returning a single object
      if (response.data.outpass) {
        setOutpasses([response.data.outpass]) // wrap in array
      } else if (Array.isArray(response.data)) {
        setOutpasses(response.data) // history route case
      } else {
        setOutpasses([])
      }
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
    </View>
  )
}
