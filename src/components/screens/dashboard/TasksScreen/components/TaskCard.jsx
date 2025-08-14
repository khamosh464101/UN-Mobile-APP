import React, { useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { ThemeContext } from "../../../../../utils/ThemeContext";

const TaskCard = ({ task, onPressViewDetails }) => {
  const { theme } = useContext(ThemeContext);
  console.log('3434343', task)

  const getPriorityStyle = (priority) => {
    return { backgroundColor: priority.color, color: '#FFFFFF' };
  };
  const priorityStyle = getPriorityStyle(task.priority);
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
              { backgroundColor: priorityStyle.backgroundColor },
            ]}
          >
            <Text style={[styles.statusText, { color: priorityStyle.color }]}>
              {task?.priority?.title}
            </Text>
          </View>
        </View>

        <Text style={[styles.subText, { color: theme.colors.secondaryText }]}>
          {task.ticket_number}
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
            <Image
              source={
                task?.owner?.photo
                  ? { uri: task.owner.photo }
                  : require('../../../../../assets/images/Head.png')
              }
              style={[styles.avatar, { backgroundColor: theme.colors.lightBlack }]}
              resizeMode="cover"
            />
    
            <Text style={[styles.value, { color: theme.colors.text }]}>
              {task?.owner?.name}
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
