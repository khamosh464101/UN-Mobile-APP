import React, { useState } from "react";
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

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);

    setEmailError(emailValidation);
    setPasswordError(passwordValidation);

    if (!emailValidation && !passwordValidation) {
      if (email !== "atiqullah@momtaz.ws") {
        setEmailError("Email does not match our records.");
        return;
      }
      if (password !== "atiq12atiq") {
        setPasswordError("Password does not match our records.");
        return;
      }

      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        navigation.navigate("OTP");
      }, 3000);
    }
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <StatusBar barStyle="light-content" />
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
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              error={emailError}
            />

            <Input
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
