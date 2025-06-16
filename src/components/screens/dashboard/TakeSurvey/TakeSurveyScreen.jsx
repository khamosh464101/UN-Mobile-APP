import React, { useState, useContext, useEffect } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
  ActivityIndicator,
} from "react-native";
import uuid from "react-native-uuid";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Topbar from "../../../common/Topbar";
import { commonStyles } from "../../../../styles/commonStyles";
import RadioQuestion from "./components/RadioQuestion";
import CheckboxQuestion from "./components/CheckboxQuestion";
import IntegerQuestion from "./components/IntegerQuestion";
import TextQuestion from "./components/TextQuestion";
import DateQuestion from "./components/DateQuestion";
import TextareaQuestion from "./components/Textareaquestion";
import PhotoQuestion from "./components/PhotoQuestion";
import MultiplePhotoQuestion from "./components/MultiplePhotoQuestion";
import { ThemeContext } from "../../../../utils/ThemeContext";
import GeoPointQuestion from "./components/GeoPointQuestion";
import { useNavigation } from "@react-navigation/native";
import Constants from "expo-constants";
import axios from "axios";
import Note from "./components/Note";
import { useSQLiteContext } from "expo-sqlite";
import * as db from "../../../../services/database";

const TakeSurveyScreen = ({ route, navigation }) => {
  const { theme } = useContext(ThemeContext);
  const { surveyId = null, draftId = null } = route?.params || {};
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [surveyData, setSurveyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const sqlite = useSQLiteContext();

  // Initialize survey
  useEffect(() => {
    const initializeSurvey = async () => {
      try {
        if (!sqlite) {
          throw new Error("SQLite context not available");
        }

        // Check if we're resuming a draft
        const draftId = route.params?.draftId;
        if (draftId) {
          console.log("Resuming draft:", draftId);
          // Set the session ID
          setSessionId(draftId);
          await AsyncStorage.setItem("current_session", draftId.toString());

          // Use initial answers and index if provided
          if (route.params?.initialAnswers) {
            setAnswers(route.params.initialAnswers);
          }
          if (route.params?.initialIndex !== undefined) {
            setCurrentIndex(route.params.initialIndex);
          }
        }
        // Note: We don't create a new session here anymore
        // It will be created when the user explicitly saves as draft

        // Fetch survey data from API
        try {
          const response = await axios.get(apiURL, {
            headers: {
              Authorization: `Token ${apiToken}`,
              Accept: "application/json",
            },
          });

          const transformed = transformKoBoData(response.data);
          setSurveyData(transformed);
        } catch (err) {
          console.error("Error fetching survey:", err);
          setError("Failed to load survey. Please try again.");
        }

        setLoading(false);
      } catch (error) {
        console.error("Error initializing survey:", error);
        Alert.alert("Error", "Failed to initialize survey. Please try again.");
        setLoading(false);
      }
    };

    initializeSurvey();
  }, [sqlite, route.params]);

  // API configuration
  const apiURL = Constants.expoConfig.extra.API_URL;
  const apiToken = Constants.expoConfig.extra.PUBLIC_API_KEY;

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

  // Fetch survey data from API
  const fetchSurveyData = async () => {
    try {
      const response = await axios.get(apiURL, {
        headers: {
          Authorization: `Token ${apiToken}`,
          Accept: "application/json",
        },
      });

      const transformed = transformKoBoData(response.data);
      setSurveyData(transformed);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching survey:", err);
      setError("Failed to load survey. Please try again.");
      setLoading(false);
    }
  };

  // Helper function to find a question by name in the survey data
  const findQuestionByName = (name, questions = surveyData) => {
    for (const question of questions) {
      if (question.name === name) {
        return question;
      }
      if (question.type === "group" && question.questions) {
        const found = findQuestionByName(name, question.questions);
        if (found) return found;
      }
    }
    return undefined;
  };

  // Get filtered options for questions with dependencies
  const getFilteredOptions = (question) => {
    if (!question.options) return [];

    const filterExpression = question.choice_filter;
    if (!filterExpression) return question.options;

    // Parse "province_name=${survey_province}"
    const match = filterExpression.match(/([^=]+)=\${([^}]+)}/);
    if (!match) return question.options;

    const [_, filterKey, answerKey] = match;
    console.log("Filter match:", { filterKey, answerKey });

    // Find the question by name using the helper function
    const dependentQuestion = findQuestionByName(answerKey);
    console.log("Dependent question:", dependentQuestion);

    if (!dependentQuestion) {
      console.log("Could not find dependent question");
      return question.options;
    }

    const questionId = dependentQuestion.id;
    const selectedValue = answers[questionId];
    console.log("Selected value:", selectedValue);

    if (!selectedValue) {
      console.log("No selected value found");
      return [];
    }

    const filteredOptions = question.options.filter((option) => {
      const matches = option.filters?.some(([key, value]) => {
        console.log("Checking filter:", {
          key,
          value,
          filterKey,
          selectedValue,
        });
        return key === filterKey && value === selectedValue;
      });
      return matches;
    });

    console.log("Filtered options:", filteredOptions);
    return filteredOptions;
  };

  // Check if a group or question is relevant based on answers
  const isRelevant = (item, answers) => {
    if (!item.relevant) return true;

    // Handle selected() function in relevance
    const selectedMatch = item.relevant.match(
      /selected\(\${([^}]+)},\s*"([^"]+)/
    );
    if (selectedMatch) {
      const [_, answerKey, expectedValue] = selectedMatch;
      // Find the question by name using the helper function
      const question = findQuestionByName(answerKey);
      const questionId = question?.id;
      const actualValue = answers[questionId];

      return actualValue === expectedValue;
    }

    // Handle simple equality conditions
    const match = item.relevant.match(/\${([^}]+)}\s*([!=]+)\s*'([^']+)'/);
    if (!match) return true;

    const [_, answerKey, operator, expectedValue] = match;
    // Find the question by name using the helper function
    const question = findQuestionByName(answerKey);
    const questionId = question?.id;
    const actualValue = answers[questionId];

    if (operator === "=") {
      return actualValue === expectedValue;
    } else if (operator === "!=") {
      return actualValue !== expectedValue;
    }

    return true;
  };

  // Get all relevant questions in order
  const getRelevantQuestions = (questions, answers) => {
    let relevantQuestions = [];

    questions.forEach((question) => {
      // Skip questions with these types
      if (["start", "end", "today", "audit"].includes(question.type)) {
        return;
      }

      if (question.type === "group") {
        if (isRelevant(question, answers)) {
          relevantQuestions = relevantQuestions.concat(
            getRelevantQuestions(question.questions, answers)
          );
        }
      } else if (isRelevant(question, answers)) {
        relevantQuestions.push(question);
      }
    });

    return relevantQuestions;
  };

  // Get current question from flattened relevant questions
  const getCurrentQuestion = () => {
    const relevantQuestions = getRelevantQuestions(surveyData, answers);
    return relevantQuestions[currentIndex];
  };

  // Get progress information
  const getProgressInfo = () => {
    const relevantQuestions = getRelevantQuestions(surveyData, answers);
    const relevantCurrentIndex =
      relevantQuestions.findIndex((q) => q.id === getCurrentQuestion()?.id) + 1;
    return {
      current: relevantCurrentIndex,
      total: relevantQuestions.length,
      progress: (relevantCurrentIndex / relevantQuestions.length) * 100,
    };
  };

  // Helper function to calculate totals
  const calculateTotals = (answers) => {
    // Female age groups
    const femaleGroups = [
      "female_0_1",
      "female_1_5",
      "female_6_12",
      "female_13_17",
      "female_18_30",
      "female_30_60",
      "female_60_above",
    ];

    // Male age groups
    const maleGroups = [
      "male_0_1",
      "male_1_5",
      "male_6_12",
      "male_13_17",
      "male_18_30",
      "male_30_60",
      "male_60_above",
    ];

    // Calculate female total
    const femaleTotal = femaleGroups.reduce((sum, groupName) => {
      // Find the question by name to get its ID
      const question = findQuestionByName(groupName);
      if (!question) return sum;
      const value = parseInt(answers[question.id]) || 0;
      return sum + value;
    }, 0);

    // Calculate male total
    const maleTotal = maleGroups.reduce((sum, groupName) => {
      // Find the question by name to get its ID
      const question = findQuestionByName(groupName);
      if (!question) return sum;
      const value = parseInt(answers[question.id]) || 0;
      return sum + value;
    }, 0);

    // Calculate total
    const total = femaleTotal + maleTotal;

    return {
      femaleTotal,
      maleTotal,
      total,
    };
  };

  // Helper function to process dynamic labels
  const processLabel = (label, answers) => {
    if (!label) return "";

    // Replace all ${variable} with their calculated values
    return label.replace(/\${([^}]+)}/g, (match, variable) => {
      const totals = calculateTotals(answers);

      switch (variable) {
        case "f_female":
          return totals.femaleTotal;
        case "f_male":
          return totals.maleTotal;
        case "f_total":
          return totals.total;
        default:
          return 0;
      }
    });
  };

  // Handle answer changes and save to SQLite
  const handleAnswerChange = async (questionId, value, type) => {
    try {
      if (!sqlite) {
        throw new Error("SQLite context not available");
      }

      // Get or create session ID
      let storedSessionId = await AsyncStorage.getItem("current_session");

      // If no session exists, create one
      if (!storedSessionId) {
        console.log("Creating new session for answers...");
        storedSessionId = await db.createSurveySession(sqlite);
        console.log("New session created with ID:", storedSessionId);
        await AsyncStorage.setItem(
          "current_session",
          storedSessionId.toString()
        );
        setSessionId(storedSessionId);
      }

      console.log("Saving answer:", {
        questionId,
        value,
        type,
        sessionId: storedSessionId,
      });

      // Update local state
      setAnswers((prev) => ({
        ...prev,
        [questionId]: value,
      }));

      // Save to SQLite
      await db.saveAnswer(sqlite, storedSessionId, questionId, value, type);
      console.log("Answer saved successfully");

      // Save draft if needed
      if (draftId) {
        const draftData = {
          answers: { ...answers, [questionId]: value },
          currentIndex,
        };
        await AsyncStorage.setItem(
          `draft_${draftId}`,
          JSON.stringify(draftData)
        );
      }
    } catch (err) {
      console.error("Error saving answer:", err);
      Alert.alert("Error", "Failed to save your answer. Please try again.");
    }
  };

  // Render the appropriate question component
  const renderQuestionComponent = () => {
    const currentQuestion = getCurrentQuestion();
    if (!currentQuestion) return null;

    // Skip calculate type questions
    if (currentQuestion.type === "calculate") {
      return null;
    }

    const commonProps = {
      question: processLabel(currentQuestion.question, answers),
      value: answers[currentQuestion.id],
      onChange: (value) =>
        handleAnswerChange(currentQuestion.id, value, currentQuestion.type),
      required: currentQuestion.required,
      hint: currentQuestion.hint,
    };

    switch (currentQuestion.type) {
      case "radio":
        return (
          <RadioQuestion
            {...commonProps}
            options={getFilteredOptions(currentQuestion)}
          />
        );
      case "checkbox":
        return (
          <CheckboxQuestion
            {...commonProps}
            options={getFilteredOptions(currentQuestion)}
          />
        );
      case "input_integer":
        return <IntegerQuestion {...commonProps} />;
      case "input_text":
        return <TextQuestion {...commonProps} />;
      case "input_date":
        return <DateQuestion {...commonProps} />;
      case "textarea":
        return <TextareaQuestion {...commonProps} />;
      case "input_photo":
        // Check if this question is part of a repeat group
        if (currentQuestion.isInRepeatGroup) {
          return <MultiplePhotoQuestion {...commonProps} />;
        }
        return <PhotoQuestion {...commonProps} />;
      case "geopoint":
        return <GeoPointQuestion {...commonProps} />;
      case "note":
      case "begin_group":
        return <Note {...commonProps} />;
      default:
        return <Text>Unsupported question type: {currentQuestion.type}</Text>;
    }
  };

  // Handle navigation to next relevant question or submission
  const goNext = async () => {
    const relevantQuestions = getRelevantQuestions(surveyData, answers);
    const currentQuestion = relevantQuestions[currentIndex];

    // Validate required fields
    if (currentQuestion.required && !answers[currentQuestion.id]) {
      Alert.alert("Required", "Please answer this question before continuing");
      return;
    }

    // Find next relevant question
    let nextIndex = currentIndex + 1;
    if (nextIndex < relevantQuestions.length) {
      setCurrentIndex(nextIndex);
      return;
    }

    // If we reached the end, show completion alert
    Alert.alert(
      "Complete Survey",
      "You've reached the end of the survey. Would you like to complete it now?",
      [
        {
          text: "Continue Editing",
          style: "cancel",
        },
        {
          text: "Complete Survey",
          onPress: handleComplete,
        },
      ]
    );
  };

  // Handle navigation to previous relevant question
  const goBack = () => {
    const relevantQuestions = getRelevantQuestions(surveyData, answers);
    let prevIndex = currentIndex - 1;
    if (prevIndex >= 0) {
      setCurrentIndex(prevIndex);
    }
  };

  // Helper function to filter out answers from irrelevant questions
  const filterIrrelevantAnswers = (allAnswers) => {
    const filtered = {};
    Object.keys(allAnswers).forEach((key) => {
      const question = surveyData.find((q) => q.id === key || q.name === key);
      if (question && isRelevant(question, allAnswers)) {
        filtered[key] = allAnswers[key];
      }
    });
    return filtered;
  };

  // Handle complete survey
  const handleComplete = async () => {
    try {
      if (!sqlite) {
        throw new Error("SQLite context not available");
      }

      // Get the session ID
      const storedSessionId = await AsyncStorage.getItem("current_session");
      if (!storedSessionId) {
        console.error("No session ID available");
        Alert.alert(
          "Error",
          "Survey session not initialized properly. Please try again."
        );
        return;
      }

      console.log("Finalizing survey with sessionId:", storedSessionId);
      console.log("Current answers:", answers);

      // Update the survey session status to finalized
      await db.completeSurveySession(sqlite, storedSessionId, "finalized");
      console.log("Survey session finalized successfully");

      // Clear the session from storage
      await AsyncStorage.removeItem("current_session");

      // Navigate back to SurveysScreen and set active tab
      const onTabChange = route.params?.onTabChange;
      if (onTabChange) {
        onTabChange("finalized");
      }
      navigation.navigate("SurveysScreen");
    } catch (err) {
      console.error("Error finalizing survey:", err);
      Alert.alert("Error", "Failed to finalize the survey. Please try again.");
    }
  };

  // Handle save as draft
  const handleSaveAsDraft = async () => {
    try {
      if (!sqlite) {
        throw new Error("SQLite context not available");
      }

      // Get the session ID
      let storedSessionId = await AsyncStorage.getItem("current_session");

      // If no session exists, create one
      if (!storedSessionId) {
        console.log("Creating new session for draft...");
        storedSessionId = await db.createSurveySession(sqlite);
        console.log("New session created with ID:", storedSessionId);
        await AsyncStorage.setItem(
          "current_session",
          storedSessionId.toString()
        );
        setSessionId(storedSessionId);
      }

      console.log("Saving survey as draft with sessionId:", storedSessionId);
      console.log("Current answers:", answers);

      // Update the survey session status to draft
      await db.completeSurveySession(sqlite, storedSessionId, "draft");
      console.log("Survey saved as draft successfully");

      // Save current index and answers to AsyncStorage
      const draftData = {
        answers,
        currentIndex,
        sessionId: storedSessionId,
      };

      // Save draft data with proper key format
      const draftKey = `draft_${storedSessionId}`;
      console.log("Saving draft data with key:", draftKey);
      await AsyncStorage.setItem(draftKey, JSON.stringify(draftData));

      // Verify the data was saved
      const savedData = await AsyncStorage.getItem(draftKey);
      console.log(
        "Verified saved draft data:",
        savedData ? "exists" : "not found"
      );

      // Clear the session from storage
      await AsyncStorage.removeItem("current_session");

      // Get the onTabChange function from route params
      const onTabChange = route.params?.onTabChange;
      console.log(
        "onTabChange function:",
        onTabChange ? "exists" : "does not exist"
      );

      // First change the tab
      if (onTabChange) {
        console.log("Changing tab to drafts");
        onTabChange("drafts");
      }

      // Then navigate back
      console.log("Navigating back to SurveysScreen");
      navigation.goBack();
    } catch (err) {
      console.error("Error saving draft:", err);
      Alert.alert("Error", "Failed to save draft. Please try again.");
    }
  };

  // Handle swipe left (go back)
  const handleSwipeLeft = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      // If we're at the first question, just go back without saving
      navigation.goBack();
    }
  };

  // Loading state
  if (loading) {
    return (
      <View
        style={[
          commonStyles.screenWrapper,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 10 }}>Loading survey...</Text>
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View
        style={[
          commonStyles.screenWrapper,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text style={{ color: "red", marginBottom: 20 }}>{error}</Text>
        <TouchableOpacity
          style={[styles.navButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => {
            setError(null);
            setLoading(true);
            fetchSurveyData();
          }}
        >
          <Text style={{ color: "#fff" }}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // No questions loaded
  if (surveyData.length === 0 && !loading) {
    return (
      <View
        style={[
          commonStyles.screenWrapper,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text>No survey questions available</Text>
      </View>
    );
  }

  // Main render
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View
          style={[
            commonStyles.screenWrapper,
            { backgroundColor: theme.colors.background },
          ]}
        >
          <Topbar />
          <View style={styles.progressContainer}>
            <View style={styles.progressBarBackground}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${getProgressInfo().progress}%`,
                    backgroundColor: theme.colors.primary,
                  },
                ]}
              />
            </View>
            <Text
              style={[
                styles.progressText,
                { color: theme.colors.secondaryText },
              ]}
            >
              {Math.round(getProgressInfo().progress)}%
            </Text>
          </View>
          <View style={styles.content}>{renderQuestionComponent()}</View>
          <View style={styles.navButtons}>
            {currentIndex > 0 && (
              <TouchableOpacity
                style={[
                  styles.navButton,
                  { backgroundColor: theme.colors.lightBlack },
                ]}
                onPress={goBack}
              >
                <Text style={{ color: theme.colors.secondaryText }}>Back</Text>
              </TouchableOpacity>
            )}
            <View style={styles.rightButtons}>
              <TouchableOpacity
                style={[
                  styles.navButton,
                  { backgroundColor: theme.colors.secondary },
                  styles.draftButton,
                ]}
                onPress={handleSaveAsDraft}
              >
                <Text style={{ color: "#fff" }}>Save as Draft</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.navButton,
                  { backgroundColor: theme.colors.primary },
                ]}
                onPress={goNext}
              >
                <Text style={{ color: "#fff" }}>
                  {currentIndex ===
                  getRelevantQuestions(surveyData, answers).length - 1
                    ? "Finalize"
                    : "Next"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: "#E0E0E0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 4,
  },
  progressText: {
    textAlign: "center",
    marginTop: 5,
    fontSize: 12,
  },
  content: {
    flex: 1,
  },
  navButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  navButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 4,
  },
  questionText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  rightButtons: {
    flexDirection: "row",
    gap: 10,
  },
  draftButton: {
    marginRight: 10,
  },
});

export default TakeSurveyScreen;
