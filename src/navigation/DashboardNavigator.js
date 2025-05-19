import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// Import dashboard screens
import HomeScreen from "../components/screens/dashboard/HomeScreen";
import ProfileScreen from "../components/screens/dashboard/ProfileScreen";
import SettingsScreen from "../components/screens/dashboard/SettingsScreen";

const Tab = createBottomTabNavigator();

export default function DashboardNavigator() {
  return (
    <Tab.Navigator initialRouteName="Home">
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
