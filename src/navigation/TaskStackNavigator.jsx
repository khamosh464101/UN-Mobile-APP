import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import TasksScreen from "../components/screens/dashboard/TasksScreen/TasksScreen";
import TaskScreen from "../components/screens/dashboard/TasksScreen/TaskScreen";

const Stack = createStackNavigator();

const TaskStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Tasks"
        component={TasksScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TaskDetails"
        component={TaskScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default TaskStackNavigator;
