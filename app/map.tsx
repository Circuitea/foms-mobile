"use client"

import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { useState } from "react"
import {
    FlatList,
    Modal,
    Platform,
    SafeAreaView,
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

export default function MapScreen() {
  const [sidebarVisible, setSidebarVisible] = useState(false)
  const [selectedSection, setSelectedSection] = useState<string | null>(null)
  const [selectedPersonnel, setSelectedPersonnel] = useState<Personnel | null>(null)
  const [fullScreenMapVisible, setFullScreenMapVisible] = useState(false)

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

              <View style={styles.fullScreenMapContainer}>{renderMapContent(true)}</View>
            </SafeAreaView>
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
                            <View
                              style={[styles.statusIndicator, { backgroundColor: getStatusColor(person.status) }]}
                            />
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
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
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
    backgroundColor: "#1E3A8A",
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
})
