import React, { useState, useEffect, useRef, useContext } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Platform,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as FileSystem from "expo-file-system";
import CameraIcon from "../../../../../assets/icons/camera.svg";
import CameraFlipIcon from "../../../../../assets/icons/camera-flip.svg";
import { ThemeContext } from "../../../../../utils/ThemeContext";

const PHOTOS_DIRECTORY = `${FileSystem.documentDirectory}survey_images/`;

const MultiplePhotoQuestion = ({
  question,
  value = [],
  onChange,
  required = false,
  hint = "",
}) => {
  const { theme } = useContext(ThemeContext);
  const cameraRef = useRef(null);
  const [facing, setFacing] = useState("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [showCamera, setShowCamera] = useState(false);
  const [photos, setPhotos] = useState(value || []);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);

  // Ensure photos directory exists
  useEffect(() => {
    const ensureDirectoryExists = async () => {
      try {
        const dirInfo = await FileSystem.getInfoAsync(PHOTOS_DIRECTORY);
        if (!dirInfo.exists) {
          await FileSystem.makeDirectoryAsync(PHOTOS_DIRECTORY, {
            intermediates: true,
          });
        }
      } catch (error) {
        console.error("Error creating photos directory:", error);
      }
    };
    ensureDirectoryExists();
  }, []);

  // Request camera permission on mount
  useEffect(() => {
    const requestCameraPermission = async () => {
      if (!permission?.granted) {
        await requestPermission();
      }
    };
    requestCameraPermission();
  }, []);

  // Clean up photos when component unmounts
  useEffect(() => {
    return () => {
      // Clean up photos that are no longer needed
      const cleanupPhotos = async () => {
        try {
          const dirInfo = await FileSystem.getInfoAsync(PHOTOS_DIRECTORY);
          if (dirInfo.exists) {
            const files = await FileSystem.readDirectoryAsync(PHOTOS_DIRECTORY);
            for (const file of files) {
              const filePath = `${PHOTOS_DIRECTORY}${file}`;
              const isPhotoInUse = photos.some(
                (photo) => photo.uri === filePath
              );
              if (!isPhotoInUse) {
                await FileSystem.deleteAsync(filePath, { idempotent: true });
              }
            }
          }
        } catch (error) {
          console.error("Error cleaning up photos:", error);
        }
      };
      cleanupPhotos();
    };
  }, [photos]);

  useEffect(() => {
    onChange(photos);
  }, [photos]);

  const takePicture = async () => {
    if (!cameraRef.current || isProcessing || !isCameraReady) return;

    try {
      setIsProcessing(true);
      const options = {
        quality: 0.7,
        base64: false,
        exif: false,
        skipProcessing: Platform.OS === "ios", // Skip processing on iOS
      };
      const newPhoto = await cameraRef.current.takePictureAsync(options);

      // Create a unique filename with timestamp
      const fileName = `photo_${Date.now()}.jpg`;
      const targetPath = `${PHOTOS_DIRECTORY}${fileName}`;

      // Copy the image to permanent location
      await FileSystem.copyAsync({
        from: newPhoto.uri,
        to: targetPath,
      });

      // Delete the temporary photo
      await FileSystem.deleteAsync(newPhoto.uri, { idempotent: true });

      // Add the new photo to the array
      const newPhotos = [...photos, { uri: targetPath }];
      setPhotos(newPhotos);
      setShowCamera(false);
      setIsProcessing(false);

      // Ask if user wants to add another photo
      Alert.alert("Add Another Photo", "Would you like to add another photo?", [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => {
            // Add a small delay before showing the camera again
            setTimeout(() => {
              setShowCamera(true);
            }, 100);
          },
        },
      ]);
    } catch (error) {
      console.error("Error taking or saving photo:", error);
      Alert.alert(
        "Error",
        "There was an error taking the photo. Please try again."
      );
      setShowCamera(false);
      setIsProcessing(false);
    }
  };

  const removePhoto = async (index) => {
    try {
      const photoToRemove = photos[index];
      if (photoToRemove?.uri) {
        await FileSystem.deleteAsync(photoToRemove.uri, { idempotent: true });
      }
      const newPhotos = photos.filter((_, i) => i !== index);
      setPhotos(newPhotos);
    } catch (e) {
      console.warn("Failed to delete photo:", e);
    }
  };

  const toggleCameraFacing = () => {
    if (isProcessing) return;
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const handleCameraPress = async () => {
    if (isProcessing) return;

    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert(
          "Permission Required",
          "Camera permission is required to take photos."
        );
        return;
      }
    }
    setShowCamera(true);
  };

  const handleCameraReady = () => {
    setIsCameraReady(true);
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={[styles.message, { color: theme.colors.text }]}>
          We need your permission to show the camera
        </Text>
        <TouchableOpacity
          style={[
            styles.permissionButton,
            { backgroundColor: theme.colors.primary },
          ]}
          onPress={requestPermission}
        >
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
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
        {hint ? (
          <Text
            style={[styles.hintText, { color: theme.colors.secondaryText }]}
          >
            {hint}
          </Text>
        ) : null}
      </View>

      {showCamera ? (
        <View style={styles.cameraContainer}>
          <CameraView
            style={styles.camera}
            facing={facing}
            ref={cameraRef}
            onCameraReady={handleCameraReady}
            enableTorch={false}
            enableZoomGesture={false}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, isProcessing && styles.buttonDisabled]}
              onPress={toggleCameraFacing}
              disabled={isProcessing}
            >
              <CameraFlipIcon />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, isProcessing && styles.buttonDisabled]}
              onPress={takePicture}
              disabled={isProcessing || !isCameraReady}
            >
              <CameraIcon />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.photosContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {photos.map((photo, index) => (
              <View key={index} style={styles.photoWrapper}>
                <Image
                  style={styles.photo}
                  source={{ uri: photo.uri }}
                  resizeMode="cover"
                />
                <TouchableOpacity
                  style={[
                    styles.removeButton,
                    { backgroundColor: theme.colors.error },
                  ]}
                  onPress={() => removePhoto(index)}
                >
                  <Text style={styles.removeButtonText}>×</Text>
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity
              style={[
                styles.addButton,
                { backgroundColor: theme.colors.primary },
              ]}
              onPress={handleCameraPress}
            >
              <CameraIcon />
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    flex: 1,
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
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
    backgroundColor: "transparent",
    position: "absolute",
    bottom: 25,
  },
  button: {
    height: 60,
    width: 60,
    borderRadius: 40,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  photosContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  photoWrapper: {
    marginRight: 10,
    position: "relative",
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeButton: {
    position: "absolute",
    top: -10,
    right: -10,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "red",
    alignItems: "center",
    justifyContent: "center",
  },
  removeButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  addButton: {
    width: 100,
    height: 100,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: {
    color: "white",
    fontSize: 40,
    fontWeight: "bold",
  },
  permissionButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  permissionButtonText: {
    color: "white",
    fontSize: 16,
  },
  message: {
    textAlign: "center",
    marginBottom: 10,
  },
});

export default MultiplePhotoQuestion;
