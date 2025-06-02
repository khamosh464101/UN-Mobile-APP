import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";

// Auth Screens
import LoginScreen from "./src/components/screens/auth/LoginScreen";
import OTPVerificationScreen from "./src/components/screens/auth/OTPVerificationScreen";
import ForgotPasswordScreen from "./src/components/screens/auth/ForgotPasswordScreen";

// Dashboard
import DashboardNavigator from "./src/navigation/DashboardNavigator";

import { SearchProvider } from "./src/utils/SearchContext";
import NotificationsScreen from "./src/components/screens/dashboard/NotificationsScreen/NotificationsScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <SearchProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="OTP" component={OTPVerificationScreen} />
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPasswordScreen}
          />
          <Stack.Screen name="Dashboard" component={DashboardNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </SearchProvider>
  );
}
