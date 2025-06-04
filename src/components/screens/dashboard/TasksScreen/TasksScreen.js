import React, { useState, useContext } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { commonStyles } from "../../../../styles/commonStyles";
import Topbar from "../../../common/Topbar";
import TaskFilter from "./components/TaskFilter";
import tasksData from "../../../../utils/tasks.json";
import TaskCard from "./components/TaskCard";
import { Dimensions } from "react-native";
import { ThemeContext } from "../../../../utils/ThemeContext";

const filters = ["All", "Open", "In Progress", "Closed"];
const screenHeight = Dimensions.get("window").height;

const TasksScreen = ({ navigation }) => {
  const { theme } = useContext(ThemeContext);
  const handleViewDetails = (task) => {
    navigation.navigate("TaskDetails", { task });
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  const [activeFilter, setActiveFilter] = useState("All");

  const filteredTasks =
    activeFilter === "All"
      ? tasksData
      : tasksData.filter(
          (task) => task.status.toLowerCase() === activeFilter.toLowerCase()
        );

  return (
    <View
      style={[
        commonStyles.screenWrapper,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <Topbar />
      <TaskFilter
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
        tasks={tasksData}
        filter={filters}
        style={{ paddingVertical: 10 }}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {filteredTasks.map((task, index) => (
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

const styles = StyleSheet.create({
  container: {
    paddingVertical: 15,
    justifyContent: "flex-start",
    minHeight: screenHeight * 0.65,
  },
});
