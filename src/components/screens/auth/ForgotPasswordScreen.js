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
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Logo from "../../../assets/images/Logo.png";
import { Header } from "../../common/Header";
import { Input } from "../../common/Input";
import { Button } from "../../common/Button";
import { commonStyles } from "../../../styles/commonStyles";
import { validateEmail } from "../../../utils/validation";
import { COLORS } from "../../../styles/colors";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleSend = () => {
    const emailValidation = validateEmail(email);
    setEmailError(emailValidation);

    if (!emailValidation) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        Alert.alert(
          "Reset Link Sent",
          "A password reset link has been sent to your email.",
          [{ text: "OK" }]
        );
      }, 2000);
    }
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      <Header
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
        backIcon={<Text>←</Text>}
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
            <Text style={commonStyles.welcomeText}>Forgot Your Password?</Text>
            <Text style={commonStyles.subtitle}>
              Let us know your email address and we will share with you the
              reset password link.
            </Text>

            <Input
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              error={emailError}
            />

            <Button
              title="Send Reset Link"
              onPress={handleSend}
              loading={loading}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
