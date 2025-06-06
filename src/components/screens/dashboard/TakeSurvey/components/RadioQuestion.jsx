import React, { useContext } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
} from "react-native";
import { ThemeContext } from "../../../../../utils/ThemeContext";

const RadioQuestion = ({ question, options, value, onChange }) => {
  const { theme } = useContext(ThemeContext);
  return (
    <ScrollView style={styles.container}>
      <Text style={[styles.question, { color: theme.colors.text }]}>
        {question}
      </Text>
      {options.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={styles.option}
          onPress={() => onChange(option)}
        >
          <View
            style={[styles.radioCircle, { borderColor: theme.colors.primary }]}
          >
            {value === option && (
              <View
                style={[
                  styles.selectedRb,
                  { backgroundColor: theme.colors.primary },
                ]}
              />
            )}
          </View>
          <Text style={[styles.optionText, { color: theme.colors.text }]}>
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default RadioQuestion;

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    flexGrow: 1,
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
  radioCircle: {
    height: 15,
    width: 15,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  selectedRb: {
    width: 7,
    height: 7,
    borderRadius: 5,
  },
  optionText: {
    fontSize: 14,
  },
});
