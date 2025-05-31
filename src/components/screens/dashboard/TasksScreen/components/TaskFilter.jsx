import React from "react";
import { Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";

const filters = ["All", "Open", "In Progress", "Closed"];

const TaskFilter = ({ activeFilter, onFilterChange, tasks }) => {
  const countByStatus = (status) =>
    status === "All"
      ? tasks.length
      : tasks.filter(
          (task) => task.status.toLowerCase() === status.toLowerCase()
        ).length;
  return (
    <FlatList
      data={filters}
      horizontal
      keyExtractor={(item) => item}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.filterContainer}
      renderItem={({ item }) => {
        const isActive = activeFilter === item;
        return (
          <TouchableOpacity
            style={[styles.filterButton, isActive && styles.activeButton]}
            onPress={() => onFilterChange(item)}
          >
            <Text style={[styles.filterText, isActive && styles.activeText]}>
              {item} ({countByStatus(item)})
            </Text>
          </TouchableOpacity>
        );
      }}
    />
  );
};

export default TaskFilter;

const styles = StyleSheet.create({
  filterContainer: {
    flex: 1,
    gap: 8,
    marginVertical: 23,
    paddingHorizontal: 0,
  },
  filterButton: {
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
    height: 40,
  },
  activeButton: {
    backgroundColor: "#7e22ce",
  },
  filterText: {
    fontSize: 14,
    color: "#333",
  },
  activeText: {
    color: "#fff",
    fontWeight: "600",
  },
});
