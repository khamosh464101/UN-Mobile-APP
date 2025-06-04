import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import notificationsData from "../../utils/notificationsData.json";
import { useNavigation } from "@react-navigation/native";
import NotificationEmpty from "../../assets/icons/notification-empty.svg";
import NotificationEmptyDark from "../../assets/icons/notification-empty-dark.svg";
import NotificationFull from "../../assets/icons/notification-full.svg";
import NotificationFullDark from "../../assets/icons/notification-full-dark.svg";
import { COLORS } from "../../styles/colors";
import { ThemeContext } from "../../utils/ThemeContext";

const Topbar = () => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme.dark;
  const navigation = useNavigation();
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    const checkUnreadNotifications = async () => {
      try {
        const stored = await AsyncStorage.getItem("readNotifications");
        const read = stored ? JSON.parse(stored) : [];

        const unread = notificationsData.some((n) => !read.includes(n.id));

        setHasUnread(unread);
      } catch (e) {
        console.error("Error checking unread notifications", e);
      }
    };

    const unsubscribe = navigation.addListener("focus", () => {
      checkUnreadNotifications(); // refresh on screen focus
    });

    // initial check
    checkUnreadNotifications();

    return unsubscribe;
  }, [navigation]);

  let NotificationIcon;

  if (hasUnread) {
    NotificationIcon = isDark ? NotificationFullDark : NotificationFull;
  } else {
    NotificationIcon = isDark ? NotificationEmptyDark : NotificationEmpty;
  }

  return (
    <View style={styles.topBar}>
      <TouchableOpacity
        style={styles.profileWrapper}
        onPress={() => navigation.navigate("Profile")}
      >
        <View
          style={[styles.avatar, { backgroundColor: theme.colors.lightBlack }]}
        />
        <View style={{ marginLeft: 10 }}>
          <Text style={[styles.userName, { color: theme.colors.text }]}>
            Atiqullah
          </Text>
          <Text
            style={[styles.userSubtitle, { color: theme.colors.secondaryText }]}
          >
            Sadeqi
          </Text>
        </View>
      </TouchableOpacity>

      <View style={{ flex: 1 }} />
      <TouchableOpacity
        style={styles.bellBtn}
        onPress={() => navigation.navigate("Notifications")}
      >
        {<NotificationIcon />}
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
  profileWrapper: {
    flexDirection: "row",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
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
