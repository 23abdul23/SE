import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { Ionicons } from "@expo/vector-icons"

// Import screens
import DashboardScreen from "../screens/DashboardScreen"
import OutpassScreen from "../screens/OutpassScreen"
import EmergencyScreen from "../screens/EmergencyScreen"
import ProfileScreen from "../screens/ProfileScreen"
import Library from "../screens/LibraryScreen"
import SAC from "../screens/SACScreen"

const Tab = createBottomTabNavigator()

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName

          if (route.name === "Dashboard") {
            iconName = focused ? "home" : "home-outline"
          } else if (route.name === "Outpass") {
            iconName = focused ? "document-text" : "document-text-outline"
          } else if (route.name === "Emergency") {
            iconName = focused ? "warning" : "warning-outline"
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline"
          } else if (route.name === "Library") {
            iconName = focused ? "book" : "book-outline"
          } else if (route.name === "SAC") {
            iconName = focused ? "bicycle" : "bicycle-outline"
          }



          return <Ionicons name={iconName} size={size} color={color} />
        },
        tabBarActiveTintColor: "#2563eb",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Outpass" component={OutpassScreen} />
      <Tab.Screen name="Emergency" component={EmergencyScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  )
}
