import React, { useContext } from "react";

import { useNavigation } from "@react-navigation/native";
import { SearchContext } from "../../../../utils/SearchContext";

import { StyleSheet, View, ScrollView, StatusBar } from "react-native";

import HeroCard from "./components/HeroCard";
import SecondaryCard from "./components/SecondaryCard";
import Topbar from "../../../common/Topbar";
import Search from "../../../common/Search";
import { commonStyles } from "../../../../styles/commonStyles";
import tasksData from "../../../../utils/tasks.json";

export default function HomeScreen() {
  const navigation = useNavigation();
  const { setSearchKeyword, setSearchResults } = useContext(SearchContext);

  const handleSearch = (keyword) => {
    const filtered = tasksData.filter(
      (task) =>
        task.title.toLowerCase().includes(keyword.toLowerCase()) ||
        task.id.toLowerCase().includes(keyword.toLowerCase())
    );
    setSearchKeyword(keyword);
    setSearchResults(filtered);
    navigation.navigate("Search");
  };
  return (
    <View style={commonStyles.screenWrapper}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.topBarWrapper}>
        <Topbar />

        <Search onSearch={handleSearch} />
      </View>
      <View style={styles.scrollViewWrapper}>
        <ScrollView
          contentContainerStyle={styles.scrollView}
          keyboardShouldPersistTaps="handled"
        >
          <HeroCard TaskCount="02" TaskType="In Progress Tasks" />

          <View style={styles.rowCards}>
            <SecondaryCard TaskCount="08" TaskType="Open Tasks" />
            <SecondaryCard TaskCount={20} TaskType="Closed Tasks" />
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollViewWrapper: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
  },
  rowCards: {
    width: "100%",
    gap: 18,
    flexDirection: "column",
    justifyContent: "space-between",
  },

  scrollViewWrapper: {
    flex: 1,
    paddingVertical: 15,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
});
