import React, { createContext, useEffect, useState } from "react";
import { Appearance } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { lightTheme, darkTheme } from "../../themes";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [themeMode, setThemeMode] = useState("system");
  const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme()); // <- NEW
  const [theme, setTheme] = useState(lightTheme);

  // Load saved preference once
  useEffect(() => {
    const loadThemePreference = async () => {
      const storedMode = await AsyncStorage.getItem("themeMode");
      const mode = storedMode || "system";
      setThemeMode(mode);
    };

    loadThemePreference();
  }, []);

  // Listen to system theme changes ONCE
  useEffect(() => {
    const listener = Appearance.addChangeListener(({ colorScheme }) => {
      setColorScheme(colorScheme); // <- this will trigger applyTheme if in 'system'
    });

    return () => listener.remove();
  }, []);

  // Apply theme when themeMode or system colorScheme changes
  useEffect(() => {
    if (themeMode === "light") {
      setTheme(lightTheme);
    } else if (themeMode === "dark") {
      setTheme(darkTheme);
    } else {
      setTheme(colorScheme === "dark" ? darkTheme : lightTheme);
    }
  }, [themeMode, colorScheme]); // <- DEPENDS ON BOTH

  const changeTheme = async (mode) => {
    await AsyncStorage.setItem("themeMode", mode);
    setThemeMode(mode);
  };
  console.log("System color scheme is:", Appearance.getColorScheme());

  return (
    <ThemeContext.Provider value={{ theme, themeMode, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
