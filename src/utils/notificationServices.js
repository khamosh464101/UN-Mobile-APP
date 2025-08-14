// src/utils/notificationServices.js
import { useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import { Alert } from 'react-native';
import { navigationRef } from './navigationRef';
import Toast from 'react-native-toast-message';
import { getErrorMessage } from './tools';
import axios from './axios';


export default function useFCMNotifications() {
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      const { notification, data } = remoteMessage;

      Alert.alert(notification?.title, notification?.body, [
        {
          text: 'Open',
          onPress: () => handleNavigationFromNotification(data),
        },
        { text: 'Cancel', style: 'cancel' },
      ]);
    });

    messaging().onNotificationOpenedApp(remoteMessage => {
      if (remoteMessage?.data) {
        handleNavigationFromNotification(remoteMessage.data);
      }
    });

    messaging().getInitialNotification().then(remoteMessage => {
      if (remoteMessage?.data) {
        handleNavigationFromNotification(remoteMessage.data);
      }
    });

    return unsubscribe;
  }, []);
}

const markAsRead = async (id, type) => {
  try {
    const { data: result } = await axios.get(`/api/notifications/mark-as-read/${id}/${type}`);
    return true;
  } catch (error) {
    Toast.show({
            type: 'error',
            text1: 'Failed!',
            text2: getErrorMessage(error)
          });
    return false;
  }
};

function handleNavigationFromNotification(data) {
    console.log('dddddata', data)
     if (data.uuid) {
      markAsRead(data.uuid, 'not-pk');
    }
  try {
    const navData = JSON.parse(data.navigation);

    if (navigationRef.isReady()) {
      navigationRef.navigate(navData.root, {
        screen: navData.screen,
        params: navData.params,
      });
    }
  } catch (e) {
    console.error('Navigation error:', e.message);
  }
}
