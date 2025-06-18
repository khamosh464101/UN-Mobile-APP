import React, { useState, useEffect, useRef, useContext } from "react";
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
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as FileSystem from "expo-file-system";
import CameraIcon from "../../../../../assets/icons/camera.svg";
import CameraFlipIcon from "../../../../../assets/icons/camera-flip.svg";
import { ThemeContext } from "../../../../../utils/ThemeContext";

const { width: screenWidth } = Dimensions.get("window");

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
  const [photos, setPhotos] = useState([]);

  // Initialize photos from value
  useEffect(() => {
    if (Array.isArray(value)) {
      setPhotos(value);
    }
  }, [value]);

  const takePicture = async () => {
    if (!cameraRef.current) return;

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 1,
        base64: false,
        exif: false,
      });

      const fileName = `photo_${Date.now()}.jpg`;
      const targetPath = `${FileSystem.documentDirectory}survey_images/${fileName}`;

      // Ensure directory exists
      await FileSystem.makeDirectoryAsync(
        `${FileSystem.documentDirectory}survey_images/`,
        {
          intermediates: true,
        }
      );

      // Copy the image
      await FileSystem.copyAsync({
        from: photo.uri,
        to: targetPath,
      });

      // Update photos array
      const newPhoto = { uri: targetPath };
      const updatedPhotos = [...photos, newPhoto];
      setPhotos(updatedPhotos);
      onChange(updatedPhotos);
    } catch (error) {
      console.error("Error taking picture:", error);
      Alert.alert("Error", "Failed to take picture. Please try again.");
    }
  };

  const removePhoto = async (index) => {
    try {
      const photoToRemove = photos[index];
      if (photoToRemove?.uri) {
        await FileSystem.deleteAsync(photoToRemove.uri, { idempotent: true });
      }
      const updatedPhotos = photos.filter((_, i) => i !== index);
      setPhotos(updatedPhotos);
      onChange(updatedPhotos);
    } catch (e) {
      console.warn("Failed to delete photo:", e);
    }
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
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
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

      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          facing={facing}
          ref={cameraRef}
          enableZoomGesture={false}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <CameraFlipIcon />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <CameraIcon />
          </TouchableOpacity>
        </View>
      </View>

      {photos.length > 0 && (
        <View style={styles.photosSection}>
          <Text style={[styles.photosTitle, { color: theme.colors.text }]}>
            Captured Photos
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={true}
            contentContainerStyle={styles.photoScrollContent}
          >
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
    height: 350,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 20,
  },
  camera: {
    flex: 1,
  },
  photosSection: {
    flex: 1,
    padding: 10,
  },
  photosTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  photoScrollContent: {
    paddingRight: 10,
  },
  photoWrapper: {
    marginRight: 10,
    position: "relative",
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
  removeButton: {
    position: "absolute",
    top: -10,
    right: -10,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  removeButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
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
  message: {
    textAlign: "center",
    marginBottom: 10,
  },
});

export default MultiplePhotoQuestion;
