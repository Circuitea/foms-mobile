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

export default function HelpSupportScreen() {
  const router = useRouter()
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [reportModalVisible, setReportModalVisible] = useState(false)
  const [reportCategory, setReportCategory] = useState("")
  const [reportDescription, setReportDescription] = useState("")

  const faqs = [
    {
      question: "How do I update my location?",
      answer:
        "Your location is automatically updated when the app is open. Make sure location permissions are enabled in your device settings and in the Privacy & Security section of the app.",
    },
    {
      question: "How do I respond to a task assignment?",
      answer:
        "When you receive a task assignment, you'll get a notification. Open the Tasks tab, select the assigned task, and view the details. You can update the task status as you progress through the task details screen.",
    },
    {
      question: "How do I change my password?",
      answer:
        "Go to Profile > Privacy & Security > Change Password. You'll need to enter your current password and then your new password twice to confirm.",
    },
    {
      question: "How do I join a meeting?",
      answer:
        "Open the Meetings tab, find the meeting you want to join, and tap on it. If the meeting has started, you'll see a 'Join Now' button. Tap it to enter the virtual meeting room.",
    },
  ]

  const toggleFaq = (index: number) => {
    if (expandedFaq === index) {
      setExpandedFaq(null)
    } else {
      setExpandedFaq(index)
    }
  }

  const handleReportProblem = () => {
    if (!reportCategory || !reportDescription.trim()) {
      Alert.alert("Error", "Please select a category and describe the problem.")
      return
    }

    Alert.alert("Success", "Your problem report has been submitted. Our support team will review it shortly.", [
      {
        text: "OK",
        onPress: () => {
          setReportModalVisible(false)
          setReportCategory("")
          setReportDescription("")
        },
      },
    ])
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
            <TouchableOpacity style={styles.backButton} onPress={() => router.push("/profile")}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Help & Support</Text>
            <View style={{ width: 24 }} />
          </View>
        </LinearGradient>

        <ScrollView style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Support</Text>

            <TouchableOpacity style={styles.contactItem}>
              <View style={styles.contactIconContainer}>
                <Ionicons name="call-outline" size={24} color="#FFFFFF" />
              </View>
              <View style={styles.contactDetails}>
                <Text style={styles.contactLabel}>Phone Support</Text>
                <Text style={styles.contactValue}>+63 (2) 8911-1406</Text>
                <Text style={styles.contactHours}>Available 24/7</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.contactItem, { borderBottomWidth: 0 }]}>
              <View style={[styles.contactIconContainer, { backgroundColor: "#10B981" }]}>
                <Ionicons name="mail-outline" size={24} color="#FFFFFF" />
              </View>
              <View style={styles.contactDetails}>
                <Text style={styles.contactLabel}>Email Support</Text>
                <Text style={styles.contactValue}>support@cdrrmo.gov.ph</Text>
                <Text style={styles.contactHours}>Response within 24 hours</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>

            {faqs.map((faq, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.faqItem, index === faqs.length - 1 && expandedFaq !== index && { borderBottomWidth: 0 }]}
                onPress={() => toggleFaq(index)}
              >
                <View style={styles.faqHeader}>
                  <Text style={styles.faqQuestion}>{faq.question}</Text>
                  <Ionicons name={expandedFaq === index ? "chevron-up" : "chevron-down"} size={20} color="#6B7280" />
                </View>

                {expandedFaq === index && <Text style={styles.faqAnswer}>{faq.answer}</Text>}
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.reportButton} onPress={() => setReportModalVisible(true)}>
            <Ionicons name="bug-outline" size={20} color="#FFFFFF" />
            <Text style={styles.reportButtonText}>Report a Problem</Text>
          </TouchableOpacity>
        </ScrollView>
        {/* Report Problem Modal */}
        <Modal
          animationType="slide"
          transparent={false}
          visible={reportModalVisible}
          onRequestClose={() => setReportModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <StatusBar barStyle="light-content" backgroundColor="#1E3A8A" />
            <SafeAreaView style={styles.modalSafeArea}>
              <LinearGradient
                colors={["#1E3A8A", "#3B82F6", "#EF4444"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.modalHeader}
              >
                <TouchableOpacity style={styles.backButton} onPress={() => setReportModalVisible(false)}>
                  <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.modalHeaderTitle}>Report a Problem</Text>
                <View style={{ width: 24 }} />
              </LinearGradient>

              <ScrollView style={styles.modalContent}>
                <View style={styles.reportSection}>
                  <Text style={styles.reportLabel}>Problem Category</Text>
                  <View style={styles.categoryGrid}>
                    {[
                      "App Crashes",
                      "Login Issues",
                      "Feature Not Working",
                      "Performance Issues",
                      "Data Sync Problems",
                      "Other",
                    ].map((category) => (
                      <TouchableOpacity
                        key={category}
                        style={[styles.categoryButton, reportCategory === category && styles.selectedCategory]}
                        onPress={() => setReportCategory(category)}
                      >
                        <Text style={[styles.categoryText, reportCategory === category && styles.selectedCategoryText]}>
                          {category}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <Text style={styles.reportLabel}>Describe the Problem</Text>
                  <TextInput
                    style={styles.reportTextArea}
                    value={reportDescription}
                    onChangeText={setReportDescription}
                    placeholder="Please describe the issue you're experiencing in detail..."
                    multiline
                    numberOfLines={6}
                    textAlignVertical="top"
                  />

                  <TouchableOpacity style={styles.submitReportButton} onPress={handleReportProblem}>
                    <Ionicons name="send" size={20} color="#FFFFFF" />
                    <Text style={styles.submitReportText}>Submit Report</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </SafeAreaView>
          </View>
        </Modal>
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
    paddingTop: 20,
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
    color: "#1E3A8A",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  contactItem: {
    flexDirection: "row",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  contactIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#3B82F6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  contactDetails: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  contactValue: {
    fontSize: 14,
    color: "#1E3A8A",
    fontWeight: "500",
    marginBottom: 2,
  },
  contactHours: {
    fontSize: 12,
    color: "#6B7280",
  },
  faqItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  faqHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111827",
    flex: 1,
    paddingRight: 16,
  },
  faqAnswer: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 12,
    lineHeight: 20,
  },
  reportButton: {
    backgroundColor: "#1E3A8A",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  reportButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
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
  reportSection: {
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
  reportLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#FFFFFF",
  },
  selectedCategory: {
    backgroundColor: "#1E3A8A",
    borderColor: "#1E3A8A",
  },
  categoryText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  selectedCategoryText: {
    color: "#FFFFFF",
  },
  reportTextArea: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    backgroundColor: "#FFFFFF",
    minHeight: 120,
    marginBottom: 20,
  },
  submitReportButton: {
    backgroundColor: "#1E3A8A",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  submitReportText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
})
