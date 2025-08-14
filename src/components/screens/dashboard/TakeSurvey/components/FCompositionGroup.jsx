import React from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import IntegerQuestion from "./IntegerQuestion";
import Note from "./Note";

const FCompositionGroup = ({ group, answers, onChange }) => {
  if (!group || !group.questions) return null;

  // Determine if we should show the group label as a Note
  const showGroupNote =
    group.type === "begin_group" ||
    group.name === "F_Composition" ||
    group.$kuid === "wy5Mh3hro" ||
    group.name === "access_civil_documentation_male" ||
    group.$kuid === "OCGg4P6IN" ||
    group.name === "access_civil_documentation_female" ||
    group.$kuid === "F8dZxdRwh";

  console.log(group);
  return (
    <ScrollView style={styles.container}>
      {showGroupNote && (
        <Note
          question={
            Array.isArray(group.label)
              ? group.label[0]
              : group.label || group.question || group.name
          }
        />
      )}
      {group.questions.map((q) => (
        <View key={q.id} style={styles.inputWrapper}>
          <IntegerQuestion
            question={q.question || q.label?.[0] || q.name}
            value={answers[q.id]}
            onChange={(value) => onChange(q.id, value, q.type)}
            required={q.required}
            hint={q.hint}
          />
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  groupLabel: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  inputWrapper: {
    marginBottom: 12,
  },
});

export default FCompositionGroup;
