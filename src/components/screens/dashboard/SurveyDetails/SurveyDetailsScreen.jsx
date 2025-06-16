import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import { ThemeContext } from "../../../../utils/ThemeContext";
import { commonStyles } from "../../../../styles/commonStyles";
import Topbar from "../../../common/Topbar";
import * as db from "../../../../services/database";
import Constants from "expo-constants";
import axios from "axios";

const SurveyDetailsScreen = ({ route, navigation }) => {
  const { theme } = useContext(ThemeContext);
  const [surveyData, setSurveyData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const sqlite = useSQLiteContext();
  const { sessionId } = route.params;

  // API configuration
  const apiURL = Constants.expoConfig.extra.API_URL;
  const apiToken = Constants.expoConfig.extra.PUBLIC_API_KEY;

  useEffect(() => {
    const loadSurveyDetails = async () => {
      try {
        if (!sqlite) {
          throw new Error("SQLite context not available");
        }

        // Get session details
        const session = await db.getSurveySession(sqlite, sessionId);
        console.log("Session details:", session);

        // Get answers for this session
        const getSessionAnswers = async () => {
          try {
            if (!sqlite) {
              throw new Error("SQLite context not available");
            }

            const answers = await db.getSessionAnswers(sqlite, sessionId);
            console.log("Raw session answers:", answers);

            // Transform answers into a more usable format
            const transformedAnswers = answers.reduce((acc, answer) => {
              acc[answer.question_id] = {
                value: answer.value,
                type: answer.type,
              };
              return acc;
            }, {});

            console.log("Transformed answers:", transformedAnswers);
            setAnswers(transformedAnswers);
          } catch (error) {
            console.error("Error getting session answers:", error);
            Alert.alert(
              "Error",
              "Failed to load survey answers. Please try again."
            );
          }
        };

        // Fetch survey questions from API
        try {
          const response = await axios.get(apiURL, {
            headers: {
              Authorization: `Token ${apiToken}`,
              Accept: "application/json",
            },
          });

          const transformedQuestions = transformKoBoData(response.data);
          console.log("Transformed questions:", transformedQuestions);
          setSurveyData({ session, questions: transformedQuestions });
          await getSessionAnswers();
        } catch (err) {
          console.error("Error fetching survey:", err);
          Alert.alert(
            "Error",
            "Failed to load survey questions. Please try again."
          );
        }

        setLoading(false);
      } catch (error) {
        console.error("Error loading survey details:", error);
        Alert.alert(
          "Error",
          "Failed to load survey details. Please try again."
        );
        setLoading(false);
      }
    };

    loadSurveyDetails();
  }, [sqlite, sessionId]);

  // Helper function to find a question by ID
  const findQuestionById = (id, questions = surveyData?.questions) => {
    if (!questions) return null;

    for (const question of questions) {
      if (question.id === id) {
        return question;
      }
      if (question.type === "group" && question.questions) {
        const found = findQuestionById(id, question.questions);
        if (found) return found;
      }
    }
    return null;
  };

  // Render answer based on type
  const renderAnswer = (questionId, answerData) => {
    if (!answerData) {
      console.log("Missing answer data for question:", questionId);
      return null;
    }

    const question = findQuestionById(questionId);
    if (!question) {
      console.log("Question not found:", questionId);
      return null;
    }

    console.log("Rendering answer:", { question, answerData });

    const displayValue = (() => {
      if (question.type === "radio" || question.type === "checkbox") {
        const option = question.options?.find(
          (opt) => opt.value === answerData.value
        );
        return option ? option.label : answerData.value;
      }
      return answerData.value;
    })();

    return (
      <View key={questionId} style={styles.answerContainer}>
        <Text style={[styles.question, { color: theme.colors.text }]}>
          {question.question}
        </Text>
        <Text style={[styles.answer, { color: theme.colors.secondaryText }]}>
          {displayValue}
        </Text>
      </View>
    );
  };

  // Transform KoBoToolbox API data to our format
  const transformKoBoData = (apiData) => {
    const { survey, choices } = apiData.asset.content;
    let transformedQuestions = [];
    let currentGroup = null;
    let groupStack = [];
    let currentRepeat = null;
    let repeatStack = [];

    // Filter out unnecessary question records first
    const filteredSurvey = survey.filter(
      (question) =>
        !["start", "end", "today", "audit", "calculate"].includes(question.type)
    );

    filteredSurvey.forEach((question) => {
      // Handle group start
      if (question.type === "begin_group") {
        groupStack.push({
          name: question.name,
          relevant: question.relevant,
          questions: [],
        });
        currentGroup = groupStack[groupStack.length - 1];
        return;
      }

      // Handle group end
      if (question.type === "end_group") {
        if (groupStack.length > 0) {
          const completedGroup = groupStack.pop();
          if (groupStack.length === 0) {
            transformedQuestions.push({
              type: "group",
              name: completedGroup.name,
              relevant: completedGroup.relevant,
              questions: completedGroup.questions,
            });
          } else {
            currentGroup = groupStack[groupStack.length - 1];
            currentGroup.questions.push({
              type: "group",
              name: completedGroup.name,
              relevant: completedGroup.relevant,
              questions: completedGroup.questions,
            });
          }
        }
        return;
      }

      // Handle repeat start
      if (question.type === "begin_repeat") {
        repeatStack.push(question.name);
        currentRepeat = question.name;
        return;
      }

      // Handle repeat end
      if (question.type === "end_repeat") {
        repeatStack.pop();
        currentRepeat = repeatStack[repeatStack.length - 1] || null;
        return;
      }

      const baseQuestion = {
        id: question.$kuid,
        name: question.name,
        type: mapKoBoTypeToLocalType(question.type),
        question: question.label?.[0] || question.name,
        required: question.required || false,
        hint: question.hint?.[0] || "",
        select_from_list_name: question.select_from_list_name,
        choice_filter: question.choice_filter,
        relevant: question.relevant,
        calculation: question.calculation,
        _original: question,
        isInRepeatGroup: currentRepeat !== null,
      };

      // Handle select questions (radio/checkbox)
      if (question.select_from_list_name) {
        const relevantChoices = choices.filter(
          (choice) => choice.list_name === question.select_from_list_name
        );

        baseQuestion.options = relevantChoices.map((choice) => ({
          value: choice.name,
          label: choice.label?.[0] || choice.name,
          filters: Object.entries(choice).filter(
            ([key]) =>
              !["name", "label", "list_name", "$kuid", "$autoname"].includes(
                key
              )
          ),
        }));
      }

      // Add question to current group, repeat group, or main questions
      if (currentGroup) {
        currentGroup.questions.push(baseQuestion);
      } else {
        transformedQuestions.push(baseQuestion);
      }
    });

    return transformedQuestions;
  };

  // Map KoBoToolbox question types to our component types
  const mapKoBoTypeToLocalType = (koboType) => {
    const typeMap = {
      select_one: "radio",
      select_multiple: "checkbox",
      text: "input_text",
      integer: "input_integer",
      decimal: "input_integer",
      date: "input_date",
      geopoint: "geopoint",
      image: "input_photo",
      note: "note",
      begin_group: "begin_group",
      begin_repeat: "begin_repeat",
    };

    return typeMap[koboType] || koboType;
  };

  if (!surveyData || !surveyData.questions) {
    console.log("No survey data available:", surveyData);
    return (
      <View
        style={[
          commonStyles.screenWrapper,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <Topbar />
        <View style={styles.content}>
          <Text style={[styles.errorText, { color: theme.colors.text }]}>
            No survey data available
          </Text>
        </View>
      </View>
    );
  }

  console.log("Rendering survey details:", {
    questions: surveyData.questions.length,
    answers: Object.keys(answers).length,
  });

  return (
    <View
      style={[
        commonStyles.screenWrapper,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <Topbar />

      {loading ? (
        <View style={[commonStyles.screenWrapper, styles.loadingContainer]}>
          <ActivityIndicator size="small" color={theme.colors.primary} />
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.colors.text }]}>
              Survey #{sessionId}
            </Text>
            <Text style={[styles.date, { color: theme.colors.secondaryText }]}>
              Finalized:{" "}
              {new Date(surveyData?.session.end_time).toLocaleDateString()}
            </Text>
          </View>
          <ScrollView style={styles.content}>
            <View style={styles.answersContainer}>
              {Object.entries(answers).map(([questionId, answerData]) =>
                renderAnswer(questionId, answerData)
              )}
            </View>
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
  },
  answersContainer: {
    padding: 16,
  },
  answerContainer: {
    marginBottom: 24,
  },
  question: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  answer: {
    fontSize: 14,
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
});

export default SurveyDetailsScreen;
