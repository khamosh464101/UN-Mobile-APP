import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import { ThemeContext } from "../../../../utils/ThemeContext";
import { commonStyles } from "../../../../styles/commonStyles";
import * as db from "../../../../services/database";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { format } from "date-fns";

const DraftSurveysScreen = () => {
  const navigation = useNavigation();
  const { theme } = useContext(ThemeContext);
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const sqlite = useSQLiteContext();

  useEffect(() => {
    console.log("DraftSurveysScreen mounted");
    loadSurveys();
  }, []);

  const loadSurveys = async () => {
    try {
      console.log("Loading drafts...");
      if (!sqlite) {
        throw new Error("SQLite context not available");
      }

      console.log("SQLite context available, calling getDraftSessions...");
      const draftSurveys = await db.getDraftSessions(sqlite);
      console.log("Loaded draft surveys:", draftSurveys);
      setSurveys(draftSurveys);
      setLoading(false);
    } catch (error) {
      console.error("Error loading drafts:", error);
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        db: !!sqlite,
        getDraftSessions: !!db.getDraftSessions,
      });
      Alert.alert("Error", "Failed to load draft surveys. Please try again.");
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, "MMM dd, yyyy 'at' hh:mm a");
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  const handleResumeSurvey = async (sessionId) => {
    try {
      console.log("Attempting to resume survey:", sessionId);

      // Get draft data from AsyncStorage
      const draftKey = `draft_${sessionId}`;
      const draftDataString = await AsyncStorage.getItem(draftKey);
      console.log("Retrieved draft data:", draftDataString);

      if (!draftDataString) {
        throw new Error("Draft data not found");
      }

      const draftData = JSON.parse(draftDataString);
      console.log("Parsed draft data:", draftData);

      // Navigate to TakeSurveyScreen with the draft data
      navigation.navigate("TakeSurveyScreen", {
        draftId: sessionId,
        initialAnswers: draftData.answers,
        initialIndex: draftData.currentIndex,
        onTabChange: (tab) => {
          // This will be called when the survey is saved or finalized
          if (navigation.isFocused()) {
            setActiveTab(tab);
          }
        },
      });
    } catch (error) {
      console.error("Error resuming survey:", error);
      Alert.alert(
        "Error",
        "Failed to resume survey. The draft data may be corrupted or missing."
      );
    }
  };

  const handleDeleteDraft = async (sessionId) => {
    try {
      if (!sqlite) {
        throw new Error("SQLite context not available");
      }

      // Delete the draft from SQLite
      await db.deleteSurveySession(sqlite, sessionId);

      // Delete the draft data from AsyncStorage
      await AsyncStorage.removeItem(`draft_${sessionId}`);

      // Reload the drafts list
      await loadSurveys();
    } catch (error) {
      console.error("Error deleting draft:", error);
      Alert.alert("Error", "Failed to delete draft. Please try again.");
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.surveyItem, { backgroundColor: theme.colors.lightBlack }]}
      onPress={() => handleResumeSurvey(item.id)}
    >
      <View style={styles.surveyInfo}>
        <View style={styles.header}>
          <Text style={[styles.surveyTitle, { color: theme.colors.text }]}>
            Survey #{item.id}
          </Text>
          <View
            style={[styles.status, { backgroundColor: theme.colors.danger }]}
          >
            <Text style={styles.statusLabel}>Draft</Text>
          </View>
        </View>
        <Text style={[styles.surveyDate, { color: theme.colors.text }]}>
          Saved on {formatDate(item.created_at)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.loadingContainer]}>
        <ActivityIndicator size="small" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View
      style={[
        commonStyles.container,
        { backgroundColor: theme.colors.background },
      ]}
    >
      {surveys.length === 0 ? (
        <Text style={[styles.emptyText, { color: theme.colors.text }]}>
          No draft surveys yet
        </Text>
      ) : (
        <FlatList
          data={surveys}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  Container: {
    flex: 1,
  },
  surveyItem: {
    padding: 20,
    borderRadius: 8,
    marginBottom: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  surveyInfo: {
    flexDirection: "column",
    justifyContent: "space-between",
    gap: 8,
  },
  surveyTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  status: {
    paddingVertical: 5,
    paddingHorizontal: 7,
    borderRadius: 3,
  },
  statusLabel: {
    color: "#fff",
    fontSize: 12,
  },
  surveyDate: {
    fontSize: 12,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
});

export default DraftSurveysScreen;
