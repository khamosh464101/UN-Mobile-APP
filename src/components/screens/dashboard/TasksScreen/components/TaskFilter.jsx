import React, { useContext } from "react";
import { Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { ThemeContext } from "../../../../../utils/ThemeContext";

const filters = ["All", "Open", "In Progress", "Closed"];

const TaskFilter = ({ activeFilter, onFilterChange, tasks }) => {
  const { theme } = useContext(ThemeContext);
  const countByStatus = (status) =>
    status === "All"
      ? tasks.length
      : tasks.filter(
          (task) => task.status.toLowerCase() === status.toLowerCase()
        ).length;
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {filters.map((item) => {
        const isActive = activeFilter === item;
        return (
          <TouchableOpacity
            key={item}
            style={[
              styles.button,
              isActive
                ? { backgroundColor: theme.colors.primary }
                : {
                    backgroundColor: theme.colors.lightBlack,
                  },
            ]}
            onPress={() => onFilterChange(item)}
          >
            <Text
              style={[
                styles.text,
                { color: theme.colors.secondaryText },
                isActive && styles.activeText,
              ]}
            >
              {item} ({countByStatus(item)})
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

export default TaskFilter;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    marginBottom: 10,
    flexDirection: "row",
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginRight: 10,
    borderRadius: 5,
    height: 35,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 14,
  },
  activeText: {
    color: "#fff",
  },
});
