import React, { useContext } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
} from "react-native";
import { ThemeContext } from "../../../../../utils/ThemeContext";

const CheckboxQuestion = ({ question, options, value = [], onChange }) => {
  const { theme } = useContext(ThemeContext);
  const toggleOption = (option) => {
    if (value.includes(option.value)) {
      onChange(value.filter((item) => item !== option.value));
    } else {
      onChange([...value, option.value]);
    }
  };
  console.log("Options:", options);
  console.log("Question:", question);
  return (
    <ScrollView style={styles.container}>
      <Text style={[styles.question, { color: theme.colors.text }]}>
        {question}
      </Text>
      {options.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={styles.option}
          onPress={() => toggleOption(option)}
        >
          <View
            style={[styles.checkbox, { borderColor: theme.colors.primary }]}
          >
            {value.includes(option.value) && (
              <View
                style={[
                  styles.checked,
                  { backgroundColor: theme.colors.primary },
                ]}
              />
            )}
          </View>
          <Text style={[styles.optionText, { color: theme.colors.text }]}>
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default CheckboxQuestion;

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  question: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  checkbox: {
    height: 15,
    width: 15,
    borderWidth: 2,
    borderRadius: 4,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  checked: {
    width: 7,
    height: 7,
  },
  optionText: {
    fontSize: 14,
  },
});
