import React from "react";
import "react-native-gesture-handler";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";

// Auth Screens
import LoginScreen from "./src/components/screens/auth/LoginScreen";
import OTPVerificationScreen from "./src/components/screens/auth/OTPVerificationScreen";
import ForgotPasswordScreen from "./src/components/screens/auth/ForgotPasswordScreen";

// Dashboard
import DashboardNavigator from "./src/navigation/DashboardNavigator";

import { SearchProvider } from "./src/utils/SearchContext";
import { useContext } from "react";
import { ThemeProvider, ThemeContext } from "./src/utils/ThemeContext";
import { SQLiteProvider } from "expo-sqlite";
import { initDatabase } from "./src/services/database";
import NetworkWrapper from "./src/components/common/NetworkWrapper";
import NetworkStatus from "./src/components/common/NetworkStatus";

const Stack = createNativeStackNavigator();

function MainApp() {
  const { theme } = useContext(ThemeContext);

  return (
    <SearchProvider>
      <NavigationContainer>
        <StatusBar style={theme.dark ? "light" : "dark"} />
        <NetworkStatus />
        <NetworkWrapper>
          <Stack.Navigator
            screenOptions={{ headerShown: false }}
            initialRouteName="Login"
          >
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="OTP" component={OTPVerificationScreen} />
            <Stack.Screen
              name="ForgotPassword"
              component={ForgotPasswordScreen}
            />
            <Stack.Screen
              name="Dashboard"
              theme={theme}
              component={DashboardNavigator}
            />
          </Stack.Navigator>
        </NetworkWrapper>
      </NavigationContainer>
    </SearchProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <SQLiteProvider databaseName="survey.db" onInit={initDatabase}>
        <MainApp />
      </SQLiteProvider>
    </ThemeProvider>
  );
}
