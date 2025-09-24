"use client"

import { Ionicons } from "@expo/vector-icons"
import { useFocusEffect } from "@react-navigation/native"
import { LinearGradient } from "expo-linear-gradient"
import {
  type LocationObject
} from "expo-location"
import { useRouter } from "expo-router"
import { useCallback, useRef, useState } from "react"
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

  // useEffect(() => {
  //   async function sendLocationToServer(currentLocation: LocationObject) {
  //     try {
  //       await api.fetchWithAuth('/api/location', {
  //         method: 'POST',
  //         body: JSON.stringify({
  //           latitude: currentLocation.coords.latitude,
  //           longitude: currentLocation.coords.longitude,
  //           timestamp: new Date().toISOString(),
  //         }),
  //       });
  //     } catch (error) {
  //       console.error('Location update failed:', error);
  //     }
  //   };

  //   async function getCurrentLocation() {
  //     const { status } = await requestForegroundPermissionsAsync()
  //     if (status !== "granted") {
  //       setErrorMsg("Permission to access location was denied")
  //       return
  //     }

  //     setIsTracking(true)
  //     return watchPositionAsync(
  //       {
  //         accuracy: Accuracy.Highest,
  //         timeInterval: 5000,
  //         distanceInterval: 1,
  //       },
  //       (fetchedLocation) => {
  //         setLocation(fetchedLocation)
  //         sendLocationToServer(fetchedLocation)
  //       },
  //     )
  //   }

  //   let watch: LocationSubscription | undefined
  //   getCurrentLocation().then((locationSubscription) => {
  //     watch = locationSubscription
  //   });

  //   scheduleNotificationAsync({
  //     content: {
  //       title: 'Test',
  //       body: 'Test Notification',
  //     },
  //     trigger: null,
  //   });

  //   return () => {
  //     if (watch) {
  //       watch.remove()
  //     }
  //     setIsTracking(false)
  //   }
  // }, [])

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
          <View style={[styles.statusIndicator, { backgroundColor: notification.isRead ? "#9CA3AF" : "#FF4D4D" }]} />
          <View
            style={[
              styles.typeBadge,
              {
                backgroundColor:
                  notification.type === "URGENT" ? "#FF4D4D" : notification.type === "HIGH" ? "#F59E0B" : "#1B2560",
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
              <Ionicons name="trash-outline" size={16} color="#FF4D4D" />
              <Text style={[styles.dropdownText, { color: "#FF4D4D" }]}>Delete</Text>
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
      <StatusBar barStyle="light-content" backgroundColor="#1B2560" translucent={false} hidden={false} />

      {/* Content with improved spacing */}
      <View style={styles.contentWrapper}>
        <ScrollView
          ref={scrollViewRef}
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Enhanced Greeting Section */}
          <View style={styles.greetingContainer}>
            <Text style={styles.greeting}>Good Morning, Officer!</Text>
            <Text style={styles.subGreeting}>Ready to keep our community safe today</Text>
            <View style={styles.separator} />
          </View>

          {/* Enhanced Personnel Tracking Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="people-outline" size={20} color="#1B2560" />
              <Text style={styles.sectionTitle}>PERSONNEL TRACKING</Text>
            </View>
            <View style={styles.metricsGrid}>
              <View style={[styles.metricCard, styles.totalStaffCard]}>
                <View style={[styles.iconContainer, { backgroundColor: "#1B2560" }]}>
                  <Ionicons name="people" size={16} color="white" />
                </View>
                <Text style={styles.metricLabel}>Total Staff</Text>
                <Text style={styles.metricValue}>10</Text>
              </View>

              <View style={[styles.metricCard, styles.activeCard]}>
                <View style={[styles.iconContainer, { backgroundColor: "#10B981" }]}>
                  <Ionicons name="checkmark-circle" size={16} color="white" />
                </View>
                <Text style={styles.metricLabel}>Active</Text>
                <Text style={styles.metricValue}>5</Text>
              </View>

              <View style={[styles.metricCard, styles.onDutyCard]}>
                <View style={[styles.iconContainer, { backgroundColor: "#F59E0B" }]}>
                  <Ionicons name="time" size={16} color="white" />
                </View>
                <Text style={styles.metricLabel}>On Duty</Text>
                <Text style={styles.metricValue}>5</Text>
              </View>

              <View style={[styles.metricCard, styles.onSiteCard]}>
                <View style={[styles.iconContainer, { backgroundColor: "#FF4D4D" }]}>
                  <Ionicons name="location" size={16} color="white" />
                </View>
                <Text style={styles.metricLabel}>On-site</Text>
                <Text style={styles.metricValue}>4</Text>
              </View>
            </View>
          </View>

          {/* Enhanced Map Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="map-outline" size={20} color="#1B2560" />
              <Text style={styles.sectionTitle}>LIVE TRACKING MAP</Text>
            </View>
            <TouchableOpacity style={styles.mapContainer} onPress={handleMapClick} activeOpacity={0.8}>
              <View style={styles.mapPlaceholder}>
                <View style={styles.mapIconContainer}>
                  <Ionicons name="map" size={56} color="#FF4D4D" />
                </View>
                <Text style={styles.mapPlaceholderText}>Interactive Personnel Map</Text>
                <Text style={styles.mapDescription}>Real-time location tracking of all field personnel</Text>
                {location && (
                  <View style={styles.currentLocation}>
                    <View style={styles.locationIcon}>
                      <Ionicons name="location" size={16} color="#FF4D4D" />
                    </View>
                    <Text style={styles.coordinateText}>
                      Current: {location.coords.latitude.toFixed(6)}, {location.coords.longitude.toFixed(6)}
                    </Text>
                  </View>
                )}
                <View style={styles.mapActionButton}>
                  <Text style={styles.mapActionText}>Tap to open full screen</Text>
                  <Ionicons name="expand-outline" size={16} color="#FFFFFF" />
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {/* Enhanced Active Tasks Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="clipboard-outline" size={20} color="#1B2560" />
              <Text style={styles.sectionTitle}>ACTIVE TASKS</Text>
            </View>

            <TouchableOpacity
              style={styles.taskCard}
              onPress={() => {
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
                  <Ionicons name="warning" size={12} color="#FFFFFF" />
                  <Text style={styles.urgentText}>URGENT</Text>
                </View>
                <Text style={styles.taskType}>Emergency Response</Text>
                <View style={styles.statusBadge}>
                  <View style={styles.statusDot} />
                  <Text style={styles.statusText}>IN PROGRESS</Text>
                </View>
              </View>

              <Text style={styles.taskTitle}>Flood Response - Barangay Greenhills</Text>

              <Text style={styles.taskDescription}>
                Deploy emergency response team to assist with flood evacuation and rescue operations in Barangay
                Greenhills.
              </Text>

              {/* Replace the existing taskFooter section (around lines 580-610) with: */}
              <View style={styles.taskFooter}>
                <View style={styles.taskLocation}>
                  <Ionicons name="location" size={16} color="#FF4D4D" />
                  <Text style={styles.taskLocationText}>Barangay Greenhills</Text>
                </View>

                <View style={styles.taskMeta}>
                  <View style={styles.taskMetaItem}>
                    <Ionicons name="time-outline" size={14} color="#6B7280" />
                    <Text style={styles.taskMetaText}>6 hours</Text>
                  </View>

                  <View style={styles.taskMetaItem}>
                    <Ionicons name="people-outline" size={14} color="#6B7280" />
                    <Text style={styles.taskMetaText}>1 assigned</Text>
                  </View>

                  <View style={styles.taskMetaItem}>
                    <Ionicons name="calendar-outline" size={14} color="#6B7280" />
                    <Text style={styles.taskMetaText}>Due: 1/16/2024</Text>
                  </View>
                </View>

                <View style={styles.taskActionContainer}>
                  <Text style={styles.tapHint}>Tap for details</Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.viewAllButton}
              onPress={() => {
                router.push("/tasks")
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.viewAllText}>View all tasks</Text>
              <Ionicons name="arrow-forward" size={18} color="#1B2560" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      {/* Notifications Modal with Updated Colors */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={notificationsVisible}
        onRequestClose={() => setNotificationsVisible(false)}
      >
        <View style={styles.modalContainer}>
          <StatusBar barStyle="light-content" backgroundColor="#1B2560" />
          <SafeAreaView style={styles.modalSafeArea}>
            {/* Header with updated gradient */}
            <View style={styles.notificationModalHeaderContainer}>
              <LinearGradient
                colors={["#1B2560", "#FF4D4D"]}
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
                <Ionicons name="notifications-outline" size={20} color={activeTab === "all" ? "#1B2560" : "#6B7280"} />
                <Text style={[styles.tabText, activeTab === "all" && styles.activeTabText]}>
                  All ({notifications.length})
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, activeTab === "archived" && styles.activeTab]}
                onPress={() => setActiveTab("archived")}
              >
                <Ionicons name="archive-outline" size={20} color={activeTab === "archived" ? "#1B2560" : "#6B7280"} />
                <Text style={[styles.tabText, activeTab === "archived" && styles.activeTabText]}>
                  Archived ({archivedNotifications.length})
                </Text>
              </TouchableOpacity>
            </View>

            {activeTab === "all" && (
              <View style={styles.sectionHeaderContainer}>
                <View style={styles.sectionHeaderRow}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Ionicons name="notifications-outline" size={20} color="#1B2560" style={{ marginRight: 6 }} />
                    <Text style={styles.sectionTitle}>All Notifications</Text>
                  </View>

                  {notifications.length > 0 && (
                    <TouchableOpacity style={styles.markAllButton} onPress={handleMarkAllAsRead}>
                      <Ionicons name="checkmark-done" size={16} color="#1B2560" />
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

      {/* Notification Detail Modal with Updated Colors */}
      {selectedNotification && (
        <Modal
          animationType="slide"
          transparent={false}
          visible={notificationDetailVisible}
          onRequestClose={() => setNotificationDetailVisible(false)}
        >
          <View style={styles.modalContainer}>
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
                              ? "#FF4D4D"
                              : selectedNotification.type === "HIGH"
                                ? "#F59E0B"
                                : "#1B2560",
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
                    <Ionicons name="location" size={20} color="#FF4D4D" />
                    <View style={styles.quickInfoContent}>
                      <Text style={styles.quickInfoLabel}>Location</Text>
                      <Text style={styles.quickInfoValue}>{selectedNotification.location}</Text>
                    </View>
                  </View>
                  <View style={styles.quickInfoItem}>
                    <Ionicons name="time" size={20} color="#1B2560" />
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
                  <View style={styles.sectionHeaderRow}>
                    <Ionicons name="document-text" size={20} color="#1B2560" />
                    <Text style={styles.sectionTitle}>Description</Text>
                  </View>
                  <Text style={styles.descriptionText}>{selectedNotification.description}</Text>
                </View>

                {/* Additional Details */}
                <View style={styles.sectionCard}>
                  <View style={styles.sectionHeaderRow}>
                    <Ionicons name="information-circle" size={20} color="#1B2560" />
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

      {/* Full Screen Map Modal with Updated Colors */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={fullScreenMapVisible}
        onRequestClose={handleBackFromFullScreen}
      >
        <View style={styles.fullScreenContainer}>
          <StatusBar barStyle="light-content" backgroundColor="#1B2560" />
          <SafeAreaView style={styles.fullScreenSafeArea}>
            <View style={styles.fullScreenHeaderContainer}>
              <LinearGradient
                colors={["#1B2560", "#FF4D4D"]}
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
                <Ionicons name="map" size={80} color="#FF4D4D" />
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

      {/* Task Detail Modal with Updated Colors */}
      {selectedTask && (
        <Modal
          animationType="slide"
          transparent={false}
          visible={taskDetailModalVisible}
          onRequestClose={() => setTaskDetailModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <StatusBar barStyle="light-content" backgroundColor="#1B2560" />
            <SafeAreaView style={styles.modalSafeArea}>
              <LinearGradient
                colors={["#1B2560", "#FF4D4D"]}
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
                    <View style={[styles.priorityBadge, { backgroundColor: "#FF4D4D" }]}>
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
                    <Ionicons name="location" size={20} color="#FF4D4D" />
                    <View style={styles.quickInfoContent}>
                      <Text style={styles.quickInfoLabel}>Location</Text>
                      <Text style={styles.quickInfoValue}>{selectedTask.location}</Text>
                    </View>
                  </View>
                  <View style={styles.quickInfoItem}>
                    <Ionicons name="time" size={20} color="#1B2560" />
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
                  <View style={styles.sectionHeaderRow}>
                    <Ionicons name="document-text" size={20} color="#1B2560" />
                    <Text style={styles.sectionTitle}>Description</Text>
                  </View>
                  <Text style={styles.descriptionText}>{selectedTask.description}</Text>
                </View>

                {/* Additional Information */}
                <View style={styles.sectionCard}>
                  <View style={styles.sectionHeaderRow}>
                    <Ionicons name="information-circle" size={20} color="#1B2560" />
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
                  <View style={styles.sectionHeaderRow}>
                    <Ionicons name="list" size={20} color="#1B2560" />
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
                  <View style={styles.sectionHeaderRow}>
                    <Ionicons name="construct" size={20} color="#1B2560" />
                    <Text style={styles.sectionTitle}>Required Resources</Text>
                  </View>
                  <View style={styles.resourceGrid}>
                    <View style={styles.resourceItem}>
                      <Ionicons name="boat" size={16} color="#1B2560" />
                      <Text style={styles.resourceText}>Rescue boats</Text>
                    </View>
                    <View style={styles.resourceItem}>
                      <Ionicons name="shield" size={16} color="#1B2560" />
                      <Text style={styles.resourceText}>Life vests</Text>
                    </View>
                    <View style={styles.resourceItem}>
                      <Ionicons name="radio" size={16} color="#1B2560" />
                      <Text style={styles.resourceText}>Communication radios</Text>
                    </View>
                    <View style={styles.resourceItem}>
                      <Ionicons name="medical" size={16} color="#1B2560" />
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
    backgroundColor: "#F8FAFC",
  },
  // Enhanced Header styles
  headerContainer: {
    position: "relative",
    zIndex: 10,
    elevation: 8,
  },
  headerGradient: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0,
    paddingBottom: 35,
  },
  headerSafeArea: {
    backgroundColor: "transparent",
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
    paddingTop: Platform.OS === "ios" ? 20 : 20,
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
  // Enhanced content wrapper
  contentWrapper: {
    flex: 1,
    marginTop: -20,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 30,
  },
  // Enhanced greeting section
  greetingContainer: {
    marginBottom: 32,
  },
  greeting: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1B2560",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subGreeting: {
    fontSize: 16,
    color: "#64748B",
    marginBottom: 20,
    fontWeight: "500",
  },
  separator: {
    height: 2,
    backgroundColor: "#E2E8F0",
    width: "100%",
    borderRadius: 1,
  },
  // Enhanced section styles
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1B2560",
    marginLeft: 8,
    letterSpacing: 0.5,
  },
  // Enhanced metrics grid
  metricsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 4, // Changed from 8 to 4
  },
  metricCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16, // Changed from 12 to 16
    width: "24%", // Changed from "23%" to "24%"
    aspectRatio: 1, // Add this line to make boxes square
    alignItems: "center",
    justifyContent: "center", // Add this to center content vertically
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  totalStaffCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#1B2560",
  },
  activeCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#10B981",
  },
  onDutyCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#F59E0B",
  },
  onSiteCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#FF4D4D",
  },
  iconContainer: {
    width: 24, // Changed from 32 to 28
    height: 24, // Changed from 32 to 28
    borderRadius: 12, // Changed from 16 to 14
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6, // Changed from 12 to 8
  },
  metricLabel: {
    fontSize: 10, // Changed from 12 to 11
    color: "#64748B",
    marginBottom: 4, // Changed from 6 to 4
    textAlign: "center",
    fontWeight: "500",
  },
  metricValue: {
    fontSize: 18, // Changed from 24 to 20
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 0, // Changed from 4 to 2
  },
  metricChange: {
    fontSize: 9, // Changed from 10 to 9
    color: "#64748B",
    textAlign: "center",
    fontWeight: "500",
  },
  // Enhanced map container
  mapContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 20,
    marginHorizontal: 4, // Added horizontal margin for equal spacing
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
  },
  mapPlaceholder: {
    height: 280, // Increased from 240 to 280 for better proportions
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    position: "relative",
    paddingHorizontal: 20, // Added horizontal padding for equal frame spacing
  },
  mapIconContainer: {
    marginBottom: 16,
  },
  mapPlaceholderText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1B2560",
    marginBottom: 8,
  },
  mapDescription: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  currentLocation: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "rgba(255, 77, 77, 0.1)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 77, 77, 0.2)",
  },
  locationIcon: {
    marginRight: 8,
  },
  coordinateText: {
    fontSize: 12,
    color: "#FF4D4D",
    fontFamily: "monospace",
    fontWeight: "600",
  },
  mapActionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1B2560",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  mapActionText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  // Enhanced task card
  taskCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
  },
  taskHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    flexWrap: "wrap",
    gap: 8,
  },
  urgentBadge: {
    backgroundColor: "#FF4D4D",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  urgentText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  taskType: {
    color: "#64748B",
    fontSize: 13,
    fontWeight: "500",
    flex: 1,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(27, 37, 96, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#1B2560",
  },
  statusText: {
    color: "#1B2560",
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 16,
    lineHeight: 24,
  },
  taskDescription: {
    fontSize: 15,
    color: "#64748B",
    lineHeight: 22,
    marginBottom: 24,
  },
  taskFooter: {
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    paddingTop: 20,
    marginBottom: 16,
  },
  taskLocation: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  taskLocationText: {
    color: "#64748B",
    fontSize: 14,
    marginLeft: 8,
    fontWeight: "500",
  },
  taskMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 12,
  },
  taskActionContainer: {
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    paddingTop: 16,
    alignItems: "center",
    marginTop: 16,
  },
  taskProgress: {
    flex: 1,
    marginRight: 16,
  },
  progressBar: {
    height: 6,
    backgroundColor: "#F1F5F9",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#1B2560",
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "500",
  },
  tapHint: {
    fontSize: 13,
    color: "#1B2560",
    fontStyle: "italic",
    fontWeight: "500",
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    borderWidth: 2,
    borderColor: "#1B2560",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  viewAllText: {
    fontSize: 15,
    color: "#1B2560",
    fontWeight: "600",
    marginRight: 8,
  },
  // Full Screen Map Styles with Updated Colors
  fullScreenContainer: {
    flex: 1,
    backgroundColor: "#1B2560",
  },
  fullScreenSafeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  fullScreenHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  backButton: {
    padding: 8,
  },
  fullScreenTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  headerSpacer: {
    width: 40,
  },
  fullScreenMapContainer: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    marginTop: -20,
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
    backgroundColor: "rgba(255, 77, 77, 0.1)",
    borderRadius: 8,
    alignItems: "center",
  },
  fullScreenCoordinateText: {
    fontSize: 14,
    color: "#FF4D4D",
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
    color: "#1B2560",
    fontWeight: "500",
  },
  // Notification Modal Styles with Updated Colors
  notificationModalHeaderContainer: {
    position: "relative",
    zIndex: 10,
  },
  notificationModalHeaderGradient: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0,
    paddingBottom: 35,
  },
  notificationModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  notificationModalCurvedBottom: {
    height: 35,
    backgroundColor: "#F8FAFC",
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    marginTop: -35,
    zIndex: 5,
  },
  sectionHeaderContainer: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    marginTop: -20,
  },
  markAllButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#1B2560",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  markAllButtonText: {
    color: "#1B2560",
    fontSize: 14,
    fontWeight: "600",
  },
  notificationModalContent: {
    flex: 1,
  },
  notificationScrollView: {
    flex: 1,
  },
  notificationScrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 30,
  },
  // Enhanced Notification Card Styles
  notificationCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#FF4D4D",
    backgroundColor: "#FEFEFE",
  },
  notificationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
    position: "relative",
  },
  notificationLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 12,
    flexWrap: "wrap",
    gap: 8,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  typeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  categoryText: {
    color: "#64748B",
    fontSize: 12,
    marginLeft: 4,
    fontWeight: "500",
  },
  taskId: {
    color: "#1B2560",
    fontSize: 12,
    fontWeight: "600",
    flexShrink: 1,
  },
  notificationTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 16,
    lineHeight: 24,
  },
  notificationDetails: {
    marginBottom: 16,
  },
  detailText: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 6,
    fontWeight: "500",
  },
  assignedSection: {
    flexDirection: "row",
    marginBottom: 16,
  },
  assignedLabel: {
    fontSize: 14,
    color: "#64748B",
    fontWeight: "500",
  },
  assignedValue: {
    fontSize: 14,
    color: "#1B2560",
    fontWeight: "600",
  },
  notificationFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    paddingTop: 16,
  },
  timeText: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "500",
  },
  dropdownMenu: {
    position: "absolute",
    top: 35,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 1000,
    minWidth: 140,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F8FAFC",
  },
  dropdownText: {
    fontSize: 14,
    color: "#374151",
    marginLeft: 10,
    fontWeight: "500",
  },
  // Enhanced Empty State
  emptyState: {
    alignItems: "center",
    paddingVertical: 80,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#64748B",
    marginTop: 20,
    marginBottom: 12,
  },
  emptyStateText: {
    fontSize: 15,
    color: "#94A3B8",
    textAlign: "center",
    fontWeight: "500",
  },
  // Enhanced Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: "#1B2560",
  },
  modalSafeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  modalHeaderTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  // Enhanced Archive/Restore Buttons
  archiveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#64748B",
    paddingVertical: 18,
    paddingHorizontal: 28,
    borderRadius: 16,
    marginBottom: 24,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  archiveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  restoreButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#10B981",
    paddingVertical: 18,
    paddingHorizontal: 28,
    borderRadius: 16,
    marginBottom: 24,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  restoreButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  // Enhanced Main Info Card
  mainInfoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
    gap: 10,
  },
  priorityBadge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  priorityText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  categoryBadgeDetail: {
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  categoryTextDetail: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "600",
  },
  detailTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1E293B",
    lineHeight: 30,
    marginBottom: 16,
  },
  readStatusRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  readStatusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  readStatusText: {
    fontSize: 14,
    color: "#64748B",
    fontWeight: "600",
  },
  quickInfoGrid: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  quickInfoItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F8FAFC",
  },
  quickInfoContent: {
    marginLeft: 16,
    flex: 1,
  },
  quickInfoLabel: {
    fontSize: 13,
    color: "#64748B",
    marginBottom: 4,
    fontWeight: "500",
  },
  quickInfoValue: {
    fontSize: 15,
    color: "#1E293B",
    fontWeight: "600",
  },
  sectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  descriptionText: {
    fontSize: 15,
    color: "#64748B",
    lineHeight: 24,
    fontWeight: "500",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F8FAFC",
  },
  detailLabel: {
    fontSize: 14,
    color: "#64748B",
    fontWeight: "500",
  },
  detailValue: {
    fontSize: 14,
    color: "#1E293B",
    fontWeight: "600",
  },
  instructionsList: {
    gap: 16,
  },
  instructionItem: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  instructionNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#1B2560",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  instructionNumberText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  instructionText: {
    fontSize: 15,
    color: "#374151",
    flex: 1,
    lineHeight: 22,
    fontWeight: "500",
  },
  resourceGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  resourceItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(27, 37, 96, 0.1)",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(27, 37, 96, 0.2)",
  },
  resourceText: {
    fontSize: 13,
    color: "#1B2560",
    fontWeight: "600",
  },
  modalScrollContent: {
    paddingBottom: 50,
    flexGrow: 1,
  },
  fullScreenHeaderContainer: {
    position: "relative",
    zIndex: 10,
  },
  fullScreenHeaderGradient: {
    paddingBottom: 35,
  },
  fullScreenCurvedBottom: {
    height: 35,
    backgroundColor: "#F3F4F6",
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    marginTop: -35,
    zIndex: 5,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    paddingHorizontal: 16,
    gap: 10,
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: "#1B2560",
  },
  tabText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#64748B",
  },
  activeTabText: {
    color: "#1B2560",
  },
})
