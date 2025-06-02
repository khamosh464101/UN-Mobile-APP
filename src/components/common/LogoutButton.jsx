import React from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../../styles/colors";
import LogoutIcon from "../../assets/icons/logout.svg";
const LogoutButton = () => {
  const navigation = useNavigation();
  return (
    <View>
      <TouchableOpacity
        style={styles.logoutBtn}
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
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 5,
    paddingVertical: 10,
    borderRadius: 4,
  },
  logoutText: {
    color: COLORS.white,
    fontWeight: "500",
    fontSize: 14,
  },
});
