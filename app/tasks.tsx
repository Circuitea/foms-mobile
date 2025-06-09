"use client"

import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { useEffect, useRef, useState } from "react"
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

interface TasksScreenProps {
  initialTab?: "notifications" | "tasks" | "archived"
}

export default function TasksScreen({ initialTab = "notifications" }: TasksScreenProps) {
  const [activeTab, setActiveTab] = useState<"notifications" | "tasks" | "archived">(initialTab)
  const [selectedItem, setSelectedItem] = useState<Notification | null>(null)
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const scrollViewRef = useRef<ScrollView>(null)
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null)

  // Update active tab when initialTab prop changes
  useEffect(() => {
    setActiveTab(initialTab)
  }, [initialTab])

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
      isRead: true,
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

  const [activeTasks, setActiveTasks] = useState<Notification[]>([
    {
      id: "4",
      type: "URGENT",
      category: "Emergency Response",
      title: "Flood Response - Barangay Greenhills",
      description:
        "Deploy emergency response team to assist with flood evacuation and rescue operations in Barangay Greenhills.",
      location: "Barangay Greenhills",
      assignedTo: "Officer Alexis",
      assignedCount: 1,
      time: "6 hours",
      timeAgo: "",
      status: "Unchecked",
      dueDate: "1/16/2024",
      isRead: true,
      taskId: "SJ-OPS-2025-001",
      department: "Emergency Operations",
      reportedBy: "Operations Chief Martinez",
    },
    {
      id: "5",
      type: "NORMAL",
      category: "Maintenance",
      title: "Equipment Maintenance - Rescue Vehicle Unit 3",
      description:
        "Perform scheduled maintenance on Rescue Vehicle Unit 3 including engine check and equipment inventory.",
      location: "CDRRMO Motor Pool",
      assignedTo: "Officer Martinez",
      assignedCount: 1,
      time: "4 hours",
      timeAgo: "",
      status: "Unchecked",
      dueDate: "1/17/2024",
      isRead: true,
    },
    {
      id: "6",
      type: "HIGH",
      category: "Assessment",
      title: "Risk Assessment - Little Baguio Area",
      description: "Conduct geological risk assessment in Little Baguio area following recent landslide warnings.",
      location: "Barangay Little Baguio",
      assignedTo: "Officer Chen",
      assignedCount: 1,
      time: "8 hours",
      timeAgo: "",
      status: "Unchecked",
      dueDate: "1/17/2024",
      isRead: false,
    },
  ])

  const [archivedItems, setArchivedItems] = useState<Notification[]>([])

  const handleItemClick = (item: Notification) => {
    // Mark item as read when clicked
    if (!item.isRead) {
      if (activeTab === "notifications") {
        setNotifications((prev) =>
          prev.map((notification) => (notification.id === item.id ? { ...notification, isRead: true } : notification)),
        )
      } else if (activeTab === "tasks") {
        setActiveTasks((prev) => prev.map((task) => (task.id === item.id ? { ...task, isRead: true } : task)))
      }
    }

    setSelectedItem({ ...item, isRead: true })
    setDetailModalVisible(true)
  }

  const handleCloseDetail = () => {
    setDetailModalVisible(false)
    setSelectedItem(null)
  }

  const handleArchive = () => {
    if (!selectedItem || activeTab !== "notifications") return

    const archivedItem = {
      ...selectedItem,
      archivedAt: new Date().toLocaleString(),
    }

    // Add to archived items
    setArchivedItems((prev) => [archivedItem, ...prev])

    // Remove from notifications list only
    setNotifications((prev) => prev.filter((item) => item.id !== selectedItem.id))

    handleCloseDetail()
    Alert.alert("Archived", "Notification has been moved to archived section.")
  }

  const handleDeleteFromArchive = (itemId: string) => {
    Alert.alert("Delete Item", "Are you sure you want to permanently delete this item?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          setArchivedItems((prev) => prev.filter((item) => item.id !== itemId))
          Alert.alert("Deleted", "Item has been permanently deleted.")
        },
      },
    ])
  }

  const handleRestoreFromArchive = (item: Notification) => {
    // Remove from archived
    setArchivedItems((prev) => prev.filter((archived) => archived.id !== item.id))

    // Restore to original list (determine by checking if it has dueDate - tasks have dueDate)
    const restoredItem = { ...item, archivedAt: undefined }
    if (item.dueDate) {
      setActiveTasks((prev) => [restoredItem, ...prev])
    } else {
      setNotifications((prev) => [restoredItem, ...prev])
    }

    Alert.alert("Restored", "Item has been restored to its original section.")
  }

  const handleMarkAllAsRead = () => {
    const unreadCount = activeTab === "notifications" ? getUnreadNotificationsCount() : getUnreadTasksCount()

    if (unreadCount === 0) {
      Alert.alert("Mark All as Read", `All ${activeTab} are already marked as read.`)
      return
    }

    Alert.alert("Mark All as Read", `Mark all ${unreadCount} unread ${activeTab} as read?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Mark All as Read", onPress: confirmMarkAllAsRead },
    ])
  }

  const confirmMarkAllAsRead = () => {
    if (activeTab === "notifications") {
      setNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })))
    } else if (activeTab === "tasks") {
      setActiveTasks((prev) => prev.map((task) => ({ ...task, isRead: true })))
    }
  }

  const handleArchiveNotification = (notificationId: string) => {
    const notification = notifications.find((n) => n.id === notificationId)
    if (!notification) return

    const archivedItem = {
      ...notification,
      archivedAt: new Date().toLocaleString(),
    }

    // Add to archived items
    setArchivedItems((prev) => [archivedItem, ...prev])

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

  const renderNotification = (notification: Notification) => (
    <TouchableOpacity
      key={notification.id}
      style={[styles.notificationCard, !notification.isRead && styles.unreadCard]}
      onPress={() => handleItemClick(notification)}
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
            <TouchableOpacity style={styles.dropdownItem} onPress={() => handleArchiveNotification(notification.id)}>
              <Ionicons name="archive-outline" size={16} color="#6B7280" />
              <Text style={styles.dropdownText}>Archive</Text>
            </TouchableOpacity>
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

  const renderTask = (task: Notification) => (
    <TouchableOpacity
      key={task.id}
      style={[styles.taskCard, !task.isRead && styles.unreadCard]}
      onPress={() => handleItemClick(task)}
      activeOpacity={0.7}
    >
      <View style={styles.taskHeader}>
        <View style={styles.taskBadges}>
          <View
            style={[
              styles.typeBadge,
              { backgroundColor: task.type === "URGENT" ? "#EF4444" : task.type === "HIGH" ? "#F59E0B" : "#1E3A8A" },
            ]}
          >
            <Text style={styles.typeText}>{task.type}</Text>
          </View>
          <Text style={styles.taskCategory}>{task.category}</Text>
          <View style={styles.statusIndicatorTask}>
            <Ionicons name="time-outline" size={16} color="#3B82F6" />
            <Text style={styles.statusTextTask}>IN PROGRESS</Text>
          </View>
        </View>
      </View>

      <Text style={styles.taskTitle}>{task.title}</Text>
      <Text style={styles.taskDescription}>{task.description}</Text>

      <View style={styles.taskMeta}>
        <View style={styles.taskMetaItem}>
          <Ionicons name="location" size={14} color="#EF4444" />
          <Text style={styles.taskMetaText}>{task.location}</Text>
        </View>
        <View style={styles.taskMetaItem}>
          <Ionicons name="time-outline" size={14} color="#6B7280" />
          <Text style={styles.taskMetaText}>{task.time}</Text>
        </View>
        <View style={styles.taskMetaItem}>
          <Ionicons name="person-outline" size={14} color="#6B7280" />
          <Text style={styles.taskMetaText}>{task.assignedTo}</Text>
        </View>
        <View style={styles.taskMetaItem}>
          <Ionicons name="calendar-outline" size={14} color="#6B7280" />
          <Text style={styles.taskMetaText}>Due: {task.dueDate}</Text>
        </View>
      </View>

      <View style={styles.taskFooter}>
        <View style={styles.readIndicator}>
          <View style={[styles.readDot, { backgroundColor: task.isRead ? "#9CA3AF" : "#3B82F6" }]} />
          <Text style={styles.readText}>{task.isRead ? "Read" : "Unread"}</Text>
        </View>
        <Text style={styles.tapHint}>Tap for details</Text>
      </View>
    </TouchableOpacity>
  )

  const renderArchivedItem = (item: Notification) => (
    <View key={item.id} style={styles.archivedCard}>
      <View style={styles.archivedHeader}>
        <View style={styles.archivedLeft}>
          <View style={[styles.typeBadge, { backgroundColor: item.type === "URGENT" ? "#EF4444" : "#6B7280" }]}>
            <Text style={styles.typeText}>{item.type}</Text>
          </View>
          <Text style={styles.archivedCategory}>{item.category}</Text>
        </View>
        <View style={styles.archivedActions}>
          <TouchableOpacity style={styles.restoreButton} onPress={() => handleRestoreFromArchive(item)}>
            <Ionicons name="arrow-undo" size={16} color="#3B82F6" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteFromArchive(item.id)}>
            <Ionicons name="trash" size={16} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.archivedTitle}>{item.title}</Text>
      <Text style={styles.archivedLocation}>📍 {item.location}</Text>

      <View style={styles.archivedFooter}>
        <Text style={styles.archivedTime}>Archived: {item.archivedAt}</Text>
        <Text style={styles.originalTime}>Original: {item.time}</Text>
      </View>
    </View>
  )

  const renderDetailModal = () => {
    if (!selectedItem) return null

    const isNotification = activeTab === "notifications"

    return (
      <Modal animationType="slide" transparent={false} visible={detailModalVisible} onRequestClose={handleCloseDetail}>
        <View style={styles.modalContainer}>
          <StatusBar barStyle="light-content" backgroundColor="#1E3A8A" />
          <SafeAreaView style={styles.modalSafeArea}>
            <LinearGradient
              colors={["#1E3A8A", "#3B82F6", "#EF4444"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.modalHeader}
            >
              <TouchableOpacity style={styles.backButton} onPress={handleCloseDetail}>
                <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <Text style={styles.modalHeaderTitle}>{isNotification ? "Notification Details" : "Task Details"}</Text>
              <View style={styles.headerSpacer} />
            </LinearGradient>

            <ScrollView
              style={styles.modalContent}
              contentContainerStyle={styles.modalScrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Archive Button - Only for notifications */}
              {isNotification && (
                <TouchableOpacity style={styles.archiveButton} onPress={handleArchive}>
                  <Ionicons name="archive" size={20} color="#FFFFFF" />
                  <Text style={styles.archiveButtonText}>Archive</Text>
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
                          selectedItem.type === "URGENT"
                            ? "#EF4444"
                            : selectedItem.type === "HIGH"
                              ? "#F59E0B"
                              : "#1E3A8A",
                      },
                    ]}
                  >
                    <Text style={styles.priorityText}>{selectedItem.type}</Text>
                  </View>
                  <View style={styles.categoryBadgeDetail}>
                    <Text style={styles.categoryTextDetail}>{selectedItem.category}</Text>
                  </View>
                </View>
                <Text style={styles.detailTitle}>{selectedItem.title}</Text>
                <View style={styles.readStatusRow}>
                  <View
                    style={[styles.readStatusDot, { backgroundColor: selectedItem.isRead ? "#10B981" : "#F59E0B" }]}
                  />
                  <Text style={styles.readStatusText}>{selectedItem.isRead ? "Read" : "Unread"}</Text>
                </View>
              </View>

              {/* Quick Info Grid */}
              <View style={styles.quickInfoGrid}>
                <View style={styles.quickInfoItem}>
                  <Ionicons name="location" size={20} color="#EF4444" />
                  <View style={styles.quickInfoContent}>
                    <Text style={styles.quickInfoLabel}>Location</Text>
                    <Text style={styles.quickInfoValue}>{selectedItem.location}</Text>
                  </View>
                </View>
                <View style={styles.quickInfoItem}>
                  <Ionicons name="time" size={20} color="#3B82F6" />
                  <View style={styles.quickInfoContent}>
                    <Text style={styles.quickInfoLabel}>Time</Text>
                    <Text style={styles.quickInfoValue}>{selectedItem.time}</Text>
                  </View>
                </View>
                <View style={styles.quickInfoItem}>
                  <Ionicons name="person" size={20} color="#10B981" />
                  <View style={styles.quickInfoContent}>
                    <Text style={styles.quickInfoLabel}>Assigned To</Text>
                    <Text style={styles.quickInfoValue}>{selectedItem.assignedTo || "N/A"}</Text>
                  </View>
                </View>
                <View style={styles.quickInfoItem}>
                  <Ionicons name="business" size={20} color="#8B5CF6" />
                  <View style={styles.quickInfoContent}>
                    <Text style={styles.quickInfoLabel}>Department</Text>
                    <Text style={styles.quickInfoValue}>{selectedItem.department || "N/A"}</Text>
                  </View>
                </View>
              </View>

              {/* Description Section */}
              <View style={styles.sectionCard}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="document-text" size={20} color="#3B82F6" />
                  <Text style={styles.sectionTitle}>Description</Text>
                </View>
                <Text style={styles.descriptionText}>{selectedItem.description}</Text>
              </View>

              {/* Additional Details */}
              <View style={styles.sectionCard}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="information-circle" size={20} color="#3B82F6" />
                  <Text style={styles.sectionTitle}>Additional Information</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Task ID:</Text>
                  <Text style={styles.detailValue}>{selectedItem.taskId || "N/A"}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Reported By:</Text>
                  <Text style={styles.detailValue}>{selectedItem.reportedBy || "N/A"}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Status:</Text>
                  <Text style={styles.detailValue}>{selectedItem.status}</Text>
                </View>
                {selectedItem.dueDate && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Due Date:</Text>
                    <Text style={styles.detailValue}>{selectedItem.dueDate}</Text>
                  </View>
                )}
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
                    <Text style={styles.instructionText}>
                      {selectedItem.category === "Meeting Reminder" || selectedItem.category === "Meeting Notice"
                        ? "Check meeting details and confirm attendance"
                        : "Assemble at designated staging area immediately"}
                    </Text>
                  </View>
                  <View style={styles.instructionItem}>
                    <View style={styles.instructionNumber}>
                      <Text style={styles.instructionNumberText}>2</Text>
                    </View>
                    <Text style={styles.instructionText}>
                      {selectedItem.category === "Meeting Reminder" || selectedItem.category === "Meeting Notice"
                        ? "Prepare necessary documents and materials"
                        : "Conduct equipment check before deployment"}
                    </Text>
                  </View>
                  <View style={styles.instructionItem}>
                    <View style={styles.instructionNumber}>
                      <Text style={styles.instructionNumberText}>3</Text>
                    </View>
                    <Text style={styles.instructionText}>
                      {selectedItem.category === "Meeting Reminder" || selectedItem.category === "Meeting Notice"
                        ? "Join meeting at scheduled time"
                        : "Establish communication protocols"}
                    </Text>
                  </View>
                  <View style={styles.instructionItem}>
                    <View style={styles.instructionNumber}>
                      <Text style={styles.instructionNumberText}>4</Text>
                    </View>
                    <Text style={styles.instructionText}>
                      {selectedItem.category === "Meeting Reminder" || selectedItem.category === "Meeting Notice"
                        ? "Participate actively in discussions"
                        : "Brief team on specific mission objectives"}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Required Resources (for tasks) */}
              {!isNotification && (
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
              )}
            </ScrollView>
          </SafeAreaView>
        </View>
      </Modal>
    )
  }

  const setActiveTabWithReset = (tab: "notifications" | "tasks" | "archived") => {
    setActiveTab(tab)
    scrollViewRef.current?.scrollTo({ y: 0, animated: false })
  }

  const getUnreadNotificationsCount = () => {
    return notifications.filter((n) => !n.isRead).length
  }

  const getUnreadTasksCount = () => {
    return activeTasks.filter((t) => !t.isRead).length
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

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "notifications" && styles.activeTab]}
            onPress={() => setActiveTabWithReset("notifications")}
          >
            <View style={styles.tabContent}>
              <Text style={[styles.tabText, activeTab === "notifications" && styles.activeTabText]}>
                Notifications ({notifications.length})
              </Text>
              {getUnreadNotificationsCount() > 0 && (
                <View style={styles.tabBadge}>
                  <Text style={styles.tabBadgeText}>{getUnreadNotificationsCount()}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "tasks" && styles.activeTab]}
            onPress={() => setActiveTabWithReset("tasks")}
          >
            <View style={styles.tabContent}>
              <Text style={[styles.tabText, activeTab === "tasks" && styles.activeTabText]}>
                Active Tasks ({activeTasks.length})
              </Text>
              {getUnreadTasksCount() > 0 && (
                <View style={styles.tabBadge}>
                  <Text style={styles.tabBadgeText}>{getUnreadTasksCount()}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "archived" && styles.activeTab]}
            onPress={() => setActiveTabWithReset("archived")}
          >
            <Text style={[styles.tabText, activeTab === "archived" && styles.activeTabText]}>
              Archived ({archivedItems.length})
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionHeaderContainer}>
          {activeTab === "notifications" ? (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Task Notifications</Text>
              <TouchableOpacity style={styles.markAllButton} onPress={handleMarkAllAsRead}>
                <Ionicons name="checkmark-done" size={16} color="#3B82F6" />
                <Text style={styles.markAllButtonText}>Mark All as Read</Text>
              </TouchableOpacity>
            </View>
          ) : activeTab === "tasks" ? (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Active Tasks</Text>
              <TouchableOpacity style={styles.markAllButton} onPress={handleMarkAllAsRead}>
                <Ionicons name="checkmark-done" size={16} color="#3B82F6" />
                <Text style={styles.markAllButtonText}>Mark All as Read</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Archived Items</Text>
              <Text style={styles.archivedCount}>{archivedItems.length} items</Text>
            </View>
          )}
        </View>

        <View style={styles.contentContainer}>
          <TouchableOpacity activeOpacity={1} onPress={() => setActiveMenuId(null)} style={{ flex: 1 }}>
            <ScrollView
              ref={scrollViewRef}
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              bounces={true}
              overScrollMode="always"
            >
              {activeTab === "notifications" ? (
                <View>{notifications.map(renderNotification)}</View>
              ) : activeTab === "tasks" ? (
                <View>{activeTasks.map(renderTask)}</View>
              ) : (
                <View>
                  {archivedItems.length === 0 ? (
                    <View style={styles.emptyState}>
                      <Ionicons name="archive" size={64} color="#9CA3AF" />
                      <Text style={styles.emptyStateTitle}>No Archived Items</Text>
                      <Text style={styles.emptyStateText}>Archived notifications and tasks will appear here</Text>
                    </View>
                  ) : (
                    archivedItems.map(renderArchivedItem)
                  )}
                </View>
              )}
            </ScrollView>
          </TouchableOpacity>
        </View>

        {renderDetailModal()}
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
    position: "relative",
  },
  profileCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#1E3A8A",
  },
  tabContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  tabText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
    textAlign: "center",
  },
  activeTabText: {
    color: "#1E3A8A",
    fontWeight: "600",
  },
  tabBadge: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#EF4444",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  tabBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "bold",
  },
  sectionHeaderContainer: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 16, // Reduced from 24 to 16
    paddingBottom: 16, // Reduced from 20 to 16
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
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    flex: 1,
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
  archivedCount: {
    fontSize: 14,
    color: "#6B7280",
  },
  contentContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12, // Reduced from 20 to 12
    paddingBottom: 20,
  },
  // Card Styles
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
  taskCard: {
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
  taskHeader: {
    marginBottom: 12,
  },
  taskBadges: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  taskCategory: {
    color: "#6B7280",
    fontSize: 12,
    marginRight: 8,
    marginLeft: 8,
  },
  statusIndicatorTask: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusTextTask: {
    color: "#3B82F6",
    fontSize: 10,
    fontWeight: "500",
    marginLeft: 4,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  taskDescription: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
    marginBottom: 16,
  },
  taskMeta: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  taskMetaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  taskMetaText: {
    fontSize: 12,
    color: "#6B7280",
    marginLeft: 4,
  },
  taskFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 8,
  },
  readIndicator: {
    flexDirection: "row",
    alignItems: "center",
  },
  readDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  readText: {
    fontSize: 12,
    color: "#6B7280",
  },
  // Archived Items
  archivedCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    opacity: 0.8,
  },
  archivedHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  archivedLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  archivedCategory: {
    fontSize: 12,
    color: "#6B7280",
    marginLeft: 8,
  },
  archivedActions: {
    flexDirection: "row",
    gap: 8,
  },
  restoreButton: {
    padding: 8,
    backgroundColor: "#EBF8FF",
    borderRadius: 6,
  },
  deleteButton: {
    padding: 8,
    backgroundColor: "#FEF2F2",
    borderRadius: 6,
  },
  archivedTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  archivedLocation: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 12,
  },
  archivedFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 8,
  },
  archivedTime: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  originalTime: {
    fontSize: 12,
    color: "#9CA3AF",
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
  taskIdBadge: {
    backgroundColor: "#EBF8FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  taskIdTextDetail: {
    color: "#3B82F6",
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
  // Quick Info Grid
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
  // Section Cards
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
  // Instructions
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
  // Resources
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
})
