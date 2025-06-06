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
import CameraIcon from "../../../../../assets/icons/camera.svg";
import CameraFlipIcon from "../../../../../assets/icons/camera-flip.svg";
import { ThemeContext } from "../../../../../utils/ThemeContext";

const PhotoQuestion = ({ question, value, onChange }) => {
  const { theme } = useContext(ThemeContext);
  const cameraRef = useRef(null);

  const [facing, setFacing] = useState("back");
  const [permission, requestPermission] = useCameraPermissions();

  const takePicture = async () => {
    if (!cameraRef.current) return;
    const options = { quality: 1, base64: true, exif: false };
    const newPhoto = await cameraRef.current.takePictureAsync(options);
    onChange({ uri: newPhoto.uri, base64: newPhoto.base64 });
  };

  const removePhoto = () => {
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
      <Text style={[styles.question, { color: theme.colors.text }]}>
        {question}
      </Text>
      <View style={styles.cameraContainer}>
        {value?.base64 ? (
          <>
            <Image
              style={styles.preview}
              source={{ uri: "data:image/jpg;base64," + value.base64 }}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => setPhoto(null)}
              >
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
  question: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
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
