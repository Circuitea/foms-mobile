import { NotificationModal } from "@/components/NotificationModal";
import { useAuth } from "@/providers/auth-provider";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Redirect, Tabs } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function TabsLayout() {
  const { isAuthenticated, isLoading, isFirstTimeLogin } = useAuth();
  const [notificationModalOpen, setNotificationModalOpen] = useState(false);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  // Redirect to onboarding if first time login
  if (isFirstTimeLogin) {
    return <Redirect href="/(auth)/onboarding" />;
  }

  return (
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
      screenLayout={({ children }) => (
          <>
            <View style={styles.headerContainer}>
              <LinearGradient
                colors={["#1B2560", "#FF4D4D"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.headerGradient}
              >
                <View style={styles.headerContent}>
                  <View style={styles.headerLeft}>
                    <View style={styles.logoContainer}>
                      <View style={styles.logoCircle}>
                        <Ionicons name="shield" size={28} color="#FFFFFF" />
                      </View>
                      <View style={styles.logoTextContainer}>
                        <Text style={styles.logoText}>CDRRMO</Text>
                        <Text style={styles.logoSubtext}>Task Management</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.headerRight}>
                    <TouchableOpacity style={styles.notificationButton} onPress={() => setNotificationModalOpen(true)}>
                      <View style={styles.notificationIconContainer}>
                        <Ionicons name="notifications" size={20} color="#FFFFFF" />
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </LinearGradient>

              {/* Enhanced curved bottom part */}
              <View style={styles.curvedBottom} />
            </View>

            {children}
            <NotificationModal open={notificationModalOpen} onOpenChange={setNotificationModalOpen} />
          </>
        )}
    >
      <Tabs.Screen
        name="home"
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
          title: "My Tasks",
          tabBarIcon: ({ color, focused }) => (
              <View style={styles.tabContainer}>
                {focused && <View style={styles.activeIndicator} />}
                <Ionicons name="list-outline" size={22} color={focused ? "#EF4444" : "#9CA3AF"} />
              </View>
            ),
        }}
      />
      <Tabs.Screen
        name="meetings"
        options={{
          href: null,
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
      <Tabs.Screen
        name="profile/status"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="task/[id]"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
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
  headerContainer: {
    position: "relative",
    zIndex: 10,
    elevation: 8,
  },
  headerGradient: {
    // paddingTop: Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0,
    paddingBottom: 35,
  },
  curvedBottom: {
    height: 35,
    backgroundColor: "#F8FAFC",
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    marginTop: -35,
    zIndex: 5,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoTextContainer: {
    flexDirection: "column",
  },
  logoText: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  logoSubtext: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 12,
    fontWeight: "500",
    marginTop: 2,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  notificationButton: {
    padding: 6,
  },
  notificationIconContainer: {
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#FF4D4D",
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  notificationBadgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "bold",
  },
  profileButton: {
    padding: 6,
  },
  profileCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
})