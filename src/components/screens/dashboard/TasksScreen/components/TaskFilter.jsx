import React from "react";
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
  ScrollView,
} from "react-native";
import { COLORS } from "../../../../../styles/colors";
const filters = ["All", "Open", "In Progress", "Closed"];

const TaskFilter = ({ activeFilter, onFilterChange, tasks }) => {
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
            style={[styles.button, isActive && styles.activeButton]}
            onPress={() => onFilterChange(item)}
          >
            <Text style={[styles.text, isActive && styles.activeText]}>
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
    backgroundColor: COLORS.lightGray,
    height: 35,
    alignItems: "center",
    justifyContent: "center",
  },
  activeButton: {
    backgroundColor: COLORS.primary,
  },
  text: {
    fontSize: 14,
    color: COLORS.subtitle,
  },
  activeText: {
    color: COLORS.white,
  },
});
