import React, { useContext } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { ThemeContext } from "../../utils/ThemeContext";

const TabSwitcher = ({ tabs = [], activeTab, setActiveTab }) => {
  const { theme } = useContext(ThemeContext);
  return (
    <View
      style={[
        styles.tabContainer,
        { backgroundColor: theme.colors.lightBlack },
      ]}
    >
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={[
            styles.tab,
            activeTab === tab.key && { backgroundColor: theme.colors.primary },
          ]}
          onPress={() => setActiveTab(tab.key)}
        >
          <Text
            style={[
              styles.tabText,
              { color: theme.colors.secondaryText },
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

  tabText: {
    fontSize: 14,
  },
  activeTabText: {
    color: "#fff",
    fontWeight: "600",
  },
});

export default TabSwitcher;
