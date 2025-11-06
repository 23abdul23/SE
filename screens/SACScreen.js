import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RoomCard from '../components/RoomCard';
import { useTheme } from '../context/ThemeContext';
import { COLORS, FONTS, SIZES, SPACING } from '../utils/constants';

export default function SAC({ navigation }) {
  const { colors, isDarkMode, toggleTheme } = useTheme();

  const rooms = [
    { name: 'Snooker Room', occupied: true, leaveTime: '7:30 PM' },
    { name: 'Table Tennis Room', occupied: false, leaveTime: null },
    { name: 'Virtuosi', occupied: true, leaveTime: '8:00 PM' },
    { name: 'Cricket Room', occupied: false, leaveTime: null },
  ];

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.background,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 8 : 0,
      }}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: SPACING.lg,
          marginBottom: SPACING.lg,
          marginTop: SPACING.sm,
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
          SAC Rooms
        </Text>

        <TouchableOpacity onPress={toggleTheme} style={{ padding: 8 }}>
          <Ionicons name={isDarkMode ? 'sunny' : 'moon'} size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Rooms List */}
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: SPACING.lg,
          paddingBottom: SPACING.xl,
        }}
        showsVerticalScrollIndicator={false}
      >
        {rooms.map((room, idx) => (
          <View
            key={idx}
            style={{
              backgroundColor: colors.card,
              borderRadius: 16,
              padding: SPACING.lg,
              marginBottom: SPACING.md,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 6,
              elevation: 3,
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text
                style={{
                  fontSize: SIZES.md,
                  fontFamily: FONTS.bold,
                  color: colors.text,
                }}
              >
                {room.name}
              </Text>

              {room.occupied ? (
                <View
                  style={{
                    backgroundColor: isDarkMode ? '#f4433630' : '#ffebee',
                    borderRadius: 12,
                    paddingVertical: 4,
                    paddingHorizontal: 10,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      color: '#f44336',
                      fontFamily: FONTS.medium,
                    }}
                  >
                    Occupied
                  </Text>
                </View>
              ) : (
                <View
                  style={{
                    backgroundColor: isDarkMode ? '#4caf5030' : '#e8f5e9',
                    borderRadius: 12,
                    paddingVertical: 4,
                    paddingHorizontal: 10,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      color: '#4caf50',
                      fontFamily: FONTS.medium,
                    }}
                  >
                    Available
                  </Text>
                </View>
              )}
            </View>

            {room.occupied && (
              <Text
                style={{
                  marginTop: 6,
                  fontSize: 13,
                  fontFamily: FONTS.regular,
                  color: colors.subText,
                }}
              >
                Expected to be free by <Text style={{ fontFamily: FONTS.bold }}>{room.leaveTime}</Text>
              </Text>
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
