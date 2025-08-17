import React, { useState, useEffect, useRef, useContext, useMemo } from "react";
import {
  View,
  Text,
  Button,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as FileSystem from "expo-file-system";
import CameraIcon from "../../../../../../assets/icons/camera.svg";
import CameraFlipIcon from "../../../../../../assets/icons/camera-flip.svg";
import { ThemeContext } from "../../../../../../utils/ThemeContext";
import { getErrorMessage, getIdAndTable } from "../../../../../../utils/flatten";
import Toast from "react-native-toast-message";
import axios from "../../../../../../utils/axios";

const PhotoQuestion = ({
  question,
  value, // Can be string (URL) or { uri: string }
  name,
  generalSubmission,
  onChange,
  required = false,
  hint = "",
}) => {
  const { theme } = useContext(ThemeContext);
  const cameraRef = useRef(null);
  const [facing, setFacing] = useState("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Normalize value to always be { uri: string } format
  const normalizedValue = useMemo(() => {
    if (!value) return null;
    return typeof value === 'string' ? { uri: value } : value;
  }, [value]);

  const takePicture = async () => {
  if (!cameraRef.current) return;
  
  try {
    setIsUploading(true);
    setUploadProgress(0);
    
    const options = { quality: 0.8, base64: false, exif: false };
    const newPhoto = await cameraRef.current.takePictureAsync(options);
    
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
      from: newPhoto.uri,
      to: targetPath,
    });

    // Prepare form data for upload
    const params = getIdAndTable(generalSubmission, name);
    const formData = new FormData();
    
    formData.append('photo', {
      uri: targetPath,
      name: fileName,
      type: 'image/jpeg',
    });
    
    formData.append('submission_id', generalSubmission.id);
    formData.append('id', params.id);
    formData.append('name', name);
    formData.append('table', params.table);

    // Upload to backend with progress tracking
    const { data: result } = await axios.post(
      `/data-managements/submissions/update-photo`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = (progressEvent.loaded / progressEvent.total) * 100;
          setUploadProgress(progress);
        },
      }
    );

    onChange(result[name]);
    Toast.show({
      type: 'success',
      text1: 'Success',
      text2: 'Photo saved successfully!'
    });

  } catch (error) {
    console.error("Error saving photo:", error);
    Toast.show({
      type: 'error',
      text1: 'Photo Error',
      text2: 'Could not save photo'
    });
    
    try {
      await FileSystem.deleteAsync(targetPath, { idempotent: true });
    } catch (e) {
      console.warn("Failed to clean up photo:", e);
    }
  } finally {
    setIsUploading(false);
    setUploadProgress(0);
  }
};

  const removePhoto = async () => {
    if (!normalizedValue?.uri) return;

    
    try {
      // Only delete if it's a local file (not a network URL)
      if (normalizedValue.uri.startsWith('file://') || 
          normalizedValue.uri.startsWith(FileSystem.documentDirectory)) {
        await FileSystem.deleteAsync(normalizedValue.uri, { idempotent: true });
      }
      onChange(null);
    } catch (e) {
      console.warn("Failed to delete photo:", e);
    }
  };

 
  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={[styles.message, { color: theme.colors.text }]}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="Grant Permission" />
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

      <View style={styles.cameraContainer}>
        {normalizedValue?.uri ? (
          <>
            <Image 
              style={styles.preview} 
              source={{ uri: normalizedValue.uri }} 
              resizeMode="contain"
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={removePhoto}>
                <CameraIcon width={24} height={24} fill={theme.colors.error} />
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <CameraView 
              style={styles.camera} 
              facing={facing} 
              ref={cameraRef}
              enableTorch={false}
            />
            {isUploading ? (
                <View style={styles.loaderContainer}>
                  <ActivityIndicator size="large" color={theme.colors.primary} />
                  {uploadProgress > 0 && (
                    <Text style={[styles.progressText, { color: theme.colors.text }]}>
                      {Math.round(uploadProgress)}% uploaded
                    </Text>
                  )}
                </View>
              ):
            <View style={styles.buttonContainer}>
              
              <TouchableOpacity
                style={styles.button}
                onPress={toggleCameraFacing}
              >
                <CameraFlipIcon width={24} height={24} fill={theme.colors.primary} />
              </TouchableOpacity>
               <TouchableOpacity style={styles.button} onPress={takePicture}>
                <CameraIcon width={24} height={24} fill={theme.colors.primary} />
              </TouchableOpacity>
              
            </View>}
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    marginBottom: 20, 
    flex: 1,
    minHeight: 400, // Ensure consistent height
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
    backgroundColor: '#000', // Black background for camera
    position: 'relative',
  },
  camera: { 
    flex: 1,
    aspectRatio: 3/4, // Standard photo aspect ratio
  },
  preview: { 
    width: "100%", 
    flex: 1,
    aspectRatio: 3/4,
  },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
    position: "absolute",
    bottom: 25,
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
  message: {
    textAlign: "center",
    padding: 20,
  },
  loaderContainer: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0,0,0,0.5)',
},
progressText: {
  marginTop: 10,
  fontSize: 16,
},
});

export default PhotoQuestion;