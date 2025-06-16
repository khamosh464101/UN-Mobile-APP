import React from "react";
import { View, Text, Image, ScrollView, StyleSheet } from "react-native";
import { commonStyles } from "../../../../styles/commonStyles";
import Topbar from "../../../common/Topbar";
import surveyQuestions from "../../../../utils/surveyQuestions.json";

const SubmittedSurveyDetailsScreen = ({ route }) => {
  const { survey } = route.params;
  const { answers } = survey;

  const getQuestionText = (id) => {
    const questionObj = surveyQuestions.find((q) => q.id.toString() === id);
    return questionObj?.question || `Question ${id}`;
  };

  return (
    <View style={commonStyles.screenWrapper}>
      <Topbar />
      <ScrollView style={styles.container}>
        {Object.entries(answers).map(([questionId, answer], index) => (
          <View key={index} style={styles.answerBox}>
            <Text style={styles.question}>{getQuestionText(questionId)}</Text>

            {typeof answer === "string" || typeof answer === "number" ? (
              <Text>{answer}</Text>
            ) : answer?.uri ? (
              <Image
                source={{ uri: answer.uri }}
                style={styles.image}
                resizeMode="cover"
              />
            ) : Array.isArray(answer) ? (
              <Text>{answer.join(", ")}</Text>
            ) : typeof answer === "object" ? (
              <Text>{JSON.stringify(answer)}</Text>
            ) : (
              <Text>No answer</Text>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default SubmittedSurveyDetailsScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
  },
  timestamp: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 16,
  },
  answerBox: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  question: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  image: {
    width: "100%",
    height: 200,
    marginTop: 8,
    borderRadius: 10,
  },
});
