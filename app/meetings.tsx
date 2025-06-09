"use client"

import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { useState } from "react"
import {
    Linking,
    Modal,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native"

interface Meeting {
  id: string
  type: "URGENT" | "NORMAL" | "HIGH" | "MEDIUM" | "LOW"
  category: "Team Meeting" | "Training Session" | "Emergency Planning" | "Procurement Meeting"
  code: string
  title: string
  description: string
  date: string
  time: string
  format: "virtual" | "in-person"
  location?: string
  meetingLink?: string
  meetingId?: string
  passcode?: string
  department: string
  organizedBy: string
  assignedTo: string
  status: "Checked" | "Unchecked"
  attendees: number
}

export default function MeetingsScreen() {
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null)
  const [meetingDetailVisible, setMeetingDetailVisible] = useState(false)

  const meetings: Meeting[] = [
    {
      id: "1",
      type: "URGENT",
      category: "Team Meeting",
      code: "MTG-2025-001",
      title: "Emergency Response Team Alpha - Monthly Briefing",
      description:
        "Monthly briefing for Emergency Response Team Alpha. Review of recent operations, upcoming training schedules, and equipment maintenance. All team members must attend to discuss response protocols and coordination procedures.",
      date: "June 5, 2025",
      time: "9:00 AM - 11:00 AM",
      format: "in-person",
      location: "CDRRMO Conference Room",
      department: "Emergency Operations",
      organizedBy: "Operations Chief Martinez",
      assignedTo: "Team Alpha Leader",
      status: "Checked",
      attendees: 12,
    },
    {
      id: "2",
      type: "NORMAL",
      category: "Training Session",
      code: "MTG-2025-002",
      title: "Disaster Preparedness Workshop - Community Outreach",
      description:
        "Community outreach workshop focusing on disaster preparedness education. Training session will cover basic emergency response, evacuation procedures, and community coordination during disasters.",
      date: "June 3, 2025",
      time: "2:00 PM - 4:00 PM",
      format: "virtual",
      meetingLink: "https://zoom.us/j/12345678990",
      meetingId: "123 456 7890",
      passcode: "CDRRMO2025",
      department: "Community Relations",
      organizedBy: "Community Coordinator Santos",
      assignedTo: "Training Team Lead",
      status: "Checked",
      attendees: 8,
    },
    {
      id: "3",
      type: "MEDIUM",
      category: "Procurement Meeting",
      code: "MTG-2025-003",
      title: "PTV Procurement Meeting",
      description: "Discussion on procurement of new emergency vehicles and equipment for the department.",
      date: "Tomorrow",
      time: "4:00 PM",
      format: "in-person",
      location: "CDRRMO Main Office",
      department: "Administration",
      organizedBy: "Procurement Officer",
      assignedTo: "Fleet Manager",
      status: "Unchecked",
      attendees: 6,
    },
    {
      id: "4",
      type: "HIGH",
      category: "Emergency Planning",
      code: "MTG-2025-004",
      title: "Flood Season Preparedness Planning",
      description:
        "Strategic planning session for upcoming flood season. Review evacuation routes, resource allocation, and coordination with local government units.",
      date: "June 8, 2025",
      time: "10:00 AM - 12:00 PM",
      format: "virtual",
      meetingLink: "https://zoom.us/j/98765432100",
      meetingId: "987 654 3210",
      passcode: "FLOOD2025",
      department: "Emergency Planning",
      organizedBy: "Planning Director",
      assignedTo: "Emergency Coordinators",
      status: "Unchecked",
      attendees: 15,
    },
  ]

  const handleMeetingClick = (meeting: Meeting) => {
    setSelectedMeeting(meeting)
    setMeetingDetailVisible(true)
  }

  const handleJoinMeeting = () => {
    if (selectedMeeting?.meetingLink) {
      Linking.openURL(selectedMeeting.meetingLink)
    }
  }

  const handleCopyLink = () => {
    console.log("Copied meeting link:", selectedMeeting?.meetingLink)
  }

  const getPriorityColor = (type: string) => {
    switch (type) {
      case "URGENT":
        return "#EF4444"
      case "HIGH":
        return "#F59E0B"
      case "NORMAL":
        return "#3B82F6"
      case "MEDIUM":
        return "#10B981"
      case "LOW":
        return "#6B7280"
      default:
        return "#6B7280"
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
            <TouchableOpacity style={styles.profileButton}>
              <View style={styles.profileCircle}>
                <Ionicons name="person" size={20} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <View style={styles.titleContainer}>
          <Text style={styles.screenTitle}>Meetings</Text>
          <Text style={styles.meetingCount}>{meetings.length} scheduled</Text>
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {meetings.map((meeting) => (
            <TouchableOpacity
              key={meeting.id}
              style={styles.meetingCard}
              onPress={() => handleMeetingClick(meeting)}
              activeOpacity={0.7}
            >
              <View style={styles.meetingHeader}>
                <View style={styles.meetingHeaderLeft}>
                  <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(meeting.type) }]}>
                    <Text style={styles.priorityText}>{meeting.type}</Text>
                  </View>
                  <Text style={styles.categoryText}>{meeting.category}</Text>
                </View>
                <View style={styles.formatBadge}>
                  <Ionicons
                    name={meeting.format === "virtual" ? "videocam" : "location"}
                    size={14}
                    color={meeting.format === "virtual" ? "#3B82F6" : "#6B7280"}
                  />
                  <Text style={[styles.formatText, { color: meeting.format === "virtual" ? "#3B82F6" : "#6B7280" }]}>
                    {meeting.format === "virtual" ? "Virtual" : "In-Person"}
                  </Text>
                </View>
              </View>

              <Text style={styles.meetingTitle}>{meeting.title}</Text>
              <Text style={styles.meetingCode}>{meeting.code}</Text>

              <View style={styles.meetingTimeInfo}>
                <View style={styles.timeContainer}>
                  <Ionicons name="calendar-outline" size={16} color="#6B7280" />
                  <Text style={styles.dateText}>{meeting.date}</Text>
                </View>
                <View style={styles.timeContainer}>
                  <Ionicons name="time-outline" size={16} color="#6B7280" />
                  <Text style={styles.timeText}>{meeting.time}</Text>
                </View>
              </View>

              <View style={styles.meetingFooter}>
                <View style={styles.attendeesContainer}>
                  <Ionicons name="people-outline" size={16} color="#6B7280" />
                  <Text style={styles.attendeesText}>{meeting.attendees} attendees</Text>
                </View>
                <Text style={styles.organizerText}>by {meeting.organizedBy}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Meeting Detail Modal */}
        <Modal
          animationType="slide"
          transparent={false}
          visible={meetingDetailVisible}
          onRequestClose={() => setMeetingDetailVisible(false)}
        >
          {selectedMeeting && (
            <View style={styles.modalContainer}>
              <StatusBar barStyle="light-content" backgroundColor="#1E3A8A" />
              <SafeAreaView style={styles.modalSafeArea}>
                <LinearGradient
                  colors={["#1E3A8A", "#3B82F6", "#EF4444"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.modalHeader}
                >
                  <TouchableOpacity style={styles.backButton} onPress={() => setMeetingDetailVisible(false)}>
                    <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                  </TouchableOpacity>
                  <Text style={styles.modalHeaderTitle}>Meeting Details</Text>
                  <View style={styles.headerSpacer} />
                </LinearGradient>

                <ScrollView
                  style={styles.modalContent}
                  contentContainerStyle={styles.modalContentContainer}
                  showsVerticalScrollIndicator={false}
                >
                  {/* Meeting Header Info */}
                  <View style={styles.modalMeetingHeader}>
                    <View style={styles.modalHeaderRow}>
                      <View
                        style={[styles.modalPriorityBadge, { backgroundColor: getPriorityColor(selectedMeeting.type) }]}
                      >
                        <Text style={styles.modalPriorityText}>{selectedMeeting.type}</Text>
                      </View>
                      <Text style={styles.modalCategory}>{selectedMeeting.category}</Text>
                    </View>
                    <Text style={styles.modalTitle}>{selectedMeeting.title}</Text>
                    <Text style={styles.modalCode}>{selectedMeeting.code}</Text>
                  </View>

                  {/* Date & Time */}
                  <View style={styles.infoSection}>
                    <Text style={styles.sectionTitle}>Schedule</Text>
                    <View style={styles.infoCard}>
                      <View style={styles.infoRow}>
                        <Ionicons name="calendar" size={20} color="#3B82F6" />
                        <Text style={styles.infoLabel}>Date</Text>
                        <Text style={styles.infoValue}>{selectedMeeting.date}</Text>
                      </View>
                      <View style={styles.infoRow}>
                        <Ionicons name="time" size={20} color="#3B82F6" />
                        <Text style={styles.infoLabel}>Time</Text>
                        <Text style={styles.infoValue}>{selectedMeeting.time}</Text>
                      </View>
                    </View>
                  </View>

                  {/* Meeting Format & Location */}
                  <View style={styles.infoSection}>
                    <Text style={styles.sectionTitle}>Meeting Format</Text>
                    <View style={styles.infoCard}>
                      <View style={styles.formatRow}>
                        <Ionicons
                          name={selectedMeeting.format === "virtual" ? "videocam" : "location"}
                          size={24}
                          color={selectedMeeting.format === "virtual" ? "#3B82F6" : "#6B7280"}
                        />
                        <Text style={styles.formatTitle}>
                          {selectedMeeting.format === "virtual" ? "Virtual Meeting" : "In-Person Meeting"}
                        </Text>
                      </View>

                      {selectedMeeting.format === "virtual" ? (
                        <View style={styles.virtualDetails}>
                          <View style={styles.infoRow}>
                            <Ionicons name="link" size={16} color="#6B7280" />
                            <Text style={styles.infoLabel}>Meeting Link</Text>
                          </View>
                          <Text style={styles.linkText}>{selectedMeeting.meetingLink}</Text>

                          <View style={styles.virtualActions}>
                            <TouchableOpacity style={styles.joinButton} onPress={handleJoinMeeting}>
                              <Ionicons name="videocam" size={16} color="#FFFFFF" />
                              <Text style={styles.joinButtonText}>Join Meeting</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.copyButton} onPress={handleCopyLink}>
                              <Ionicons name="copy" size={16} color="#6B7280" />
                              <Text style={styles.copyButtonText}>Copy Link</Text>
                            </TouchableOpacity>
                          </View>

                          <View style={styles.meetingCredentials}>
                            <View style={styles.credentialRow}>
                              <Text style={styles.credentialLabel}>Meeting ID:</Text>
                              <Text style={styles.credentialValue}>{selectedMeeting.meetingId}</Text>
                            </View>
                            <View style={styles.credentialRow}>
                              <Text style={styles.credentialLabel}>Passcode:</Text>
                              <Text style={styles.credentialValue}>{selectedMeeting.passcode}</Text>
                            </View>
                          </View>
                        </View>
                      ) : (
                        <View style={styles.locationDetails}>
                          <View style={styles.infoRow}>
                            <Ionicons name="location" size={16} color="#6B7280" />
                            <Text style={styles.infoLabel}>Location</Text>
                            <Text style={styles.infoValue}>{selectedMeeting.location}</Text>
                          </View>
                        </View>
                      )}
                    </View>
                  </View>

                  {/* Organization Details */}
                  <View style={styles.infoSection}>
                    <Text style={styles.sectionTitle}>Organization</Text>
                    <View style={styles.infoCard}>
                      <View style={styles.infoRow}>
                        <Ionicons name="business" size={20} color="#6B7280" />
                        <Text style={styles.infoLabel}>Department</Text>
                        <Text style={styles.infoValue}>{selectedMeeting.department}</Text>
                      </View>
                      <View style={styles.infoRow}>
                        <Ionicons name="person" size={20} color="#6B7280" />
                        <Text style={styles.infoLabel}>Organized By</Text>
                        <Text style={styles.infoValue}>{selectedMeeting.organizedBy}</Text>
                      </View>
                      <View style={styles.infoRow}>
                        <Ionicons name="people" size={20} color="#6B7280" />
                        <Text style={styles.infoLabel}>Attendees</Text>
                        <Text style={styles.infoValue}>{selectedMeeting.attendees} people</Text>
                      </View>
                    </View>
                  </View>

                  {/* Description */}
                  <View style={styles.infoSection}>
                    <Text style={styles.sectionTitle}>Description</Text>
                    <View style={styles.descriptionCard}>
                      <Text style={styles.descriptionText}>{selectedMeeting.description}</Text>
                    </View>
                  </View>
                </ScrollView>
              </SafeAreaView>
            </View>
          )}
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
  titleContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    backgroundColor: "white",
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
  },
  meetingCount: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 32,
  },
  meetingCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  meetingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  meetingHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  priorityText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "600",
  },
  categoryText: {
    fontSize: 12,
    color: "#6B7280",
    flex: 1,
  },
  formatBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  formatText: {
    fontSize: 10,
    fontWeight: "500",
    marginLeft: 4,
  },
  meetingTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
    lineHeight: 22,
  },
  meetingCode: {
    fontSize: 12,
    color: "#3B82F6",
    fontWeight: "500",
    marginBottom: 12,
  },
  meetingTimeInfo: {
    marginBottom: 12,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  dateText: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "500",
    marginLeft: 8,
  },
  timeText: {
    fontSize: 14,
    color: "#6B7280",
    marginLeft: 8,
  },
  meetingFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingTop: 12,
  },
  attendeesContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  attendeesText: {
    fontSize: 12,
    color: "#6B7280",
    marginLeft: 6,
  },
  organizerText: {
    fontSize: 12,
    color: "#6B7280",
    fontStyle: "italic",
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
  backButton: {
    padding: 8,
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
  },
  modalContentContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 40,
  },
  modalMeetingHeader: {
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
  modalHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  modalPriorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 12,
  },
  modalPriorityText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  modalCategory: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
    lineHeight: 28,
  },
  modalCode: {
    fontSize: 14,
    color: "#3B82F6",
    fontWeight: "500",
  },
  infoSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: "#6B7280",
    marginLeft: 12,
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "500",
  },
  formatRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  formatTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginLeft: 12,
  },
  virtualDetails: {
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingTop: 16,
  },
  linkText: {
    fontSize: 14,
    color: "#3B82F6",
    marginBottom: 16,
    marginLeft: 28,
  },
  virtualActions: {
    flexDirection: "row",
    marginBottom: 16,
    gap: 12,
  },
  joinButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3B82F6",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    flex: 1,
    justifyContent: "center",
  },
  joinButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 6,
  },
  copyButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    flex: 1,
    justifyContent: "center",
  },
  copyButtonText: {
    color: "#6B7280",
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 6,
  },
  meetingCredentials: {
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    padding: 12,
  },
  credentialRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  credentialLabel: {
    fontSize: 12,
    color: "#6B7280",
  },
  credentialValue: {
    fontSize: 12,
    color: "#111827",
    fontWeight: "500",
    fontFamily: "monospace",
  },
  locationDetails: {
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingTop: 16,
  },
  descriptionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  descriptionText: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 22,
  },
})
