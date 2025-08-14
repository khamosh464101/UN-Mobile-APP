import React, { useContext, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from "react-native";
import CloseIcon from "../../../../../assets/icons/close.svg";
import CloseDarkIcon from "../../../../../assets/icons/close-dark.svg";
import { ThemeContext } from "../../../../../utils/ThemeContext";
import { COLORS } from "../../../../../styles/colors";
import axios from "../../../../../utils/axios";
import { getErrorMessage } from "../../../../../utils/tools";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";

const NotificationItem = ({ notification, isRead, setNotifications }) => {
  const navigation = useNavigation();
  const { theme } = useContext(ThemeContext);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const isDark = theme.dark;
  

    const onPress = async () => {
    const id = notification.id;
    const taskId = notification?.data?.ticket_id;
    console.log('workssssss');
    try {
      console.log('workssssss1');
      if (!notification.read_at) {
        const {data:{notification:n}} =  await axios.get(`/api/mobile/notifications/mark-as-read/${id}/${'pk'}`);
        setNotifications((prev) =>
          prev.map((item) => (item.id === id ? n : item))
        );
      }
      const tab = notification?.type === 'Modules\\Projects\\Notifications\\Ticket\\TicketNotification'? "details" : "update";
      navigation.navigate('Tasks', {
        screen: 'TaskDetails',
        params: { id: taskId, tab },
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed!',
        text2: getErrorMessage(error)
      });
    }
  };

  const onDelete = async () => {
    const id = notification.id;
    setDeleteLoading(true);
    try {
      const {data:{ message}} =  await axios.get(`/api/mobile/notifications/delete/${id}/${'pk'}`);
        setNotifications((prev) =>
          prev.filter((item) => item.id !== id)
        );
        Toast.show({
                  type: 'success',
                  text1: 'Success!',
                  text2: message
                });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed!',
        text2: getErrorMessage(error)
      });
      ;
    }finally {
      setDeleteLoading(false);
    }
  }

  return (
    <View
      style={[
        styles.notificationCard,
        { backgroundColor: theme.colors.secondaryBackground },
        isRead && [
          styles.readNotification,
          { backgroundColor: theme.colors.lightBlack },
        ],
      ]}
    >
      {/* Image as touchable */}
      <TouchableOpacity onPress={onPress}>
        <Image
          source={
            notification?.data?.causer_photo
              ? { uri: notification?.data?.causer_photo }
              : require("../../../../../assets/images/Head.png")
          }
          style={[styles.avatar, { backgroundColor: theme.colors.lightBlack }]}
          resizeMode="cover"
        />
      </TouchableOpacity>

      {/* Title and time */}
      <TouchableOpacity onPress={onPress} style={{ flex: 1 }}>
        <Text
          style={[
            { fontSize: 14, color: theme.colors.text, fontWeight: "600" },
            isRead && { fontWeight: "400" },
          ]}
        >
          {notification?.data?.title}
        </Text>
        <Text style={{ fontSize: 12, color: theme.colors.secondaryText }}>
          {notification.timeAgo}
        </Text>
      </TouchableOpacity>

      {/* Close icon with separate handler */}
      <TouchableOpacity onPress={onDelete} style={styles.closeButton}>
        {deleteLoading ? (
          <ActivityIndicator color={COLORS.white} />
        ) : (
          isDark ? <CloseDarkIcon /> : <CloseIcon />
        )}
      </TouchableOpacity>

    </View>
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
