import { Ionicons } from "@expo/vector-icons"
import { Tabs } from "expo-router"
import { StatusBar, StyleSheet, View } from "react-native"

export default function RootLayout() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#1E3A8A" translucent={false} hidden={false} />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#EF4444",
          tabBarInactiveTintColor: "#9CA3AF",
          tabBarStyle: {
            backgroundColor: "#FFFFFF",
            borderTopWidth: 1,
            borderTopColor: "#E5E7EB",
            height: 90,
            paddingBottom: 20,
            paddingTop: 10,
            elevation: 8,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "500",
            marginTop: 2,
          },
          tabBarIconStyle: {
            marginTop: 5,
          },
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, focused }) => (
              <View style={styles.tabContainer}>
                {focused && <View style={styles.activeIndicator} />}
                <Ionicons name={focused ? "home" : "home-outline"} size={22} color={focused ? "#EF4444" : "#9CA3AF"} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="tasks"
          options={{
            title: "Tasks",
            tabBarIcon: ({ color, focused }) => (
              <View style={styles.tabContainer}>
                {focused && <View style={styles.activeIndicator} />}
                <Ionicons name="list-outline" size={22} color={focused ? "#EF4444" : "#9CA3AF"} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="map"
          options={{
            title: "Map",
            tabBarIcon: ({ color, focused }) => (
              <View style={styles.mapTabContainer}>
                <View style={styles.mapTabButton}>
                  <Ionicons name="map" size={24} color="#FFFFFF" />
                </View>
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="meetings"
          options={{
            title: "Meetings",
            tabBarIcon: ({ color, focused }) => (
              <View style={styles.tabContainer}>
                {focused && <View style={styles.activeIndicator} />}
                <Ionicons name="calendar-outline" size={22} color={focused ? "#EF4444" : "#9CA3AF"} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, focused }) => (
              <View style={styles.tabContainer}>
                {focused && <View style={styles.activeIndicator} />}
                <Ionicons name="person-outline" size={22} color={focused ? "#EF4444" : "#9CA3AF"} />
              </View>
            ),
          }}
        />
        {/* Hide profile sub-screens from tabs */}
        <Tabs.Screen
          name="profile/personal-information"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="profile/privacy-security"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="profile/help-support"
          options={{
            href: null,
          }}
        />
      </Tabs>
    </>
  )
}

const styles = StyleSheet.create({
  tabContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50,
    paddingVertical: 5,
  },
  activeIndicator: {
    position: "absolute",
    top: -10,
    width: 30,
    height: 3,
    borderRadius: 2,
    backgroundColor: "#EF4444",
  },
  mapTabContainer: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    top: -20,
    width: 60,
    height: 60,
  },
  mapTabButton: {
    backgroundColor: "#1E3A8A",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
})
