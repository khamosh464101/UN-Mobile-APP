import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// Import dashboard screens
import HomeScreen from "../components/screens/dashboard/HomeScreen/HomeScreen";
import ProfileScreen from "../components/screens/dashboard/ProfileScreen/ProfileScreen";
import SearchScreen from "../components/screens/dashboard/SettingsScreen";
import TasksScreen from "../components/screens/dashboard/TasksScreen/TasksScreen";
import TaskStackNavigator from "./TaskStackNavigator";

// Import icons
import HomeActiveIcon from "../assets/icons/home-active.svg";
import HomeIcon from "../assets/icons/home.svg";
import ProfileActiveIcon from "../assets/icons/profile-active.svg";
import ProfileIcon from "../assets/icons/profile.svg";
import SearchActiveIcon from "../assets/icons/search-active.svg";
import SearchIcon from "../assets/icons/search.svg";
import TaskActiveIcon from "../assets/icons/task-active.svg";
import TaskIcon from "../assets/icons/task.svg";

// Import styles
import { COLORS } from "../styles/colors";

const Tab = createBottomTabNavigator();

export default function DashboardNavigator() {
  return (
    <Tab.Navigator initialRouteName="Home">
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? <HomeActiveIcon /> : <HomeIcon />,
          tabBarActiveTintColor: COLORS.primary,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? <ProfileActiveIcon /> : <ProfileIcon />,
          tabBarActiveTintColor: COLORS.primary,
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarIcon: ({ focused }) =>
            focused ? <SearchActiveIcon /> : <SearchIcon />,
          tabBarActiveTintColor: COLORS.primary,
        }}
      />
      <Tab.Screen
        name="Tasks"
        component={TaskStackNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? <TaskActiveIcon /> : <TaskIcon />,
          tabBarActiveTintColor: COLORS.primary,
        }}
      />
    </Tab.Navigator>
  );
}
