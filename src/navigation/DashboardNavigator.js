import React, { useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";

// Import dashboard screens
import HomeScreen from "../components/screens/dashboard/HomeScreen/HomeScreen";
import ProfileScreen from "../components/screens/dashboard/ProfileScreen/ProfileScreen";
import SearchScreen from "../components/screens/dashboard/SearchScreen/SearchScreen";
import NotificationsScreen from "../components/screens/dashboard/NotificationsScreen/NotificationsScreen";
import TasksScreen from "../components/screens/dashboard/TasksScreen/TasksScreen";
import TaskScreen from "../components/screens/dashboard/TasksScreen/TaskScreen";
import SettingsScreen from "../components/screens/dashboard/SettingsScreen/SettingsScreen";
import TakeSurvey from "../components/screens/dashboard/TakeSurvey/TakeSurvey";
// import TaskStackNavigator from "./TaskStackNavigator";

// Import icons
import HomeActiveIcon from "../assets/icons/home-active.svg";
import HomeIcon from "../assets/icons/home.svg";
import HomeDarkIcon from "../assets/icons/home-dark.svg";
import ProfileActiveIcon from "../assets/icons/profile-active.svg";
import ProfileIcon from "../assets/icons/profile.svg";
import ProfileDarkIcon from "../assets/icons/profile-dark.svg";
import SearchActiveIcon from "../assets/icons/search-active.svg";
import SearchIcon from "../assets/icons/search.svg";
import SearchDarkIcon from "../assets/icons/search-dark.svg";
import TaskActiveIcon from "../assets/icons/task-active.svg";
import TaskIcon from "../assets/icons/task.svg";
import TaskDarkIcon from "../assets/icons/task-dark.svg";
import SettingsIcon from "../assets/icons/settings.svg";
import SettingsActiveIcon from "../assets/icons/settings-active.svg";
import SettingsDarkIcon from "../assets/icons/settings-dark.svg";
import PlusIcon from "../assets/icons/plus.svg";
import PlusDarkIcon from "../assets/icons/plus-dark.svg";
import PlusActiveIcon from "../assets/icons/plus-active.svg";

// Import styles
import { COLORS } from "../styles/colors";
import { ThemeContext } from "../utils/ThemeContext";
import SurveySuccessScreen from "../components/screens/dashboard/TakeSurvey/SurveySuccessScreen";

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const TasksStack = createStackNavigator();
const SurveysStack = createStackNavigator();
const SearchStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const SettingsStack = createStackNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeScreen" component={HomeScreen} />
      <HomeStack.Screen name="Notifications" component={NotificationsScreen} />
    </HomeStack.Navigator>
  );
}

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

function SurveysStackScreen() {
  return (
    <SurveysStack.Navigator screenOptions={{ headerShown: false }}>
      <SurveysStack.Screen
        name="SurveyScreen"
        component={TakeSurvey}
        options={{ headerShown: false }}
      />
      <SurveysStack.Screen
        name="SurveySuccessScreen"
        component={SurveySuccessScreen}
      />
      <SurveysStack.Screen
        name="Notifications"
        component={NotificationsScreen}
      />
    </SurveysStack.Navigator>
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
function SettingsStackScreen() {
  return (
    <SettingsStack.Navigator screenOptions={{ headerShown: false }}>
      <SettingsStack.Screen name="SettingsScreen" component={SettingsScreen} />
      <SettingsStack.Screen
        name="Notifications"
        component={NotificationsScreen}
      />
    </SettingsStack.Navigator>
  );
}

export default function DashboardNavigator() {
  const { theme } = useContext(ThemeContext);
  const isDark = theme.dark;
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.lightBlack,
          borderTopColor: theme.colors.background,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.text,
      }}
      initialRouteName="Home"
    >
      <Tab.Screen
        name="Home"
        component={HomeStackScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => {
            if (focused) {
              return <HomeActiveIcon />;
            } else {
              return isDark ? <HomeDarkIcon /> : <HomeIcon />;
            }
          },
          tabBarActiveTintColor: COLORS.primary,
        }}
      />
      <Tab.Screen
        name="Tasks"
        component={TasksStackScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => {
            if (focused) {
              return <TaskActiveIcon />;
            } else {
              return isDark ? <TaskDarkIcon /> : <TaskIcon />;
            }
          },
          tabBarActiveTintColor: COLORS.primary,
        }}
      />
      <Tab.Screen
        name="Take Survey"
        component={SurveysStackScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => {
            if (focused) {
              return <PlusActiveIcon />;
            } else {
              return isDark ? <PlusDarkIcon /> : <PlusIcon />;
            }
          },
          tabBarActiveTintColor: COLORS.primary,
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchStackSCreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => {
            if (focused) {
              return <SearchActiveIcon />;
            } else {
              return isDark ? <SearchDarkIcon /> : <SearchIcon />;
            }
          },
          tabBarActiveTintColor: COLORS.primary,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStackScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => {
            if (focused) {
              return <ProfileActiveIcon />;
            } else {
              return isDark ? <ProfileDarkIcon /> : <ProfileIcon />;
            }
          },
          tabBarActiveTintColor: COLORS.primary,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsStackScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => {
            if (focused) {
              return <SettingsActiveIcon />;
            } else {
              return isDark ? <SettingsDarkIcon /> : <SettingsIcon />;
            }
          },
          tabBarActiveTintColor: COLORS.primary,
        }}
      />
    </Tab.Navigator>
  );
}
