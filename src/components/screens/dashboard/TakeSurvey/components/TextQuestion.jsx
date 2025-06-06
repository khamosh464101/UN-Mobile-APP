import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

const TextQuestion = ({ question, value, onChange }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.question}>{question}</Text>
      <TextInput
        style={styles.input}
        value={value || ""}
        onChangeText={onChange}
        placeholder="Enter your answer"
        placeholderTextColor="#888"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  question: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: "#4B0082",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 14,
  },
});

export default TextQuestion;
