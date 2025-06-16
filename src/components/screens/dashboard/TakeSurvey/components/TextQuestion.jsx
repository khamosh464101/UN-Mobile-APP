import React, { useContext } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { ThemeContext } from "../../../../../utils/ThemeContext";

const TextQuestion = ({
  question,
  value,
  onChange,
  required = false,
  hint = "",
}) => {
  const { theme } = useContext(ThemeContext);
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
      <TextInput
        style={[
          styles.input,
          { borderColor: theme.colors.lightBlack, color: theme.colors.text },
        ]}
        value={value || ""}
        onChangeText={onChange}
        placeholder="Enter your answer"
        placeholderTextColor={theme.colors.secondaryText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
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
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 14,
  },
});

export default TextQuestion;
