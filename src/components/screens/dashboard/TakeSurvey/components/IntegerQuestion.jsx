import React, { useContext } from "react";
import { StyleSheet, View, Text, TextInput } from "react-native";
import { ThemeContext } from "../../../../../utils/ThemeContext";

const IntegerQuestion = ({ question, value, onChange }) => {
  const { theme } = useContext(ThemeContext);
  return (
    <View style={styles.container}>
      <Text style={[styles.question, { color: theme.colors.text }]}>
        {question}
      </Text>
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
  question: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 3,
    paddingHorizontal: 10,
    fontSize: 14,
  },
});
