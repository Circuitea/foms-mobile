"use client"

import { Ionicons } from "@expo/vector-icons"
import { useFocusEffect } from "@react-navigation/native"
import { LinearGradient } from "expo-linear-gradient"
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

interface Task {
  id: string
  type: "URGENT" | "NORMAL" | "HIGH"
  category: string
  title: string
  description: string
  location: string
  assignedTo: string
  assignedCount: number
  time: string
  timeAgo?: string
  status: "Checked" | "Unchecked"
  taskId?: string
  dueDate: string
  isRead: boolean
  department?: string
  reportedBy?: string
  isActive?: boolean
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

interface TasksScreenProps {
  initialTab?: "active" | "all"
}

export default function TasksScreen({ initialTab = "active" }: TasksScreenProps) {
  const [activeTab, setActiveTab] = useState<"active" | "all">(initialTab)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const scrollViewRef = useRef<ScrollView>(null)

  // Reset scroll position and states when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: false })
      // Reset any active states
      setDetailModalVisible(false)
      setSelectedTask(null)
    }, []),
  )

  const [activeTasks, setActiveTasks] = useState<Task[]>([
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
      isActive: true,
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
      isActive: true,
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
      isActive: true,
    },
  ])

  const [allTasks, setAllTasks] = useState<Task[]>([
    // Active tasks
    ...activeTasks,
    // Recent completed tasks
    {
      id: "7",
      type: "NORMAL",
      category: "Training",
      title: "Emergency Response Training - Team Beta",
      description: "Conduct monthly emergency response training for Team Beta members.",
      location: "CDRRMO Training Center",
      assignedTo: "Training Officer Santos",
      assignedCount: 1,
      time: "2 hours",
      timeAgo: "Completed 2 days ago",
      status: "Checked",
      dueDate: "1/14/2024",
      isRead: true,
      taskId: "TRN-2025-001",
      department: "Training Division",
      reportedBy: "Training Coordinator",
      isActive: false,
    },
    {
      id: "8",
      type: "HIGH",
      category: "Equipment Alert",
      title: "Radio Communication System Check",
      description: "Perform weekly radio communication system check and maintenance.",
      location: "Communications Room",
      assignedTo: "Tech Officer Reyes",
      assignedCount: 1,
      time: "3 hours",
      timeAgo: "Completed 1 day ago",
      status: "Checked",
      dueDate: "1/15/2024",
      isRead: true,
      taskId: "COMM-2025-002",
      department: "Communications",
      reportedBy: "Communications Chief",
      isActive: false,
    },
    {
      id: "9",
      type: "NORMAL",
      category: "Meeting Notice",
      title: "Weekly Operations Meeting",
      description: "Weekly operations meeting to discuss ongoing tasks and upcoming assignments.",
      location: "Conference Room A",
      assignedTo: "All Department Heads",
      assignedCount: 8,
      time: "1 hour",
      timeAgo: "Completed 3 days ago",
      status: "Checked",
      dueDate: "1/13/2024",
      isRead: true,
      taskId: "MTG-2025-003",
      department: "Administration",
      reportedBy: "CDRRMO Director",
      isActive: false,
    },
  ])

  // Notification states
  const [notificationsVisible, setNotificationsVisible] = useState(false)
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)
  const [notificationDetailVisible, setNotificationDetailVisible] = useState(false)
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null)
  const [activeNotificationTab, setActiveNotificationTab] = useState<"all" | "archived">("all")

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

  const handleTaskClick = (task: Task) => {
    // Mark task as read when clicked
    if (!task.isRead) {
      if (activeTab === "active") {
        setActiveTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, isRead: true } : t)))
      }
      setAllTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, isRead: true } : t)))
    }

    setSelectedTask({ ...task, isRead: true })
    setDetailModalVisible(true)
  }

  const handleCloseDetail = () => {
    setDetailModalVisible(false)
    setSelectedTask(null)
  }

  const handleMarkAllAsRead = () => {
    const currentTasks = activeTab === "active" ? activeTasks : allTasks
    const unreadCount = currentTasks.filter((t) => !t.isRead).length

    if (unreadCount === 0) {
      Alert.alert("Mark All as Read", `All ${activeTab} tasks are already marked as read.`)
      return
    }

    Alert.alert("Mark All as Read", `Mark all ${unreadCount} unread ${activeTab} tasks as read?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Mark All as Read", onPress: confirmMarkAllAsRead },
    ])
  }

  const confirmMarkAllAsRead = () => {
    if (activeTab === "active") {
      setActiveTasks((prev) => prev.map((task) => ({ ...task, isRead: true })))
    } else {
      setAllTasks((prev) => prev.map((task) => ({ ...task, isRead: true })))
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

  const handleRestoreNotification = (notificationId: string) => {
    const notification = archivedNotifications.find((n) => n.id === notificationId)
    if (!notification) return

    // Remove archivedAt property and add back to notifications
    const { archivedAt, ...restoredNotification } = notification

    // Add back to notifications list
    setNotifications((prev) => [restoredNotification, ...prev])

    // Remove from archived items
    setArchivedNotifications((prev) => prev.filter((item) => item.id !== notificationId))

    setActiveMenuId(null)
    Alert.alert("Restored", "Notification has been restored to your notifications.")
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

  const handleMarkAllNotificationsAsRead = () => {
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

  const getCurrentNotifications = () => {
    return activeNotificationTab === "all" ? notifications : archivedNotifications
  }

  const renderNotification = (notification: Notification) => (
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
            {activeNotificationTab === "archived" ? (
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

  const renderTask = (task: Task) => (
    <TouchableOpacity
      key={task.id}
      style={[styles.taskCard, !task.isRead && styles.unreadCard]}
      onPress={() => handleTaskClick(task)}
      activeOpacity={0.7}
    >
      <View style={styles.taskHeader}>
        <View style={styles.taskBadges}>
          <View
            style={[
              styles.typeBadge,
              { backgroundColor: task.type === "URGENT" ? "#FF4D4D" : task.type === "HIGH" ? "#F59E0B" : "#1B2560" },
            ]}
          >
            {task.type === "URGENT" && <Ionicons name="warning" size={12} color="#FFFFFF" />}
            <Text style={styles.typeText}>{task.type}</Text>
          </View>
          <View style={styles.categoryContainer}>
            <Text style={styles.taskCategory}>{task.category}</Text>
          </View>
          <View style={styles.statusIndicatorTask}>
            <View style={[styles.statusDot, { backgroundColor: task.isActive ? "#1B2560" : "#10B981" }]} />
            <Text style={[styles.statusTextTask, { color: task.isActive ? "#1B2560" : "#10B981" }]}>
              {task.isActive ? "IN PROGRESS" : "COMPLETED"}
            </Text>
          </View>
        </View>
      </View>

      <Text style={styles.taskTitle}>{task.title}</Text>
      <Text style={styles.taskDescription}>{task.description}</Text>

      <View style={styles.taskMeta}>
        <View style={styles.taskMetaRow}>
          <View style={styles.taskMetaItem}>
            <Ionicons name="location" size={16} color="#FF4D4D" />
            <Text style={styles.taskMetaText}>{task.location}</Text>
          </View>
          <View style={styles.taskMetaItem}>
            <Ionicons name="time-outline" size={16} color="#64748B" />
            <Text style={styles.taskMetaText}>{task.timeAgo || task.time}</Text>
          </View>
        </View>
        <View style={styles.taskMetaRow}>
          <View style={styles.taskMetaItem}>
            <Ionicons name="person-outline" size={16} color="#64748B" />
            <Text style={styles.taskMetaText}>{task.assignedTo}</Text>
          </View>
          <View style={styles.taskMetaItem}>
            <Ionicons name="calendar-outline" size={16} color="#64748B" />
            <Text style={styles.taskMetaText}>Due: {task.dueDate}</Text>
          </View>
        </View>
      </View>

      <View style={styles.taskFooter}>
        <View style={styles.readIndicator}>
          <View style={[styles.readDot, { backgroundColor: task.isRead ? "#9CA3AF" : "#FF4D4D" }]} />
          <Text style={styles.readText}>{task.isRead ? "Read" : "Unread"}</Text>
        </View>
        <Text style={styles.tapHint}>Tap for details</Text>
      </View>
    </TouchableOpacity>
  )

  const renderDetailModal = () => {
    if (!selectedTask) return null

    return (
      <Modal animationType="slide" transparent={false} visible={detailModalVisible} onRequestClose={handleCloseDetail}>
        <View style={styles.modalContainer}>
          <StatusBar barStyle="light-content" backgroundColor="#1B2560" />
          <SafeAreaView style={styles.modalSafeArea}>
            <LinearGradient
              colors={["#1B2560", "#FF4D4D"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.modalHeader}
            >
              <TouchableOpacity style={styles.backButton} onPress={handleCloseDetail}>
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
                  <View
                    style={[
                      styles.priorityBadge,
                      {
                        backgroundColor:
                          selectedTask.type === "URGENT"
                            ? "#FF4D4D"
                            : selectedTask.type === "HIGH"
                              ? "#F59E0B"
                              : "#1B2560",
                      },
                    ]}
                  >
                    <Text style={styles.priorityText}>{selectedTask.type}</Text>
                  </View>
                  <View style={styles.categoryBadgeDetail}>
                    <Text style={styles.categoryTextDetail}>{selectedTask.category}</Text>
                  </View>
                </View>
                <Text style={styles.detailTitle}>{selectedTask.title}</Text>
                <View style={styles.readStatusRow}>
                  <View
                    style={[styles.readStatusDot, { backgroundColor: selectedTask.isRead ? "#10B981" : "#F59E0B" }]}
                  />
                  <Text style={styles.readStatusText}>{selectedTask.isRead ? "Read" : "Unread"}</Text>
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
                    <Text style={styles.quickInfoLabel}>Time</Text>
                    <Text style={styles.quickInfoValue}>{selectedTask.timeAgo || selectedTask.time}</Text>
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
                  <Ionicons name="business" size={20} color="#8B5CF6" />
                  <View style={styles.quickInfoContent}>
                    <Text style={styles.quickInfoLabel}>Department</Text>
                    <Text style={styles.quickInfoValue}>{selectedTask.department || "N/A"}</Text>
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

              {/* Additional Details */}
              <View style={styles.sectionCard}>
                <View style={styles.sectionHeaderRow}>
                  <Ionicons name="information-circle" size={20} color="#1B2560" />
                  <Text style={styles.sectionTitle}>Additional Information</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Task ID:</Text>
                  <Text style={styles.detailValue}>{selectedTask.taskId || "N/A"}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Reported By:</Text>
                  <Text style={styles.detailValue}>{selectedTask.reportedBy || "N/A"}</Text>
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
                    <Text style={styles.instructionText}>
                      {selectedTask.category === "Meeting Notice"
                        ? "Check meeting details and confirm attendance"
                        : "Assemble at designated staging area immediately"}
                    </Text>
                  </View>
                  <View style={styles.instructionItem}>
                    <View style={styles.instructionNumber}>
                      <Text style={styles.instructionNumberText}>2</Text>
                    </View>
                    <Text style={styles.instructionText}>
                      {selectedTask.category === "Meeting Notice"
                        ? "Prepare necessary documents and materials"
                        : "Conduct equipment check before deployment"}
                    </Text>
                  </View>
                  <View style={styles.instructionItem}>
                    <View style={styles.instructionNumber}>
                      <Text style={styles.instructionNumberText}>3</Text>
                    </View>
                    <Text style={styles.instructionText}>
                      {selectedTask.category === "Meeting Notice"
                        ? "Join meeting at scheduled time"
                        : "Establish communication protocols"}
                    </Text>
                  </View>
                  <View style={styles.instructionItem}>
                    <View style={styles.instructionNumber}>
                      <Text style={styles.instructionNumberText}>4</Text>
                    </View>
                    <Text style={styles.instructionText}>
                      {selectedTask.category === "Meeting Notice"
                        ? "Participate actively in discussions"
                        : "Brief team on specific mission objectives"}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Required Resources (for active tasks) */}
              {selectedTask.isActive && (
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
              )}
            </ScrollView>
          </SafeAreaView>
        </View>
      </Modal>
    )
  }

  const setActiveTabWithReset = (tab: "active" | "all") => {
    setActiveTab(tab)
    scrollViewRef.current?.scrollTo({ y: 0, animated: false })
  }

  const getUnreadActiveTasksCount = () => {
    return activeTasks.filter((t) => !t.isRead).length
  }

  const getUnreadAllTasksCount = () => {
    return allTasks.filter((t) => !t.isRead).length
  }

  const getCurrentTasks = () => {
    return activeTab === "active" ? activeTasks : allTasks
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1B2560" translucent={false} hidden={false} />

      <View style={styles.content}>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "active" && styles.activeTab]}
            onPress={() => setActiveTabWithReset("active")}
          >
            <View style={styles.tabContent}>
              <Ionicons name="time-outline" size={18} color={activeTab === "active" ? "#1B2560" : "#64748B"} />
              <Text style={[styles.tabText, activeTab === "active" && styles.activeTabText]}>
                Active Tasks
              </Text>
              {getUnreadActiveTasksCount() > 0 && (
                <View style={styles.tabBadge}>
                  <Text style={styles.tabBadgeText}>{getUnreadActiveTasksCount()}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "all" && styles.activeTab]}
            onPress={() => setActiveTabWithReset("all")}
          >
            <View style={styles.tabContent}>
              <Ionicons name="list-outline" size={18} color={activeTab === "all" ? "#1B2560" : "#64748B"} />
              <Text style={[styles.tabText, activeTab === "all" && styles.activeTabText]}>
                All Tasks
              </Text>
              {getUnreadAllTasksCount() > 0 && (
                <View style={styles.tabBadge}>
                  <Text style={styles.tabBadgeText}>{getUnreadAllTasksCount()}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionHeaderContainer}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleContainer}>
              <Ionicons name={activeTab === "active" ? "time" : "list"} size={24} color="#1B2560" />
              <Text style={styles.sectionTitle}>{activeTab === "active" ? "Active Tasks" : "All Tasks"}</Text>
            </View>
            <TouchableOpacity style={styles.markAllButton} onPress={handleMarkAllAsRead}>
              <Ionicons name="checkmark-done" size={16} color="#1B2560" />
              <Text style={styles.markAllButtonText}>Mark All as Read</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.contentContainer}>
          <ScrollView
            ref={scrollViewRef}
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            bounces={true}
            overScrollMode="always"
          >
            <View>{getCurrentTasks().map(renderTask)}</View>
          </ScrollView>
        </View>
      </View>

      {renderDetailModal()}

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

            {/* Notification Tabs */}
            <View style={styles.notificationTabContainer}>
              <TouchableOpacity
                style={[styles.notificationTab, activeNotificationTab === "all" && styles.activeNotificationTab]}
                onPress={() => setActiveNotificationTab("all")}
              >
                <Ionicons
                  name="notifications-outline"
                  size={18}
                  color={activeNotificationTab === "all" ? "#1B2560" : "#64748B"}
                />
                <Text
                  style={[
                    styles.notificationTabText,
                    activeNotificationTab === "all" && styles.activeNotificationTabText,
                  ]}
                >
                  All
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.notificationTab, activeNotificationTab === "archived" && styles.activeNotificationTab]}
                onPress={() => setActiveNotificationTab("archived")}
              >
                <Ionicons
                  name="archive-outline"
                  size={18}
                  color={activeNotificationTab === "archived" ? "#1B2560" : "#64748B"}
                />
                <Text
                  style={[
                    styles.notificationTabText,
                    activeNotificationTab === "archived" && styles.activeNotificationTabText,
                  ]}
                >
                  Archived
                </Text>
              </TouchableOpacity>
            </View>

            {/* Section Header with Mark All Button - Only show for non-archived notifications */}
            {activeNotificationTab === "all" && (
              <View style={styles.sectionHeaderContainer}>
                <View style={styles.sectionHeaderRow}>
                  {/* Notification Bell + Title */}
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Ionicons name="notifications-outline" size={20} color="#1B2560" style={{ marginRight: 6 }} />
                    <Text style={styles.sectionTitle}>All Notifications</Text>
                  </View>

                  {/* Mark All as Read Button */}
                  <TouchableOpacity style={styles.markAllButton} onPress={handleMarkAllNotificationsAsRead}>
                    <Ionicons name="checkmark-done" size={16} color="#1B2560" />
                    <Text style={styles.markAllButtonText}>Mark All as Read</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Archived Header - Only show for archived notifications */}
            {activeNotificationTab === "archived" && (
              <View style={styles.sectionHeaderContainer}>
                <View style={styles.sectionHeaderRow}>
                  {/* Archive Icon + Title */}
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Ionicons name="archive-outline" size={20} color="#64748B" style={{ marginRight: 6 }} />
                    <Text style={styles.sectionTitle}>Archived Notifications</Text>
                  </View>
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
                  {getCurrentNotifications().length === 0 ? (
                    <View style={styles.emptyState}>
                      <Ionicons
                        name={activeNotificationTab === "all" ? "notifications-off" : "archive"}
                        size={64}
                        color="#9CA3AF"
                      />
                      <Text style={styles.emptyStateTitle}>
                        No {activeNotificationTab === "all" ? "Notifications" : "Archived Notifications"}
                      </Text>
                      <Text style={styles.emptyStateText}>
                        {activeNotificationTab === "all" ? "You're all caught up!" : "No archived notifications yet"}
                      </Text>
                    </View>
                  ) : (
                    getCurrentNotifications().map(renderNotification)
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
                {/* Archive Button - Only show for non-archived notifications */}
                {activeNotificationTab !== "archived" && (
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
                )}

                {/* Restore Button - Only show for archived notifications */}
                {activeNotificationTab === "archived" && (
                  <TouchableOpacity
                    style={[styles.archiveButton, { backgroundColor: "#10B981" }]}
                    onPress={() => {
                      handleRestoreNotification(selectedNotification.id)
                      setNotificationDetailVisible(false)
                    }}
                  >
                    <Ionicons name="refresh" size={20} color="#FFFFFF" />
                    <Text style={styles.archiveButtonText}>Restore</Text>
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
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  content: {
    flex: 1,
    marginTop: -20,
  },
  // Enhanced tab container
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    marginTop: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderBottomWidth: 3,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#1B2560",
  },
  tabContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    gap: 8,
  },
  tabText: {
    fontSize: 15,
    color: "#64748B",
    fontWeight: "600",
    textAlign: "center",
  },
  activeTabText: {
    color: "#1B2560",
    fontWeight: "700",
  },
  tabBadge: {
    position: "absolute",
    top: -10,
    right: -10,
    backgroundColor: "#FF4D4D",
    borderRadius: 12,
    minWidth: 20,
    height: 20,
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
  // Enhanced section header
  sectionHeaderContainer: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 36,
    gap: 20,
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1B2560",
    letterSpacing: 0.3,
  },
  taskCounter: {
    backgroundColor: "#FF4D4D",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginLeft: 8,
  },
  taskCounterText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
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
  contentContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 30,
  },
  // Enhanced Task Card Styles
  taskCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
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
  taskHeader: {
    marginBottom: 16,
  },
  taskBadges: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 10,
  },
  typeBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  typeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  categoryContainer: {
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  taskCategory: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "600",
  },
  statusIndicatorTask: {
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
  },
  statusTextTask: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 12,
    lineHeight: 24,
  },
  taskDescription: {
    fontSize: 15,
    color: "#64748B",
    lineHeight: 22,
    marginBottom: 20,
  },
  taskMeta: {
    marginBottom: 20,
    gap: 12,
  },
  taskMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },
  taskMetaItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 8,
  },
  taskMetaText: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "500",
    flex: 1,
  },
  taskFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    paddingTop: 16,
    gap: 16,
  },
  readIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  readDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  readText: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "500",
  },
  progressContainer: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  progressBar: {
    width: "100%",
    height: 4,
    backgroundColor: "#F1F5F9",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#1B2560",
    borderRadius: 2,
  },
  progressText: {
    fontSize: 11,
    color: "#64748B",
    fontWeight: "500",
  },
  tapHint: {
    fontSize: 13,
    color: "#1B2560",
    fontStyle: "italic",
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
  backButton: {
    padding: 8,
  },
  modalHeaderTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  headerSpacer: {
    width: 40,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
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
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
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
  // Enhanced Notification Modal Styles
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
  notificationTabContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  notificationTab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    paddingHorizontal: 16,
    gap: 10,
    borderBottomWidth: 3,
    borderBottomColor: "transparent",
  },
  activeNotificationTab: {
    borderBottomColor: "#1B2560",
  },
  notificationTabText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#64748B",
  },
  activeNotificationTabText: {
    color: "#1B2560",
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
  // Enhanced Archive Button
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
})