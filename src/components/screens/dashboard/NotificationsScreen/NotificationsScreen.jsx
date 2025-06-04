import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import notificationsData from "../../../../utils/notificationsData.json";
import tasksData from "../../../../utils/tasks.json";
import { useNavigation } from "@react-navigation/native";

import Topbar from "../../../common/Topbar";
import NotificationItem from "./components/NotificationItem";
import { commonStyles } from "../../../../styles/commonStyles";
import { ThemeContext } from "../../../../utils/ThemeContext";

const NotificationsScreen = () => {
  const { theme } = useContext(ThemeContext);
  const navigation = useNavigation();
  const [readNotifications, setReadNotifications] = useState([]);

  useEffect(() => {
    const loadReadNotifications = async () => {
      try {
        const stored = await AsyncStorage.getItem("readNotifications");
        if (stored) {
          setReadNotifications(JSON.parse(stored));
        }
      } catch (e) {
        console.error("Failed to load read notifications:", e);
      }
    };

    loadReadNotifications();
  }, []);

  useEffect(() => {
    const saveReadNotifications = async () => {
      try {
        await AsyncStorage.setItem(
          "readNotifications",
          JSON.stringify(readNotifications)
        );
      } catch (e) {
        console.error("Failed to save read notifications:", e);
      }
    };

    if (readNotifications.length > 0) {
      saveReadNotifications();
    }
  }, [readNotifications]);

  const handleNotificationPress = (id, taskId) => {
    // Mark as read if not already
    if (!readNotifications.includes(id)) {
      setReadNotifications([...readNotifications, id]);
    }
    const task = tasksData.find((t) => t.id === taskId);
    if (task) {
      navigation.navigate("Tasks", {
        screen: "TaskDetails",
        params: { task },
      });
    }
  };
  const handleClearNotifications = () => {
    alert("All notifications cleared!");
  };

  return (
    <View
      style={[
        commonStyles.screenWrapper,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <Topbar />

      <TouchableOpacity
        onPress={handleClearNotifications}
        style={[
          styles.clearNotifications,
          { backgroundColor: theme.colors.danger },
        ]}
      >
        <Text style={{ color: "#fff", textAlign: "center" }}>
          Clear all Notifications
        </Text>
      </TouchableOpacity>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ paddingVertical: 15 }}
      >
        {Array.isArray(notificationsData) &&
          notificationsData.map((n) => (
            <NotificationItem
              key={n.id}
              notification={n}
              isRead={readNotifications.includes(n.id)}
              onPress={() => handleNotificationPress(n.id, n.taskId)}
            />
          ))}
      </ScrollView>
    </View>
  );
};

export default NotificationsScreen;

const styles = StyleSheet.create({
  clearNotifications: {
    paddingVertical: 10,
    borderRadius: 6,
    marginVertical: 17,
  },
});
