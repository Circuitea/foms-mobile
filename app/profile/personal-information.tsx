"use client"

import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { useRouter } from "expo-router"
import { useState } from "react"
import {
  Alert,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"

export default function PersonalInformationScreen() {
  const router = useRouter()
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState("+63 912 345 6789")
  const [emergencyContact, setEmergencyContact] = useState("+63 998 765 4321")
  const [tempPhoneNumber, setTempPhoneNumber] = useState(phoneNumber)
  const [tempEmergencyContact, setTempEmergencyContact] = useState(emergencyContact)

  const handleEditPress = () => {
    setTempPhoneNumber(phoneNumber)
    setTempEmergencyContact(emergencyContact)
    setEditModalVisible(true)
  }

  const handleSaveChanges = () => {
    // Validate phone numbers
    if (!tempPhoneNumber.trim()) {
      Alert.alert("Error", "Phone number cannot be empty")
      return
    }
    if (!tempEmergencyContact.trim()) {
      Alert.alert("Error", "Emergency contact cannot be empty")
      return
    }

    // Save the changes
    setPhoneNumber(tempPhoneNumber)
    setEmergencyContact(tempEmergencyContact)
    setEditModalVisible(false)
    Alert.alert("Success", "Your contact information has been updated successfully.")
  }

  const handleCancelEdit = () => {
    setTempPhoneNumber(phoneNumber)
    setTempEmergencyContact(emergencyContact)
    setEditModalVisible(false)
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E3A8A" translucent={false} hidden={false} />

      {/* Updated Header with curved bottom */}
      <View style={styles.headerContainer}>
        <LinearGradient
          colors={["#1E3A8A", "#3B82F6", "#EF4444"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.headerGradient}
        >
          <SafeAreaView style={styles.headerSafeArea}>
            <View style={styles.headerContent}>
              <TouchableOpacity style={styles.backButton} onPress={() => router.push("/profile")}>
                <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Personal Information</Text>
              <View style={{ width: 24 }} />
            </View>
          </SafeAreaView>
        </LinearGradient>

        {/* This is the curved bottom part */}
        <View style={styles.curvedBottom} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Basic Information</Text>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Full Name</Text>
            <Text style={styles.infoValue}>{"{Name of User}"}</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Badge Number</Text>
            <Text style={styles.infoValue}>#12345</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Position</Text>
            <Text style={styles.infoValue}>Emergency Response Coordinator</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Department</Text>
            <Text style={styles.infoValue}>CDRRMO - Emergency Operations</Text>
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Contact Information</Text>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>user@cdrrmo.gov.ph</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Phone</Text>
            <Text style={styles.infoValue}>{phoneNumber}</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Emergency Contact</Text>
            <Text style={styles.infoValue}>{emergencyContact}</Text>
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Work Information</Text>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Date Joined</Text>
            <Text style={styles.infoValue}>January 15, 2022</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Supervisor</Text>
            <Text style={styles.infoValue}>Director Santos</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Work Schedule</Text>
            <Text style={styles.infoValue}>Monday - Friday, 8:00 AM - 5:00 PM</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.editButton} onPress={handleEditPress}>
          <Ionicons name="create-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.editButtonText}>Edit Information</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Edit Modal */}
      <Modal animationType="slide" transparent={false} visible={editModalVisible} onRequestClose={handleCancelEdit}>
        <View style={styles.modalContainer}>
          <StatusBar barStyle="light-content" backgroundColor="#1E3A8A" />
          <SafeAreaView style={styles.modalSafeArea}>
            <LinearGradient
              colors={["#1E3A8A", "#3B82F6", "#EF4444"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.modalHeader}
            >
              <TouchableOpacity style={styles.backButton} onPress={handleCancelEdit}>
                <Ionicons name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <Text style={styles.modalHeaderTitle}>Edit Contact Information</Text>
              <View style={{ width: 40 }} />
            </LinearGradient>

            <ScrollView style={styles.modalContent} contentContainerStyle={styles.modalScrollContent}>
              <View style={styles.editSection}>
                <Text style={styles.editSectionTitle}>Personal Information</Text>

                {/* Fixed Name Field */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Full Name</Text>
                  <View style={styles.fixedInputContainer}>
                    <Text style={styles.fixedInputText}>{"{Name of User}"}</Text>
                    <View style={styles.lockIconContainer}>
                      <Ionicons name="lock-closed" size={16} color="#9CA3AF" />
                    </View>
                  </View>
                  <Text style={styles.inputHint}>Name cannot be changed</Text>
                </View>

                {/* Editable Phone Number */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Phone Number</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons name="call-outline" size={20} color="#6B7280" style={styles.inputIcon} />
                    <TextInput
                      style={styles.textInput}
                      value={tempPhoneNumber}
                      onChangeText={setTempPhoneNumber}
                      placeholder="Enter phone number"
                      keyboardType="phone-pad"
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>
                </View>

                {/* Editable Emergency Contact */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Emergency Contact</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons name="medical-outline" size={20} color="#6B7280" style={styles.inputIcon} />
                    <TextInput
                      style={styles.textInput}
                      value={tempEmergencyContact}
                      onChangeText={setTempEmergencyContact}
                      placeholder="Enter emergency contact"
                      keyboardType="phone-pad"
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>
                </View>
              </View>

              <View style={styles.editSection}>
                <Text style={styles.editSectionTitle}>Instructions</Text>
                <View style={styles.instructionCard}>
                  <Ionicons name="information-circle" size={20} color="#3B82F6" />
                  <View style={styles.instructionContent}>
                    <Text style={styles.instructionText}>
                      • Your name is managed by the system administrator and cannot be changed here.
                    </Text>
                    <Text style={styles.instructionText}>• Make sure your phone number is active and reachable.</Text>
                    <Text style={styles.instructionText}>
                      • Emergency contact should be someone who can be reached 24/7.
                    </Text>
                  </View>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.cancelButton} onPress={handleCancelEdit}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveActionButton} onPress={handleSaveChanges}>
                  <Ionicons name="checkmark" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                  <Text style={styles.saveActionButtonText}>Save Changes</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </SafeAreaView>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  // Updated Header styles with curved bottom (matching profile screen)
  headerContainer: {
    position: "relative",
    zIndex: 10,
  },
  headerGradient: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0,
    paddingBottom: 30,
  },
  headerSafeArea: {
    backgroundColor: "transparent",
  },
  curvedBottom: {
    height: 30,
    backgroundColor: "#F9FAFB",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    zIndex: 5,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 15, // Adjusted to account for curved header
    marginTop: -15, // Pull content up slightly to overlap with the curve
  },
  infoSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1E3A8A",
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingBottom: 8,
  },
  infoItem: {
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: "#111827",
    fontWeight: "500",
  },
  editButton: {
    flexDirection: "row",
    backgroundColor: "#1E3A8A",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  editButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: "#1E3A8A",
  },
  modalSafeArea: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  modalHeaderTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  modalScrollContent: {
    paddingBottom: 40,
  },
  editSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  editSectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1E3A8A",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingBottom: 8,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
  },
  fixedInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  fixedInputText: {
    flex: 1,
    fontSize: 16,
    color: "#6B7280",
  },
  lockIconContainer: {
    marginLeft: 8,
  },
  inputHint: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 4,
    fontStyle: "italic",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: "#111827",
    paddingVertical: 8,
  },
  instructionCard: {
    flexDirection: "row",
    backgroundColor: "#EBF8FF",
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#3B82F6",
  },
  instructionContent: {
    marginLeft: 12,
    flex: 1,
  },
  instructionText: {
    fontSize: 14,
    color: "#1E40AF",
    lineHeight: 20,
    marginBottom: 4,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#6B7280",
    fontSize: 16,
    fontWeight: "500",
  },
  saveActionButton: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#10B981",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  saveActionButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
})
