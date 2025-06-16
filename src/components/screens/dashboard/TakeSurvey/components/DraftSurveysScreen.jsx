// screens/DraftSurveysScreen.jsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import surveyQuestions from "../../../../../utils/surveyQuestions.json";
import { useNavigation } from "@react-navigation/native";

const DraftSurveysScreen = () => {
  const [drafts, setDrafts] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchDrafts = async () => {
      try {
        const stored = await AsyncStorage.getItem("draftSurveys");
        if (stored) {
          setDrafts(JSON.parse(stored));
        }
      } catch (err) {
        console.error("Error loading drafts:", err);
      }
    };

    const unsubscribe = navigation.addListener("focus", fetchDrafts);
    return unsubscribe;
  }, [navigation]);

  const handleViewDraft = (draft) => {
    navigation.navigate("TakeSurveyScreen", { draft });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Saved Drafts</Text>
      {drafts.length === 0 && (
        <Text style={styles.empty}>No drafts saved.</Text>
      )}
      {drafts.map((draft, index) => (
        <TouchableOpacity
          key={draft.id || index}
          style={styles.item}
          onPress={() => handleViewDraft(draft)}
        >
          <Text style={styles.question}>
            {surveyQuestions[0]?.question || "Question 1"}:
          </Text>
          <Text style={styles.answer}>{draft.answers?.["1"] || "-"}</Text>
          <Text style={styles.timestamp}>
            {new Date(draft.timestamp).toLocaleString()}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default DraftSurveysScreen;

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#fff" },
  header: { fontSize: 20, fontWeight: "bold", marginBottom: 12 },
  empty: { textAlign: "center", marginTop: 30, color: "#999" },
  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  question: { fontWeight: "600", marginBottom: 4 },
  answer: { marginBottom: 4 },
  timestamp: { fontSize: 12, color: "#666" },
});
