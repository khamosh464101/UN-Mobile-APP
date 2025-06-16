import React, { useState, useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ThemeContext } from "../../../../utils/ThemeContext";
import { commonStyles } from "../../../../styles/commonStyles";
import Topbar from "../../../common/Topbar";
import TabSwitcher from "../../../common/TabSwitcher";
import DraftSurveysScreen from "../DraftSurveys/DraftSurveysScreen";
import FinalizedSurveysScreen from "../FinalizedSurveys/FinalizedSurveysScreen";
import { useNavigation } from "@react-navigation/native";

const SurveysScreen = () => {
  const { theme } = useContext(ThemeContext);
  const [activeTab, setActiveTab] = useState("finalized");
  const navigation = useNavigation();

  const tabs = [
    { key: "finalized", label: "Finalized" },
    { key: "drafts", label: "Drafts" },
    { key: "submitted", label: "Submitted" },
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case "finalized":
        return <FinalizedSurveysScreen />;
      case "drafts":
        return <DraftSurveysScreen />;
      case "submitted":
        return (
          <View style={styles.submittedContainer}>
            <Text style={[styles.submittedText, { color: theme.colors.text }]}>
              Submitted Surveys
            </Text>
          </View>
        );
      default:
        return <FinalizedSurveysScreen />;
    }
  };

  return (
    <View
      style={[
        commonStyles.screenWrapper,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <Topbar />
      <TouchableOpacity
        style={styles.newSurveyButton}
        onPress={() =>
          navigation.navigate("TakeSurveyScreen", {
            onTabChange: setActiveTab,
          })
        }
      >
        <Text style={[styles.newSurveyText, { color: theme.colors.primary }]}>
          Start a New Survey
        </Text>
      </TouchableOpacity>

      <TabSwitcher
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      {renderActiveTab()}
    </View>
  );
};

const styles = StyleSheet.create({
  newSurveyButton: {
    padding: 16,
    alignItems: "center",
  },
  newSurveyText: {
    fontSize: 16,
    fontWeight: "500",
  },
  submittedContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  submittedText: {
    fontSize: 16,
  },
});

export default SurveysScreen;
