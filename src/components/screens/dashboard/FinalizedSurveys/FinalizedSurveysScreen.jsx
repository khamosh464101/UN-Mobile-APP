import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import { ThemeContext } from "../../../../utils/ThemeContext";
import { commonStyles } from "../../../../styles/commonStyles";
import { useNavigation } from "@react-navigation/native";
import * as db from "../../../../services/database";
import { format } from "date-fns";

const FinalizedSurveysScreen = () => {
  const navigation = useNavigation();
  const { theme } = useContext(ThemeContext);
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const sqlite = useSQLiteContext();

  useEffect(() => {
    loadSurveys();
  }, []);

  const loadSurveys = async () => {
    try {
      if (!sqlite) {
        throw new Error("SQLite context not available");
      }

      const finalizedSurveys = await db.getFinalizedSessions(sqlite);
      console.log("Loaded finalized surveys:", finalizedSurveys);
      setSurveys(finalizedSurveys);
    } catch (error) {
      console.error("Error loading finalized surveys:", error);
      Alert.alert("Error", "Failed to load finalized surveys");
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

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.surveyItem, { backgroundColor: theme.colors.lightBlack }]}
      onPress={() => {
        // Navigate to survey details screen
        navigation.navigate("SurveyDetailsScreen", { sessionId: item.id });
      }}
    >
      <View style={styles.surveyInfo}>
        <View style={styles.header}>
          <Text style={[styles.surveyTitle, { color: theme.colors.text }]}>
            Survey #{item.id}
          </Text>
          <View
            style={[styles.status, { backgroundColor: theme.colors.primary }]}
          >
            <Text style={styles.statusLabel}>Finalized</Text>
          </View>
        </View>
        <Text
          style={[styles.surveyDate, { color: theme.colors.secondaryText }]}
        >
          Finalized on {formatDate(item.created_at)}
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
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {surveys.length === 0 ? (
        <Text style={[styles.emptyText, { color: theme.colors.text }]}>
          No finalized surveys yet
        </Text>
      ) : (
        <FlatList
          data={surveys}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
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
  container: {
    flex: 1,
  },
  listContainer: {},
  surveyItem: {
    padding: 20,
    borderRadius: 8,
    marginBottom: 12,
  },
  surveyInfo: {
    flexDirection: "column",
    justifyContent: "space-between",
    gap: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
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
  loadingText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
});

export default FinalizedSurveysScreen;
