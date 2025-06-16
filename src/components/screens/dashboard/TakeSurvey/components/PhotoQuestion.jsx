import React, { useState, useEffect, useRef, useContext } from "react";
import {
  View,
  Text,
  Button,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as FileSystem from "expo-file-system";
import CameraIcon from "../../../../../assets/icons/camera.svg";
import CameraFlipIcon from "../../../../../assets/icons/camera-flip.svg";
import { ThemeContext } from "../../../../../utils/ThemeContext";

const PhotoQuestion = ({
  question,
  value,
  onChange,
  required = false,
  hint = "",
}) => {
  const { theme } = useContext(ThemeContext);
  const cameraRef = useRef(null);

  const [facing, setFacing] = useState("back");
  const [permission, requestPermission] = useCameraPermissions();

  const takePicture = async () => {
    if (!cameraRef.current) return;
    const options = { quality: 1, base64: true, exif: false };
    const newPhoto = await cameraRef.current.takePictureAsync(options);
    try {
      // Create a unique filename with timestamp
      const fileName = `photo_${Date.now()}.jpg`;
      const targetPath = `${FileSystem.documentDirectory}survey_images/${fileName}`;

      // Ensure directory exists
      await FileSystem.makeDirectoryAsync(
        `${FileSystem.documentDirectory}survey_images/`,
        {
          intermediates: true,
        }
      );

      // Copy the image to permanent location
      await FileSystem.copyAsync({
        from: newPhoto.uri,
        to: targetPath,
      });

      // Save only the new uri (permanent location)
      onChange({ uri: targetPath });
    } catch (error) {
      console.error("Error saving image to permanent location", error);
    }
  };

  const removePhoto = async () => {
    if (value?.uri) {
      try {
        await FileSystem.deleteAsync(value.uri, { idempotent: true });
      } catch (e) {
        console.warn("Failed to delete photo:", e);
      }
    }
    onChange(null);
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
        {value?.uri ? (
          <>
            <Image style={styles.preview} source={{ uri: value.uri }} />
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={removePhoto}>
                <CameraIcon />
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <CameraView style={styles.camera} facing={facing} ref={cameraRef} />

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={toggleCameraFacing}
              >
                <CameraFlipIcon />
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={takePicture}>
                <CameraIcon />
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 20, flex: 1 },
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
  camera: { flex: 1 },
  cameraButtonContainer: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "flex-end",
    marginBottom: 20,
    position: "absolute",
  },
  preview: { width: "100%", flex: 1 },
  // message: {
  //   textAlign: "center",
  //   paddingBottom: 10,
  // },

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
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "red",
  },
});

export default PhotoQuestion;
