import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from "react-native";
import Logo from "../../../assets/images/Logo.png";
import ArrowLeft from "../../../assets/icons/arrow-left.svg";
import { Header } from "../../common/Header";
import { Button } from "../../common/Button";
import { commonStyles } from "../../../styles/commonStyles";
import { validateOTP } from "../../../utils/validation";
import { COLORS } from "../../../styles/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import auth from '@react-native-firebase/auth';
import firestore from "@react-native-firebase/firestore";
import axios from "../../../utils/axios";
import Toast from "react-native-toast-message";
import { getErrorMessage } from "../../../utils/tools";
import messaging from '@react-native-firebase/messaging';

export default function OTPVerificationScreen({ navigation }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputs = useRef([]);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [confirm, setConfirm] = useState(null);
  const [verificationMethod, setVerificationMethod] = useState("Email");
  const [otpRequestLoading, setOtpRequestLoading] = useState(false);
  useEffect(() => {
    checkStorage();
  }, []);

  const checkStorage = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      let user = await AsyncStorage.getItem("user");
      user = JSON.parse(user);
      console.log('444444444', user);
    } catch (error) {
      console.log("Error retrieving token:", error);
    }
  };

  
  const handleChange = (text, index) => {
    if (/^\d$/.test(text)) {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);
      // Move to next input
      if (index < 5) {
        inputs.current[index + 1].focus();
      }
    } else if (text === "") {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace" && otp[index] === "" && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

const handleVerify = async () => {
  const token = await AsyncStorage.getItem("token");
  const otpString = otp.join("");
  console.log('OTP String:', otpString);
  
  if (!token) {
    console.error("No token found, aborting request.");
    return;
  }

  if (verificationMethod === 'Phone') {
    await confirmCode();
    return;
  } 
  setVerifyLoading(true);

  const deviceToken = await messaging().getToken();
  const payload = {
        two_factor_code: otpString,
        deviceToken,
      };
  try {
    const {data:result} = await axios.post(`/api/verify`, payload);
    setVerifyLoading(false);
    navigation.reset({
      index: 0,
      routes: [{ name: "Dashboard" }],
    });
  } catch (error) {
    Toast.show({
            type: 'error',
            text1: 'Failed!',
            text2: getErrorMessage(error)
          });
    setVerifyLoading(false);
  }
};


  const handleResend = async () => {
    setVerificationMethod("Email");
  const token = await AsyncStorage.getItem("token");  
  if (!token) {
    console.error("No token found, aborting request.");
    return;
  }
    setResendLoading(true);
    try {
      const {data:result} = await axios.get(`/api/verify/resend`);
      setResendLoading(false);
      Alert.alert(
          "OTP Sent",
          "A 6-digit code has been sent to your email.",
          [{ text: "OK" }]
        );
    } catch (error) {
      Toast.show({
              type: 'error',
              text1: 'Failed!',
              text2: getErrorMessage(error)
            });
      setResendLoading(false);
    }

  };

  const handleOTPRequest = async () => {
  setVerificationMethod("Phone");
  setOtpRequestLoading(true);

  let user = await AsyncStorage.getItem("user");
  user = JSON.parse(user);
  const phoneNumber = user.phone;

  try {
    const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
    setConfirm(confirmation);
    setOtpRequestLoading(false);
    Toast.show({
              type: 'success',
              text1: 'Success',
              text2: 'A 6 digt code has been sent to your phone!'
            });
  } catch (error) {
    setOtpRequestLoading(false);
    console.log("Error sending code:", error);
    Toast.show({
        type: 'error',
        text1: 'Failed!',
        text2: getErrorMessage(error)
      });
  }
};


  const  confirmCode = async () => {
    try {
     const otpString = otp.join("");
     const userCredential = await confirm.confirm(otpString);
     const user = userCredential.user;
     const idToken = await user.getIdToken();
     const phone = user.phoneNumber;

     const deviceToken = await messaging().getToken();
     const {data:result} = await axios.post(`/api/phoneVerify`, {
          idToken,
          phone,
          deviceToken,
        });

        console.log("232323232", result);
    navigation.reset({
      index: 0,
      routes: [{ name: "Dashboard" }],
    });

    //  CHECK IF THE USER IS NEW OR EXISTING
    } catch (error) {
      console.log('1112222',error);
      Toast.show({
                type: 'error',
                text1: 'Failed!',
                text2: getErrorMessage(error)
              });
    }
  }

  return (
    <SafeAreaView style={commonStyles.container}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      <Header
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
        backIcon={<ArrowLeft width={28} height={28} />}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={commonStyles.keyboardAvoidView}
      >
        <ScrollView
          contentContainerStyle={commonStyles.scrollView}
          keyboardShouldPersistTaps="handled"
        >
          <View style={commonStyles.formContainer}>
            <Image
              source={Logo}
              style={{
                width: 101,
                alignSelf: "left",
                marginBottom: 16,
              }}
              resizeMode="contain"
            />
            <Text style={commonStyles.welcomeText}>Verify Your Account</Text>
            <Text style={commonStyles.subtitle}>
              Enter the 6 digit code sent to the registered email.
            </Text>

            <View style={styles.otpContainer}>
              {otp.map((digit, idx) => (
                <TextInput
                  key={idx}
                  ref={(ref) => (inputs.current[idx] = ref)}
                  style={styles.otpInput}
                  keyboardType="number-pad"
                  maxLength={1}
                  value={digit}
                  onChangeText={(text) => handleChange(text, idx)}
                  onKeyPress={(e) => handleKeyPress(e, idx)}
                  autoFocus={idx === 0}
                  textAlign="center"
                />
              ))}
            </View>
            {otpError ? (
              <Text style={styles.otpErrorText}>{otpError}</Text>
            ) : null}

            <View style={styles.resendContainer}>
              <Text style={styles.resendText}>Did not receive a code?</Text>
              {/* <TouchableOpacity onPress={handleResend}>
                <Text style={styles.resendLink}>Resend</Text>
              </TouchableOpacity> */}
              <TouchableOpacity
              onPress={handleResend}
              disabled={resendLoading} // disable when loading to prevent multiple clicks
              style={styles.resendButton} // if you have button styles
            >
              {resendLoading ? (
                <ActivityIndicator size="small" color="#e2e2e2" /> // your desired color
              ) : (
                <Text style={styles.resendLink}>Resend</Text>
              )}
            </TouchableOpacity>
            </View>

            <Button
              title="Verify"
              onPress={handleVerify}
              loading={verifyLoading}
            />

            <Button
              title="Send OTP as SMS"
              onPress={handleOTPRequest}
              loading={otpRequestLoading}
              variant="secondary"
            />

            <Text style={styles.warningText}>
              *Don't share the verification code with anyone!
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 28,
    width: "100%",
    gap: 1,
  },
  otpInput: {
    width: 44,
    height: 48,
    borderWidth: 1.2,
    borderColor: commonStyles.input.borderColor,
    borderRadius: 10,
    backgroundColor: commonStyles.input.backgroundColor,
    fontSize: 22,
    textAlign: "center",
    marginHorizontal: 0,
  },
  resendContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  resendText: {
    fontSize: 12,
    fontWeight: "bold",
    color: commonStyles.subtitle.color,
    marginBottom: 12,
    textAlign: "left",
  },
  resendLink: {
    fontSize: 12,
    color: commonStyles.errorText.color,
    textAlign: "left",
    marginBottom: 12,
  },
  otpErrorText: {
    color: commonStyles.errorText.color,
    fontSize: 13,
    marginTop: -16,
    marginBottom: 12,
    marginLeft: 2,
    textAlign: "left",
  },
  warningText: {
    fontSize: 12,
    color: commonStyles.errorText.color,
    marginTop: 12,
    textAlign: "center",
  },
});
