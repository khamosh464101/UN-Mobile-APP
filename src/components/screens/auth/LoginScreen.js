import React, { useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import EyeIcon from "../../../assets/icons/login/eye.svg";
import EyeSlashIcon from "../../../assets/icons/login/eye-slash.svg";
import Logo from "../../../assets/images/Logo.png";
import { Header } from "../../common/Header";
import { Input } from "../../common/Input";
import { Button } from "../../common/Button";
import { commonStyles } from "../../../styles/commonStyles";
import { validateEmail, validatePassword } from "../../../utils/validation";
import { COLORS } from "../../../styles/colors";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordRef = useRef(null);
  const handleLogin = async () => {
    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);

    setEmailError(emailValidation);
    setPasswordError(passwordValidation);

    if (!emailValidation && !passwordValidation) {
      setLoading(true);
      try {
        const response = await axios.post("https://un.momtazhost.com/login", {
          email: email,
          password: password,
        });

        // const { data } = response;

        console.log("Response:", response);
        // await AsyncStorage.setItem("token", response.data.token);
        // await AsyncStorage.setItem("user", response.data.user);
        navigation.navigate("OTP");
      } catch (error) {
        console.error("Error:", error.response?.data || error.message);
      }
    }
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      <Header />
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
                alignSelf: "left",
                marginBottom: 10,
              }}
              resizeMode="contain"
            />
            <Text style={commonStyles.welcomeText}>
              Sign in to your Account
            </Text>
            <Text style={commonStyles.subtitle}>
              Enter your email and password to log in
            </Text>

            <Input
              label="Email"
              value={email}
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() => passwordRef.current.focus()}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              error={emailError}
            />

            <Input
              ref={passwordRef}
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry={secureTextEntry}
              error={passwordError}
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
              style={styles.forgotPasswordContainer}
              onPress={() => navigation.navigate("ForgotPassword")}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <Button title="Sign In" onPress={handleLogin} loading={loading} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  forgotPasswordContainer: {
    alignSelf: "flex-end",
    marginBottom: 18,
  },
  forgotPasswordText: {
    color: commonStyles.errorText.color,
    fontSize: 14,
    fontWeight: "500",
  },
});
