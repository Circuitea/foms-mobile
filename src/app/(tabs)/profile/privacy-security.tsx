"use client"

import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { useRouter } from "expo-router"
import { useState } from "react"
import {
  Alert,
  FlatList,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"

export default function PrivacySecurityScreen() {
  const router = useRouter()
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)

  // Modal states
  const [changePasswordModal, setChangePasswordModal] = useState(false)
  const [securityQuestionsModal, setSecurityQuestionsModal] = useState(false)
  const [privacyPolicyModal, setPrivacyPolicyModal] = useState(false)
  const [termsModal, setTermsModal] = useState(false)

  // Dropdown states
  const [showDropdown1, setShowDropdown1] = useState(false)
  const [showDropdown2, setShowDropdown2] = useState(false)

  // Form states
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [securityQuestion1, setSecurityQuestion1] = useState("")
  const [securityAnswer1, setSecurityAnswer1] = useState("")
  const [securityQuestion2, setSecurityQuestion2] = useState("")
  const [securityAnswer2, setSecurityAnswer2] = useState("")

  // Navigate back to profile screen
  const navigateToProfile = () => {
    router.push("/profile")
  }

  // Predefined security questions
  const securityQuestions = [
    "What was your first pet's name?",
    "What city were you born in?",
    "What was the name of your first school?",
    "What is your mother's maiden name?",
    "What was the make of your first car?",
    "What is the name of your favorite teacher?",
    "What street did you grow up on?",
    "What was your childhood nickname?",
    "What is your favorite movie?",
    "What was the name of your first boss?",
    "What is your favorite food?",
    "What was your first job?",
  ]

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill in all password fields.")
      return
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords do not match.")
      return
    }

    if (newPassword.length < 8) {
      Alert.alert("Error", "New password must be at least 8 characters long.")
      return
    }

    // Simulate password change
    Alert.alert("Success", "Password has been changed successfully.", [
      {
        text: "OK",
        onPress: () => {
          setChangePasswordModal(false)
          setCurrentPassword("")
          setNewPassword("")
          setConfirmPassword("")
        },
      },
    ])
  }

  const handleSecurityQuestions = () => {
    if (!securityQuestion1 || !securityAnswer1 || !securityQuestion2 || !securityAnswer2) {
      Alert.alert("Error", "Please fill in all security question fields.")
      return
    }

    if (securityQuestion1 === securityQuestion2) {
      Alert.alert("Error", "Please select different security questions.")
      return
    }

    // Simulate saving security questions
    Alert.alert("Success", "Security questions have been updated successfully.", [
      {
        text: "OK",
        onPress: () => {
          setSecurityQuestionsModal(false)
          setSecurityQuestion1("")
          setSecurityAnswer1("")
          setSecurityQuestion2("")
          setSecurityAnswer2("")
        },
      },
    ])
  }

  const renderDropdown = (
    questions: string[],
    selectedQuestion: string,
    onSelect: (question: string) => void,
    isVisible: boolean,
    onClose: () => void,
  ) => {
    if (!isVisible) return null

    return (
      <View style={styles.dropdownContainer}>
        <View style={styles.dropdownContent}>
          <View style={styles.dropdownHeader}>
            <Text style={styles.dropdownTitle}>Select Security Question</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={questions}
            keyExtractor={(item, index) => index.toString()}
            style={styles.dropdownList}
            showsVerticalScrollIndicator={true}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.dropdownItem, selectedQuestion === item && styles.dropdownItemSelected]}
                onPress={() => {
                  onSelect(item)
                  onClose()
                }}
              >
                <Text style={[styles.dropdownItemText, selectedQuestion === item && styles.dropdownItemTextSelected]}>
                  {item}
                </Text>
                {selectedQuestion === item && <Ionicons name="checkmark" size={20} color="#1B2560" />}
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    )
  }

  const renderChangePasswordModal = () => (
    <Modal animationType="slide" transparent={false} visible={changePasswordModal}>
      <View style={styles.modalContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#1B2560" />
        <SafeAreaView style={styles.modalSafeArea}>
          <LinearGradient
            colors={["#1B2560", "#FF4D4D"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.modalHeader}
          >
            <TouchableOpacity style={styles.backButton} onPress={() => setChangePasswordModal(false)}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.modalHeaderTitle}>Change Password</Text>
            <View style={styles.headerSpacer} />
          </LinearGradient>

          <ScrollView style={styles.modalContent}>
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Current Password</Text>
              <TextInput
                style={styles.formInput}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry
                placeholder="Enter current password"
              />

              <Text style={styles.formLabel}>New Password</Text>
              <TextInput
                style={styles.formInput}
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
                placeholder="Enter new password"
              />

              <Text style={styles.formLabel}>Confirm New Password</Text>
              <TextInput
                style={styles.formInput}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                placeholder="Confirm new password"
              />

              <View style={styles.passwordRequirements}>
                <Text style={styles.requirementsTitle}>Password Requirements:</Text>
                <Text style={styles.requirementText}>• At least 8 characters long</Text>
                <Text style={styles.requirementText}>• Contains uppercase and lowercase letters</Text>
                <Text style={styles.requirementText}>• Contains at least one number</Text>
                <Text style={styles.requirementText}>• Contains at least one special character</Text>
              </View>

              <TouchableOpacity style={styles.submitButton} onPress={handleChangePassword}>
                <Text style={styles.submitButtonText}>Change Password</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    </Modal>
  )

  const renderSecurityQuestionsModal = () => (
    <Modal animationType="slide" transparent={false} visible={securityQuestionsModal}>
      <View style={styles.modalContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#1B2560" />
        <SafeAreaView style={styles.modalSafeArea}>
          <LinearGradient
            colors={["#1B2560", "#FF4D4D"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.modalHeader}
          >
            <TouchableOpacity style={styles.backButton} onPress={() => setSecurityQuestionsModal(false)}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.modalHeaderTitle}>Security Questions</Text>
            <View style={styles.headerSpacer} />
          </LinearGradient>

          <ScrollView style={styles.modalContent}>
            <View style={styles.formSection}>
              <Text style={styles.sectionDescription}>
                Set up security questions to help recover your account if you forget your password.
              </Text>

              <Text style={styles.formLabel}>Security Question 1</Text>
              <TouchableOpacity style={styles.dropdownSelector} onPress={() => setShowDropdown1(true)}>
                <Text style={[styles.dropdownSelectorText, !securityQuestion1 && styles.dropdownPlaceholder]}>
                  {securityQuestion1 || "Select a security question"}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#6B7280" />
              </TouchableOpacity>

              <Text style={styles.formLabel}>Answer 1</Text>
              <TextInput
                style={styles.formInput}
                value={securityAnswer1}
                onChangeText={setSecurityAnswer1}
                placeholder="Enter your answer"
                editable={!!securityQuestion1}
              />

              <Text style={styles.formLabel}>Security Question 2</Text>
              <TouchableOpacity style={styles.dropdownSelector} onPress={() => setShowDropdown2(true)}>
                <Text style={[styles.dropdownSelectorText, !securityQuestion2 && styles.dropdownPlaceholder]}>
                  {securityQuestion2 || "Select a security question"}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#6B7280" />
              </TouchableOpacity>

              <Text style={styles.formLabel}>Answer 2</Text>
              <TextInput
                style={styles.formInput}
                value={securityAnswer2}
                onChangeText={setSecurityAnswer2}
                placeholder="Enter your answer"
                editable={!!securityQuestion2}
              />

              <TouchableOpacity style={styles.submitButton} onPress={handleSecurityQuestions}>
                <Text style={styles.submitButtonText}>Save Security Questions</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* Dropdown Modals */}
          <Modal
            visible={showDropdown1}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setShowDropdown1(false)}
          >
            {renderDropdown(
              securityQuestions.filter((q) => q !== securityQuestion2),
              securityQuestion1,
              setSecurityQuestion1,
              showDropdown1,
              () => setShowDropdown1(false),
            )}
          </Modal>

          <Modal
            visible={showDropdown2}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setShowDropdown2(false)}
          >
            {renderDropdown(
              securityQuestions.filter((q) => q !== securityQuestion1),
              securityQuestion2,
              setSecurityQuestion2,
              showDropdown2,
              () => setShowDropdown2(false),
            )}
          </Modal>
        </SafeAreaView>
      </View>
    </Modal>
  )

  const renderPrivacyPolicyModal = () => (
    <Modal animationType="slide" transparent={false} visible={privacyPolicyModal}>
      <View style={styles.modalContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#1B2560" />
        <SafeAreaView style={styles.modalSafeArea}>
          <LinearGradient
            colors={["#1B2560", "#FF4D4D"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.modalHeader}
          >
            <TouchableOpacity style={styles.backButton} onPress={() => setPrivacyPolicyModal(false)}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.modalHeaderTitle}>Privacy Policy</Text>
            <View style={styles.headerSpacer} />
          </LinearGradient>

          <ScrollView style={styles.modalContent}>
            <View style={styles.documentSection}>
              <Text style={styles.documentTitle}>CDRRMO Privacy Policy</Text>
              <Text style={styles.documentDate}>Last updated: January 2025</Text>

              <Text style={styles.documentSubtitle}>1. Information We Collect</Text>
              <Text style={styles.documentText}>
                We collect information you provide directly to us, such as when you create an account, use our services,
                or contact us for support. This may include your name, email address, phone number, and other contact
                information.
              </Text>

              <Text style={styles.documentSubtitle}>2. How We Use Your Information</Text>
              <Text style={styles.documentText}>
                We use the information we collect to provide, maintain, and improve our services, process transactions,
                send you technical notices and support messages, and communicate with you about products, services, and
                events.
              </Text>

              <Text style={styles.documentSubtitle}>3. Information Sharing</Text>
              <Text style={styles.documentText}>
                We do not sell, trade, or otherwise transfer your personal information to third parties without your
                consent, except as described in this policy or as required by law.
              </Text>

              <Text style={styles.documentSubtitle}>4. Data Security</Text>
              <Text style={styles.documentText}>
                We implement appropriate security measures to protect your personal information against unauthorized
                access, alteration, disclosure, or destruction.
              </Text>

              <Text style={styles.documentSubtitle}>5. Contact Us</Text>
              <Text style={styles.documentText}>
                If you have any questions about this Privacy Policy, please contact us at privacy@cdrrmo.gov.ph
              </Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    </Modal>
  )

  const renderTermsModal = () => (
    <Modal animationType="slide" transparent={false} visible={termsModal}>
      <View style={styles.modalContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#1B2560" />
        <SafeAreaView style={styles.modalSafeArea}>
          <LinearGradient
            colors={["#1B2560", "#FF4D4D"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.modalHeader}
          >
            <TouchableOpacity style={styles.backButton} onPress={() => setTermsModal(false)}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.modalHeaderTitle}>Terms of Service</Text>
            <View style={styles.headerSpacer} />
          </LinearGradient>

          <ScrollView style={styles.modalContent}>
            <View style={styles.documentSection}>
              <Text style={styles.documentTitle}>CDRRMO Terms of Service</Text>
              <Text style={styles.documentDate}>Last updated: January 2025</Text>

              <Text style={styles.documentSubtitle}>1. Acceptance of Terms</Text>
              <Text style={styles.documentText}>
                By accessing and using this application, you accept and agree to be bound by the terms and provision of
                this agreement.
              </Text>

              <Text style={styles.documentSubtitle}>2. Use License</Text>
              <Text style={styles.documentText}>
                Permission is granted to temporarily use this application for personal, non-commercial transitory
                viewing only. This is the grant of a license, not a transfer of title.
              </Text>

              <Text style={styles.documentSubtitle}>3. Disclaimer</Text>
              <Text style={styles.documentText}>
                The materials in this application are provided on an 'as is' basis. CDRRMO makes no warranties,
                expressed or implied, and hereby disclaims and negates all other warranties.
              </Text>

              <Text style={styles.documentSubtitle}>4. Limitations</Text>
              <Text style={styles.documentText}>
                In no event shall CDRRMO or its suppliers be liable for any damages (including, without limitation,
                damages for loss of data or profit, or due to business interruption) arising out of the use or inability
                to use this application.
              </Text>

              <Text style={styles.documentSubtitle}>5. Governing Law</Text>
              <Text style={styles.documentText}>
                These terms and conditions are governed by and construed in accordance with the laws of the Philippines.
              </Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    </Modal>
  )

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1B2560" translucent={false} hidden={false} />

      {/* Updated Header with curved bottom (matching personal information screen) */}
      <View style={styles.headerContainer}>
        <LinearGradient
          colors={["#1B2560", "#FF4D4D"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.headerGradient}
        >
          <SafeAreaView style={styles.headerSafeArea}>
            <View style={styles.headerContent}>
              <TouchableOpacity style={styles.backButton} onPress={navigateToProfile}>
                <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Privacy & Security</Text>
              <View style={{ width: 24 }} />
            </View>
          </SafeAreaView>
        </LinearGradient>

        {/* This is the curved bottom part */}
        <View style={styles.curvedBottom} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Security</Text>

          <TouchableOpacity style={styles.menuItem} onPress={() => setChangePasswordModal(true)}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="lock-closed-outline" size={24} color="#1B2560" />
              <Text style={styles.menuText}>Change Password</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => setSecurityQuestionsModal(true)}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="shield-checkmark-outline" size={24} color="#1B2560" />
              <Text style={styles.menuText}>Security Questions</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <View style={styles.toggleItem}>
            <View style={styles.toggleItemLeft}>
              <Ionicons name="shield-outline" size={24} color="#1B2560" />
              <Text style={styles.toggleText}>Two-Factor Authentication</Text>
            </View>
            <Switch
              trackColor={{ false: "#D1D5DB", true: "#93C5FD" }}
              thumbColor={twoFactorEnabled ? "#1B2560" : "#F3F4F6"}
              onValueChange={() => setTwoFactorEnabled(!twoFactorEnabled)}
              value={twoFactorEnabled}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy Settings</Text>

          <View style={styles.toggleItem}>
            <View style={styles.toggleItemLeft}>
              <Ionicons name="notifications-outline" size={24} color="#1B2560" />
              <Text style={styles.toggleText}>Push Notifications</Text>
            </View>
            <Switch
              trackColor={{ false: "#D1D5DB", true: "#93C5FD" }}
              thumbColor={notificationsEnabled ? "#1B2560" : "#F3F4F6"}
              onValueChange={() => setNotificationsEnabled(!notificationsEnabled)}
              value={notificationsEnabled}
            />
          </View>

          <TouchableOpacity style={styles.menuItem} onPress={() => setPrivacyPolicyModal(true)}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="eye-off-outline" size={24} color="#1B2560" />
              <Text style={styles.menuText}>Privacy Policy</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => setTermsModal(true)}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="document-text-outline" size={24} color="#1B2560" />
              <Text style={styles.menuText}>Terms of Service</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {renderChangePasswordModal()}
      {renderSecurityQuestionsModal()}
      {renderPrivacyPolicyModal()}
      {renderTermsModal()}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  // Updated Header styles with curved bottom (matching personal information screen)
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
  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1B2560",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuText: {
    fontSize: 16,
    color: "#111827",
    marginLeft: 12,
  },
  toggleItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  toggleItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  toggleText: {
    fontSize: 16,
    color: "#111827",
    marginLeft: 12,
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: "#1B2560",
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
  headerSpacer: {
    width: 40,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  // Form Styles
  formSection: {
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
  sectionDescription: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 20,
    lineHeight: 20,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
    marginTop: 16,
  },
  formInput: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "#FFFFFF",
  },
  passwordRequirements: {
    backgroundColor: "#F9FAFB",
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  requirementText: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
  },
  submitButton: {
    backgroundColor: "#1B2560",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 24,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  // Dropdown Styles
  dropdownSelector: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownSelectorText: {
    fontSize: 16,
    color: "#111827",
    flex: 1,
  },
  dropdownPlaceholder: {
    color: "#9CA3AF",
  },
  dropdownContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  dropdownContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    width: "100%",
    maxHeight: "70%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  dropdownHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  dropdownTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  dropdownList: {
    maxHeight: 300,
  },
  dropdownItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  dropdownItemSelected: {
    backgroundColor: "#EFF6FF",
  },
  dropdownItemText: {
    fontSize: 16,
    color: "#111827",
    flex: 1,
  },
  dropdownItemTextSelected: {
    color: "#1B2560",
    fontWeight: "500",
  },
  // Document Styles
  documentSection: {
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
  documentTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
  },
  documentDate: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 24,
  },
  documentSubtitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1B2560",
    marginTop: 20,
    marginBottom: 12,
  },
  documentText: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 22,
    marginBottom: 16,
  },
})
