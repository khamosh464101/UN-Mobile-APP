import React, { useState, useEffect, useRef, useContext, useMemo } from "react";
import {
  View,
  Text,
  Button,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Dimensions,
  Modal,
  SafeAreaView,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as FileSystem from "expo-file-system";
import CameraIcon from "../../../../../../assets/icons/camera.svg";
import CloseIcon from "../../../../../../assets/icons/close.svg";
import CloseDarkIcon from "../../../../../../assets/icons/close-dark.svg";
import CameraFlipIcon from "../../../../../../assets/icons/camera-flip.svg";
import { ThemeContext } from "../../../../../../utils/ThemeContext";
import { getErrorMessage, getIdAndTable } from "../../../../../../utils/flatten";
import axios from "../../../../../../utils/axios";
import Toast from "react-native-toast-message";

const { width: screenWidth } = Dimensions.get("window");

const MultiplePhotoQuestion = ({
  question,
  value = [], // Can be array of strings or { uri: string } objects
  name,
  generalSubmission,
  setGeneralSubmission,
  currentQuestion,
  onChange,

  required = false,
  hint = "",
  maxPhotos = 10, // Optional limit
}) => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme.dark;
  const cameraRef = useRef(null);
  const [facing, setFacing] = useState("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Normalize photos to always be { uri: string } format
  const photos = useMemo(() => {
    if (!Array.isArray(value)) return [];
    return value.map(item => typeof item === 'string' ? { uri: item } : item);
  }, [value]);

 const takePicture = async () => {
  if (!cameraRef.current || (maxPhotos && photos.length >= maxPhotos)) return;

  try {
    // 1. Capture photo from camera
    const photo = await cameraRef.current.takePictureAsync({
      quality: 0.8,
      base64: false,
      exif: false,
    });

    // 2. Prepare file storage
    const fileName = `photo_${Date.now()}.jpg`;
    const targetPath = `${FileSystem.documentDirectory}survey_images/${fileName}`;

    // 3. Ensure directory exists
    await FileSystem.makeDirectoryAsync(
      `${FileSystem.documentDirectory}survey_images/`,
      { intermediates: true }
    );

    // 4. Move photo to permanent storage
    await FileSystem.moveAsync({
      from: photo.uri,
      to: targetPath,
    });

    // 5. Prepare form data for backend submission
    const path = currentQuestion?._original?.$xpath;
    const parts = path.split("/");
    const relationOne = parts[1];
    
    const formData = new FormData();
    formData.append('photo', {
      uri: targetPath,
      name: fileName,
      type: 'image/jpeg'
    });
    formData.append('submission_id', generalSubmission.id);
    formData.append('relation_id', generalSubmission[relationOne].id);
    formData.append('name', name);
    formData.append('relation', relationOne);
    formData.append('table', name === 'house_document_photo' ? 'land_ownership_document' : name);

    // 6. Submit to backend
    const { data: result } = await axios.post(
      `/data-managements/submissions/add-photo`, 
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      }
    );

    // 7. Update local state with backend response
    const updatedPhotos = [...photos, { uri: targetPath, id: result.data.id }];
    onChange(updatedPhotos);

    // 8. Update general submission state
    if (setGeneralSubmission) {
      setGeneralSubmission(prev => ({
        ...prev,
        [relationOne]: {
          ...prev[relationOne],
          [name]: [
            ...(prev[relationOne][name] || []),
            result.data
          ]
        }
      }));
    }

    // 9. Show success feedback
    Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Photo saved successfully!'
        });

  } catch (error) {
    Toast.show({
          type: 'error',
          text1: 'Failed',
          text2: getErrorMessage(error)
        });
  }
};


  const removePhoto = async (index) => {
  const photoToRemove = photos[index];
  
  if (!photoToRemove) return;

  try {
    // 1. Extract relation paths
    const path = currentQuestion?._original?.$xpath;
   
    const parts = path.split("/");
    const relationOne = parts[1];
    const relationTwo = name === 'house_document_photo' ? 'land_ownership_document' : name;

    const photoId = generalSubmission?.[relationOne]?.[relationTwo]?.find(row => row[name] === photoToRemove.uri).id;


    // 2. Optimistic UI update - remove from local state first
    const updatedPhotos = photos.filter((_, i) => i !== index);
    onChange(updatedPhotos.map(p => p.uri));

    
    // 3. Delete from backend if it has an ID
    if (photoId) {
      const { data: result } = await axios.post(
        `/data-managements/submissions/remove-photo`,
        {
          id: photoId,
          relation_id: generalSubmission[relationOne].id,
          name,
          relation: relationOne,
          table: relationTwo,
          submission_id: generalSubmission.id,
        }
      );
    }

    // 4. Delete local file if it exists
    if (photoToRemove.uri && (
      photoToRemove.uri.startsWith('file://') || 
      photoToRemove.uri.startsWith(FileSystem.documentDirectory)
    )) {
      await FileSystem.deleteAsync(photoToRemove.uri, { idempotent: true });
    }

    // 5. Update general submission state
    if (setGeneralSubmission && relationOne && relationTwo && photoId) {
      setGeneralSubmission(prev => ({
        ...prev,
        [relationOne]: {
          ...prev[relationOne],
          [relationTwo]: prev[relationOne][relationTwo].filter(
            item => item.id !== photoId
          ),
        },
      }));
    }

    // 6. Show success feedback
    Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Photo deleted successfully!'
        });

  } catch (error) {
    
    // 7. Revert UI if deletion failed
    onChange(photos.map(p => p.uri));
    
    Toast.show({
          type: 'error',
          text1: 'Failed',
          text2: getErrorMessage(error)
        });
  }
};
  

  const toggleCameraFacing = () => {
    setFacing(current => (current === "back" ? "front" : "back"));
  };

  const renderPhotoModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isModalVisible}
      statusBarTranslucent={true}
      onRequestClose={() => setIsModalVisible(false)}
    >
      <View style={[styles.centeredView, { backgroundColor: 'rgba(0,0,0,0.7)' }]}>
        <View style={[
          styles.modalView,
          { 
            backgroundColor: theme.colors.background,
            width: screenWidth * 0.95,
            maxHeight: '80%',
          }
        ]}>
          <View style={[
            styles.modalHeader,
            { backgroundColor: theme.colors.lightBlack }
          ]}>
            <Text style={[styles.photosTitle, { color: theme.colors.text }]}>
              Captured Photos ({photos.length})
            </Text>
            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
              {isDark ? <CloseDarkIcon width={24} height={24} /> : <CloseIcon width={24} height={24} />}
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.photosSection}>
            {photos.map((photo, index) => (
              <View key={`photo-${index}`} style={styles.photoWrapper}>
                <Image
                  style={styles.photo}
                  source={{ uri: photo.uri }}
                  resizeMode="cover"
                />
                <TouchableOpacity
                  style={[
                    styles.removeButton,
                    { backgroundColor: theme.colors.error }
                  ]}
                  onPress={() => removePhoto(index)}
                >
                  <CloseDarkIcon width={20} height={20} fill="red" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={[styles.message, { color: theme.colors.text }]}>
          We need your permission to show the camera
        </Text>
        <Button 
          onPress={requestPermission} 
          title="Grant Permission" 
          color={theme.colors.primary}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.questionHeader}>
        <Text style={[styles.question, { color: theme.colors.text }]}>
          {question}
          {required && <Text style={{ color: theme.colors.error }}> *</Text>}
        </Text>
        {hint && (
          <Text style={[styles.hintText, { color: theme.colors.secondaryText }]}>
            {hint}
          </Text>
        )}
      </View>

      <View style={[
        styles.modalRelated,
        { backgroundColor: theme.colors.lightBlack }
      ]}>
        <Text style={{ color: theme.colors.text }}>
          Captured Photos ({photos.length}{maxPhotos ? `/${maxPhotos}` : ''})
        </Text>
        {photos.length > 0 && (
          <TouchableOpacity
            style={{
              borderRadius: 4,
              paddingHorizontal: 8,
              paddingVertical: 4,
              backgroundColor: theme.colors.primary,
            }}
            onPress={() => setIsModalVisible(true)}
          >
            <Text style={{ color: theme.colors.text }}>View Photos</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          facing={facing}
          ref={cameraRef}
          enableZoomGesture={true}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.button} 
            onPress={toggleCameraFacing}
          >
            <CameraFlipIcon width={24} height={24} fill={theme.colors.text} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.button, 
              maxPhotos && photos.length >= maxPhotos && { opacity: 0.5 }
            ]} 
            onPress={takePicture}
            disabled={maxPhotos && photos.length >= maxPhotos}
          >
            <CameraIcon width={24} height={24} fill={theme.colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {renderPhotoModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    flex: 1,
    minHeight: 500, // Ensure consistent height
  },
  questionHeader: {
    marginBottom: 10,
  },
  question: {
    fontSize: 16,
    fontWeight: "bold",
  },
  hintText: {
    fontSize: 13,
    marginTop: 5,
    fontStyle: "italic",
  },
  cameraContainer: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
    aspectRatio: 3/4,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    position: "absolute",
    bottom: 25,
    width: '100%',
  },
  button: {
    height: 60,
    width: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.9)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalRelated: {
    marginBottom: 15,
    height: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    borderRadius: 7,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    borderRadius: 20,
    paddingBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    width: "100%",
    padding: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  photosSection: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    padding: 10,
    gap: 10,
  },
  photoWrapper: {
    position: "relative",
    width: '45%',
    aspectRatio: 1,
  },
  photo: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  removeButton: {
    position: "absolute",
    top: 5,
    right: 5,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    padding: 20,
  },
});

export default MultiplePhotoQuestion;