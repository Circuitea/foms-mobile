import api from "@/lib/api";
import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Modal, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "./Button";

interface NotificationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void,
}

type Notification = TaskAssignedNotification;

interface TaskAssignedNotification {
  id: string;
  type: 'task-assigned';
  data: {
    task: {
      id: number;
      title: string;
      description: string;
    };
  };

  read_at?: string;
  created_at?: string;
  updated_at?: string;
}

export function NotificationModal({ open, onOpenChange }: NotificationModalProps) {
  const [activeTab, setActiveTab] = useState<"unread" | "all">('unread');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const scrollViewRef = useRef<ScrollView>(null)

  useEffect(() => {
    async function getNotifications() {
      const response = await api.get<Notification[]>(`/notifications/${activeTab}`);

      if (response.status === 200) {
        setNotifications(response.data)
      }
    }

    if (open) {
      setNotifications([]);
      getNotifications();
    }
  }, [open, activeTab]);

  const setActiveTabWithReset = (tab: "unread" | "all") => {
    setActiveTab(tab)
    scrollViewRef.current?.scrollTo({ y: 0, animated: false })
  }

  async function markNotificationAs(id: string, status: 'read' | 'unread', index: number) {
    const response = await api.patch<{ notification: Notification }>(`/notifications/${id}/${status}`);

    if (response.status === 200) {
      const entries = [...notifications];
      entries[index] = response.data.notification;
      setNotifications(entries);
    }
  }
  
  return (
    <Modal
      animationType="slide"
      visible={open}
      transparent={false}
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
            <TouchableOpacity style={styles.backButton} onPress={() => onOpenChange(false)}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.modalHeaderTitle}>Notifications</Text>
            <View style={styles.headerSpacer} />
          </LinearGradient>

          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === "unread" && styles.activeTab]}
              onPress={() => setActiveTabWithReset("unread")}
            >
              <View style={styles.tabContent}>
                <Ionicons name="time-outline" size={18} color={activeTab === "unread" ? "#1B2560" : "#64748B"} />
                <Text style={[styles.tabText, activeTab === "unread" && styles.activeTabText]}>
                  Unread
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === "all" && styles.activeTab]}
              onPress={() => setActiveTabWithReset("all")}
            >
              <View style={styles.tabContent}>
                <Ionicons name="list-outline" size={18} color={activeTab === "all" ? "#1B2560" : "#64748B"} />
                <Text style={[styles.tabText, activeTab === "all" && styles.activeTabText]}>
                  All Notifications
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <ScrollView
            ref={scrollViewRef}
            style={{ flex: 1 }}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            bounces={true}
            overScrollMode="always"
          >
            <View>{!!notifications && notifications.length > 0 ? notifications.map((notification, index) => (
              <View
                key={notification.id}
                style={[styles.taskCard]}
              >
                {notification.type === 'task-assigned' && <TaskAssignedDetails onAction={() => {
                  onOpenChange(false)
                  markNotificationAs(notification.id, 'read', index)
                }} notification={ notification} />}


                <View style={styles.taskFooter}>
                  <View style={styles.readIndicator}>
                    {/* <View style={[styles.readDot, { backgroundColor: task.isRead ? "#9CA3AF" : "#FF4D4D" }]} /> */}
                    {/* <Text style={styles.readText}>{task.isRead ? "Read" : "Unread"}</Text> */}

                    <View style={styles.notificationMetaRow}>
                      <View style={styles.notificationMetaItem}>
                        <Ionicons name="time-outline" size={16} color="#64748B" />
                        <Text style={styles.notificationMetaText}>{dayjs(notification.created_at).format('YYYY/MM/DD hh:mm A')}</Text>
                      </View>
                      
                      {!!notification.read_at ? (
                        <TouchableOpacity onPress={() => markNotificationAs(notification.id, 'unread', index)} activeOpacity={0.7} style={[styles.markButton, styles.markButtonUnread]}>
                          <Text style={[styles.markButtonText, styles.markButtonUnreadText]}>Mark as Unread</Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity onPress={() => markNotificationAs(notification.id, 'read', index)} activeOpacity={0.7} style={styles.markButton}>
                          <Text style={styles.markButtonText}>Mark as Read</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </View>
              </View>
            )) : (
              <Text>No {activeTab === 'unread' ? 'unread ' : ''}notifications</Text>
            )}</View>
          </ScrollView>

        </SafeAreaView>
      </View>
    </Modal>
  )
}

function TaskAssignedDetails({ notification, onAction }: { notification: TaskAssignedNotification, onAction?: () => void }) {
  const router = useRouter();

  return (
    <>
      <View style={{ flex: 1 }}>
        <Text style={styles.notificationTitle}>New Task Assignment: '{notification.data.task.title}'</Text>
        <Text style={styles.notificationDescription}>You have been assigned to task '{notification.data.task.title}'</Text>
      </View>
      <View style={styles.notificationMeta}>
        <View style={styles.notificationMetaRow}>
          <View style={styles.notificationMetaItem}>
            <Button title="View Task" onPress={() => {
              if (onAction) onAction();
              router.navigate(`/(tabs)/task/${notification.data.task.id}`)
            }} />
          </View>
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
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
  multilineInput: {
    minHeight: 80,
    maxHeight: 160,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#1E293B",
    marginBottom: 16,
    textAlignVertical: "top", // ensures text starts at the top for multiline
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
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
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 30,
  },
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
  notificationMeta: {
    marginBottom: 20,
    gap: 12,
  },
  notificationMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },
  notificationMetaItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 8,
  },
  notificationMetaText: {
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
  tapHint: {
    fontSize: 13,
    color: "#1B2560",
    fontStyle: "italic",
    fontWeight: "500",
  },
  notificationTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 12,
    lineHeight: 24,
  },
  notificationDescription: {
    fontSize: 15,
    color: "#64748B",
    lineHeight: 22,
    marginBottom: 20,
  },
  markButton: {
    paddingHorizontal: 16,
    height: 40,
    borderWidth: 1,
    borderColor: "#1B2560",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    shadowColor: "#1B2560",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  markButtonText: {
    color: "#1B2560",
    fontWeight: "bold",
    fontSize: 15,
    letterSpacing: 0.5,
  },
  markButtonUnread: {
    backgroundColor: "#FF4D4D",
    borderColor: "#FF4D4D",
  },
  markButtonUnreadText: {
    color: "#FFF",
  },
});