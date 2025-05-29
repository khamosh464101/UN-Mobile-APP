import React from "react";
import { StyleSheet, View, ScrollView, StatusBar } from "react-native";

import HeroCard from "./components/HeroCard";
import SecondaryCard from "./components/SecondaryCard";
import Topbar from "../../../common/Topbar";
import Search from "../../../common/Search";
import { commonStyles } from "../../../../styles/commonStyles";

export default function HomeScreen() {
  return (
    <View style={commonStyles.screenWrapper}>
      <StatusBar barStyle="dark-content" />
      {/* Top Bar */}
      <View style={styles.topBarWrapper}>
        <Topbar />
        {/* Search Section */}
        <Search />
      </View>
      <View style={styles.scrollViewWrapper}>
        <ScrollView
          contentContainerStyle={styles.scrollView}
          keyboardShouldPersistTaps="handled"
        >
          {/* In Progress Tasks Card */}
          <HeroCard TaskCount={2} TaskType="In Progress Tasks" />

          {/* Open/Resolved Tasks Cards */}
          <View style={styles.rowCards}>
            <SecondaryCard TaskCount={8} TaskType="Open Tasks" />
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
    marginTop: 35,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
});
