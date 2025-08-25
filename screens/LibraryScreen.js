import React from "react";
import { View, Text } from "react-native";
import styles from "../styles/LibraryStyles";

export default function Library() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Aegis ID</Text>
      <Text style={styles.subtitle}>Library</Text>
    </View>
  );
}
