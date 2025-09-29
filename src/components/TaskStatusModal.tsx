import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { Modal, ModalProps, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "./Button";

export function TaskStatusModal(props: ModalProps & {
  onTaskFinish?: (notes?: string) => void,
  onTaskCancel?: () => void,
  onOpenChange?: (open: boolean) => void,
}) {
  const [action, setAction] = useState<'finish' | 'cancel' | null>(null);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (!props.visible) {
      setAction(null);
    }
  }, [props.visible]);

  return (
    <Modal {...props}>
      <View style={[styles.modalContainer, { backgroundColor: "#1B2560" }]}>
          <StatusBar barStyle="light-content" backgroundColor="#1B2560" />
          <SafeAreaView style={styles.modalSafeArea}>
            <LinearGradient
              colors={["#1B2560", "#FF4D4D"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.modalHeader}
            >
              <TouchableOpacity style={styles.backButton} onPress={() => props.onOpenChange && props.onOpenChange(false)}>
                <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <Text style={styles.modalHeaderTitle}>Update Task Status</Text>
              <View style={styles.headerSpacer} />
            </LinearGradient>

            <View style={styles.modalContent}>
              {!action
                ? (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                    }}
                  >
                    <Button title="Finish Task" onPress={() => setAction('finish')} />
                    <Button title="Cancel Task" onPress={() => setAction('cancel')} />
                  </View>
                )
                : action === 'finish'
                  ? (
                    <View style={{
                      flex: 1,
                      justifyContent: 'flex-start',
                    }}>
                      <Text>Additional Notes</Text>
                      <TextInput
                        style={styles.multilineInput}
                        value={notes}
                        onChangeText={setNotes}
                        multiline
                        numberOfLines={3}
                      />
                      <Button title="Submit and Finalize Task" onPress={() => props.onTaskFinish && props.onTaskFinish(notes)} />
                      <Button title="Cancel" onPress={() => setAction(null)} />
                    </View>
                  )
                  : (
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                      <Text>Are you sure you want to cancel the task?</Text>
                      <Button title="Cancel the Task" onPress={() => props.onTaskCancel && props.onTaskCancel()} />
                      <Button title="Go Back" onPress={() => setAction(null)} />
                    </View>

                  )}
            </View>
          </SafeAreaView>
        </View>
    </Modal>
  );
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
});