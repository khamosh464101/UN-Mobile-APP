import React, { useContext } from "react";
import { StyleSheet, View, Text, TextInput } from "react-native";
import { ThemeContext } from "../../../../../utils/ThemeContext";

const IntegerQuestion = ({
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
        keyboardType="numeric"
        value={value?.toString() || ""}
        onChangeText={(text) => {
          const numeric = text.replace(/[^0-9]/g, "");
          onChange(numeric);
        }}
        placeholder="Enter a number"
        placeholderTextColor={theme.colors.secondaryText}
        maxLength={10}
      />
    </View>
  );
};

export default IntegerQuestion;

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
    height: 50,
    borderWidth: 1,
    borderRadius: 3,
    paddingHorizontal: 10,
    fontSize: 14,
  },
});
