import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { Image, Modal, ModalProps, Platform, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "./Button";

export function TaskStatusModal(props: ModalProps & {
  onTaskFinish?: (notes?: string, attachments?: ImagePicker.ImagePickerAsset[]) => void,
  onTaskCancel?: () => void,
  onOpenChange?: (open: boolean) => void,
}) {
  const [action, setAction] = useState<'finish' | 'cancel' | null>(null);
  const [notes, setNotes] = useState('');
  const [attachments, setAttachments] = useState<ImagePicker.ImagePickerAsset[]>([]);

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      setAttachments([
        ...attachments,
        ...result.assets,
      ])
      console.log(result);
    }
  }

  const takePhotoAsync = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Camera permission is required to take photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      setAttachments(prev => [...prev, ...result.assets]);
      console.log('Photo taken', result);
    }
  }

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  }
  
  useEffect(() => {
    if (!props.visible) {
      setAction(null);
      setAttachments([]);
    }
  }, [props.visible]);

  const handleFinish = () => {
    if (props.onTaskFinish) props.onTaskFinish(notes, attachments);
    if (props.onOpenChange) props.onOpenChange(false);
  };

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
                      <View style={{ flex: 1, flexDirection: 'row', gap: 10 }}>
                        <TouchableOpacity onPress={takePhotoAsync} style={styles.button} activeOpacity={0.7}>
                          <Ionicons name="camera" color="white" />
                          <Text style={{ color: 'white' }}>Take a Photo</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={pickImageAsync} style={styles.button} activeOpacity={0.7}>
                          <Ionicons name="images" color="white" />
                          <Text style={{ color: 'white' }}>Pick from Gallery</Text>
                        </TouchableOpacity>
                      </View>

                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={{ height: 160 }}
                        contentContainerStyle={{ alignItems: 'center', paddingHorizontal: 8 }}
                      >
                        {attachments.length > 0 ? attachments.map((attachment, index) => {
                          const aspect = attachment.width && attachment.height
                            ? attachment.width / attachment.height
                            : undefined;

                          return (
                            <View key={index} style={{ height: '100%', marginRight: 12, position: 'relative' }}>
                              <Image
                                source={{ uri: attachment.uri }}
                                resizeMode="contain"
                                style={{
                                  height: '100%',           // fit the ScrollView height
                                  aspectRatio: aspect,     // preserve aspect ratio
                                  borderRadius: 8,
                                  backgroundColor: '#fff'
                                }}
                              />
                              <TouchableOpacity
                                style={styles.removeButton}
                                onPress={() => removeAttachment(index)}
                                accessibilityLabel="Remove attachment"
                              >
                                <Ionicons name="close" size={16} color="#fff" />
                              </TouchableOpacity>
                            </View>
                          );
                        }) : (
                          <Text>No Attachments</Text>
                        )}
                      </ScrollView>

                      <Button title="Submit and Finalize Task" onPress={handleFinish} />
                      <Button title="Cancel" onPress={() => setAction(null)} />
                    </View>
                  )
                  : (
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                      <Text>Are you sure you want to cancel the task?</Text>
                      <Button title="Cancel the Task" onPress={() => {
                        if (props.onTaskCancel) {
                          props.onTaskCancel()
                        }

                        if (props.onOpenChange) {
                          props.onOpenChange(false)
                        }
                      }} />
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
  button: {
    height: 40,
    backgroundColor: Platform.OS === 'android' ? '#2196F3' : '#007AFF',
    paddingVertical: 5,
    borderRadius: 50,
    flex: 1,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10
  },
  removeButton: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
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