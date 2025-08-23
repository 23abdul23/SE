"use client"

import { View, Text, StyleSheet, TouchableOpacity, RefreshControl, Alert, FlatList } from "react-native"
import { useState, useEffect } from "react"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { studentAPI } from "../services/api"
import { COLORS, FONTS, SIZES, SPACING } from "../utils/constants"
import LoadingSpinner from "../components/LoadingSpinner"
import OutpassCard from "../components/OutpassCard"
import FilterTabs from "../components/FilterTabs"

export default function OutpassScreen() {
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
      const response = await studentAPI.getOutpasses()
      setOutpasses(response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
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
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Outpass Management</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleCreateOutpass}>
          <Ionicons name="add" size={24} color={COLORS.white} />
        </TouchableOpacity>
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
  headerTitle: {
    fontSize: SIZES.xl,
    fontFamily: FONTS.bold,
    color: COLORS.gray[800],
  },
  addButton: {
    backgroundColor: COLORS.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    padding: SPACING.lg,
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: SPACING.xxl,
  },
  emptyTitle: {
    fontSize: SIZES.lg,
    fontFamily: FONTS.bold,
    color: COLORS.gray[800],
    marginTop: SPACING.md,
    marginBottom: SPACING.xs,
  },
  emptyText: {
    fontSize: SIZES.md,
    fontFamily: FONTS.regular,
    color: COLORS.gray[600],
    textAlign: "center",
    marginBottom: SPACING.lg,
    maxWidth: 250,
  },
  createButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: 8,
  },
  createButtonText: {
    fontSize: SIZES.md,
    fontFamily: FONTS.bold,
    color: COLORS.white,
  },
})
