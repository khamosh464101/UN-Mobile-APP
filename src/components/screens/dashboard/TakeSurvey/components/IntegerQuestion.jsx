import React, { useContext, useState, useEffect, useCallback } from "react";
import { StyleSheet, View, Text, TextInput } from "react-native";
import { ThemeContext } from "../../../../../utils/ThemeContext";
import debounce from "lodash/debounce";

const IntegerQuestion = ({
  question,
  value,
  onChange,
  required = false,
  hint = "",
}) => {
  const { theme } = useContext(ThemeContext);
  const [localValue, setLocalValue] = useState(value?.toString() || "");

  // Update local value when prop value changes
  useEffect(() => {
    setLocalValue(value?.toString() || "");
  }, [value]);

  // Create a debounced version of onChange
  const debouncedOnChange = useCallback(
    debounce((text) => {
      onChange(text);
    }, 500),
    [onChange]
  );

  const handleChangeText = (text) => {
    const numeric = text.replace(/[^0-9]/g, "");
    setLocalValue(numeric);
    debouncedOnChange(numeric);
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
        keyboardType="numeric"
        value={localValue}
        onChangeText={handleChangeText}
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
