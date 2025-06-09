"use client"

import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import {
  type LocationObject,
  type LocationSubscription,
  requestForegroundPermissionsAsync,
  watchPositionAsync,
} from "expo-location"
import { useRouter } from "expo-router"
import { useEffect, useState } from "react"
import {
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
  const [location, setLocation] = useState<LocationObject | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [isTracking, setIsTracking] = useState(false)
  const [fullScreenMapVisible, setFullScreenMapVisible] = useState(false)
  const [selectedTask, setSelectedTask] = useState<TaskData | null>(null)
  const [taskDetailModalVisible, setTaskDetailModalVisible] = useState(false)

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

  const handleMapClick = () => {
    setFullScreenMapVisible(true)
  }

  const handleBackFromFullScreen = () => {
    setFullScreenMapVisible(false)
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

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
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
              style={styles.taskCard}
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
                router.push("/tasks?tab=tasks")
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.viewAllText}>View all tasks</Text>
              <Ionicons name="chevron-forward" size={16} color="#3B82F6" />
            </TouchableOpacity>
          </View>
        </ScrollView>

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
              <LinearGradient
                colors={["#1E3A8A", "#3B82F6", "#EF4444"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.fullScreenHeader}
              >
                <TouchableOpacity style={styles.backButton} onPress={handleBackFromFullScreen}>
                  <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.fullScreenTitle}>Interactive Map</Text>
                <View style={styles.headerSpacer} />
              </LinearGradient>

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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  greetingContainer: {
    marginTop: 20,
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
    marginBottom: 20, // Increased from 15 to 20 for more spacing
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 8, // Add top margin for extra spacing
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
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
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
    marginBottom: 8,
  },
  taskDescription: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
    marginBottom: 16,
  },
  taskFooter: {
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 12,
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
    paddingTop: 8,
    marginTop: 8,
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
})
