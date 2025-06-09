"use client"

import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { useRouter } from "expo-router"
import { useState } from "react"
import {
    Alert,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native"

export default function ProfileScreen() {
  const router = useRouter()
  const [showPhotoOptions, setShowPhotoOptions] = useState(false)

  const handlePersonalInformation = () => {
    router.push("/profile/personal-information")
  }

  const handlePrivacySecurity = () => {
    router.push("/profile/privacy-security")
  }

  const handleHelpSupport = () => {
    router.push("/profile/help-support")
  }

  const confirmSignOut = () => {
    console.log("User signed out - would navigate to login page")
    Alert.alert("Success", "You have been signed out successfully.")
  }

  const handleSignOut = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out of your account? You'll need to sign in again to access your dashboard.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Sign Out", style: "destructive", onPress: confirmSignOut },
      ],
    )
  }

  const handleChangeProfilePhoto = () => {
    setShowPhotoOptions(true)
  }

  const handlePhotoOptionSelect = (option: string) => {
    setShowPhotoOptions(false)

    if (option === "camera") {
      Alert.alert("Camera", "Opening camera to take a new profile photo")
      // Here you would implement camera functionality
    } else if (option === "gallery") {
      Alert.alert("Gallery", "Opening gallery to select a profile photo")
      // Here you would implement photo picker functionality
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E3A8A" translucent={false} hidden={false} />
      <SafeAreaView style={styles.safeArea}>
        <LinearGradient
          colors={["#1E3A8A", "#3B82F6", "#EF4444"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <View style={styles.logoContainer}>
                <View style={styles.logoCircle}>
                  <Ionicons name="shield" size={20} color="#FFFFFF" />
                </View>
                <Text style={styles.logoText}>CDRRMO</Text>
              </View>
            </View>
            {/* Keep the profile button to match other screens */}
            <TouchableOpacity style={styles.profileButton}>
              <View style={styles.profileCircle}>
                <Ionicons name="person" size={20} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <ScrollView style={styles.content}>
          <View style={styles.profileCard}>
            <TouchableOpacity style={styles.avatarContainer} onPress={handleChangeProfilePhoto}>
              <View style={styles.avatarWrapper}>
                <Ionicons name="person" size={80} color="#3B82F6" />
                <View style={styles.cameraIconContainer}>
                  <Ionicons name="camera" size={16} color="#FFFFFF" />
                </View>
              </View>
              <Text style={styles.changePhotoText}>Change Photo</Text>
            </TouchableOpacity>
            <Text style={styles.userName}>Officer {"{Name of User}"}</Text>
            <Text style={styles.userRole}>Emergency Response Coordinator</Text>
            <Text style={styles.userBadge}>Badge #12345</Text>
            <Text style={styles.userDepartment}>CDRRMO - Emergency Operations</Text>
          </View>

          <View style={styles.menuSection}>
            <TouchableOpacity style={styles.menuItem} onPress={handlePersonalInformation}>
              <Ionicons name="person-outline" size={24} color="#6B7280" />
              <Text style={styles.menuText}>Personal Information</Text>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={handlePrivacySecurity}>
              <Ionicons name="shield-outline" size={24} color="#6B7280" />
              <Text style={styles.menuText}>Privacy & Security</Text>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={handleHelpSupport}>
              <Ionicons name="help-circle-outline" size={24} color="#6B7280" />
              <Text style={styles.menuText}>Help & Support</Text>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.menuItem, styles.logoutItem]} onPress={handleSignOut}>
              <Ionicons name="log-out-outline" size={24} color="#EF4444" />
              <Text style={[styles.menuText, styles.logoutText]}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Photo Options Modal */}
        {showPhotoOptions && (
          <View style={styles.photoOptionsOverlay}>
            <TouchableOpacity style={styles.photoOptionsBackdrop} onPress={() => setShowPhotoOptions(false)} />
            <View style={styles.photoOptionsContainer}>
              <Text style={styles.photoOptionsTitle}>Change Profile Photo</Text>
              <TouchableOpacity style={styles.photoOption} onPress={() => handlePhotoOptionSelect("camera")}>
                <Ionicons name="camera" size={24} color="#3B82F6" />
                <Text style={styles.photoOptionText}>Take Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.photoOption} onPress={() => handlePhotoOptionSelect("gallery")}>
                <Ionicons name="images" size={24} color="#3B82F6" />
                <Text style={styles.photoOptionText}>Choose from Gallery</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.photoOption, styles.cancelOption]}
                onPress={() => setShowPhotoOptions(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E3A8A",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  logoText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  profileButton: {
    padding: 4,
  },
  profileCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  profileCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    marginBottom: 16,
    alignItems: "center",
  },
  avatarWrapper: {
    position: "relative",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
    overflow: "visible", // Changed from "hidden" to "visible"
  },
  cameraIconContainer: {
    position: "absolute",
    bottom: -2, // Moved slightly outside the circle
    right: -2, // Moved slightly outside the circle
    backgroundColor: "#3B82F6",
    width: 28, // Reduced size
    height: 28, // Reduced size
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3, // Increased border width
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  changePhotoText: {
    marginTop: 8,
    fontSize: 14,
    color: "#3B82F6",
    fontWeight: "500",
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  userRole: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 4,
  },
  userBadge: {
    fontSize: 14,
    color: "#9CA3AF",
    marginBottom: 4,
  },
  userDepartment: {
    fontSize: 14,
    color: "#3B82F6",
    fontWeight: "500",
  },
  menuSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: "#111827",
    marginLeft: 12,
  },
  logoutItem: {
    borderBottomWidth: 0,
  },
  logoutText: {
    color: "#EF4444",
  },
  // Photo Options Modal Styles
  photoOptionsOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "flex-end",
    zIndex: 1000,
  },
  photoOptionsBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  photoOptionsContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  photoOptionsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 16,
    textAlign: "center",
  },
  photoOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  photoOptionText: {
    fontSize: 16,
    color: "#111827",
    marginLeft: 12,
  },
  cancelOption: {
    justifyContent: "center",
    borderBottomWidth: 0,
    marginTop: 8,
  },
  cancelText: {
    fontSize: 16,
    color: "#EF4444",
    fontWeight: "500",
    textAlign: "center",
  },
})
