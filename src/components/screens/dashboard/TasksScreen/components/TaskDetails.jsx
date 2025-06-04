import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { ThemeContext } from "../../../../../utils/ThemeContext";

const TaskDetails = ({ task }) => {
  const { theme } = useContext(ThemeContext);
  const [status, setStatus] = useState(task.status);

  const statuses = ["Open", "In Progress", "Closed"];

  return (
    <ScrollView
      contentContainerStyle={styles.scrollView}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.taskInfo}>
        <Text
          style={[styles.taskInfoLabel, { color: theme.colors.secondaryText }]}
        >
          Assigned By
        </Text>
        <View style={styles.taskInfoItemWrapper}>
          <View
            style={[
              styles.avatar,
              { backgroundColor: theme.colors.lightBlack },
            ]}
          ></View>
          <Text style={[styles.taskInfoValue, { color: theme.colors.text }]}>
            {task.assignedBy.name}
          </Text>
        </View>
      </View>
      <View style={styles.taskInfo}>
        <Text
          style={[styles.taskInfoLabel, { color: theme.colors.secondaryText }]}
        >
          Status
        </Text>
        <View style={styles.taskStatusWrapper}>
          <View style={styles.taskStatus}>
            {statuses.map((item) => (
              <TouchableOpacity
                key={item}
                onPress={() => setStatus(item)}
                style={styles.taskStatusItem}
              >
                <View
                  style={[
                    styles.taskStatusItemDot,
                    { borderColor: theme.colors.primary },
                  ]}
                >
                  {status === item && (
                    <View
                      style={[
                        styles.taskStatusItemDotActive,
                        { backgroundColor: theme.colors.primary },
                      ]}
                    />
                  )}
                </View>
                <Text
                  style={[styles.taskInfoValue, { color: theme.colors.text }]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
      <View style={styles.taskInfo}>
        <Text
          style={[styles.taskInfoLabel, { color: theme.colors.secondaryText }]}
        >
          Estimation
        </Text>
        <View style={styles.taskInfoItemWrapper}>
          <Text style={[styles.taskInfoValue, { color: theme.colors.text }]}>
            {task.estimationHours} Hours
          </Text>
        </View>
      </View>
      <View style={styles.taskInfo}>
        <Text
          style={[styles.taskInfoLabel, { color: theme.colors.secondaryText }]}
        >
          Deadline
        </Text>
        <View style={styles.taskInfoItemWrapper}>
          <Text style={[styles.taskInfoValue, { color: theme.colors.text }]}>
            {task.deadline}
          </Text>
        </View>
      </View>
      <View style={styles.taskDetails}>
        <View>
          <Text style={[styles.taskTitle, { color: theme.colors.text }]}>
            {task.title}
          </Text>

          <Text style={[styles.taskId, { color: theme.colors.secondaryText }]}>
            #{task.id}
          </Text>
        </View>
        <Text style={[styles.description, { color: theme.colors.text }]}>
          {task.description}
        </Text>
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
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  taskStatusItemDotActive: {
    height: 10,
    width: 10,
    borderRadius: 5,
  },
});
