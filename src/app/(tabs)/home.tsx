"use client"

import api from "@/lib/api"
import { useProfile, useProfileDispatch } from "@/providers/ProfileProvider"
import { Status } from "@/types"
import { Task } from "@/types/tasks"
import { Ionicons } from "@expo/vector-icons"
import { useFocusEffect } from "@react-navigation/native"
import dayjs from "dayjs"
import { useRouter } from "expo-router"
import { useCallback, useRef, useState } from "react"
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native"

export default function HomeScreen() {
  const router = useRouter()
  const scrollViewRef = useRef<ScrollView>(null)
  const profile = useProfile();
  const profileDispatch = useProfileDispatch();
  const [activeTask, setActiveTask] = useState<Task | null>(null);


  // Reset scroll position when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      async function getActiveTask() {
        const response = await api.get<{ task: Task }>('/active-task');

        if (response.status === 200) {
          setActiveTask(response.data.task);
        }
      }

      async function updateStatus() {
        const response = await api.get<{ status: Status }>('/status');
        
        if (response.status === 200) {
          profileDispatch({ type: 'updateStatus', status: response.data.status });
        }
      }

      scrollViewRef.current?.scrollTo({ y: 0, animated: false })

      getActiveTask();
      updateStatus();
      
      const interval = setInterval(updateStatus, 5000);

      return () => {
        clearInterval(interval);
      }

    }, []),
  )

  async function changeStatus(status: Status) {
    const response = await api.post<{ status: Status }>('/status', { status });

    if (response.status === 200) {
      profileDispatch({ type: 'updateStatus' , status: response.data.status});
    }
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
            <Text style={styles.greeting}>Good Day, {profile.first_name}!</Text>
            <Text style={styles.subGreeting}>Ready to keep our community safe today</Text>
            <View style={styles.separator} />
          </View>

          {/* Enhanced Personnel Tracking Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="people-outline" size={20} color="#1B2560" />
              <Text style={styles.sectionTitle}>Status</Text>
            </View>
            <View style={styles.metricsGrid}>
              <TouchableOpacity
                style={[styles.metricCard, profile.status === 'available' && { backgroundColor: '#10B981' }]}
                onPress={() => changeStatus('available')}
              >
                <View style={[styles.iconContainer, { backgroundColor: "#10B981" }]}>
                  <Ionicons name="checkmark-circle" size={16} color="white" />
                </View>
                <Text style={[styles.metricLabel, profile.status === 'available' && { color: 'white' }]}>Available</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.metricCard, profile.status === 'on break' && { backgroundColor: '#F59E0B' }]}
                onPress={() => changeStatus('on break')}
              >
                <View style={[styles.iconContainer, { backgroundColor: "#F59E0B" }]}>
                  <Ionicons name="cafe" size={16} color="white" />
                </View>
                <Text style={[styles.metricLabel, profile.status === 'on break' && { color: 'white' }]}>On Break</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.metricCard, profile.status === 'unavailable' &&  { backgroundColor: '#525252' }]}
                onPress={() => changeStatus('unavailable')}
              >
                <View style={[styles.iconContainer, { backgroundColor: "#525252" }]}>
                  <Ionicons name="time" size={16} color="white" />
                </View>
                <Text style={[styles.metricLabel, profile.status === 'unavailable' && { color: 'white' }]}>Off Duty</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.metricCard, profile.status === 'emergency' && { backgroundColor: '#FF4D4D' }]}
                onPress={() => changeStatus('emergency')}
              >
                <View style={[styles.iconContainer, { backgroundColor: "#FF4D4D" }]}>
                  <Ionicons name="warning" size={16} color="white" />
                </View>
                <Text style={[styles.metricLabel, profile.status === 'emergency' && { color: 'white' }]}>Emergency</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="clipboard-outline" size={20} color="#1B2560" />
              <Text style={styles.sectionTitle}>ACTIVE TASK</Text>
            </View>

            {!activeTask ? (
              <Text style={{ textAlign: 'center', paddingVertical: 20 }}>No Active Task</Text>
            ) : (
              <TouchableOpacity
                style={styles.taskCard}
                activeOpacity={0.7}
                onPress={() => router.navigate(`/(tabs)/task/${activeTask.id}`)}
              >
                <View style={styles.taskHeader}>
                  <View style={[styles.urgentBadge, activeTask.priority.name !== 'urgent' && {
                    backgroundColor: '#1B2560',
                  }]}>
                    <Ionicons name="warning" size={12} color="#FFFFFF" />
                    <Text style={styles.urgentText}>{activeTask.priority.name}</Text>
                  </View>
                  <Text style={styles.taskType}>{activeTask.type.name}</Text>
                </View>

                <Text style={styles.taskTitle}>{activeTask.title}</Text>

                <Text style={styles.taskDescription}>{activeTask.description}</Text>

                {/* Replace the existing taskFooter section (around lines 580-610) with: */}
                <View style={styles.taskFooter}>
                  <View style={styles.taskLocation}>
                    <Ionicons name="location" size={16} color="#FF4D4D" />
                    <Text style={styles.taskLocationText}>{activeTask.location}</Text>
                  </View>

                  <View style={styles.taskMeta}>
                    <View>
                      <Ionicons name="time-outline" size={14} color="#6B7280" />
                      <Text>Created: {dayjs(activeTask.created_at).format('YYYY/MM/DD - hh:mm A')}</Text>
                    </View>

                    <View>
                      <Ionicons name="calendar-outline" size={14} color="#6B7280" />
                      <Text>Due Date: {dayjs(activeTask.due_date).format('YYYY/MM/DD hh:mm A')}</Text>
                    </View>
                  </View>

                  <View style={styles.taskActionContainer}>
                    <Text style={styles.tapHint}>Tap for details</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}

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
    padding: 12, // Changed from 12 to 16
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
