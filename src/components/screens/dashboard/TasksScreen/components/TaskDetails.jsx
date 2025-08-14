import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  useWindowDimensions,
  Alert
} from "react-native";
import { ThemeContext } from "../../../../../utils/ThemeContext";
import RenderHTML from 'react-native-render-html';
import axios from "../../../../../utils/axios";
import Toast from "react-native-toast-message";
import { getErrorMessage } from "../../../../../utils/tools";

const TaskDetails = ({ task, setTask }) => {
  console.log("tttttask", task);
  const { theme } = useContext(ThemeContext);
  const { width } = useWindowDimensions();
  const [statuses, setStatuses] = useState([]);
  const isClosed = task.status.id === 4; // Assuming 3 is the "Closed" status ID

  useEffect(() => {
    const getStatuses = async () => {
      try {
        const {data:result} = await axios.get('/api/mobile/ticket-statuses');
        setStatuses(result);
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Failed!',
          text2: getErrorMessage(error)
        });
      }
    }
    getStatuses();
  }, []);

   const handleStatusPress =  (itemId) => {
    if (!isClosed) {
      // Show confirmation dialog
      Alert.alert(
        "Confirm Status Change",
        `Are you sure you want to change status to "${statuses.find(s => s.id === itemId)?.title}"?`,
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          { 
            text: "Confirm", 
            onPress: () => handleChangleStatus(itemId)
          }
        ]
      );
    }
  };

  const handleChangleStatus = async (itemId) => {
    const url = `/api/mobile/ticket-status/change`;
    try {
      const {data:result} = await axios.post(url, {id: task?.id, status_id: itemId});
      if (result.status === 403) {
        Toast.show({
        type: 'error',
        text1: 'Failed!',
        text2: "You can't change if task is closed"
      });
      return;
      }
      console.log('5555555555',result.status);
       await setTask((prv) => {
        let updated = {...prv};
        updated.status = result?.status;
        return updated;
       });
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Successfully changed!'
      });
    } catch (error) {
      console.log(error);
      Toast.show({
        type: 'error',
        text1: 'Failed!',
        text2: getErrorMessage(error)
      });
    }
  }

  return (
    <ScrollView
      contentContainerStyle={styles.scrollView}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.taskInfo}>
        <Text style={[styles.taskInfoLabel, { color: theme.colors.secondaryText }]}>
          Assigned By
        </Text>
        <View style={styles.taskInfoItemWrapper}>
          <Image
            source={
              task?.owner?.photo
                ? { uri: task.owner.photo }
                : require('../../../../../assets/images/Head.png')
            }
            style={[styles.avatar, { backgroundColor: theme.colors.lightBlack }]}
            resizeMode="cover"
          />
          <Text style={[styles.taskInfoValue, { color: theme.colors.text }]}>
            {task.owner.name}
          </Text>
        </View>
      </View>

      <View style={styles.taskInfo}>
        <Text style={[styles.taskInfoLabel, { color: theme.colors.secondaryText }]}>
          Status
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.statusScrollContainer}
        >
          {statuses.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleStatusPress(item.id)}
              style={[
                styles.statusItem,
                task.status.id === item.id && styles.selectedStatusItem,
                isClosed && styles.disabledStatusItem
              ]}
              disabled={isClosed || index === 3}
            >
              <View
                style={[
                  styles.statusDot,
                  { borderColor: theme.colors.primary },
                  (isClosed || index === 3) && { borderColor: theme.colors.secondaryText }
                ]}
              >
                {task.status.id === item.id && (
                  <View
                    style={[
                      styles.statusDotActive,
                      { 
                        backgroundColor: (isClosed || index === 3)
                          ? theme.colors.secondaryText 
                          : theme.colors.primary 
                      },
                    ]}
                  />
                )}
              </View>
              <Text style={[
                styles.statusText, 
                { color: theme.colors.text },
                (isClosed || index === 3) && { color: theme.colors.secondaryText }
              ]}>
                {item.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.taskInfo}>
        <Text style={[styles.taskInfoLabel, { color: theme.colors.secondaryText }]}>
          Estimation
        </Text>
        <View style={styles.taskInfoItemWrapper}>
          <Text style={[styles.taskInfoValue, { color: theme.colors.text }]}>
            {task.estimationHours} Hours
          </Text>
        </View>
      </View>

      <View style={styles.taskInfo}>
        <Text style={[styles.taskInfoLabel, { color: theme.colors.secondaryText }]}>
          Deadline
        </Text>
        <View style={styles.taskInfoItemWrapper}>
          <Text style={[styles.taskInfoValue, { color: theme.colors.text }]}>
            {task.deadline}
          </Text>
        </View>
      </View>

      <View style={styles.taskDetails}>
        <View>
          <Text style={[styles.taskTitle, { color: theme.colors.text }]}>
            {task.title}
          </Text>
          <Text style={[styles.taskId, { color: theme.colors.secondaryText }]}>
            {task.ticket_number}
          </Text>
        </View>
        <Text style={[styles.description, { color: theme.colors.text }]}>
          <RenderHTML
            contentWidth={width}
            source={{
              html: task.description,
            }}
            baseStyle={{ color: theme.colors.text }}
          />
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  taskInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
    paddingHorizontal: 15,
  },
  taskInfoItemWrapper: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  avatar: {
    height: 25,
    width: 25,
    borderRadius: 25,
  },
  taskInfoLabel: {
    fontSize: 13,
  },
  taskInfoValue: {
    fontSize: 13,
    fontWeight: "500",
  },
  statusScrollContainer: {
    paddingVertical: 5,
    paddingRight: 20,
  },
  statusItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  selectedStatusItem: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 15,
  },
  disabledStatusItem: {
    opacity: 0.6,
  },
  statusDot: {
    height: 18,
    width: 18,
    borderRadius: 9,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  statusDotActive: {
    height: 8,
    width: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 13,
    fontWeight: "500",
  },
  taskDetails: {
    flexDirection: "column",
    gap: 15,
    marginTop: 25,
    paddingHorizontal: 15,
  },
  taskTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },
  taskId: {
    marginTop: 4,
    fontSize: 12,
  },
  description: {
    lineHeight: 20,
    textAlign: "justify",
  },
});

export default TaskDetails;