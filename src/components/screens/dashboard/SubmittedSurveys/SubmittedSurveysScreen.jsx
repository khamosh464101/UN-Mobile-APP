import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import { useNavigation } from "@react-navigation/native";
import { ThemeContext } from "../../../../utils/ThemeContext";
import * as db from "../../../../services/database";
import { format } from "date-fns";

const SubmittedSurveysScreen = () => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const db = useSQLiteContext();
  const navigation = useNavigation();
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    loadSurveys();
  }, []);

  const loadSurveys = async () => {
    try {
      const result = await db.getAllAsync(
        "SELECT * FROM survey_sessions WHERE status = 'submitted' ORDER BY id DESC"
      );
      setSurveys(result);
    } catch (error) {
      console.error("Error loading submitted surveys:", error);
    } finally {
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

  const handleSurveyPress = (survey) => {
    navigation.navigate("SurveyDetailsScreen", { sessionId: survey.id });
  };

  if (loading) {
    return (
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {surveys.length === 0 ? (
        <Text style={[styles.emptyText, { color: theme.colors.text }]}>
          No submitted surveys yet
        </Text>
      ) : (
        <FlatList
          data={surveys}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.surveyItem,
                { backgroundColor: theme.colors.lightBlack },
              ]}
              onPress={() => handleSurveyPress(item)}
            >
              <View style={styles.header}>
                <Text
                  style={[styles.surveyTitle, { color: theme.colors.text }]}
                >
                  Survey #{item.id}
                </Text>
                <View
                  style={[
                    styles.status,
                    { backgroundColor: theme.colors.primary },
                  ]}
                >
                  <Text style={styles.statusLabel}>Submitted</Text>
                </View>
              </View>
              <Text
                style={[
                  styles.timestamp,
                  { color: theme.colors.secondaryText },
                ]}
              >
                Submitted on {formatDate(item.end_time)}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {},
  surveyItem: {
    marginBottom: 12,
    borderRadius: 8,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  surveyTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  status: {
    paddingHorizontal: 7,
    paddingVertical: 5,
    borderRadius: 3,
  },
  statusLabel: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  timestamp: {
    fontSize: 12,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
});

export default SubmittedSurveysScreen;
