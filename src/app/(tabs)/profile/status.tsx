import api from "@/lib/api";
import { useProfile, useProfileDispatch } from "@/providers/ProfileProvider";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from '@react-native-picker/picker';
import { useRouter } from "expo-router";
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Status() {
  const router = useRouter();
  const profile = useProfile();
  const profileDispatch = useProfileDispatch();
  
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1B2560" translucent={false} hidden={false} />

      {/* Updated Header with curved bottom */}
      <View style={styles.headerContainer}>
        <SafeAreaView style={styles.headerSafeArea}>
          <View style={styles.headerContent}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.push("/profile")}>
              <Ionicons name="arrow-back" size={24} color="#000000" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Status</Text>
            <View style={{ width: 24 }} />
          </View>
        </SafeAreaView>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Change Status</Text>

          <TouchableOpacity style={styles.contactItem}>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={profile.status}
                dropdownIconColor="#000000"
                onValueChange={(status) => {
                  api.post('/status', { status });
                  profileDispatch({
                    type: 'updateStatus',
                    status: status,
                  });
                }}
                style={styles.picker}
              >
                <Picker.Item label="Available" value="available"/>
                <Picker.Item label="Assigned to Task" value="assigned"/>
                <Picker.Item label="On Leave" value="on leave"/>
                <Picker.Item label="Emergency" value="emergency"/>
              </Picker>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
    marginBottom: 16,
    overflow: "hidden",
    width: '100%',
  },
  picker: {
    width: '100%',
    color: "#1B2560",
    fontSize: 16,
    paddingHorizontal: 8,
  },
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  // Updated Header styles with curved bottom (matching profile screen)
  headerContainer: {
    position: "relative",
    zIndex: 10,
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
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000000",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 15, // Adjusted to account for curved header
    marginTop: -15, // Pull content up slightly to overlap with the curve
  },
  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1B2560",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  contactItem: {
    flexDirection: "row",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  contactIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#3B82F6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  contactDetails: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  contactValue: {
    fontSize: 14,
    color: "#1B2560",
    fontWeight: "500",
    marginBottom: 2,
  },
  contactHours: {
    fontSize: 12,
    color: "#6B7280",
  },
  faqItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  faqHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111827",
    flex: 1,
    paddingRight: 16,
  },
  faqAnswer: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 12,
    lineHeight: 20,
  },
  reportButton: {
    backgroundColor: "#1B2560",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  reportButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: "#1B2560",
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
  reportSection: {
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
  reportLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#FFFFFF",
  },
  selectedCategory: {
    backgroundColor: "#1B2560",
    borderColor: "#1B2560",
  },
  categoryText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  selectedCategoryText: {
    color: "#FFFFFF",
  },
  reportTextArea: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    backgroundColor: "#FFFFFF",
    minHeight: 120,
    marginBottom: 20,
  },
  submitReportButton: {
    backgroundColor: "#1B2560",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  submitReportText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
})