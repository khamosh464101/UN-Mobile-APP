import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  Modal,
  Dimensions,
  KeyboardAvoidingView,
  Platform, 
  ScrollView,
  ActivityIndicator
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import EmailIcon from "../../../../../assets/icons/profile/email.svg";
import EmailDarkIcon from "../../../../../assets/icons/profile/email-dark.svg";
import ProfileIcon from "../../../../../assets/icons/profile/profile.svg";
import ProfileDarkIcon from "../../../../../assets/icons/profile/profile-dark.svg";
import PhoneIcon from "../../../../../assets/icons/profile/phone.svg";
import PhoneDarkIcon from "../../../../../assets/icons/profile/phone-dark.svg";
import StaffDesc from "../../../../../assets/icons/profile/staff-desc.svg";
import StaffDescDark from "../../../../../assets/icons/profile/staff-desc-dark.svg";
import PencilIcon from "../../../../../assets/icons/profile/pencil.svg";
import PencilDarkIcon from "../../../../../assets/icons/profile/pencil-dark.svg";
import TickIcon from "../../../../../assets/icons/profile/square-tick.svg";
import TickDarkIcon from "../../../../../assets/icons/profile/square-tick-dark.svg";
import ArrowRightIcon from "../../../../../assets/icons/chevron-right.svg";
import ArrowRightDarkIcon from "../../../../../assets/icons/chevron-right-dark.svg";
import EyeIcon from "../../../../../assets/icons/login/eye.svg";
import EyeSlashIcon from "../../../../../assets/icons/login/eye-slash.svg";
import { ThemeContext } from "../../../../../utils/ThemeContext";
import { Input } from "../../../../common/Input";
import axios from "../../../../../utils/axios";
import Toast from "react-native-toast-message";
import { getErrorMessage } from "../../../../../utils/tools";
import { useUser } from "../../../../../../UserContext";
import { useNavigation } from "@react-navigation/native";

const ProfileInfoItem = ({ staff, setStaff}) => {
  const { width: screenWidth } = Dimensions.get("window");
  const { theme } = useContext(ThemeContext);
  const isDark = theme.dark;
  const localImage = require("../../../../../assets/images/image.png");
const { user, updateUser } = useUser();
  const [editField, setEditField] = useState(null);
  const [values, setValues] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  

  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const navigation = useNavigation();
  const handleEdit = (field) => setEditField(field);
  const handleSave = async (field) => {
  const value = values[field] !== undefined ? values[field] : staff[field]; // Use the edited value if it exists
  
  try {
    const { data } = await axios.post('/api/mobile/user-update', { field, value });

      // Update local staff state (preserved as per your requirement)
      setStaff((prv) => ({ ...prv, [field]: value }));

      // Update AsyncStorage and notify all components through context
      await updateUser({ [field]: value });

      // Clear the edited value
      setValues((prev) => {
        const newValues = { ...prev };
        delete newValues[field];
        return newValues;
      });

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Successfully updated!',
      });

  } catch (error) {
    Toast.show({
      type: 'error',
      text1: 'Failed!',
      text2: getErrorMessage(error),
    });
  }

  setEditField(null);
};

  const handleChange = async (field, value) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

const handlePasswordChange = async () => {
  try {
    // Validate passwords
    if (!password || !confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please fill in both password fields',
      });
      return;
    }

    if (password !== confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Passwords do not match',
      });
      return;
    }

    if (password.length < 6) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Password must be at least 6 characters',
      });
      return;
    }

    setIsUploading(true); // Show loading indicator

    const { data } = await axios.post('/api/mobile/change-password', { 
      password,
      password_confirmation: confirmPassword 
    });


    // Reset form and close modal
    setPassword('');
    setConfirmPassword('');
    setIsPasswordModalVisible(false);
    
    // Optional: Navigate to login or other screen
     navigation.navigate("Login");

  } catch (error) {
    console.error('Password change error:', error);
    Toast.show({
      type: 'error',
      text1: 'Failed!',
      text2: getErrorMessage(error) || 'Failed to change password',
    });
  } finally {
    setIsUploading(false); // Hide loading indicator
  }
};
    

  const renderField = (
    label,
    value,
    field,
    Icon,
    DarkIcon,
    multiline = false
  ) => (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>{isDark ? <DarkIcon /> : <Icon />}</View>
      <View
        style={[
          styles.textWrapper,
          { borderBottomColor: theme.colors.lightBlack },
        ]}
      >
        <Text style={[styles.label, { color: theme.colors.secondaryText }]}>
          {label}
        </Text>
        {editField === field ? (
          <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
            <TextInput
              style={[
                styles.value,
                {
                  color: theme.colors.text,
                  borderBottomColor: theme.colors.primary,
                  borderBottomWidth: 1,
                  flex: 1,
                  textAlignVertical: multiline ? "top" : "center",
                  ...(field === "staffDesc"
                    ? {
                        borderWidth: 1,
                        borderColor: theme.colors.inputBorder || "#E0E0E0",
                        borderRadius: 8,
                        paddingHorizontal: 8,
                        minHeight: 140,
                      }
                    : {}),
                },
              ]}
              value={values[field] !== undefined ? values[field] : staff[field]}
              onChangeText={(text) => handleChange(field, text)}
              multiline={multiline}
              numberOfLines={multiline ? 3 : 1}
              autoFocus
            />

            <TouchableOpacity
              onPress={() => handleSave(field)}
              style={{ marginLeft: 8, alignSelf: "flex-start" }}
            >
              {isDark ? (
                <TickDarkIcon width={18} height={18} />
              ) : (
                <TickIcon width={18} height={18} />
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
            <Text
              style={[styles.value, { color: theme.colors.text, flex: 1 }]}
              numberOfLines={multiline ? 0 : 1}
            >
              {value}
            </Text>
            <TouchableOpacity
              onPress={() => handleEdit(field)}
              style={{ marginLeft: 8, alignSelf: "flex-start" }}
            >
              {isDark ? (
                <PencilDarkIcon width={18} height={18} />
              ) : (
                <PencilIcon width={18} height={18} />
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );

  const renderProfileImageModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isProfileModalVisible}
      statusBarTranslucent={true}
      onRequestClose={() => {
        setIsProfileModalVisible(!isProfileModalVisible);
      }}
    >
      <View style={styles.centeredView}>
        <View
          style={[
            styles.modalView,
            {
              backgroundColor: theme.colors.background,
              width: screenWidth,
              height: "25%",
            },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.modalButton,
              { backgroundColor: theme.colors.lightBlack },
            ]}
            onPress={() => handleImageSelection('camera')}
          >
            <Text style={{ fontSize: 16, color: theme.colors.text }}>
              Take Photo
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.modalButton,
              { backgroundColor: theme.colors.lightBlack },
            ]}
            onPress={() => handleImageSelection('library')}
          >
            <Text style={{ fontSize: 16, color: theme.colors.text }}>
              Choose Photo
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.modalButton,
              { backgroundColor: theme.colors.lightBlack },
            ]}
            onPress={() => setIsProfileModalVisible(false)}
          >
            <Text style={{ fontSize: 16, color: theme.colors.text }}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderPasswordChangeModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isPasswordModalVisible}
      statusBarTranslucent={true}
      onRequestClose={() => {
        setIsPasswordModalVisible(!isPasswordModalVisible);
      }}
    >
      <View style={styles.centeredView}>
        <View
          style={[
            styles.modalView,
            {
              backgroundColor: theme.colors.background,
              width: screenWidth,
              height: "30%",
            },
          ]}
        >
          <Input
            style={{
              width: "100%",
              backgroundColor: theme.colors.lightBlack,
            }}
            onChangeText={setPassword}
            value={password}
            placeholder="Type Your Current Password"
            secureTextEntry={secureTextEntry}
            rightIcon={
              secureTextEntry ? (
                <EyeIcon width={24} height={24} fill="black" />
              ) : (
                <EyeSlashIcon width={24} height={24} fill="black" />
              )
            }
            onRightIconPress={() => setSecureTextEntry(!secureTextEntry)}
          />
          <Input
            style={{
              width: "100%",
              backgroundColor: theme.colors.lightBlack,
            }}
            placeholder="Type Your a New Password"
            secureTextEntry={secureTextEntry}
            onChangeText={setConfirmPassword}
            value={confirmPassword}
            rightIcon={
              secureTextEntry ? (
                <EyeIcon width={24} height={24} fill="black" />
              ) : (
                <EyeSlashIcon width={24} height={24} fill="black" />
              )
            }
            onRightIconPress={() => setSecureTextEntry(!secureTextEntry)}
          />
          <TouchableOpacity
            style={[
              styles.modalButton,
              { backgroundColor: theme.colors.primary },
            ]}
            onPress={() => handlePasswordChange()}
          >
            <Text style={{ fontSize: 16, color: "#fff" }}>Change Password</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.modalButton,
              { backgroundColor: theme.colors.lightBlack },
            ]}
            onPress={() => setIsPasswordModalVisible(false)}
          >
            <Text style={{ fontSize: 16, color: theme.colors.text }}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

const handleImageSelection = async (source) => {
  try {
    let result;
    
    // Handle permission requests based on source
    if (source === 'library') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Toast.show({
          type: 'error',
          text1: 'Permission required',
          text2: 'Please enable photo library access',
        });
        return;
      }

      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 4],
        quality: 0.8,
        selectionLimit: 1,
      });
    } else { // camera
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
    }

    if (result.canceled) {
      setIsProfileModalVisible(false);
      return;
    }

    const uri = result.assets[0].uri;

    // Prepare the image for upload
    const filename = uri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image/jpeg';

    const formData = new FormData();
    formData.append('photo', {
      uri,
      name: filename || 'profile.jpg',
      type: type || 'image/jpeg',
    });
    formData.append('field', 'photo');

    // Show loading indicator
    setIsUploading(true);

    // Upload the image
    const { data } = await axios.post('/api/mobile/user-update', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    await updateUser({ photo: data });

    Toast.show({
      type: 'success',
      text1: 'Success',
      text2: 'Profile photo updated successfully!',
    });
  } catch (error) {
    console.error('Image processing error:', error);
    Toast.show({
      type: 'error',
      text1: source === 'library' ? 'Gallery Error' : 'Camera Error',
      text2: 'Failed to update profile photo',
    });
  } finally {
    setIsUploading(false);
    setIsProfileModalVisible(false);
  }
};

  return (
    <View>
      <KeyboardAvoidingView
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    style={{ flex: 1 }}
  >
    <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
      <View style={styles.ProfileImageWrapper}>
        <TouchableOpacity
          style={{
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            overflow: "hidden",
            height: 100,
            width: 100,
            borderRadius: 100,
          }}
          onPress={() => setIsProfileModalVisible(true)}
        >
          <Image
            style={[
              styles.ProfileImage,
              { backgroundColor: theme.colors.lightBlack },
            ]}
            source={user?.photo ? { uri: user?.photo } : localImage}
            resizeMode="cover"
          />
          <Text
            style={{
              position: "absolute",
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              width: 100,
              paddingVertical: 5,
              bottom: 0,
              backgroundColor: "#000",
              color: "#fff",
              opacity: 0.7,
            }}
          >
            Edit
          </Text>
        </TouchableOpacity>
      </View>
      {renderField("Name", staff?.name, "name", ProfileIcon, ProfileDarkIcon)}
      {renderField("Email", staff?.personal_email, "personal_email", EmailIcon, EmailDarkIcon)}
      {renderField("Phone", staff?.phone2, "phone2", PhoneIcon, PhoneDarkIcon)}
      {renderField(
        "About",
        staff.about,
        "about",
        StaffDesc,
        StaffDescDark,
        true
      )}
      <View style={styles.container}>
        <View style={styles.iconWrapper}>
          {isDark ? <PencilDarkIcon /> : <PencilIcon />}
        </View>
        <TouchableOpacity
          onPress={() => setIsPasswordModalVisible(true)}
          style={{ marginLeft: 8, alignSelf: "flex-start", flex: 1 }}
        >
          <View style={[styles.textWrapper, { borderBottomWidth: 0 }]}>
            <Text style={[styles.label, { color: theme.colors.secondaryText }]}>
              Password
            </Text>

            <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
              <Text
                style={[styles.value, { color: theme.colors.primary, flex: 1 }]}
              >
                Change your password
              </Text>
              <View style={{ marginLeft: 8, alignSelf: "flex-start" }}>
                {isDark ? <ArrowRightDarkIcon /> : <ArrowRightIcon />}
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
      {renderProfileImageModal()}
      {renderPasswordChangeModal()}
      {isUploading && (
  <Modal
    transparent={true}
    animationType="fade"
    visible={isUploading}
    onRequestClose={() => {}}
  >
    <View style={styles.loadingOverlay}>
      <View  style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.text }]}>
          Uploading photo...
        </Text>
      </View>
    </View>
  </Modal>
)}

    </ScrollView>
  </KeyboardAvoidingView>
      
    </View>
  );
};

export default ProfileInfoItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingVertical: 12,
    alignItems: "flex-start",
    gap: 10,
  },
  iconWrapper: {
    alignItems: "center",
    paddingTop: 7,
  },
  textWrapper: {
    width: "100%",
    flex: 1,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  label: {
    fontSize: 14,
    color: "#888",
  },
  value: {
    color: "#000",

    lineHeight: 20,
    textAlign: "justify",
    fontSize: 15,
  },
  ProfileImageWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  ProfileImage: {
    height: 100,
    width: 100,
    borderRadius: 100,
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
    paddingHorizontal: 10,
    paddingVertical: 25,
    borderWidth: 0.5,
    borderColor: "lightgray",
  },
  modalButton: {
    width: "100%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginBottom: 15,
  },
  loadingOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.5)',
  justifyContent: 'center',
  alignItems: 'center',
},
loadingContainer: {
  padding: 30,
  borderRadius: 10,
  alignItems: 'center',
},
loadingText: {
  marginTop: 15,
  fontSize: 16,
},
});
