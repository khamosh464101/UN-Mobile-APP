// src/context/ThemeContext.js
import React, { createContext, useEffect, useState } from "react";
import { Appearance } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { lightTheme, darkTheme } from "../../themes";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [themeMode, setThemeMode] = useState("system");
  const [theme, setTheme] = useState(lightTheme);

  // Apply theme based on mode
  const applyTheme = (mode) => {
    if (mode === "dark") {
      setTheme(darkTheme);
    } else if (mode === "light") {
      setTheme(lightTheme);
    } else {
      const systemColorScheme = Appearance.getColorScheme();
      setTheme(systemColorScheme === "dark" ? darkTheme : lightTheme);
    }
  };

  const changeTheme = async (mode) => {
    await AsyncStorage.setItem("themeMode", mode);
    setThemeMode(mode);
    applyTheme(mode);
  };

  // Load stored mode and apply on mount
  useEffect(() => {
    const loadTheme = async () => {
      const savedMode = await AsyncStorage.getItem("themeMode");
      const initialMode = savedMode || "system";
      setThemeMode(initialMode);
      applyTheme(initialMode);
    };

    loadTheme();

    const subscription = Appearance.addChangeListener(() => {
      if (themeMode === "system") applyTheme("system");
    });

    return () => subscription.remove();
  }, [themeMode]);

  return (
    <ThemeContext.Provider value={{ theme, themeMode, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
