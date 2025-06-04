import React, { useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ThemeContext } from "../../../../../utils/ThemeContext";

const TaskCard = ({ task, onPressViewDetails }) => {
  const { theme } = useContext(ThemeContext);

  const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case "open":
        return { backgroundColor: theme.colors.primary, color: "#fff" }; // Purple
      case "in progress":
        return { backgroundColor: theme.colors.secondary, color: "#000" }; // Yellow
      case "closed":
        return { backgroundColor: theme.colors.danger, color: "#fff" }; // Red
      default:
        return { backgroundColor: "#ccc", color: "#000" };
    }
  };
  const statusStyle = getStatusStyle(task.status);
  return (
    <View style={[styles.card, { backgroundColor: theme.colors.lightBlack }]}>
      <View>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            {task.title}
          </Text>
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

        <Text style={[styles.subText, { color: theme.colors.secondaryText }]}>
          #{task.id}
        </Text>
      </View>
      <View
        style={[
          styles.seprator,
          { borderBottomColor: theme.colors.background },
        ]}
      ></View>

      <View style={styles.infoRow}>
        <View style={styles.taskInfo}>
          <Text style={[styles.label, { color: theme.colors.secondaryText }]}>
            Assigned By
          </Text>
          <View style={styles.avatarWrapper}>
            <View
              style={[
                styles.avatar,
                { backgroundColor: theme.colors.background },
              ]}
            ></View>
            <Text style={[styles.value, { color: theme.colors.text }]}>
              {task.assignedBy.name}
            </Text>
          </View>
        </View>
        <View style={styles.taskInfo}>
          <Text style={[styles.label, { color: theme.colors.secondaryText }]}>
            Deadline
          </Text>
          <View style={styles.avatarWrapper}>
            <Text style={[styles.value, { color: theme.colors.text }]}>
              {task.deadline}
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.colors.primary }]}
        onPress={() => onPressViewDetails?.(task)}
      >
        <Text style={[styles.buttonText, { color: "#fff" }]}>View Details</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TaskCard;

const styles = StyleSheet.create({
  card: {
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
    marginTop: 4,
    fontSize: 12,
  },
  seprator: {
    marginTop: 10,
    borderBottomWidth: 1,
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
  },
  label: {
    fontSize: 13,
  },
  value: {
    fontWeight: "500",
    fontSize: 13,
  },
  button: {
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    fontWeight: "600",
    fontSize: 14,
  },
});
