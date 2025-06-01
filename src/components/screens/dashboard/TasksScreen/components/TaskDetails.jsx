import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { COLORS } from "../../../../../styles/colors";

const TaskDetails = ({ task }) => {
  const [status, setStatus] = useState(task.status);

  const statuses = ["Open", "In Progress", "Closed"];

  return (
    <ScrollView
      contentContainerStyle={styles.scrollView}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.taskInfo}>
        <Text style={styles.taskInfoLabel}>Assigned By</Text>
        <View style={styles.taskInfoItemWrapper}>
          <View style={styles.avatar}></View>
          <Text style={styles.taskInfoValue}>{task.assignedBy.name}</Text>
        </View>
      </View>
      <View style={styles.taskInfo}>
        <Text style={styles.taskInfoLabel}>Status</Text>
        <View style={styles.taskStatusWrapper}>
          <View style={styles.taskStatus}>
            {statuses.map((item) => (
              <TouchableOpacity
                key={item}
                onPress={() => setStatus(item)}
                style={styles.taskStatusItem}
              >
                <View style={styles.taskStatusItemDot}>
                  {status === item && (
                    <View style={styles.taskStatusItemDotActive} />
                  )}
                </View>
                <Text style={styles.taskInfoValue}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
      <View style={styles.taskInfo}>
        <Text style={styles.taskInfoLabel}>Estimation</Text>
        <View style={styles.taskInfoItemWrapper}>
          <Text style={styles.taskInfoValue}>{task.estimationHours} Hours</Text>
        </View>
      </View>
      <View style={styles.taskInfo}>
        <Text style={styles.taskInfoLabel}>Deadline</Text>
        <View style={styles.taskInfoItemWrapper}>
          <Text style={styles.taskInfoValue}>{task.deadline}</Text>
        </View>
      </View>
      <View style={styles.taskDetails}>
        <View>
          <Text style={styles.taskTitle}>{task.title}</Text>

          <Text style={styles.taskId}>#{task.id}</Text>
        </View>
        <Text style={styles.description}>{task.description}</Text>
      </View>
    </ScrollView>
  );
};

export default TaskDetails;

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
  },
  taskInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  taskInfoItemWrapper: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
  },
  avatar: {
    height: 25,
    width: 25,
    borderRadius: 25,
    backgroundColor: COLORS.lightGray,
  },
  taskStatusWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  taskStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  taskInfoLabel: {
    fontSize: 13,
    color: COLORS.subtitle,
  },
  taskInfoValue: {
    fontSize: 13,
    fontWeight: "500",
  },
  taskDetails: {
    flexDirection: "column",
    gap: 15,
    marginTop: 25,
  },
  taskTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },
  taskId: {
    color: COLORS.subtitle,
    marginTop: 4,
    fontSize: 12,
  },
  description: {
    lineHeight: 20,
    textAlign: "justify",
  },
  taskStatusItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  taskStatusItemDot: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.subtitle,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  taskStatusItemDotActive: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: COLORS.subtitle,
  },
});
