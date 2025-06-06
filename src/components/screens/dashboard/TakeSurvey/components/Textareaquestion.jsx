import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

const TextareaQuestion = ({ question, value, onChange }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.question}>{question}</Text>
      <TextInput
        style={styles.textarea}
        value={value}
        onChangeText={onChange}
        multiline
        numberOfLines={4}
        placeholder="Enter your answer..."
        textAlignVertical="top"
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
  textarea: {
    height: 120,
    borderColor: "#4B0082",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    backgroundColor: "#fff",
  },
});

export default TextareaQuestion;
