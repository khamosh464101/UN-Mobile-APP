import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS } from "../../../../../styles/colors";
import CloseIcon from "../../../../../assets/icons/close.svg";

const NotificationItem = ({ notification, isRead, onPress }) => {
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
      style={[styles.notificationCard, isRead && styles.readNotification]}
    >
      <View style={styles.avatar} />
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 14 }}>{renderMessage(notification)}</Text>
        <Text style={{ fontSize: 12, color: COLORS.subtitle }}>
          {notification.timeAgo}
        </Text>
      </View>
      <TouchableOpacity>
        <CloseIcon />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default NotificationItem;

const styles = StyleSheet.create({
  notificationCard: {
    backgroundColor: COLORS.background,
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  readNotification: {
    backgroundColor: COLORS.lightGray,
  },
  avatar: {
    height: 36,
    width: 36,
    borderRadius: 18,
    backgroundColor: COLORS.white,
  },
});
