import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { COLORS } from "../../styles/colors";

const TabSwitcher = ({ tabs = [], activeTab, setActiveTab }) => {
  return (
    <View style={styles.tabContainer}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={[styles.tab, activeTab === tab.key && styles.activeTab]}
          onPress={() => setActiveTab(tab.key)}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === tab.key && styles.activeTabText,
            ]}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.lightGray,
    borderRadius: 10,
    padding: 4,
    marginVertical: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: "transparent",
    borderRadius: 8,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: 14,
    color: COLORS.subtitle,
  },
  activeTabText: {
    color: COLORS.white,
    fontWeight: "600",
  },
});

export default TabSwitcher;
