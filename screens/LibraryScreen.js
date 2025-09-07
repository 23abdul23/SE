import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../styles/LibraryStyles";
import { useTheme } from "../context/ThemeContext";

export default function LibraryScreen({ navigation }) {
  const { isDarkMode, toggleTheme, colors } = useTheme();

  const libraryStats = { capacity: 120, current: 75 };
  const issuedBooks = [
    {
      id: 1,
      name: "The Hitchhiker's Guide to the Galaxy",
      issueDate: "2025-08-20",
      isDue: false,
    },
    {
      id: 2,
      name: "The Lord of the Rings: The Fellowship of the Ring",
      issueDate: "2025-08-21",
      isDue: true,
    },
    {
      id: 3,
      name: "The Chronicles of Narnia: The Lion, the Witch and the Wardrobe",
      issueDate: "2025-08-18",
      isDue: false,
    },
  ];

  const [notify, setNotify] = useState(false);
  const tokenNumber = "42";
  const isFull = libraryStats.current >= libraryStats.capacity;
  const availableSeats = libraryStats.capacity - libraryStats.current;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Library Stats</Text>
        <TouchableOpacity onPress={toggleTheme}>
          <Ionicons
            name={isDarkMode ? "sunny" : "moon"}
            size={24}
            color={colors.icon}
          />
        </TouchableOpacity>
      </View>

    {/* Current Status */}
    <View style={[styles.card, styles.shadow]}>
      <Text style={styles.sectionTitle}>Current Status</Text>

      <View style={styles.statusContentRow}>
      {/* Big number on left */}
      <Text style={styles.bigNumber}>{libraryStats.current}</Text>

      {/* Text on right */}
      <View style={styles.statusDescriptionContainer}>
      <Text style={styles.descriptionText}>Readers</Text>
      <Text style={styles.descriptionText}>Tentative: {availableSeats}</Text>
      </View>
  </View>

  {isFull && (
    <TouchableOpacity
      onPress={() => setNotify(!notify)}
      style={styles.notifyBar}
    >
      <Text style={styles.notifyText}>🔔 Notify when empty?</Text>
    </TouchableOpacity>
  )}
</View>


      {/* Seat Number */}
      <View style={[styles.card, styles.shadow]}>
        <Text style={styles.sectionTitle}>Your Seat</Text>
        <Text style={styles.seatNumber}>#{tokenNumber}</Text>
      </View>

      {/* Issued Books */}
      <View style={[styles.card, styles.shadow]}>
        <View style={styles.issuedBooksHeader}>
          <Text style={styles.sectionTitle}>Issued Books</Text>
          <Text style={styles.bookCount}>{`0${issuedBooks.length}`}</Text>
        </View>

        {/* Table Header */}
        <View style={styles.bookTableHeader}>
          <Text style={styles.tableHeaderCol}>No.</Text>
          <Text style={styles.tableHeaderCol}>Name</Text>
          <Text style={styles.tableHeaderCol}>Issue Date</Text>
        </View>

        {/* Book List */}
        {issuedBooks.map((book, index) => (
          <View
            key={book.id}
            style={[
              styles.bookRow,
              book.isDue && styles.dueBookRow,
            ]}
          >
            <Text style={styles.bookCol}>{index + 1}.</Text>
            <Text style={styles.bookCol}>
              {book.name}
              {book.isDue && <Text style={styles.dueText}> DUE</Text>}
            </Text>
            <Text style={styles.bookCol}>{book.issueDate}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
