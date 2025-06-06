import React, { useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import SurveySuccessIcon from "../../../../assets/icons/survey-success.svg";
import { ThemeContext } from "../../../../utils/ThemeContext";
const SurveySuccessScreen = () => {
  const { theme } = useContext(ThemeContext);
  const navigation = useNavigation();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.primary }]}>
      <SurveySuccessIcon />
      <Text style={styles.message}>Survey Completed</Text>
      <Text style={styles.subMessage}>Successfully Submitted</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Dashboard")}
      >
        <Text style={[styles.buttonText, { color: theme.colors.primary }]}>
          Back to Dashboard
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SurveySuccessScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  message: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 20,
    color: "#fff",
  },
  subMessage: {
    fontSize: 16,
    color: "#fff",
    marginTop: 5,
  },
  button: {
    marginTop: 30,
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 16,
  },
});
