"use client"

import { Ionicons } from "@expo/vector-icons"
import { useFocusEffect } from "@react-navigation/native"
import { LinearGradient } from "expo-linear-gradient"
import {
  type LocationObject,
  type LocationSubscription,
  requestForegroundPermissionsAsync,
  watchPositionAsync,
} from "expo-location"
import { useRouter } from "expo-router"
import { useCallback, useEffect, useRef, useState } from "react"
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

interface TaskData {
  id: string
  type: "URGENT" | "NORMAL" | "HIGH"
  category: string
  title: string
  description: string
  location: string
  assignedTo: string
  time: string
  status: string
  dueDate: string
  isRead: boolean
  taskId: string
  department: string
  reportedBy: string
}

export default function HomeScreen() {
  const router = useRouter()
  const scrollViewRef = useRef<ScrollView>(null)
  const [location, setLocation] = useState<LocationObject | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [isTracking, setIsTracking] = useState(false)
  const [fullScreenMapVisible, setFullScreenMapVisible] = useState(false)
  const [selectedTask, setSelectedTask] = useState<TaskData | null>(null)
  const [taskDetailModalVisible, setTaskDetailModalVisible] = useState(false)

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
    {
      id: "7",
      type: "HIGH",
      category: "Meeting Reminder",
      title: "Emergency Response Team Alpha - Monthly Briefing Tomorrow",
      description:
        "Monthly briefing for Emergency Response Team Alpha. Review of recent operations, upcoming training schedules, and equipment maintenance. All team members must attend.",
      location: "CDRRMO Conference Room",
      department: "Emergency Operations",
      reportedBy: "Operations Chief Martinez",
      assignedTo: "Team Alpha Members",
      time: "02:15 PM",
      timeAgo: "2 hours ago",
      status: "Unchecked",
      taskId: "MTG-2025-001",
      isRead: false,
    },
    {
      id: "8",
      type: "NORMAL",
      category: "Meeting Reminder",
      title: "Disaster Preparedness Workshop - Community Outreach",
      description:
        "Community outreach workshop focusing on disaster preparedness education. Training session will cover basic emergency response and evacuation procedures.",
      location: "Virtual Meeting",
      department: "Community Relations",
      reportedBy: "Community Coordinator Santos",
      assignedTo: "Training Team",
      time: "01:30 PM",
      timeAgo: "3 hours ago",
      status: "Unchecked",
      taskId: "MTG-2025-002",
      isRead: false,
    },
  ])

  const [archivedNotifications, setArchivedNotifications] = useState<Notification[]>([])

  const handleRestoreNotification = (notificationId: string) => {
    const notification = archivedNotifications.find((n) => n.id === notificationId)
    if (!notification) return

    const { archivedAt, ...restoredItem } = notification
    setNotifications((prev) => [restoredItem, ...prev])
    setArchivedNotifications((prev) => prev.filter((item) => item.id !== notificationId))
    setActiveMenuId(null)
    Alert.alert("Restored", "Notification has been restored to main list.")
  }

  // Reset scroll position when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: false })
      // Reset any active states
      setFullScreenMapVisible(false)
      setTaskDetailModalVisible(false)
      setSelectedTask(null)
      setNotificationsVisible(false)
      setNotificationDetailVisible(false)
      setSelectedNotification(null)
      setActiveMenuId(null)
    }, []),
  )

  useEffect(() => {
    async function getCurrentLocation() {
      const { status } = await requestForegroundPermissionsAsync()
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied")
        return
      }

      setIsTracking(true)
      return watchPositionAsync(
        {
          timeInterval: 5000,
          distanceInterval: 10,
        },
        (fetchedLocation) => {
          setLocation(fetchedLocation)
          sendLocationToServer(fetchedLocation)
        },
      )
    }

    let watch: LocationSubscription | undefined
    getCurrentLocation().then((locationSubscription) => {
      watch = locationSubscription
    })

    return () => {
      if (watch) {
        watch.remove()
      }
      setIsTracking(false)
    }
  }, [])

  const sendLocationToServer = async (currentLocation: LocationObject) => {
    try {
      const response = await fetch("http://192.168.45.5/location", {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          timestamp: new Date().toISOString(),
        }),
      })

      if (!response.ok) {
        console.log(`Error: ${response.status}`)
      }
    } catch (error) {
      console.log("Network error:", error)
    }
  }

  const getUnreadNotificationsCount = () => {
    return notifications.filter((n) => !n.isRead).length
  }

  const handleNotificationClick = (notification: Notification) => {
    // Mark notification as read when clicked
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

    // Add to archived items
    setArchivedNotifications((prev) => [archivedItem, ...prev])

    // Remove from notifications list
    setNotifications((prev) => prev.filter((item) => item.id !== notificationId))

    setActiveMenuId(null)
    Alert.alert("Archived", "Notification has been moved to archived section.")
  }

  const handleDeleteNotification = (notificationId: string) => {
    Alert.alert("Delete Notification", "Are you sure you want to permanently delete this notification?", [
      { text: "Cancel", style: "cancel", onPress: () => setActiveMenuId(null) },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          setNotifications((prev) => prev.filter((item) => item.id !== notificationId))
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

  const handleMapClick = () => {
    setFullScreenMapVisible(true)
  }

  const handleBackFromFullScreen = () => {
    setFullScreenMapVisible(false)
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E3A8A" translucent={false} hidden={false} />

      {/* Updated Header with Notification Bell */}
      <View style={styles.headerContainer}>
        <LinearGradient
          colors={["#1E3A8A", "#3B82F6", "#EF4444"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.headerGradient}
        >
          <SafeAreaView style={styles.headerSafeArea}>
            <View style={styles.headerContent}>
              <View style={styles.headerLeft}>
                <View style={styles.logoContainer}>
                  <View style={styles.logoCircle}>
                    <Ionicons name="shield" size={24} color="#FFFFFF" />
                  </View>
                  <Text style={styles.logoText}>CDRRMO</Text>
                </View>
              </View>
              <View style={styles.headerRight}>
                {/* Notification Bell Button */}
                <TouchableOpacity style={styles.notificationButton} onPress={() => setNotificationsVisible(true)}>
                  <View style={styles.notificationIconContainer}>
                    <Ionicons name="notifications" size={20} color="#FFFFFF" />
                    {getUnreadNotificationsCount() > 0 && (
                      <View style={styles.notificationBadge}>
                        <Text style={styles.notificationBadgeText}>
                          {getUnreadNotificationsCount() > 99 ? "99+" : getUnreadNotificationsCount()}
                        </Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.profileButton}>
                  <View style={styles.profileCircle}>
                    <Ionicons name="person" size={20} color="#FFFFFF" />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </LinearGradient>

        {/* Curved bottom part */}
        <View style={styles.curvedBottom} />
      </View>

      {/* Content with proper spacing */}
      <View style={styles.contentWrapper}>
        <ScrollView
          ref={scrollViewRef}
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.greetingContainer}>
            <Text style={styles.greeting}>Hello, {"{Name}"}!</Text>
            <View style={styles.separator} />
          </View>

          {/* Personnel Tracking Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PERSONNEL TRACKING</Text>
            <View style={styles.metricsGrid}>
              <View style={styles.metricCard}>
                <View style={[styles.iconContainer, { backgroundColor: "#3B82F6" }]}>
                  <Ionicons name="people" size={16} color="white" />
                </View>
                <Text style={styles.metricLabel}>Total Staff</Text>
                <Text style={styles.metricValue}>10</Text>
              </View>

              <View style={styles.metricCard}>
                <View style={[styles.iconContainer, { backgroundColor: "#10B981" }]}>
                  <Ionicons name="checkmark-circle" size={16} color="white" />
                </View>
                <Text style={styles.metricLabel}>Active</Text>
                <Text style={styles.metricValue}>5</Text>
              </View>

              <View style={styles.metricCard}>
                <View style={[styles.iconContainer, { backgroundColor: "#F59E0B" }]}>
                  <Ionicons name="time" size={16} color="white" />
                </View>
                <Text style={styles.metricLabel}>On Duty</Text>
                <Text style={styles.metricValue}>5</Text>
              </View>

              <View style={styles.metricCard}>
                <View style={[styles.iconContainer, { backgroundColor: "#8B5CF6" }]}>
                  <Ionicons name="location" size={16} color="white" />
                </View>
                <Text style={styles.metricLabel}>On-site</Text>
                <Text style={styles.metricValue}>4</Text>
              </View>
            </View>
          </View>

          {/* Map Placeholder */}
          <TouchableOpacity style={styles.mapContainer} onPress={handleMapClick} activeOpacity={0.8}>
            <View style={styles.mapPlaceholder}>
              <Ionicons name="map" size={48} color="#9CA3AF" />
              <Text style={styles.mapPlaceholderText}>Interactive Map</Text>
              {location && (
                <View style={styles.currentLocation}>
                  <Text style={styles.coordinateText}>
                    Current: {location.coords.latitude.toFixed(6)}, {location.coords.longitude.toFixed(6)}
                  </Text>
                </View>
              )}
              <Text style={styles.mapClickHint}>Tap to open full screen map</Text>
            </View>
          </TouchableOpacity>

          {/* Active Tasks */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ACTIVE TASK</Text>
            <TouchableOpacity
              style={[styles.taskCard, { marginTop: 16 }]} // Add marginTop for spacing
              onPress={() => {
                // Show task details modal
                const taskData: TaskData = {
                  id: "4",
                  type: "URGENT",
                  category: "Emergency Response",
                  title: "Flood Response - Barangay Greenhills",
                  description:
                    "Deploy emergency response team to assist with flood evacuation and rescue operations in Barangay Greenhills.",
                  location: "Barangay Greenhills",
                  assignedTo: "Officer Alexis",
                  time: "6 hours",
                  status: "Unchecked",
                  dueDate: "1/16/2024",
                  isRead: true,
                  taskId: "SJ-OPS-2025-001",
                  department: "Emergency Operations",
                  reportedBy: "Operations Chief Martinez",
                }
                setSelectedTask(taskData)
                setTaskDetailModalVisible(true)
              }}
              activeOpacity={0.7}
            >
              <View style={styles.taskHeader}>
                <View style={styles.urgentBadge}>
                  <Text style={styles.urgentText}>URGENT</Text>
                </View>
                <Text style={styles.taskType}>Emergency Response</Text>
                <View style={styles.statusBadge}>
                  <Ionicons name="ellipse" size={10} color="#3B82F6" />
                  <Text style={styles.statusText}>IN PROGRESS</Text>
                </View>
              </View>

              <Text style={styles.taskTitle}>Flood Response - Barangay Greenhills</Text>

              <Text style={styles.taskDescription}>
                Deploy emergency response team to assist with flood evacuation and rescue operations in Barangay
                Greenhills.
              </Text>

              <View style={styles.taskFooter}>
                <View style={styles.taskLocation}>
                  <Ionicons name="location" size={14} color="#EF4444" />
                  <Text style={styles.taskLocationText}>Barangay Greenhills</Text>
                </View>

                <View style={styles.taskMeta}>
                  <View style={styles.taskTime}>
                    <Ionicons name="time-outline" size={14} color="#6B7280" />
                    <Text style={styles.taskTimeText}>6 hours</Text>
                  </View>

                  <View style={styles.taskAssigned}>
                    <Ionicons name="people-outline" size={14} color="#6B7280" />
                    <Text style={styles.taskAssignedText}>1 assigned</Text>
                  </View>

                  <View style={styles.taskDueDate}>
                    <Ionicons name="calendar-outline" size={14} color="#6B7280" />
                    <Text style={styles.taskDueDateText}>Due: 1/16/2024</Text>
                  </View>
                </View>
              </View>

              <View style={styles.tapHintContainer}>
                <Text style={styles.tapHint}>Tap for details</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.viewAllButton}
              onPress={() => {
                // Navigate to tasks screen - active tasks tab
                router.push("/tasks")
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.viewAllText}>View all tasks</Text>
              <Ionicons name="arrow-forward" size={16} color="#3B82F6" />
            </TouchableOpacity>
          </View>
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
            {/* Header with curved bottom */}
            <View style={styles.notificationModalHeaderContainer}>
              <LinearGradient
                colors={["#1E3A8A", "#3B82F6", "#EF4444"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.notificationModalHeaderGradient}
              >
                <View style={styles.notificationModalHeader}>
                  <TouchableOpacity style={styles.backButton} onPress={() => setNotificationsVisible(false)}>
                    <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                  </TouchableOpacity>
                  <Text style={styles.modalHeaderTitle}>Notifications</Text>
                  <View style={styles.headerSpacer} />
                </View>
              </LinearGradient>
              <View style={styles.notificationModalCurvedBottom} />
            </View>

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
                  {/* Notification Bell + Title */}
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Ionicons name="notifications-outline" size={20} color="#3B82F6" style={{ marginRight: 6 }} />
                    <Text style={styles.sectionTitle}>All Notifications</Text>
                  </View>

                  {/* Mark All as Read Button */}
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
                contentContainerStyle={styles.modalScrollContent}
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

                {/* Main Info Card */}
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

                {/* Quick Info Grid */}
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

                {/* Description Section */}
                <View style={styles.sectionCard}>
                  <View style={styles.sectionHeader}>
                    <Ionicons name="document-text" size={20} color="#3B82F6" />
                    <Text style={styles.sectionTitle}>Description</Text>
                  </View>
                  <Text style={styles.descriptionText}>{selectedNotification.description}</Text>
                </View>

                {/* Additional Details */}
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

      {/* Full Screen Map Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={fullScreenMapVisible}
        onRequestClose={handleBackFromFullScreen}
      >
        <View style={styles.fullScreenContainer}>
          <StatusBar barStyle="light-content" backgroundColor="#1E3A8A" />
          <SafeAreaView style={styles.fullScreenSafeArea}>
            {/* Add curved header */}
            <View style={styles.fullScreenHeaderContainer}>
              <LinearGradient
                colors={["#1E3A8A", "#3B82F6", "#EF4444"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.fullScreenHeaderGradient}
              >
                <View style={styles.fullScreenHeader}>
                  <TouchableOpacity style={styles.backButton} onPress={handleBackFromFullScreen}>
                    <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                  </TouchableOpacity>
                  <Text style={styles.fullScreenTitle}>Interactive Map</Text>
                  <View style={styles.headerSpacer} />
                </View>
              </LinearGradient>
              <View style={styles.fullScreenCurvedBottom} />
            </View>

            <View style={styles.fullScreenMapContainer}>
              <View style={styles.fullScreenMapPlaceholder}>
                <Ionicons name="map" size={80} color="#9CA3AF" />
                <Text style={styles.fullScreenMapText}>Full Screen Map</Text>
                {location && (
                  <View style={styles.fullScreenCurrentLocation}>
                    <Text style={styles.fullScreenCoordinateText}>
                      Current: {location.coords.latitude.toFixed(6)}, {location.coords.longitude.toFixed(6)}
                    </Text>
                    {isTracking && (
                      <View style={styles.trackingIndicator}>
                        <View style={styles.trackingDot} />
                        <Text style={styles.trackingText}>Live Tracking</Text>
                      </View>
                    )}
                  </View>
                )}
              </View>
            </View>
          </SafeAreaView>
        </View>
      </Modal>

      {/* Task Detail Modal */}
      {selectedTask && (
        <Modal
          animationType="slide"
          transparent={false}
          visible={taskDetailModalVisible}
          onRequestClose={() => setTaskDetailModalVisible(false)}
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
                <TouchableOpacity style={styles.backButton} onPress={() => setTaskDetailModalVisible(false)}>
                  <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.modalHeaderTitle}>Task Details</Text>
                <View style={styles.headerSpacer} />
              </LinearGradient>

              <ScrollView
                style={styles.modalContent}
                contentContainerStyle={styles.modalScrollContent}
                showsVerticalScrollIndicator={false}
              >
                {/* Main Info Card */}
                <View style={styles.mainInfoCard}>
                  <View style={styles.badgeRow}>
                    <View style={[styles.priorityBadge, { backgroundColor: "#EF4444" }]}>
                      <Text style={styles.priorityText}>URGENT</Text>
                    </View>
                    <View style={styles.categoryBadgeDetail}>
                      <Text style={styles.categoryTextDetail}>Emergency Response</Text>
                    </View>
                  </View>
                  <Text style={styles.detailTitle}>{selectedTask.title}</Text>
                  <View style={styles.readStatusRow}>
                    <View style={[styles.readStatusDot, { backgroundColor: "#10B981" }]} />
                    <Text style={styles.readStatusText}>Read</Text>
                  </View>
                </View>

                {/* Quick Info Grid */}
                <View style={styles.quickInfoGrid}>
                  <View style={styles.quickInfoItem}>
                    <Ionicons name="location" size={20} color="#EF4444" />
                    <View style={styles.quickInfoContent}>
                      <Text style={styles.quickInfoLabel}>Location</Text>
                      <Text style={styles.quickInfoValue}>{selectedTask.location}</Text>
                    </View>
                  </View>
                  <View style={styles.quickInfoItem}>
                    <Ionicons name="time" size={20} color="#3B82F6" />
                    <View style={styles.quickInfoContent}>
                      <Text style={styles.quickInfoLabel}>Duration</Text>
                      <Text style={styles.quickInfoValue}>{selectedTask.time}</Text>
                    </View>
                  </View>
                  <View style={styles.quickInfoItem}>
                    <Ionicons name="person" size={20} color="#10B981" />
                    <View style={styles.quickInfoContent}>
                      <Text style={styles.quickInfoLabel}>Assigned To</Text>
                      <Text style={styles.quickInfoValue}>{selectedTask.assignedTo}</Text>
                    </View>
                  </View>
                  <View style={styles.quickInfoItem}>
                    <Ionicons name="calendar" size={20} color="#8B5CF6" />
                    <View style={styles.quickInfoContent}>
                      <Text style={styles.quickInfoLabel}>Due Date</Text>
                      <Text style={styles.quickInfoValue}>{selectedTask.dueDate}</Text>
                    </View>
                  </View>
                </View>

                {/* Description Section */}
                <View style={styles.sectionCard}>
                  <View style={styles.sectionHeader}>
                    <Ionicons name="document-text" size={20} color="#3B82F6" />
                    <Text style={styles.sectionTitle}>Description</Text>
                  </View>
                  <Text style={styles.descriptionText}>{selectedTask.description}</Text>
                </View>

                {/* Additional Information */}
                <View style={styles.sectionCard}>
                  <View style={styles.sectionHeader}>
                    <Ionicons name="information-circle" size={20} color="#3B82F6" />
                    <Text style={styles.sectionTitle}>Additional Information</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Task ID:</Text>
                    <Text style={styles.detailValue}>{selectedTask.taskId}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Reported By:</Text>
                    <Text style={styles.detailValue}>{selectedTask.reportedBy}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Status:</Text>
                    <Text style={styles.detailValue}>{selectedTask.status}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Due Date:</Text>
                    <Text style={styles.detailValue}>{selectedTask.dueDate}</Text>
                  </View>
                </View>

                {/* Instructions */}
                <View style={styles.sectionCard}>
                  <View style={styles.sectionHeader}>
                    <Ionicons name="list" size={20} color="#3B82F6" />
                    <Text style={styles.sectionTitle}>Instructions</Text>
                  </View>
                  <View style={styles.instructionsList}>
                    <View style={styles.instructionItem}>
                      <View style={styles.instructionNumber}>
                        <Text style={styles.instructionNumberText}>1</Text>
                      </View>
                      <Text style={styles.instructionText}>Assemble at designated staging area immediately</Text>
                    </View>
                    <View style={styles.instructionItem}>
                      <View style={styles.instructionNumber}>
                        <Text style={styles.instructionNumberText}>2</Text>
                      </View>
                      <Text style={styles.instructionText}>Conduct equipment check before deployment</Text>
                    </View>
                    <View style={styles.instructionItem}>
                      <View style={styles.instructionNumber}>
                        <Text style={styles.instructionNumberText}>3</Text>
                      </View>
                      <Text style={styles.instructionText}>Establish communication protocols</Text>
                    </View>
                    <View style={styles.instructionItem}>
                      <View style={styles.instructionNumber}>
                        <Text style={styles.instructionNumberText}>4</Text>
                      </View>
                      <Text style={styles.instructionText}>Brief team on specific mission objectives</Text>
                    </View>
                  </View>
                </View>

                {/* Required Resources */}
                <View style={styles.sectionCard}>
                  <View style={styles.sectionHeader}>
                    <Ionicons name="construct" size={20} color="#3B82F6" />
                    <Text style={styles.sectionTitle}>Required Resources</Text>
                  </View>
                  <View style={styles.resourceGrid}>
                    <View style={styles.resourceItem}>
                      <Ionicons name="boat" size={16} color="#3B82F6" />
                      <Text style={styles.resourceText}>Rescue boats</Text>
                    </View>
                    <View style={styles.resourceItem}>
                      <Ionicons name="shield" size={16} color="#3B82F6" />
                      <Text style={styles.resourceText}>Life vests</Text>
                    </View>
                    <View style={styles.resourceItem}>
                      <Ionicons name="radio" size={16} color="#3B82F6" />
                      <Text style={styles.resourceText}>Communication radios</Text>
                    </View>
                    <View style={styles.resourceItem}>
                      <Ionicons name="medical" size={16} color="#3B82F6" />
                      <Text style={styles.resourceText}>First aid kits</Text>
                    </View>
                  </View>
                </View>
              </ScrollView>
            </SafeAreaView>
          </View>
        </Modal>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  // Fixed Header styles with proper curved bottom
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
  logoCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  logoText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
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
  // Fixed content wrapper
  contentWrapper: {
    flex: 1,
    marginTop: -15, // Overlap with curve
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 25, // Space from curved header
    paddingBottom: 20,
  },
  greetingContainer: {
    marginBottom: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1E3A8A",
    marginBottom: 12,
  },
  separator: {
    height: 1,
    backgroundColor: "#E5E7EB",
    width: "100%",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E3A8A",
    marginBottom: 16, // Changed from 20 to 16 for better spacing
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 8,
  },
  metricCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 12,
    width: "23%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  metricLabel: {
    fontSize: 10,
    color: "#6B7280",
    marginBottom: 4,
    textAlign: "center",
  },
  metricValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },
  mapContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mapPlaceholder: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
  },
  mapPlaceholderText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6B7280",
    marginTop: 12,
  },
  currentLocation: {
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    borderRadius: 6,
  },
  coordinateText: {
    fontSize: 10,
    color: "#3B82F6",
    fontFamily: "monospace",
  },
  mapClickHint: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 8,
    fontStyle: "italic",
  },
  // Full Screen Map Styles
  fullScreenContainer: {
    flex: 1,
    backgroundColor: "#1E3A8A",
  },
  fullScreenSafeArea: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  fullScreenHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
  },
  fullScreenTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  headerSpacer: {
    width: 40,
  },
  fullScreenMapContainer: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    marginTop: -15, // Overlap with curve
  },
  fullScreenMapPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
  },
  fullScreenMapText: {
    fontSize: 24,
    fontWeight: "600",
    color: "#6B7280",
    marginTop: 20,
  },
  fullScreenCurrentLocation: {
    marginTop: 24,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    borderRadius: 8,
    alignItems: "center",
  },
  fullScreenCoordinateText: {
    fontSize: 14,
    color: "#3B82F6",
    fontFamily: "monospace",
    marginBottom: 8,
  },
  trackingIndicator: {
    flexDirection: "row",
    alignItems: "center",
  },
  trackingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#10B981",
    marginRight: 6,
  },
  trackingText: {
    fontSize: 12,
    color: "#3B82F6",
    fontWeight: "500",
  },
  taskCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 16,
    marginTop: 16, // Add this line for spacing from section title
  },
  taskHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  urgentBadge: {
    backgroundColor: "#EF4444",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  urgentText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "600",
  },
  taskType: {
    color: "#6B7280",
    fontSize: 12,
    flex: 1,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    color: "#3B82F6",
    fontSize: 10,
    fontWeight: "500",
    marginLeft: 4,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12, // Increased from 8 to 12
  },
  taskDescription: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
    marginBottom: 20, // Increased from 16 to 20
  },
  taskFooter: {
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 16, // Increased from 12 to 16
    marginBottom: 12, // Added margin bottom
  },
  taskLocation: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  taskLocationText: {
    color: "#6B7280",
    fontSize: 12,
    marginLeft: 4,
  },
  taskMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  taskTime: {
    flexDirection: "row",
    alignItems: "center",
  },
  taskTimeText: {
    color: "#6B7280",
    fontSize: 12,
    marginLeft: 4,
  },
  taskAssigned: {
    flexDirection: "row",
    alignItems: "center",
  },
  taskAssignedText: {
    color: "#6B7280",
    fontSize: 12,
    marginLeft: 4,
  },
  taskDueDate: {
    flexDirection: "row",
    alignItems: "center",
  },
  taskDueDateText: {
    color: "#6B7280",
    fontSize: 12,
    marginLeft: 4,
  },
  tapHintContainer: {
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 12, // Increased from 8 to 12
    marginTop: 12, // Increased from 8 to 12
    alignItems: "center",
  },
  tapHint: {
    fontSize: 12,
    color: "#3B82F6",
    fontStyle: "italic",
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  viewAllText: {
    fontSize: 14,
    color: "#3B82F6",
    fontWeight: "500",
    marginRight: 4,
  },
  // Notification Modal Styles
  notificationModalHeaderContainer: {
    position: "relative",
    zIndex: 10,
  },
  notificationModalHeaderGradient: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0,
    paddingBottom: 30,
  },
  notificationModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  notificationModalCurvedBottom: {
    height: 30,
    backgroundColor: "#F9FAFB",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    zIndex: 5,
  },
  // Updated Section Header Container for Notifications Modal
  sectionHeaderContainer: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    marginTop: -15, // Overlap with curve
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 32,
    gap: 48,
  },
  // Updated Mark All Button to match tasks screen style
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
    paddingTop: 12, // Reduced from 25 to match tasks screen
    paddingBottom: 20,
  },
  // Notification Card Styles
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
  // Empty State
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
  // Archive Button
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
  // Main Info Card
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
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginLeft: 8,
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
  instructionsList: {
    gap: 12,
  },
  instructionItem: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  instructionNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#3B82F6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  instructionNumberText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  instructionText: {
    fontSize: 14,
    color: "#374151",
    flex: 1,
    lineHeight: 20,
  },
  resourceGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  resourceItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EBF8FF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  resourceText: {
    fontSize: 12,
    color: "#1E40AF",
    fontWeight: "500",
  },
  modalScrollContent: {
    paddingBottom: 40,
    flexGrow: 1,
  },
  fullScreenHeaderContainer: {
    position: "relative",
    zIndex: 10,
  },
  fullScreenHeaderGradient: {
    paddingBottom: 30,
  },
  fullScreenCurvedBottom: {
    height: 30,
    backgroundColor: "#F3F4F6",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    zIndex: 5,
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
})
