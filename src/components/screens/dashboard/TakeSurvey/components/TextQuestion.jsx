import React, { useContext, useState, useEffect, useCallback } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { ThemeContext } from "../../../../../utils/ThemeContext";
import debounce from "lodash/debounce";

const TextQuestion = ({
  question,
  value,
  onChange,
  required = false,
  hint = "",
}) => {
  const { theme } = useContext(ThemeContext);
  const [localValue, setLocalValue] = useState(value || "");

  // Update local value when prop value changes
  useEffect(() => {
    setLocalValue(value || "");
  }, [value]);

  // Create a debounced version of onChange
  const debouncedOnChange = useCallback(
    debounce((text) => {
      onChange(text);
    }, 500),
    [onChange]
  );

  const handleChangeText = (text) => {
    setLocalValue(text);
    debouncedOnChange(text);
  };

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
        value={localValue}
        onChangeText={handleChangeText}
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
