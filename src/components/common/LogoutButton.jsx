import React, { useContext } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ThemeContext } from "../../utils/ThemeContext";
import { COLORS } from "../../styles/colors";
import LogoutIcon from "../../assets/icons/logout.svg";
const LogoutButton = () => {
  const { theme } = useContext(ThemeContext);
  const navigation = useNavigation();
  return (
    <View>
      <TouchableOpacity
        style={[styles.logoutBtn, { backgroundColor: theme.colors.primary }]}
        onPress={() =>
          navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
          })
        }
      >
        <LogoutIcon />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LogoutButton;

const styles = StyleSheet.create({
  logoutBtn: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 5,
    paddingVertical: 10,
    borderRadius: 4,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 14,
  },
});
