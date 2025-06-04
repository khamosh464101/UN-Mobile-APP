import React, { useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import CloseIcon from "../../../../../assets/icons/close.svg";
import CloseDarkIcon from "../../../../../assets/icons/close-dark.svg";
import { ThemeContext } from "../../../../../utils/ThemeContext";

const NotificationItem = ({ notification, isRead, onPress }) => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme.dark;
  const renderMessage = (notification) => {
    switch (notification.type) {
      case "comment":
        return `${notification.actor} Commented on task ${notification.taskTitle}`;
      case "update":
        return `${notification.actor} Updated a task "${notification.taskTitle}"`;
      case "assignment":
        return `${notification.actor} Assigned a new task "${notification.taskTitle}"`;
      default:
        return "";
    }
  };
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.notificationCard,
        { backgroundColor: theme.colors.secondaryBackground },
        isRead && [
          styles.readNotification,
          { backgroundColor: theme.colors.lightBlack },
        ],
      ]}
    >
      <View
        style={[styles.avatar, { backgroundColor: theme.colors.background }]}
      />
      <View style={{ flex: 1 }}>
        <Text
          style={[
            { fontSize: 14, color: theme.colors.text, fontWeight: "600" },
            isRead && { fontWeight: "400" },
          ]}
        >
          {renderMessage(notification)}
        </Text>
        <Text style={{ fontSize: 12, color: theme.colors.secondaryText }}>
          {notification.timeAgo}
        </Text>
      </View>
      <TouchableOpacity>
        {isDark ? <CloseDarkIcon /> : <CloseIcon />}
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default NotificationItem;

const styles = StyleSheet.create({
  notificationCard: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  readNotification: {},
  avatar: {
    height: 36,
    width: 36,
    borderRadius: 18,
  },
});
