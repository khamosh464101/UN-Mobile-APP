import React, { useRef, useState } from "react";
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
} from "react-native";
import Logo from "../../../assets/images/Logo.png";
import ArrowLeft from "../../../assets/icons/login/arrow-left.svg";
import { Header } from "../../common/Header";
import { Button } from "../../common/Button";
import { commonStyles } from "../../../styles/commonStyles";
import { validateOTP } from "../../../utils/validation";

export default function OTPVerificationScreen({ navigation }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputs = useRef([]);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [otpError, setOtpError] = useState("");

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

  const handleVerify = () => {
    const otpString = otp.join("");
    const otpValidation = validateOTP(otpString);
    setOtpError(otpValidation);

    if (!otpValidation) {
      setVerifyLoading(true);
      setTimeout(() => {
        setVerifyLoading(false);
        if (otpString !== "770415") {
          setOtpError("Invalid code. Please try again.");
        } else {
          navigation.navigate("Dashboard");
        }
      }, 2000);
    }
  };

  const handleResend = () => {
    setResendLoading(true);
    setTimeout(() => {
      setResendLoading(false);
      Alert.alert(
        "OTP Sent",
        "A 6-digit code has been sent to your registered number.",
        [{ text: "OK" }]
      );
    }, 2000);
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <StatusBar barStyle="light-content" />
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
              <TouchableOpacity onPress={handleResend}>
                <Text style={styles.resendLink}>Resend</Text>
              </TouchableOpacity>
            </View>

            <Button
              title="Verify"
              onPress={handleVerify}
              loading={verifyLoading}
            />

            <Button
              title="Send OTP as SMS"
              onPress={handleResend}
              loading={resendLoading}
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
