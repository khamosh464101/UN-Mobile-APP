import React, { useState } from "react";
import { View, FlatList, StyleSheet, ScrollView } from "react-native";
import { commonStyles } from "../../../../styles/commonStyles";
import Topbar from "../../../common/Topbar";
import TaskFilter from "./components/TaskFilter";
import tasksData from "../../../../utils/tasks.json";
import TaskCard from "./components/TaskCard";
const TasksScreen = ({ navigation }) => {
  const handleViewDetails = (task) => {
    navigation.navigate("TaskDetails", { task });
  };
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredTasks =
    activeFilter === "All"
      ? tasksData
      : tasksData.filter(
          (task) => task.status.toLowerCase() === activeFilter.toLowerCase()
        );

  return (
    <View style={commonStyles.screenWrapper}>
      <Topbar />
      <TaskFilter
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        tasks={tasksData}
      />
      <ScrollView contentContainerStyle={styles.container}>
        {tasksData.map((task, index) => (
          <TaskCard
            key={index}
            task={task}
            onPressViewDetails={handleViewDetails}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default TasksScreen;

const styles = StyleSheet.create({});
