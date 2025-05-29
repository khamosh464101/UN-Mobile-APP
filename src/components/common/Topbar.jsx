import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import BellIconEmpty from "../../assets/icons/bell-icon-empty.svg";
import { COLORS } from "../../styles/colors";
const BellIcon = () => <BellIconEmpty width={30} height={30} />;

const Topbar = () => {
  return (
    <View style={styles.topBar}>
      <View style={styles.avatar} />
      <View style={{ marginLeft: 10 }}>
        <Text style={styles.userName}>Atiqullah</Text>
        <Text style={styles.userSubtitle}>Sadeqi</Text>
      </View>
      <View style={{ flex: 1 }} />
      <TouchableOpacity style={styles.bellBtn}>
        <BellIcon />
      </TouchableOpacity>
    </View>
  );
};

export default Topbar;

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
    marginTop: 25,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.lightGray,
  },
  userName: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#222",
  },
  userSubtitle: {
    fontSize: 13,
    color: "#888",
  },
  bellBtn: {
    padding: 6,
  },
});
