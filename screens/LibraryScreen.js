import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, Platform, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { COLORS, FONTS, SIZES, SPACING } from "../utils/constants";

export default function LibraryScreen({ navigation }) {
  const { isDarkMode, toggleTheme, colors } = useTheme();

  const libraryStats = { capacity: 120, current: 75 };
  const issuedBooks = [
    { id: 1, name: "The Hitchhiker's Guide to the Galaxy", issueDate: "2025-08-20", isDue: false },
    { id: 2, name: "The Lord of the Rings: The Fellowship of the Ring", issueDate: "2025-08-21", isDue: true },
    { id: 3, name: "The Chronicles of Narnia: The Lion, the Witch and the Wardrobe", issueDate: "2025-08-18", isDue: false },
  ];

  const [notify, setNotify] = useState(false);
  const tokenNumber = "42";
  const isFull = libraryStats.current >= libraryStats.capacity;
  const availableSeats = libraryStats.capacity - libraryStats.current;

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.background,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 8 : 0,
      }}
    >
      <ScrollView
        style={{ flex: 1, backgroundColor: colors.background }}
        contentContainerStyle={{ padding: SPACING.lg }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: SPACING.lg,
          }}
        >
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 8 }}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>

          <Text
            style={{
              fontSize: SIZES.lg,
              fontFamily: FONTS.bold,
              color: colors.text,
            }}
          >
            Library
          </Text>

          <TouchableOpacity onPress={toggleTheme} style={{ padding: 8 }}>
            <Ionicons name={isDarkMode ? "sunny" : "moon"} size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Current Status Card */}
        <View
          style={{
            backgroundColor: colors.card,
            borderRadius: 16,
            padding: SPACING.lg,
            marginBottom: SPACING.lg,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 6,
            elevation: 4,
          }}
        >
          <Text
            style={{
              fontSize: SIZES.lg,
              fontFamily: FONTS.bold,
              color: colors.text,
              marginBottom: SPACING.sm,
            }}
          >
            Current Status
          </Text>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 48,
                fontFamily: FONTS.bold,
                color: colors.primary,
              }}
            >
              {libraryStats.current}
            </Text>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={{ fontSize: SIZES.md, color: colors.subText }}>Readers</Text>
              <Text style={{ fontSize: SIZES.md, color: colors.subText }}>
                Available: {availableSeats}
              </Text>
            </View>
          </View>

          {isFull && (
            <TouchableOpacity
              onPress={() => setNotify(!notify)}
              style={{
                marginTop: SPACING.md,
                backgroundColor: isDarkMode ? "#4caf5030" : "#4caf5020",
                borderRadius: 10,
                paddingVertical: 10,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: colors.text,
                  fontFamily: FONTS.medium,
                }}
              >
                🔔 Notify when empty?
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Seat Number Card */}
        <View
          style={{
            backgroundColor: colors.card,
            borderRadius: 16,
            padding: SPACING.lg,
            marginBottom: SPACING.lg,
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 6,
            elevation: 4,
          }}
        >
          <Text
            style={{
              fontSize: SIZES.lg,
              fontFamily: FONTS.bold,
              color: colors.text,
              marginBottom: SPACING.sm,
            }}
          >
            Your Seat
          </Text>
          <Text
            style={{
              fontSize: 42,
              fontFamily: FONTS.bold,
              color: colors.primary,
            }}
          >
            #{tokenNumber}
          </Text>
        </View>

        {/* Issued Books Card */}
        <View
          style={{
            backgroundColor: colors.card,
            borderRadius: 16,
            padding: SPACING.lg,
            marginBottom: SPACING.xl,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 6,
            elevation: 4,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: SPACING.sm,
            }}
          >
            <Text
              style={{
                fontSize: SIZES.lg,
                fontFamily: FONTS.bold,
                color: colors.text,
              }}
            >
              Issued Books
            </Text>
            <Text
              style={{
                fontSize: SIZES.md,
                fontFamily: FONTS.bold,
                color: colors.primary,
              }}
            >
              {issuedBooks.length}
            </Text>
          </View>

          {/* Table Header */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              borderBottomWidth: 1,
              borderBottomColor: colors.subText + "30",
              paddingBottom: 6,
              marginBottom: 6,
            }}
          >
            <Text style={{ color: colors.subText, flex: 0.2 }}>No.</Text>
            <Text style={{ color: colors.subText, flex: 1 }}>Name</Text>
            <Text
              style={{
                color: colors.subText,
                flex: 0.6,
                textAlign: "right",
              }}
            >
              Date
            </Text>
          </View>

          {issuedBooks.map((book, index) => (
            <View
              key={book.id}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingVertical: 8,
                backgroundColor: book.isDue
                  ? isDarkMode
                    ? "#f4433620"
                    : "#ffebee"
                  : "transparent",
                borderRadius: 8,
                paddingHorizontal: 4,
                marginBottom: 4,
              }}
            >
              <Text style={{ color: colors.text, flex: 0.2 }}>{index + 1}.</Text>
              <Text style={{ color: colors.text, flex: 1 }}>
                {book.name}
                {book.isDue && (
                  <Text style={{ color: "#f44336", fontFamily: FONTS.bold }}> (DUE)</Text>
                )}
              </Text>
              <Text style={{ color: colors.text, flex: 0.6, textAlign: "right" }}>
                {book.issueDate}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
