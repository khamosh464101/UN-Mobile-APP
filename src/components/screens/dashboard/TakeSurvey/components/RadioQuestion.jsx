import React, { useContext } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
} from "react-native";
import { ThemeContext } from "../../../../../utils/ThemeContext";

const RadioQuestion = ({
  question,
  options,
  value,
  onChange,
  required = false,
  hint = "",
}) => {
  const { theme } = useContext(ThemeContext);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
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

      {options.length > 0 ? (
        options.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={styles.option}
            onPress={() => onChange(option.value)}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.radioCircle,
                {
                  borderColor: theme.colors.primary,
                  backgroundColor: theme.colors.card,
                },
              ]}
            >
              {value === option.value && (
                <View
                  style={[
                    styles.selectedRb,
                    { backgroundColor: theme.colors.primary },
                  ]}
                />
              )}
            </View>
            <Text style={[styles.optionText, { color: theme.colors.text }]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))
      ) : (
        <Text
          style={[styles.noOptionsText, { color: theme.colors.secondaryText }]}
        >
          No options available. Please complete previous questions.
        </Text>
      )}
    </ScrollView>
  );
};

export default RadioQuestion;

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    flexGrow: 1,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  questionHeader: {
    marginBottom: 15,
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
  option: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingVertical: 5,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  selectedRb: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  optionText: {
    fontSize: 15,
    flexShrink: 1,
  },
  noOptionsText: {
    fontSize: 14,
    fontStyle: "italic",
    marginTop: 10,
  },
});
