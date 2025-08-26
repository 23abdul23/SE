import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RoomCard from '../components/RoomCard';
import styles from '../styles/SACStyles';

export default function SAC({ navigation }) {
  const rooms = [
    { name: 'Snooker Room', occupied: true, leaveTime: '7:30 PM' },
    { name: 'Table Tennis Room', occupied: false, leaveTime: null },
    { name: 'Virtuosi', occupied: true, leaveTime: '8:00 PM' },
    { name: 'Cricket Room', occupied: false, leaveTime: null },
  ];

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} >
        <Ionicons name="arrow-back" size={22} color="black" />
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.pageTitle}>SAC Rooms</Text>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {rooms.map((room, idx) => (
          <RoomCard key={idx} room={room} />
        ))}
      </ScrollView>
    </View>
  );
}
