import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";

// Import dashboard screens
import HomeScreen from "../components/screens/dashboard/HomeScreen/HomeScreen";
import ProfileScreen from "../components/screens/dashboard/ProfileScreen/ProfileScreen";
import SearchScreen from "../components/screens/dashboard/SearchScreen/SearchScreen";
import NotificationsScreen from "../components/screens/dashboard/NotificationsScreen/NotificationsScreen";
import TasksScreen from "../components/screens/dashboard/TasksScreen/TasksScreen";
import TaskScreen from "../components/screens/dashboard/TasksScreen/TaskScreen";
// import TaskStackNavigator from "./TaskStackNavigator";

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
const HomeStack = createStackNavigator();
const TasksStack = createStackNavigator();
const SearchStack = createStackNavigator();
const ProfileStack = createStackNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeScreen" component={HomeScreen} />
      <HomeStack.Screen name="Notifications" component={NotificationsScreen} />
    </HomeStack.Navigator>
  );
}

// Repeat similar stack navigators for other tabs
function TasksStackScreen() {
  return (
    <TasksStack.Navigator screenOptions={{ headerShown: false }}>
      <TasksStack.Screen
        name="TasksScreen"
        component={TasksScreen}
        options={{ headerShown: false }}
      />
      <TasksStack.Screen
        name="TaskDetails"
        component={TaskScreen}
        options={{ headerShown: false }}
      />
      <TasksStack.Screen name="Notifications" component={NotificationsScreen} />
    </TasksStack.Navigator>
  );
}

function SearchStackSCreen() {
  return (
    <SearchStack.Navigator screenOptions={{ headerShown: false }}>
      <SearchStack.Screen name="SearchScreen" component={SearchScreen} />
      <SearchStack.Screen
        name="Notifications"
        component={NotificationsScreen}
      />
    </SearchStack.Navigator>
  );
}

function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="ProfileScreen" component={ProfileScreen} />
      <ProfileStack.Screen
        name="Notifications"
        component={NotificationsScreen}
      />
    </ProfileStack.Navigator>
  );
}

export default function DashboardNavigator() {
  return (
    <Tab.Navigator initialRouteName="Home">
      <Tab.Screen
        name="Home"
        component={HomeStackScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? <HomeActiveIcon /> : <HomeIcon />,
          tabBarActiveTintColor: COLORS.primary,
        }}
      />
      <Tab.Screen
        name="Tasks"
        component={TasksStackScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? <TaskActiveIcon /> : <TaskIcon />,
          tabBarActiveTintColor: COLORS.primary,
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchStackSCreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? <SearchActiveIcon /> : <SearchIcon />,
          tabBarActiveTintColor: COLORS.primary,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStackScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? <ProfileActiveIcon /> : <ProfileIcon />,
          tabBarActiveTintColor: COLORS.primary,
        }}
      />
    </Tab.Navigator>
  );
}
