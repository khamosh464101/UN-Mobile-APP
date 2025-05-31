import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const getStatusStyle = (status) => {
  switch (status.toLowerCase()) {
    case "open":
      return { backgroundColor: "#8b5cf6", color: "#fff" }; // Purple
    case "in progress":
      return { backgroundColor: "#fbbf24", color: "#000" }; // Yellow
    case "closed":
      return { backgroundColor: "#ef4444", color: "#fff" }; // Red
    default:
      return { backgroundColor: "#ccc", color: "#000" };
  }
};

const TaskCard = ({ task, onPressViewDetails }) => {
  const statusStyle = getStatusStyle(task.status);
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{task.title}</Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: statusStyle.backgroundColor },
          ]}
        >
          <Text style={[styles.statusText, { color: statusStyle.color }]}>
            {task.status}
          </Text>
        </View>
      </View>

      <Text style={styles.subText}>#{task.id}</Text>

      <View style={styles.infoRow}>
        <View>
          <Text style={styles.label}>Due Date:</Text>
          <Text style={styles.value}>{task.dueDate}</Text>
        </View>
        <View>
          <Text style={styles.label}>Assigned By</Text>
          <Text style={styles.value}>{task.assignedBy.name}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => onPressViewDetails?.(task)}
      >
        <Text style={styles.buttonText}>View Details</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TaskCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fafafa",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#111",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  subText: {
    color: "#888",
    marginTop: 4,
    fontSize: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    marginBottom: 16,
  },
  label: {
    color: "#666",
    fontSize: 13,
  },
  value: {
    color: "#333",
    fontWeight: "500",
    fontSize: 13,
  },
  button: {
    backgroundColor: "#8b5cf6",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
});
