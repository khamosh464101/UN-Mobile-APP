import React, { useEffect, useState, useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeContext } from "../../../../../utils/ThemeContext";

const SubmittedSurveysScreen = () => {
  const { theme } = useContext(ThemeContext);
  const [submittedSurveys, setSubmittedSurveys] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchSubmittedSurveys = async () => {
      try {
        const data = await AsyncStorage.getItem("submittedSurveys");
        const surveys = data ? JSON.parse(data) : [];
        setSubmittedSurveys(surveys);
      } catch (error) {
        console.error("Error loading submitted surveys:", error);
      }
    };

    fetchSubmittedSurveys();
  }, []);

  useEffect(() => {
    const loadSubmittedSurveys = async () => {
      const data = await AsyncStorage.getItem("submittedSurveys");
      if (data) {
        setSubmittedSurveys(JSON.parse(data));
      }
    };
    const unsubscribe = navigation.addListener("focus", loadSubmittedSurveys);
    return unsubscribe;
  }, [navigation]);

  return (
    <ScrollView style={styles.container}>
      {submittedSurveys.length === 0 ? (
        <Text style={[styles.empty, { color: theme.colors.secondaryText }]}>
          No submitted surveys yet.
        </Text>
      ) : (
        submittedSurveys.map((survey, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.surveyItem,
              { backgroundColor: theme.colors.lightBlack },
            ]}
            onPress={() =>
              navigation.navigate("SubmittedSurveyDetails", { survey })
            }
          >
            <Text style={[styles.question, { color: theme.colors.text }]}>
              First Answer: {getFirstAnswer(survey.answers)}
            </Text>
            <Text style={[styles.time, { color: theme.colors.secondaryText }]}>
              Submitted: {new Date(survey.timestamp).toLocaleString()}
            </Text>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
};

const getFirstAnswer = (answers) => {
  if (!answers) return "N/A";
  const keys = Object.keys(answers);
  const firstKey = keys[0];
  const answer = answers[firstKey];

  if (typeof answer === "object") {
    return "[Complex Answer]";
  }
  return String(answer);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  surveyItem: {
    padding: 12,
    backgroundColor: "#f1f1f1",
    borderRadius: 8,
    marginBottom: 10,
  },
  question: {
    fontSize: 16,
  },
  time: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  empty: {
    fontStyle: "italic",
    color: "#888",
    marginTop: 16,
  },
});

export default SubmittedSurveysScreen;
