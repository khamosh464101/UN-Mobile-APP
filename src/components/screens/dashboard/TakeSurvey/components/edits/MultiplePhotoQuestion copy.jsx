import React, { useState, useRef, useContext, useMemo } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Dimensions,
  Modal,
  ActivityIndicator,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from 'expo-image-picker';
import CameraIcon from "../../../../../../assets/icons/camera.svg";
import CloseIcon from "../../../../../../assets/icons/close.svg";
import CloseDarkIcon from "../../../../../../assets/icons/close-dark.svg";
import CameraFlipIcon from "../../../../../../assets/icons/camera-flip.svg";
import GalleryIcon from "../../../../../../assets/icons/gallery.svg";
import { ThemeContext } from "../../../../../../utils/ThemeContext";
import axios from "../../../../../../utils/axios";
import { getErrorMessage } from "../../../../../../utils/flatten";

const { width: screenWidth } = Dimensions.get("window");

const MultiplePhotoQuestion = ({
  question,
  value = [],
  name,
  generalSubmission,
  setGeneralSubmission,
  currentQuestion,
  onChange,
  required = false,
  hint = "",
  maxPhotos = 10,
}) => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme.dark;
  const cameraRef = useRef(null);
  const [facing, setFacing] = useState("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Extract relation paths from currentQuestion
  const path = currentQuestion?._original?.$xpath;
  const parts = path?.split("/") || [];
  const relationOne = parts[1];
  const relationTwo = name;

  // Normalize photos to always be { uri: string, id?: string } format
  const photos = useMemo(() => {
    if (!Array.isArray(value)) return [];
    return value.map(item => {
      if (typeof item === 'string') return { uri: item };
      if (item?.url) return { uri: item.url, id: item.id };
      return item;
    });
  }, [value]);

  const uploadPhotoToBackend = async (fileUri) => {
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      const fileName = fileUri.split('/').pop();
      const formData = new FormData();
      
      formData.append('photo', {
        uri: fileUri,
        name: fileName,
        type: 'image/jpeg',
      });
      formData.append('submission_id', generalSubmission.id);
      formData.append('relation_id', generalSubmission[relationOne]?.id || '');
      formData.append('name', name);
      formData.append('relation', relationOne);
      formData.append('table', relationTwo);

      const { data: result } = await axios.post(
        `/data-managements/submissions/add-photo`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(progress);
          },
        }
      );

      return result.data;
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const processAndAddPhoto = async (photoUri) => {
    try {
      // Create unique filename
      const fileName = `photo_${Date.now()}.jpg`;
      const targetPath = `${FileSystem.documentDirectory}survey_images/${fileName}`;

      // Ensure directory exists
      await FileSystem.makeDirectoryAsync(
        `${FileSystem.documentDirectory}survey_images/`,
        { intermediates: true }
      );

      // Move the image to permanent storage
      await FileSystem.moveAsync({
        from: photoUri,
        to: targetPath,
      });

      // Temporarily add the local URI
      const tempPhotos = [...photos, { uri: targetPath }];
      onChange(tempPhotos.map(p => p.uri));

      // Upload to backend
      const uploadedPhoto = await uploadPhotoToBackend(targetPath);
      
      // Replace temp entry with backend response
      const updatedPhotos = [
        ...photos,
        { uri: uploadedPhoto.url, id: uploadedPhoto.id }
      ];
      onChange(updatedPhotos.map(p => p.uri));

      // Update general submission state if needed
      if (setGeneralSubmission && relationOne && relationTwo) {
        setGeneralSubmission(prev => ({
          ...prev,
          [relationOne]: {
            ...prev[relationOne],
            [relationTwo]: [
              ...(prev[relationOne][relationTwo] || []),
              uploadedPhoto
            ]
          }
        }));
      }

      Alert.alert("Success", "Photo uploaded successfully!");
      return uploadedPhoto;
    } catch (error) {
      console.error("Error processing photo:", error);
      // Remove the temporary photo if upload failed
      const updatedPhotos = photos.filter((_, i) => i !== photos.length - 1);
      onChange(updatedPhotos.map(p => p.uri));
      Alert.alert("Error", getErrorMessage(error));
      return null;
    }
  };

  const takePicture = async () => {
    if (!cameraRef.current || (maxPhotos && photos.length >= maxPhotos)) return;

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
        exif: false,
      });
      await processAndAddPhoto(photo.uri);
    } catch (error) {
      console.error("Error taking picture:", error);
      Alert.alert("Error", "Failed to take picture. Please try again.");
    }
  };

  const pickImage = async () => {
    if (maxPhotos && photos.length >= maxPhotos) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        await processAndAddPhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to select image. Please try again.");
    }
  };

  const removePhoto = async (index) => {
    const photoToRemove = photos[index];
    if (!photoToRemove) return;

    try {
      // Optimistic UI update
      const updatedPhotos = photos.filter((_, i) => i !== index);
      onChange(updatedPhotos.map(p => p.uri));

      // Delete from backend if it has an ID
      if (photoToRemove.id) {
        await axios.post(`/data-managements/submissions/remove-photo`, {
          id: photoToRemove.id,
          relation_id: generalSubmission[relationOne]?.id,
          name,
          relation: relationOne,
          table: relationTwo,
          submission_id: generalSubmission.id,
        });
      }

      // Delete local file if it exists
      if (photoToRemove.uri && (
        photoToRemove.uri.startsWith('file://') || 
        photoToRemove.uri.startsWith(FileSystem.documentDirectory)
      )) {
        await FileSystem.deleteAsync(photoToRemove.uri, { idempotent: true });
      }

      // Update general submission state if needed
      if (setGeneralSubmission && relationOne && relationTwo && photoToRemove.id) {
        setGeneralSubmission(prev => ({
          ...prev,
          [relationOne]: {
            ...prev[relationOne],
            [relationTwo]: prev[relationOne][relationTwo].filter(
              item => item.id !== photoToRemove.id
            )
          }
        }));
      }

      Alert.alert("Success", "Photo removed successfully!");
    } catch (error) {
      console.error("Error removing photo:", error);
      // Revert UI if deletion failed
      onChange(photos.map(p => p.uri));
      Alert.alert("Error", getErrorMessage(error));
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
      onRequestClose={() => setIsModalVisible(false)}
    >
      <View style={[styles.centeredView, { backgroundColor: 'rgba(0,0,0,0.9)' }]}>
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
              Photos ({photos.length}{maxPhotos ? `/${maxPhotos}` : ''})
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
                  <CloseDarkIcon width={16} height={16} />
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
          Photos ({photos.length}{maxPhotos ? `/${maxPhotos}` : ''})
        </Text>
        {photos.length > 0 && (
          <TouchableOpacity
            style={styles.viewPhotosButton}
            onPress={() => setIsModalVisible(true)}
          >
            <Text style={{ color: theme.colors.text }}>View All</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.cameraContainer}>
        {isUploading && (
          <View style={styles.uploadOverlay}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={[styles.progressText, { color: theme.colors.text }]}>
              Uploading... {uploadProgress}%
            </Text>
          </View>
        )}
        
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
            disabled={isUploading}
          >
            <CameraFlipIcon width={24} height={24} fill={theme.colors.text} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.button, 
              (maxPhotos && photos.length >= maxPhotos) && { opacity: 0.5 }
            ]} 
            onPress={takePicture}
            disabled={isUploading || (maxPhotos && photos.length >= maxPhotos)}
          >
            <CameraIcon width={24} height={24} fill={theme.colors.text} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.button, 
              (maxPhotos && photos.length >= maxPhotos) && { opacity: 0.5 }
            ]} 
            onPress={pickImage}
            disabled={isUploading || (maxPhotos && photos.length >= maxPhotos)}
          >
            <GalleryIcon width={24} height={24} fill={theme.colors.text} />
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
    minHeight: 500,
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
  modalRelated: {
    marginBottom: 15,
    height: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    borderRadius: 7,
  },
  viewPhotosButton: {
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: theme.colors.primary,
  },
  cameraContainer: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: '#000',
    position: 'relative',
  },
  uploadOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  progressText: {
    marginTop: 10,
    fontSize: 16,
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
  photosTitle: {
    fontSize: 18,
    fontWeight: 'bold',
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