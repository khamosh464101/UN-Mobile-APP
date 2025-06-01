import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS } from "../../../../../styles/colors";

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
      <View>
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
      </View>
      <View style={styles.seprator}></View>

      <View style={styles.infoRow}>
        <View style={styles.taskInfo}>
          <Text style={styles.label}>Assigned By</Text>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatar}></View>
            <Text style={styles.value}>{task.assignedBy.name}</Text>
          </View>
        </View>
        <View style={styles.taskInfo}>
          <Text style={styles.label}>Deadline</Text>
          <View style={styles.avatarWrapper}>
            <Text style={styles.value}>{task.deadline}</Text>
          </View>
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
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    gap: 15,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
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
    color: COLORS.subtitle,
    marginTop: 4,
    fontSize: 12,
  },
  seprator: {
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.inputBorder,
  },
  infoRow: {
    flexDirection: "column",
    justifyContent: "space-between",
  },
  taskInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  avatarWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 10,
  },
  avatar: {
    height: 25,
    width: 25,
    borderRadius: 25,
    backgroundColor: COLORS.white,
  },
  label: {
    color: COLORS.subtitle,
    fontSize: 13,
  },
  value: {
    fontWeight: "500",
    fontSize: 13,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: "600",
    fontSize: 14,
  },
});
