"use client"

import api from "@/lib/api"
import { useProfile } from "@/providers/ProfileProvider"
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
  TouchableOpacity,
  View,
} from "react-native"

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

export default function ProfileScreen() {
  const router = useRouter()
  const [showPhotoOptions, setShowPhotoOptions] = useState(false)
  const profile = useProfile();

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

  // Your existing handlers...
  const handlePersonalInformation = () => {
    router.push("/profile/personal-information")
  }

  const handlePrivacySecurity = () => {
    router.push("/profile/privacy-security")
  }

  const handleHelpSupport = () => {
    router.push("/profile/help-support")
  }

  const handleStatus = () => {
    router.push("/profile/status")
  }

  const confirmSignOut = async () => {
    const response = await api.delete('/logout');

    if (response.status === 200) router.navigate('/');
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

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1B2560" translucent={false} hidden={false} />

      <ScrollView style={styles.content}>
        <View style={styles.profileCard}>
          <View style={styles.avatarWrapper}>
            <Ionicons name="person" size={80} color="#3B82F6" />
          </View>
          <Text style={styles.userName}>{profile.first_name} {profile.surname.charAt(0).toUpperCase()}.</Text>
          <Text style={styles.userRole}>{profile.position ?? 'CDRRMO Personnel'}</Text>
        </View>

        <View style={styles.menuSection}>
          <TouchableOpacity style={styles.menuItem} onPress={handleStatus}>
            <Ionicons name="radio-button-on" size={24} color="#6B7280" />
            <Text style={styles.menuText}>Status</Text>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handlePersonalInformation}>
            <Ionicons name="person-outline" size={24} color="#6B7280" />
            <Text style={styles.menuText}>Personal Information</Text>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handlePrivacySecurity}>
            <Ionicons name="shield-outline" size={24} color="#6B7280" />
            <Text style={styles.menuText}>Account Password</Text>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuItem, styles.logoutItem]} onPress={handleSignOut}>
            <Ionicons name="log-out-outline" size={24} color="#EF4444" />
            <Text style={[styles.menuText, styles.logoutText]}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Notifications Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={notificationsVisible}
        onRequestClose={() => setNotificationsVisible(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: "#1B2560" }]}>
          <StatusBar barStyle="light-content" backgroundColor="#1B2560" />
          <SafeAreaView style={styles.modalSafeArea}>
            <LinearGradient
              colors={["#1B2560", "#FF4D4D"]}
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
          <View style={[styles.modalContainer, { backgroundColor: "#1B2560" }]}>
            <StatusBar barStyle="light-content" backgroundColor="#1B2560" />
            <SafeAreaView style={styles.modalSafeArea}>
              <LinearGradient
                colors={["#1B2560", "#FF4D4D"]}
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
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  // Header styles with curved bottom
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
    paddingTop: Platform.OS === "ios" ? 16 : 16,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  // Updated logo styles - made bigger
  logoCircle: {
    width: 48, // Increased from 40
    height: 48, // Increased from 40
    borderRadius: 24, // Increased from 20
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  logoText: {
    color: "white",
    fontSize: 20, // Increased from 18
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
    marginTop: 5, // Changed from -15 to 5 to prevent curve cutoff
  },
  // Updated profile card with rounded top corners
  profileCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderTopLeftRadius: 20, // Added specific top corner radius
    borderTopRightRadius: 20, // Added specific top corner radius
    padding: 24,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginTop: 15, // Changed from 5 to 15 for better spacing
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
    overflow: "visible",
  },
  cameraIconContainer: {
    position: "absolute",
    bottom: -2,
    right: -2,
    backgroundColor: "#3B82F6",
    width: 28,
    height: 28,
    borderRadius: 14,
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
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  modalContentContainer: {
    paddingBottom: 40,
    flexGrow: 1,
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginLeft: 8,
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
  categoryText: {
    color: "#6B7280",
    fontSize: 12,
    marginLeft: 4,
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
  timeText: {
    fontSize: 12,
    color: "#6B7280",
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
})
