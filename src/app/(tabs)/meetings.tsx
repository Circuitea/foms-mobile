"use client"

import { Ionicons } from "@expo/vector-icons"
import { useFocusEffect } from "@react-navigation/native"
import { LinearGradient } from "expo-linear-gradient"
import { useCallback, useRef, useState } from "react"
import {
  Alert,
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

interface Notification {
  id: string
  type: "URGENT" | "NORMAL" | "HIGH"
  category:
    | "Team Deployment"
    | "Meeting Notice"
    | "Equipment Alert"
    | "Emergency Response"
    | "Maintenance"
    | "Assessment"
    | "Meeting Reminder"
  title: string
  description: string
  location: string
  department?: string
  reportedBy?: string
  assignedTo?: string
  assignedCount?: number
  time: string
  timeAgo: string
  status: "Checked" | "Unchecked"
  taskId?: string
  dueDate?: string
  isRead?: boolean
  archivedAt?: string
}

export default function MeetingsScreen() {
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null)
  const [meetingDetailVisible, setMeetingDetailVisible] = useState(false)

  // Notification states
  const [notificationsVisible, setNotificationsVisible] = useState(false)
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)
  const [notificationDetailVisible, setNotificationDetailVisible] = useState(false)
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"all" | "archived">("all")

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "URGENT",
      category: "Team Deployment",
      title: "Emergency Response Team Alpha - Deploy to Barangay Greenhills",
      description:
        "Deploy emergency response team to assist with flood evacuation and rescue operations in Barangay Greenhills.",
      location: "Barangay Greenhills",
      department: "Emergency Operations",
      reportedBy: "Operations Chief Martinez",
      assignedTo: "Team Alpha Leader",
      time: "05:44 PM",
      timeAgo: "8 minutes ago",
      status: "Checked",
      taskId: "SJ-OPS-2025-001",
      isRead: false,
    },
    {
      id: "2",
      type: "NORMAL",
      category: "Meeting Notice",
      title: "Staff Meeting - Post-Incident Review scheduled for 3:00 PM",
      description: "Conduct post-incident review meeting to discuss recent emergency response operations.",
      location: "CDRRMO Conference Room",
      department: "Administration",
      reportedBy: "CDRRMO Director",
      time: "05:07 PM",
      timeAgo: "45 minutes ago",
      status: "Checked",
      isRead: true,
    },
    {
      id: "3",
      type: "NORMAL",
      category: "Equipment Alert",
      title: "Equipment Maintenance - Rescue Vehicle Unit 3",
      description:
        "Perform scheduled maintenance on Rescue Vehicle Unit 3 including engine check and equipment inventory.",
      location: "CDRRMO Motor Pool",
      department: "Maintenance",
      reportedBy: "Fleet Manager",
      time: "04:30 PM",
      timeAgo: "1 hour ago",
      status: "Unchecked",
      taskId: "SJ-MAINT-2025-003",
      isRead: false,
    },
  ])

  const [archivedNotifications, setArchivedNotifications] = useState<Notification[]>([])

  const scrollViewRef = useRef<ScrollView>(null)

  // Reset scroll position and states when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: false })
      // Reset any active states
      setMeetingDetailVisible(false)
      setSelectedMeeting(null)
      setNotificationsVisible(false)
      setNotificationDetailVisible(false)
      setSelectedNotification(null)
      setActiveMenuId(null)
    }, []),
  )

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

  const getUnreadNotificationsCount = () => {
    return notifications.filter((n) => !n.isRead).length
  }

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      setNotifications((prev) => prev.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n)))
    }
    setSelectedNotification({ ...notification, isRead: true })
    setNotificationDetailVisible(true)
  }

  const handleArchiveNotification = (notificationId: string) => {
    const notification = notifications.find((n) => n.id === notificationId)
    if (!notification) return

    const archivedItem = {
      ...notification,
      archivedAt: new Date().toLocaleString(),
    }

    setArchivedNotifications((prev) => [archivedItem, ...prev])
    setNotifications((prev) => prev.filter((item) => item.id !== notificationId))
    setActiveMenuId(null)
    Alert.alert("Archived", "Notification has been moved to archived section.")
  }

  const handleRestoreNotification = (notificationId: string) => {
    const notification = archivedNotifications.find((n) => n.id === notificationId)
    if (!notification) return

    const { archivedAt, ...restoredItem } = notification
    setNotifications((prev) => [restoredItem, ...prev])
    setArchivedNotifications((prev) => prev.filter((item) => item.id !== notificationId))
    setActiveMenuId(null)
    Alert.alert("Restored", "Notification has been restored to main list.")
  }

  const handleDeleteNotification = (notificationId: string) => {
    Alert.alert("Delete Notification", "Are you sure you want to permanently delete this notification?", [
      { text: "Cancel", style: "cancel", onPress: () => setActiveMenuId(null) },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          setNotifications((prev) => prev.filter((item) => item.id !== notificationId))
          setArchivedNotifications((prev) => prev.filter((item) => item.id !== notificationId))
          setActiveMenuId(null)
          Alert.alert("Deleted", "Notification has been permanently deleted.")
        },
      },
    ])
  }

  const handleMarkAllAsRead = () => {
    const unreadCount = getUnreadNotificationsCount()
    if (unreadCount === 0) {
      Alert.alert("Mark All as Read", "All notifications are already marked as read.")
      return
    }

    Alert.alert("Mark All as Read", `Mark all ${unreadCount} unread notifications as read?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Mark All as Read",
        onPress: () => {
          setNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })))
        },
      },
    ])
  }

  const renderNotification = (notification: Notification, isArchived = false) => (
    <TouchableOpacity
      key={notification.id}
      style={[styles.notificationCard, !notification.isRead && styles.unreadCard]}
      onPress={() => handleNotificationClick(notification)}
      activeOpacity={0.7}
    >
      <View style={styles.notificationHeader}>
        <View style={styles.notificationLeft}>
          <View style={[styles.statusIndicator, { backgroundColor: notification.isRead ? "#9CA3AF" : "#3B82F6" }]} />
          <View
            style={[
              styles.typeBadge,
              {
                backgroundColor:
                  notification.type === "URGENT" ? "#EF4444" : notification.type === "HIGH" ? "#F59E0B" : "#1E3A8A",
              },
            ]}
          >
            <Text style={styles.typeText}>{notification.type}</Text>
          </View>
          <View style={styles.categoryBadge}>
            <Ionicons
              name={
                notification.category === "Team Deployment"
                  ? "people"
                  : notification.category === "Meeting Notice" || notification.category === "Meeting Reminder"
                    ? "calendar"
                    : "construct"
              }
              size={16}
              color="#6B7280"
            />
            <Text style={styles.categoryText}>{notification.category}</Text>
          </View>
          {notification.taskId && <Text style={styles.taskId}>{notification.taskId}</Text>}
        </View>
        <TouchableOpacity onPress={() => setActiveMenuId(activeMenuId === notification.id ? null : notification.id)}>
          <Ionicons name="ellipsis-vertical" size={20} color="#9CA3AF" />
        </TouchableOpacity>
        {activeMenuId === notification.id && (
          <View style={styles.dropdownMenu}>
            {isArchived ? (
              <TouchableOpacity style={styles.dropdownItem} onPress={() => handleRestoreNotification(notification.id)}>
                <Ionicons name="refresh-outline" size={16} color="#10B981" />
                <Text style={[styles.dropdownText, { color: "#10B981" }]}>Restore</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.dropdownItem} onPress={() => handleArchiveNotification(notification.id)}>
                <Ionicons name="archive-outline" size={16} color="#6B7280" />
                <Text style={styles.dropdownText}>Archive</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.dropdownItem} onPress={() => handleDeleteNotification(notification.id)}>
              <Ionicons name="trash-outline" size={16} color="#EF4444" />
              <Text style={[styles.dropdownText, { color: "#EF4444" }]}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <Text style={styles.notificationTitle}>{notification.title}</Text>

      {notification.department && (
        <View style={styles.notificationDetails}>
          <Text style={styles.detailText}>Location: {notification.location}</Text>
          <Text style={styles.detailText}>Department: {notification.department}</Text>
          {notification.reportedBy && <Text style={styles.detailText}>Reported by: {notification.reportedBy}</Text>}
        </View>
      )}

      {notification.assignedTo && (
        <View style={styles.assignedSection}>
          <Text style={styles.assignedLabel}>Assigned to: </Text>
          <Text style={styles.assignedValue}>{notification.assignedTo}</Text>
        </View>
      )}

      <View style={styles.notificationFooter}>
        <Text style={styles.timeText}>
          {notification.time} {notification.timeAgo && `(${notification.timeAgo})`}
        </Text>
        <Text style={styles.tapHint}>Tap for details</Text>
      </View>
    </TouchableOpacity>
  )

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

      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <View style={styles.titleWithIcon}>
            <Ionicons name="calendar" size={24} color="#1E3A8A" />
            <Text style={styles.screenTitle}>Meetings</Text>
          </View>
          <Text style={styles.meetingCount}>{meetings.length} scheduled</Text>
        </View>

        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
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
      </View>

      {/* Notifications Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={notificationsVisible}
        onRequestClose={() => setNotificationsVisible(false)}
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
              <TouchableOpacity style={styles.backButton} onPress={() => setNotificationsVisible(false)}>
                <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <Text style={styles.modalHeaderTitle}>Notifications</Text>
              <View style={styles.headerSpacer} />
            </LinearGradient>

            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[styles.tab, activeTab === "all" && styles.activeTab]}
                onPress={() => setActiveTab("all")}
              >
                <Ionicons name="notifications-outline" size={20} color={activeTab === "all" ? "#3B82F6" : "#6B7280"} />
                <Text style={[styles.tabText, activeTab === "all" && styles.activeTabText]}>
                  All ({notifications.length})
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, activeTab === "archived" && styles.activeTab]}
                onPress={() => setActiveTab("archived")}
              >
                <Ionicons name="archive-outline" size={20} color={activeTab === "archived" ? "#3B82F6" : "#6B7280"} />
                <Text style={[styles.tabText, activeTab === "archived" && styles.activeTabText]}>
                  Archived ({archivedNotifications.length})
                </Text>
              </TouchableOpacity>
            </View>

            {activeTab === "all" && (
              <View style={styles.sectionHeaderContainer}>
                <View style={styles.sectionHeader}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Ionicons name="notifications-outline" size={20} color="#3B82F6" style={{ marginRight: 6 }} />
                    <Text style={styles.sectionTitle}>All Notifications</Text>
                  </View>
                  {notifications.length > 0 && (
                    <TouchableOpacity style={styles.markAllButton} onPress={handleMarkAllAsRead}>
                      <Ionicons name="checkmark-done" size={16} color="#3B82F6" />
                      <Text style={styles.markAllButtonText}>Mark All as Read</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}

            <View style={styles.notificationModalContent}>
              <TouchableOpacity activeOpacity={1} onPress={() => setActiveMenuId(null)} style={{ flex: 1 }}>
                <ScrollView
                  style={styles.notificationScrollView}
                  contentContainerStyle={styles.notificationScrollContent}
                  showsVerticalScrollIndicator={false}
                >
                  {activeTab === "all" ? (
                    notifications.length === 0 ? (
                      <View style={styles.emptyState}>
                        <Ionicons name="notifications-off" size={64} color="#9CA3AF" />
                        <Text style={styles.emptyStateTitle}>No Notifications</Text>
                        <Text style={styles.emptyStateText}>You're all caught up!</Text>
                      </View>
                    ) : (
                      notifications.map((notification) => renderNotification(notification, false))
                    )
                  ) : archivedNotifications.length === 0 ? (
                    <View style={styles.emptyState}>
                      <Ionicons name="archive" size={64} color="#9CA3AF" />
                      <Text style={styles.emptyStateTitle}>No Archived Notifications</Text>
                      <Text style={styles.emptyStateText}>Archived notifications will appear here</Text>
                    </View>
                  ) : (
                    archivedNotifications.map((notification) => renderNotification(notification, true))
                  )}
                </ScrollView>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>
      </Modal>

      {/* Notification Detail Modal */}
      {selectedNotification && (
        <Modal
          animationType="slide"
          transparent={false}
          visible={notificationDetailVisible}
          onRequestClose={() => setNotificationDetailVisible(false)}
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
                <TouchableOpacity style={styles.backButton} onPress={() => setNotificationDetailVisible(false)}>
                  <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.modalHeaderTitle}>Notification Details</Text>
                <View style={styles.headerSpacer} />
              </LinearGradient>

              <ScrollView
                style={styles.modalContent}
                contentContainerStyle={styles.modalContentContainer}
                showsVerticalScrollIndicator={false}
              >
                {!selectedNotification.archivedAt ? (
                  <TouchableOpacity
                    style={styles.archiveButton}
                    onPress={() => {
                      handleArchiveNotification(selectedNotification.id)
                      setNotificationDetailVisible(false)
                    }}
                  >
                    <Ionicons name="archive" size={20} color="#FFFFFF" />
                    <Text style={styles.archiveButtonText}>Archive</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.restoreButton}
                    onPress={() => {
                      handleRestoreNotification(selectedNotification.id)
                      setNotificationDetailVisible(false)
                    }}
                  >
                    <Ionicons name="refresh" size={20} color="#FFFFFF" />
                    <Text style={styles.restoreButtonText}>Restore</Text>
                  </TouchableOpacity>
                )}

                <View style={styles.mainInfoCard}>
                  <View style={styles.badgeRow}>
                    <View
                      style={[
                        styles.priorityBadge,
                        {
                          backgroundColor:
                            selectedNotification.type === "URGENT"
                              ? "#EF4444"
                              : selectedNotification.type === "HIGH"
                                ? "#F59E0B"
                                : "#1E3A8A",
                        },
                      ]}
                    >
                      <Text style={styles.priorityText}>{selectedNotification.type}</Text>
                    </View>
                    <View style={styles.categoryBadgeDetail}>
                      <Text style={styles.categoryTextDetail}>{selectedNotification.category}</Text>
                    </View>
                  </View>
                  <Text style={styles.detailTitle}>{selectedNotification.title}</Text>
                  <View style={styles.readStatusRow}>
                    <View
                      style={[
                        styles.readStatusDot,
                        { backgroundColor: selectedNotification.isRead ? "#10B981" : "#F59E0B" },
                      ]}
                    />
                    <Text style={styles.readStatusText}>{selectedNotification.isRead ? "Read" : "Unread"}</Text>
                  </View>
                </View>

                <View style={styles.quickInfoGrid}>
                  <View style={styles.quickInfoItem}>
                    <Ionicons name="location" size={20} color="#EF4444" />
                    <View style={styles.quickInfoContent}>
                      <Text style={styles.quickInfoLabel}>Location</Text>
                      <Text style={styles.quickInfoValue}>{selectedNotification.location}</Text>
                    </View>
                  </View>
                  <View style={styles.quickInfoItem}>
                    <Ionicons name="time" size={20} color="#3B82F6" />
                    <View style={styles.quickInfoContent}>
                      <Text style={styles.quickInfoLabel}>Time</Text>
                      <Text style={styles.quickInfoValue}>{selectedNotification.time}</Text>
                    </View>
                  </View>
                  <View style={styles.quickInfoItem}>
                    <Ionicons name="person" size={20} color="#10B981" />
                    <View style={styles.quickInfoContent}>
                      <Text style={styles.quickInfoLabel}>Assigned To</Text>
                      <Text style={styles.quickInfoValue}>{selectedNotification.assignedTo || "N/A"}</Text>
                    </View>
                  </View>
                  <View style={styles.quickInfoItem}>
                    <Ionicons name="business" size={20} color="#8B5CF6" />
                    <View style={styles.quickInfoContent}>
                      <Text style={styles.quickInfoLabel}>Department</Text>
                      <Text style={styles.quickInfoValue}>{selectedNotification.department || "N/A"}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.sectionCard}>
                  <View style={styles.sectionHeader}>
                    <Ionicons name="document-text" size={20} color="#3B82F6" />
                    <Text style={styles.sectionTitle}>Description</Text>
                  </View>
                  <Text style={styles.descriptionText}>{selectedNotification.description}</Text>
                </View>

                <View style={styles.sectionCard}>
                  <View style={styles.sectionHeader}>
                    <Ionicons name="information-circle" size={20} color="#3B82F6" />
                    <Text style={styles.sectionTitle}>Additional Information</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Task ID:</Text>
                    <Text style={styles.detailValue}>{selectedNotification.taskId || "N/A"}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Reported By:</Text>
                    <Text style={styles.detailValue}>{selectedNotification.reportedBy || "N/A"}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Status:</Text>
                    <Text style={styles.detailValue}>{selectedNotification.status}</Text>
                  </View>
                </View>
              </ScrollView>
            </SafeAreaView>
          </View>
        </Modal>
      )}

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
    paddingBottom: 30, // Increased padding for better curve
  },
  headerSafeArea: {
    backgroundColor: "transparent",
  },
  curvedBottom: {
    height: 30, // Increased height for better curve
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
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  // Updated logo styles to match profile screen
  logoCircle: {
    width: 48, // Increased from 40 to match profile
    height: 48, // Increased from 40 to match profile
    borderRadius: 24, // Increased from 20 to match profile
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  logoText: {
    color: "white",
    fontSize: 20, // Increased from 18 to match profile
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
    marginTop: -15, // Overlap with curve
  },
  titleContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    backgroundColor: "white",
    marginTop: 10, // Increased margin to create separation from curved header
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
  scrollView: {
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
  // Notification styles
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  notificationButton: {
    padding: 4,
  },
  notificationIconContainer: {
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#EF4444",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  notificationBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "bold",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 12,
    gap: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#3B82F6",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
  },
  activeTabText: {
    color: "#3B82F6",
  },
  sectionHeaderContainer: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 32,
    gap: 48,
  },
  markAllButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#3B82F6",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    minWidth: 120,
    marginLeft: 16,
  },
  markAllButtonText: {
    color: "#3B82F6",
    fontSize: 14,
    fontWeight: "500",
  },
  notificationModalContent: {
    flex: 1,
  },
  notificationScrollView: {
    flex: 1,
  },
  notificationScrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
  },
  notificationCard: {
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
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#3B82F6",
    backgroundColor: "#F8FAFC",
  },
  notificationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
    position: "relative",
  },
  notificationLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 8,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  typeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "600",
  },
  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  taskId: {
    color: "#3B82F6",
    fontSize: 12,
    fontWeight: "500",
    flexShrink: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
    lineHeight: 22,
  },
  notificationDetails: {
    marginBottom: 12,
  },
  detailText: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 4,
  },
  assignedSection: {
    flexDirection: "row",
    marginBottom: 12,
  },
  assignedLabel: {
    fontSize: 14,
    color: "#6B7280",
  },
  assignedValue: {
    fontSize: 14,
    color: "#3B82F6",
    fontWeight: "500",
  },
  notificationFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 12,
  },
  tapHint: {
    fontSize: 12,
    color: "#3B82F6",
    fontStyle: "italic",
  },
  dropdownMenu: {
    position: "absolute",
    top: 30,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
    minWidth: 120,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  dropdownText: {
    fontSize: 14,
    color: "#374151",
    marginLeft: 8,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6B7280",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
  },
  archiveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6B7280",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 20,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  archiveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  restoreButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#10B981",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 20,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  restoreButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  mainInfoCard: {
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
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
    gap: 8,
  },
  priorityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  priorityText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  categoryBadgeDetail: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  categoryTextDetail: {
    color: "#6B7280",
    fontSize: 12,
    fontWeight: "500",
  },
  detailTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    lineHeight: 28,
    marginBottom: 12,
  },
  readStatusRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  readStatusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  readStatusText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  quickInfoGrid: {
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
  quickInfoItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  quickInfoContent: {
    marginLeft: 12,
    flex: 1,
  },
  quickInfoLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 2,
  },
  quickInfoValue: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "500",
  },
  sectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  descriptionText: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 22,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  detailLabel: {
    fontSize: 14,
    color: "#6B7280",
  },
  detailValue: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "500",
  },
  titleWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
})
