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
  Modal,
  SafeAreaView,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as FileSystem from "expo-file-system";
import CameraIcon from "../../../../../assets/icons/camera.svg";
import CloseIcon from "../../../../../assets/icons/close.svg";
import CloseDarkIcon from "../../../../../assets/icons/close-dark.svg";
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
  const isDark = theme.dark;
  const cameraRef = useRef(null);
  const [facing, setFacing] = useState("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [photos, setPhotos] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

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

  function renderModal() {
    return (
      <Modal
        animationType="slide" 
        transparent={true}
        visible={isModalVisible}
        statusBarTranslucent={true}
        onRequestClose={() => {
          setIsModalVisible(!isModalVisible);
        }}
      >

        <View style={styles.centeredView}>
          <View
            style={[
              styles.modalView,
              {
                backgroundColor: theme.colors.background,
                width: screenWidth,
                height: "90%",
              },
            ]}
          >
            <View
              style={[
                styles.modalHeader,
                { backgroundColor: theme.colors.lightBlack },
              ]}
            >
              <Text style={[styles.photosTitle, { color: theme.colors.text }]}>
                Captured Photos
              </Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                {isDark ? <CloseDarkIcon /> : <CloseIcon />}
              </TouchableOpacity>
            </View>

            {photos.length > 0 && (
              <View style={styles.photosSection}>
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
                        { backgroundColor: theme.colors.primary },
                      ]}
                      onPress={() => removePhoto(index)}
                    >
                      <Text style={styles.removeButtonText}>
                        <CloseDarkIcon />
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </Modal>
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

      <View
        style={[
          styles.modalRelated,
          { backgroundColor: theme.colors.lightBlack },
        ]}
      >
        <Text style={{ color: theme.colors.text }}>
          {" "}
          Captured Photos ({photos.length})
        </Text>
        {photos.length && (
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
        {renderModal()}
      </View>
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
    marginBottom: 20,
  },
  camera: {
    flex: 1,
  },
  photosSection: {
    height: "100%",
    width: "100%",
    padding: 10,
    flex: 1,
    gap: 15,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  photosTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  photoScrollContent: {
    width: "100%",
  },
  photoWrapper: {
    position: "relative",
  },
  photo: {
    width: 200,
    height: 200,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
  removeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 34,
    height: 34,
    borderRadius: 20,
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
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
  modalView: {
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  modalHeader: {
    width: "100%",
    height: 50,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5,
  },
});

export default MultiplePhotoQuestion;