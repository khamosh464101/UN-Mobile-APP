import React, { useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import MoonIcon from "../../../../../assets/icons/moon.svg";
import MoonDarkIcon from "../../../../../assets/icons/moon-dark.svg";
import SunIcon from "../../../../../assets/icons/sun.svg";
import SunDarkIcon from "../../../../../assets/icons/sun-dark.svg";
import SystemIcon from "../../../../../assets/icons/system.svg";
import SystemDarkIcon from "../../../../../assets/icons/system-dark.svg";
import { ThemeContext } from "../../../../../utils/ThemeContext";

const ThemeSelector = () => {
  const { themeMode, changeTheme, theme } = useContext(ThemeContext);
  const isDark = theme.dark;

  return (
    <View>
      <Text style={[styles.title, { color: theme.colors.text }]}>Theme</Text>
      <View
        style={[styles.container, { borderColor: theme.colors.lightBlack }]}
      >
        <TouchableOpacity
          style={[
            styles.option,
            { borderBottomColor: theme.colors.lightBlack },
          ]}
          onPress={() => changeTheme("system")}
        >
          {isDark ? <SystemDarkIcon /> : <SystemIcon />}
          <Text style={[styles.label, { color: theme.colors.text }]}>
            Automatic
          </Text>
          <View style={[styles.radio, { borderColor: theme.colors.primary }]}>
            {themeMode === "system" && (
              <View
                style={[
                  styles.radioSelected,
                  { backgroundColor: theme.colors.primary },
                ]}
              />
            )}
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.option,
            { borderBottomColor: theme.colors.lightBlack },
          ]}
          onPress={() => changeTheme("light")}
        >
          {isDark ? <SunDarkIcon /> : <SunIcon />}

          <Text style={[styles.label, { color: theme.colors.text }]}>
            Light
          </Text>
          <View style={[styles.radio, { borderColor: theme.colors.primary }]}>
            {themeMode === "light" && (
              <View
                style={[
                  styles.radioSelected,
                  { backgroundColor: theme.colors.primary },
                ]}
              />
            )}
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.option, { borderBottomWidth: 0 }]}
          onPress={() => changeTheme("dark")}
        >
          {isDark ? <MoonDarkIcon /> : <MoonIcon />}
          <Text style={[styles.label, { color: theme.colors.text }]}>Dark</Text>
          <View style={[styles.radio, { borderColor: theme.colors.primary }]}>
            {themeMode === "dark" && (
              <View
                style={[
                  styles.radioSelected,
                  { backgroundColor: theme.colors.primary },
                ]}
              />
            )}
          </View>
        </TouchableOpacity>
      </View>
      <Text style={[styles.note, { color: theme.colors.text }]}>
        Automatic is only supported on systems that allow you to control the
        system-wide color scheme.
      </Text>
    </View>
  );
};

export default ThemeSelector;

const styles = StyleSheet.create({
  container: {
    borderRadius: 6,
    borderWidth: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
  },
  icon: {
    marginRight: 12,
  },
  label: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  radioSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  note: {
    fontSize: 12,
    marginTop: 10,
  },
});
