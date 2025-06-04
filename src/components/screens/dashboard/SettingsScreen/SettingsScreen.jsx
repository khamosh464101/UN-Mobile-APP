import React, { useContext } from "react";
import { View, StyleSheet } from "react-native";
import { commonStyles } from "../../../../styles/commonStyles";
import { ThemeContext } from "../../../../utils/ThemeContext";
import Topbar from "../../../common/Topbar";
import LogoutButton from "../../../common/LogoutButton";
import ThemeSelector from "./components/ThemeSelector";

const SettingsScreen = () => {
  const { theme } = useContext(ThemeContext);
  return (
    <View
      style={[
        commonStyles.screenWrapper,
        { backgroundColor: theme.colors.background, paddingBottom: 20 },
      ]}
    >
      <Topbar />
      <View style={styles.settingWrapper}>
        <ThemeSelector />
        <LogoutButton style={styles.LogoutButton} />
      </View>
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  settingWrapper: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    gap: 20,
  },
});
