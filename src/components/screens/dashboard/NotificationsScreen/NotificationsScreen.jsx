import React, { useState, useEffect, useContext, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import notificationsData from "../../../../utils/notificationsData.json";
import tasksData from "../../../../utils/tasks.json";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

import Topbar from "../../../common/Topbar";
import NotificationItem from "./components/NotificationItem";
import { commonStyles } from "../../../../styles/commonStyles";
import { ThemeContext } from "../../../../utils/ThemeContext";
import Toast from "react-native-toast-message";
import { getErrorMessage } from "../../../../utils/tools";
import axios from "../../../../utils/axios";
import { COLORS } from "../../../../styles/colors";

const NotificationsScreen = () => {
  const { theme } = useContext(ThemeContext);
  const [notifications, setNotifications] = useState([]);
  const [deleteAllLoading, setDeleteAllLoading] = useState(false);

  useFocusEffect(
  useCallback(() => {
    getData();
  }, [])
);

  const getData = async () => {
    const url = `/api/mobile/notifications`;
    try {
      const {data:result} = await axios.get(url);
      setNotifications(result);
      console.log('this is working well', result);
    } catch (error) {
      console.log('this is the request result ', error);
      Toast.show({
        type: 'error',
        text1: 'Failed!',
        text2: getErrorMessage(error)
      });
    }
  }


  const deleteAll = async () => {

    setDeleteAllLoading(true);
    try {
      const {data:{ message}} =  await axios.get(`/api/mobile/notifications/delete-all`);
        setNotifications([]);
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
      setDeleteAllLoading(false);
    }
  }

  return (
    <View
      style={[
        commonStyles.screenWrapper,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <Topbar />

      <TouchableOpacity
  onPress={deleteAll}
  style={[
    styles.clearNotifications,
    {
      backgroundColor: theme.colors.danger,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 8,
    },
  ]}
>
  {deleteAllLoading && (
    <ActivityIndicator color={COLORS.white} style={{ marginRight: 8 }} />
  )}
  <Text style={{ color: "#fff", fontSize: 16, fontWeight: "500" }}>
    Clear all Notifications
  </Text>
</TouchableOpacity>


      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ paddingVertical: 15 }}
      >
        {Array.isArray(notifications) &&
          notifications.map((n, index) => (
            <NotificationItem
              key={index}
              notification={n}
              isRead={n.read_at}
              setNotifications={setNotifications}
              onPress={() => handleNotificationPress(n)}
              onDelete={() => onDelete(n)}
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
