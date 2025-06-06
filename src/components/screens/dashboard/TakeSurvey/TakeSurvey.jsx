import React, { useState, useContext } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Topbar from "../../../common/Topbar";
import { commonStyles } from "../../../../styles/commonStyles";
import surveyData from "../../../../utils/surveyQuestions.json";
import RadioQuestion from "./components/RadioQuestion";
import CheckboxQuestion from "./components/CheckboxQuestion";
import IntegerQuestion from "./components/IntegerQuestion";
import TextQuestion from "./components/TextQuestion";
import DateQuestion from "./components/DateQuestion";
import TextareaQuestion from "./components/Textareaquestion";
import PhotoQuestion from "./components/PhotoQuestion";
import { ThemeContext } from "../../../../utils/ThemeContext";
import GeoPointQuestion from "./components/GeoPointQuestion";
import { useNavigation } from "@react-navigation/native";

const TakeSurvey = () => {
  const navigation = useNavigation();
  const handleViewDetails = (task) => {
    navigation.navigate("Tasks", {
      screen: "TaskDetails",
      params: { task },
    });
  };
  const { theme } = useContext(ThemeContext);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [answers, setAnswers] = useState({});

  const currentQuestion = surveyData[currentIndex];

  const handleAnswerChange = (value) => {
    setAnswers({ ...answers, [currentQuestion.id]: value });
  };

  const renderQuestionComponent = () => {
    switch (currentQuestion.type) {
      case "radio":
        return (
          <RadioQuestion
            question={currentQuestion.question}
            options={currentQuestion.options}
            value={answers[currentQuestion.id]}
            onChange={handleAnswerChange}
          />
        );
      case "checkbox":
        return (
          <CheckboxQuestion
            question={currentQuestion.question}
            options={currentQuestion.options}
            value={answers[currentQuestion.id]}
            onChange={handleAnswerChange}
          />
        );
      case "input_integer":
        return (
          <IntegerQuestion
            question={currentQuestion.question}
            value={answers[currentQuestion.id]}
            onChange={handleAnswerChange}
          />
        );
      case "input_text":
        return (
          <TextQuestion
            question={currentQuestion.question}
            value={answers[currentQuestion.id]}
            onChange={handleAnswerChange}
          />
        );
      case "input_date":
        return (
          <DateQuestion
            question={currentQuestion.question}
            value={answers[currentQuestion.id]}
            onChange={handleAnswerChange}
          />
        );
      case "textarea":
        return (
          <TextareaQuestion
            question={currentQuestion.question}
            value={answers[currentQuestion.id]}
            onChange={handleAnswerChange}
          />
        );
      case "input_photo":
        return (
          <PhotoQuestion
            question={currentQuestion.question}
            value={answers[currentQuestion.id]}
            onChange={handleAnswerChange}
          />
        );
      case "geopoint":
        return (
          <GeoPointQuestion
            question={currentQuestion.question}
            value={answers[currentQuestion.id]}
            onChange={handleAnswerChange}
          />
        );
      default:
        return <Text>Unsupported question type</Text>;
    }
  };

  const goNext = async () => {
    if (currentIndex < surveyData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      console.log("Survey completed:", answers);
      try {
        const existing = await AsyncStorage.getItem("submittedSurveys");

        const surveys = existing ? JSON.parse(existing) : [];

        const UpdatedSurveys = [...surveys, { timestamp: Date.now(), answers }];

        await AsyncStorage.setItem(
          "submittedSurveys",
          JSON.stringify(UpdatedSurveys)
        );

        setAnswers({});
        setCurrentIndex(0);

        navigation.navigate("Take Survey", {
          screen: "SurveySuccessScreen",
        });
      } catch (error) {
        console.error("Error saving survey:", error);
      }
    }
  };

  const goBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View
        style={[
          commonStyles.screenWrapper,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <Topbar />
        {/* Progress bar */}
        <Text style={[styles.progress, { color: theme.colors.secondaryText }]}>
          Question {currentIndex + 1} of {surveyData.length}
        </Text>
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
          <TouchableOpacity
            style={[
              styles.navButton,
              { backgroundColor: theme.colors.primary },
            ]}
            onPress={goNext}
          >
            <Text style={{ color: "#fff" }}>
              {currentIndex === surveyData.length - 1 ? "Submit" : "Next"}
            </Text>
          </TouchableOpacity>
        </View>
        {/* <RadioQuestion/> */}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default TakeSurvey;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  progress: {
    textAlign: "center",
    marginBottom: 12,
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
    backgroundColor: "#e8e8e8",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 4,
  },
});
