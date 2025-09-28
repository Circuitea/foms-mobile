"use client"

import api from "@/lib/api"
import { Task } from "@/types/tasks"
import { ConsumableItem, ConsumableTransaction, EquipmentItem, EquipmentTransaction, Transaction } from "@/types/transaction"
import { Ionicons } from "@expo/vector-icons"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useEffect, useState } from "react"
import {
  ActivityIndicator,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native"

type TaskWithProps = Task & {
  transaction?: Transaction & {
    equipment?: (EquipmentTransaction & { item: EquipmentItem })[],
    consumables?: (ConsumableTransaction & { item: ConsumableItem })[],
  }
}

export default function TasksScreen() {
  const { id } = useLocalSearchParams();
  const [task, setTask] = useState<TaskWithProps | null>(null);
  useEffect(() => {
    async function getTask() {
      const response = await api.get<{ task: TaskWithProps }>(`/task/${id}`);

      if (!!response.data.task) {
        setTask(response.data.task);
      }
    }

    console.log(`Fetching tasks details for ID ${id}`)

    setTask(null)
    getTask()
  }, [id]);

  const router = useRouter();

  return !task ? (
    <ActivityIndicator />
  ) : (
    <View style={styles.modalContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#1B2560" />
      <SafeAreaView style={styles.modalSafeArea}>
        <View
          style={styles.modalHeader}
        >
          <TouchableOpacity style={styles.backButton} onPress={() => router.navigate('/(tabs)/tasks')}>
            <Ionicons name="arrow-back" size={24} color="#000000" />
          </TouchableOpacity>
          <Text style={styles.modalHeaderTitle}>Task Details</Text>
          <View style={styles.headerSpacer} />
        </View>

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
                      task.priority.name === "Urgent"
                        ? "#FF4D4D"
                        : task.priority.name === "High"
                          ? "#F59E0B"
                          : "#1B2560",
                  },
                ]}
              >
                <Text style={styles.priorityText}>{task.priority.name}</Text>
              </View>
              <View style={styles.categoryBadgeDetail}>
                <Text style={styles.categoryTextDetail}>{task.type.name}</Text>
              </View>
            </View>
            <Text style={styles.detailTitle}>{task.title}</Text>
          </View>

          {/* Quick Info Grid */}
          <View style={styles.quickInfoGrid}>
            <View style={styles.quickInfoItem}>
              <Ionicons name="location" size={20} color="#FF4D4D" />
              <View style={styles.quickInfoContent}>
                <Text style={styles.quickInfoLabel}>Location</Text>
                <Text style={styles.quickInfoValue}>{task.location}</Text>
              </View>
            </View>
            <View style={styles.quickInfoItem}>
              <Ionicons name="time" size={20} color="#1B2560" />
              <View style={styles.quickInfoContent}>
                <Text style={styles.quickInfoLabel}>Time</Text>
                <Text style={styles.quickInfoValue}>TIME AGO</Text>
              </View>
            </View>
            <View style={styles.quickInfoItem}>
              <Ionicons name="person" size={20} color="#10B981" />
              <View style={styles.quickInfoContent}>
                <Text style={styles.quickInfoLabel}>Assigned To</Text>
                <Text style={styles.quickInfoValue}>ME</Text>
              </View>
            </View>
          </View>

          {/* Description Section */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <Ionicons name="document-text" size={20} color="#1B2560" />
              <Text style={styles.sectionTitle}>Description</Text>
            </View>
            <Text style={styles.descriptionText}>{task.description}</Text>
          </View>

          {/* Additional Details */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <Ionicons name="information-circle" size={20} color="#1B2560" />
              <Text style={styles.sectionTitle}>Additional Information</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Task ID:</Text>
              <Text style={styles.detailValue}>{task.id || "N/A"}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Reported By:</Text>
              <Text style={styles.detailValue}>CREATOR</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Status:</Text>
              <Text style={styles.detailValue}>STATUS</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Due Date:</Text>
              <Text style={styles.detailValue}>DUE DATE</Text>
            </View>
          </View>


          {/* Required Resources (for active tasks) */}
          {!!task.transaction && (
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeaderRow}>
                <Ionicons name="apps" size={20} color="#1B2560" />
                <Text style={styles.sectionTitle}>Required Resources</Text>
              </View>
              <View style={styles.resourceGrid}>
                {task.transaction?.equipment?.map(equipment => (
                  <View key={equipment.id} style={styles.resourceItem}>
                    <Ionicons name="construct" size={16} color="#1B2560" />
                    <Text style={styles.resourceText}>{equipment.item.name}</Text>
                  </View>
                ))}

                {task.transaction?.consumables?.map(consumable => (
                  <View key={consumable.id} style={styles.resourceItem}>
                    <Ionicons name="cube" size={16} color="#1B2560" />
                    <Text style={styles.resourceText}>{consumable.item.name} x {consumable.quantity}</Text>
                  </View>
                ))}
                {/* <View style={styles.resourceItem}>
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
                </View> */}
              </View>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  // Enhanced Header styles with new gradient colors
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
    color: "#000000",
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