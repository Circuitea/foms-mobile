"use client"

import { Ionicons } from "@expo/vector-icons"
import { useFocusEffect } from "@react-navigation/native"
import { LinearGradient } from "expo-linear-gradient"
import { useCallback, useState } from "react"
import {
  Alert,
  FlatList,
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

interface PersonnelSection {
  id: string
  name: string
  count: number
  personnel: Personnel[]
}

interface Personnel {
  id: string
  name: string
  role: string
  status: "active" | "on-duty" | "emergency" | "offline"
  location?: string
  coordinates?: {
    latitude: number
    longitude: number
  }
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

export default function MapScreen() {
  const [sidebarVisible, setSidebarVisible] = useState(false)
  const [selectedSection, setSelectedSection] = useState<string | null>(null)
  const [selectedPersonnel, setSelectedPersonnel] = useState<Personnel | null>(null)
  const [fullScreenMapVisible, setFullScreenMapVisible] = useState(false)

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

  // Reset scroll position and states when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      // Reset any active states
      setSidebarVisible(false)
      setSelectedPersonnel(null)
      setFullScreenMapVisible(false)
      setSelectedSection(null)
      setNotificationsVisible(false)
      setNotificationDetailVisible(false)
      setSelectedNotification(null)
      setActiveMenuId(null)
    }, []),
  )

  const sections: PersonnelSection[] = [
    {
      id: "management",
      name: "Management",
      count: 12,
      personnel: [
        {
          id: "m1",
          name: "Director Santos",
          role: "CDRRMO Director",
          status: "active",
          location: "HQ Office",
          coordinates: { latitude: 14.5995, longitude: 120.9842 },
        },
        {
          id: "m2",
          name: "Deputy Cruz",
          role: "Deputy Director",
          status: "active",
          location: "Field Office",
          coordinates: { latitude: 14.6042, longitude: 120.9822 },
        },
        {
          id: "m3",
          name: "Chief Reyes",
          role: "Operations Chief",
          status: "on-duty",
          location: "Command Center",
          coordinates: { latitude: 14.5985, longitude: 120.9862 },
        },
      ],
    },
    {
      id: "monitoring",
      name: "Monitoring",
      count: 8,
      personnel: [
        {
          id: "mon1",
          name: "Officer Garcia",
          role: "Senior Monitor",
          status: "active",
          location: "Weather Station",
          coordinates: { latitude: 14.6012, longitude: 120.9832 },
        },
        {
          id: "mon2",
          name: "Officer Lim",
          role: "Data Analyst",
          status: "on-duty",
          location: "Command Center",
          coordinates: { latitude: 14.5985, longitude: 120.9862 },
        },
        {
          id: "mon3",
          name: "Officer Tan",
          role: "Systems Specialist",
          status: "offline",
        },
      ],
    },
    {
      id: "planning",
      name: "Planning",
      count: 10,
      personnel: [
        {
          id: "p1",
          name: "Planner Mendoza",
          role: "Chief Planner",
          status: "active",
          location: "Planning Room",
          coordinates: { latitude: 14.5975, longitude: 120.9852 },
        },
        {
          id: "p2",
          name: "Officer Aquino",
          role: "Resource Manager",
          status: "on-duty",
          location: "Logistics Center",
          coordinates: { latitude: 14.6025, longitude: 120.9815 },
        },
        {
          id: "p3",
          name: "Officer Diaz",
          role: "Scenario Specialist",
          status: "emergency",
          location: "Field Site Alpha",
          coordinates: { latitude: 14.6055, longitude: 120.9795 },
        },
      ],
    },
    {
      id: "others",
      name: "Others",
      count: 15,
      personnel: [
        {
          id: "o1",
          name: "Driver Pascual",
          role: "Emergency Vehicle Operator",
          status: "on-duty",
          location: "Vehicle Bay",
          coordinates: { latitude: 14.5965, longitude: 120.9872 },
        },
        {
          id: "o2",
          name: "Medic Santos",
          role: "First Responder",
          status: "emergency",
          location: "Incident Site",
          coordinates: { latitude: 14.6075, longitude: 120.9785 },
        },
        {
          id: "o3",
          name: "Tech Flores",
          role: "Communications Specialist",
          status: "active",
          location: "Comms Room",
          coordinates: { latitude: 14.5995, longitude: 120.9842 },
        },
      ],
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "#10B981"
      case "on-duty":
        return "#F59E0B"
      case "emergency":
        return "#EF4444"
      default:
        return "#9CA3AF"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Active"
      case "on-duty":
        return "On Duty"
      case "emergency":
        return "Emergency"
      default:
        return "Offline"
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

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible)
  }

  const toggleSection = (sectionId: string) => {
    if (selectedSection === sectionId) {
      setSelectedSection(null)
    } else {
      setSelectedSection(sectionId)
    }
  }

  const handlePersonnelClick = (person: Personnel) => {
    if (person.coordinates && person.location) {
      // If the same person is clicked again, deselect them
      if (selectedPersonnel?.id === person.id) {
        setSelectedPersonnel(null)
        console.log(`Deselected ${person.name}`)
      } else {
        // Focus on the person's location in the current map
        setSelectedPersonnel(person)
        console.log(`Focusing on ${person.name} at coordinates:`, person.coordinates)
      }

      // Close sidebar to show the map with highlighted person
      setSidebarVisible(false)
    } else {
      // Person is offline or location unavailable
      console.log(`${person.name} location unavailable - ${person.status}`)
    }
  }

  const handleMapClick = () => {
    // Open full-screen map view
    setFullScreenMapVisible(true)
  }

  const handleBackFromFullScreen = () => {
    setFullScreenMapVisible(false)
  }

  const renderMapContent = (isFullScreen = false) => {
    if (isFullScreen) {
      return (
        <View style={styles.fullScreenMapContent}>
          <Ionicons name="map" size={80} color="#9CA3AF" />
          <Text style={styles.fullScreenMapText}>Full Screen Map</Text>
          <Text style={styles.fullScreenMapSubtext}>
            {selectedPersonnel
              ? `Focused on: ${selectedPersonnel.name} at ${selectedPersonnel.location}`
              : "Personnel locations will appear here"}
          </Text>

          {selectedPersonnel && (
            <View style={styles.fullScreenPersonnelIndicator}>
              <View style={[styles.mapPersonnelDot, { backgroundColor: getStatusColor(selectedPersonnel.status) }]} />
              <Text style={styles.selectedPersonnelText}>{selectedPersonnel.name}</Text>
              <Text style={styles.selectedPersonnelLocation}>{selectedPersonnel.location}</Text>
            </View>
          )}
        </View>
      )
    }

    return (
      <View style={styles.mapPlaceholder}>
        <Ionicons name="map" size={64} color="#9CA3AF" />
        <Text style={styles.mapPlaceholderText}>Interactive Map</Text>
        <Text style={styles.mapSubtext}>
          {selectedPersonnel
            ? `Focused on: ${selectedPersonnel.name} at ${selectedPersonnel.location}`
            : "Personnel locations will appear here"}
        </Text>

        {selectedPersonnel && (
          <View style={styles.selectedPersonnelIndicator}>
            <View style={[styles.mapPersonnelDot, { backgroundColor: getStatusColor(selectedPersonnel.status) }]} />
            <Text style={styles.selectedPersonnelText}>{selectedPersonnel.name}</Text>
            <Text style={styles.selectedPersonnelLocation}>{selectedPersonnel.location}</Text>
          </View>
        )}

        <Text style={styles.mapClickHint}>Tap to open full screen map</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E3A8A" translucent={false} hidden={false} />

      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.screenTitle}>Interactive Map</Text>
          <TouchableOpacity style={styles.filterButton} onPress={toggleSidebar}>
            <Ionicons name="people" size={20} color="#3B82F6" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.mapContainer} onPress={handleMapClick} activeOpacity={0.8}>
          {renderMapContent(false)}
        </TouchableOpacity>

        <View style={styles.legendContainer}>
          <Text style={styles.legendTitle}>Personnel Status</Text>
          <View style={styles.legendItems}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: "#10B981" }]} />
              <Text style={styles.legendText}>Active (24)</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: "#F59E0B" }]} />
              <Text style={styles.legendText}>On Duty (38)</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: "#EF4444" }]} />
              <Text style={styles.legendText}>Emergency (2)</Text>
            </View>
          </View>
        </View>
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

      {/* Full Screen Map Modal - FIXED HEADER */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={fullScreenMapVisible}
        onRequestClose={handleBackFromFullScreen}
      >
        <View style={styles.fullScreenContainer}>
          <StatusBar barStyle="light-content" backgroundColor="#1E3A8A" />

          {/* FIXED: Updated curved header container (matching personal information screen) */}
          <View style={styles.fullScreenHeaderContainer}>
            <LinearGradient
              colors={["#1E3A8A", "#3B82F6", "#EF4444"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.fullScreenHeaderGradient}
            >
              <SafeAreaView style={styles.fullScreenHeaderSafeArea}>
                <View style={styles.fullScreenHeaderContent}>
                  <TouchableOpacity style={styles.backButton} onPress={handleBackFromFullScreen}>
                    <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                  </TouchableOpacity>
                  <Text style={styles.fullScreenTitle}>Interactive Map</Text>
                  <View style={styles.headerSpacer} />
                </View>
              </SafeAreaView>
            </LinearGradient>

            {/* This is the curved bottom part */}
            <View style={styles.fullScreenCurvedBottom} />
          </View>

          <View style={styles.fullScreenMapContainer}>{renderMapContent(true)}</View>
        </View>
      </Modal>

      {/* Personnel Sidebar */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={sidebarVisible}
        onRequestClose={() => setSidebarVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.sidebarContainer}>
            <View style={styles.sidebarHeader}>
              <Text style={styles.sidebarTitle}>Sections</Text>
              <TouchableOpacity onPress={() => setSidebarVisible(false)}>
                <Ionicons name="close" size={24} color="#111827" />
              </TouchableOpacity>
            </View>

            <Text style={styles.sidebarSubtitle}>Select a section to view personnel</Text>

            <FlatList
              data={sections}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.sectionContainer}>
                  <TouchableOpacity style={styles.sectionHeader} onPress={() => toggleSection(item.id)}>
                    <View style={styles.sectionLeft}>
                      <View style={styles.sectionIcon}>
                        <Ionicons name="people" size={20} color="#FFFFFF" />
                      </View>
                      <View>
                        <Text style={styles.sectionName}>{item.name}</Text>
                        <Text style={styles.sectionCount}>{item.count}</Text>
                      </View>
                    </View>
                    <Ionicons
                      name={selectedSection === item.id ? "chevron-up" : "chevron-down"}
                      size={20}
                      color="#6B7280"
                    />
                  </TouchableOpacity>

                  {selectedSection === item.id && (
                    <View style={styles.personnelList}>
                      {item.personnel.map((person) => (
                        <TouchableOpacity
                          key={person.id}
                          style={[
                            styles.personnelItem,
                            selectedPersonnel?.id === person.id && styles.selectedPersonnelItem,
                          ]}
                          onPress={() => handlePersonnelClick(person)}
                          activeOpacity={0.7}
                        >
                          <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(person.status) }]} />
                          <View style={styles.personnelInfo}>
                            <Text
                              style={[
                                styles.personnelName,
                                selectedPersonnel?.id === person.id && styles.selectedPersonnelName,
                              ]}
                            >
                              {person.name}
                            </Text>
                            <Text style={styles.personnelRole}>{person.role}</Text>
                            <View style={styles.personnelStatus}>
                              <Text style={[styles.statusText, { color: getStatusColor(person.status) }]}>
                                {getStatusText(person.status)}
                              </Text>
                              {person.location && (
                                <>
                                  <Text style={styles.locationSeparator}>•</Text>
                                  <Text style={styles.locationText}>{person.location}</Text>
                                </>
                              )}
                            </View>
                          </View>
                          {person.coordinates ? (
                            <Ionicons name="location" size={16} color="#3B82F6" />
                          ) : (
                            <Ionicons name="location-outline" size={16} color="#9CA3AF" />
                          )}
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              )}
              contentContainerStyle={styles.sectionsList}
            />

            <View style={styles.sidebarFooter}>
              <View style={styles.footerIcon}>
                <Ionicons name="people-outline" size={24} color="#9CA3AF" />
              </View>
              <Text style={styles.footerText}>Select Personnel</Text>
              <Text style={styles.footerSubtext}>Tap on a person to focus on their location</Text>
            </View>
          </View>
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
  content: {
    flex: 1,
    marginTop: -15, // Overlap with curve
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    marginTop: 10, // Increased margin to create separation from curved header
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
  },
  filterButton: {
    padding: 8,
  },
  mapContainer: {
    flex: 1,
    margin: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1,
  },
  mapGradient: {
    borderRadius: 12,
  },
  fullScreenMapGradient: {
    flex: 1,
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
  },
  mapPlaceholderText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6B7280",
    marginTop: 16,
  },
  mapSubtext: {
    fontSize: 14,
    color: "#9CA3AF",
    marginTop: 8,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  selectedPersonnelIndicator: {
    alignItems: "center",
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: "#3B82F6",
  },
  mapPersonnelDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedPersonnelText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  selectedPersonnelLocation: {
    fontSize: 14,
    color: "#6B7280",
  },
  mapClickHint: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 16,
    fontStyle: "italic",
  },
  // FIXED: Full Screen Map Styles with proper curved header
  fullScreenContainer: {
    flex: 1,
    backgroundColor: "#F9FAFB", // Changed to match main background
  },
  // FIXED: Full-screen header container with curved bottom
  fullScreenHeaderContainer: {
    position: "relative",
    zIndex: 10,
  },
  fullScreenHeaderGradient: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0,
    paddingBottom: 30, // Added padding for curve
  },
  fullScreenHeaderSafeArea: {
    backgroundColor: "transparent",
  },
  fullScreenHeaderContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  fullScreenCurvedBottom: {
    height: 30,
    backgroundColor: "#F3F4F6", // Match the map background
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    zIndex: 5,
  },
  backButton: {
    padding: 4, // Reduced padding to match personal info screen
  },
  fullScreenTitle: {
    fontSize: 20, // Increased to match personal info screen
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  headerSpacer: {
    width: 24, // Match the back button width for centering
  },
  fullScreenMapContainer: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    marginTop: -15, // Overlap with curve
  },
  fullScreenMapContent: {
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
  fullScreenMapSubtext: {
    fontSize: 16,
    color: "#9CA3AF",
    marginTop: 12,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  fullScreenPersonnelIndicator: {
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  legendContainer: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1,
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  legendItems: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: "#6B7280",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  sidebarContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 16,
    paddingBottom: 30,
    height: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
  sidebarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  sidebarTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
  },
  sidebarSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  sectionsList: {
    paddingHorizontal: 20,
  },
  sectionContainer: {
    marginBottom: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  sectionLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1E3A8A",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  sectionName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  sectionCount: {
    fontSize: 14,
    color: "#6B7280",
  },
  personnelList: {
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingVertical: 8,
  },
  personnelItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  selectedPersonnelItem: {
    backgroundColor: "#EBF8FF",
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
  },
  personnelInfo: {
    flex: 1,
  },
  personnelName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
  },
  selectedPersonnelName: {
    color: "#1E40AF",
    fontWeight: "600",
  },
  personnelRole: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 2,
  },
  personnelStatus: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
  locationSeparator: {
    fontSize: 12,
    color: "#9CA3AF",
    marginHorizontal: 4,
  },
  locationText: {
    fontSize: 12,
    color: "#6B7280",
  },
  sidebarFooter: {
    alignItems: "center",
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  footerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  footerText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111827",
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
  },
  // Notification Modal Styles
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
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  modalScrollContent: {
    paddingBottom: 40,
    flexGrow: 1,
  },
})
