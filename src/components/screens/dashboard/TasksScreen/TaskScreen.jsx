import React, { useState, useContext, useCallback } from "react";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { View, Text, TouchableOpacity } from "react-native";
import { commonStyles } from "../../../../styles/commonStyles";
import Topbar from "../../../common/Topbar";
import TabSwitcher from "../../../common/TabSwitcher";
import TaskDetails from "./components/TaskDetails";
import TaskUpdates from "./components/TaskUpdates";
import LeftArrow from "../../../../assets/icons/chevron-left.svg";
import LeftDarkArrow from "../../../../assets/icons/chevron-left-dark.svg";
import { useNavigation } from "@react-navigation/native";
import { ThemeContext } from "../../../../utils/ThemeContext";
import Toast from "react-native-toast-message";
import { getErrorMessage } from "../../../../utils/tools";
import axios from "../../../../utils/axios";
const TaskScreen = () => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme.dark;
  const navigation = useNavigation();
 
  const route = useRoute();
  const [task, setTask] = useState();
  const { id, tab = 'details' } = route.params;
   const [activeTab, setActiveTab] = useState(tab);
  

  useFocusEffect(
  useCallback(() => {
    getData();
  }, [])
);

  const getData = async () => {
    const url = `/api/mobile/tickets/${id}`;
    try {
      const {data:result} = await axios.get(url);
      setTask(result);
    } catch (error) {
      console.log(error);
      Toast.show({
        type: 'error',
        text1: 'Failed!',
        text2: getErrorMessage(error)
      });
    }
  }
  const tabs = [
    { key: "details", label: "Task Details" },
    { key: "update", label: "Updates" },
  ];

  return (
    <View
      style={[
        commonStyles.screenWrapper,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <Topbar />
      <TouchableOpacity
        onPress={() => navigation.navigate("TasksScreen")}
        style={{ flexDirection: "row", alignItems: "center" }}
      >
        {isDark ? <LeftDarkArrow /> : <LeftArrow />}
        <Text
          style={{
            marginLeft: 0,
            fontSize: 16,
            fontWeight: "500",
            color: theme.colors.text,
          }}
        >
          All Tasks
        </Text>
      </TouchableOpacity>
      <TabSwitcher
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      {task?.id && (
        activeTab === "details" ? (
          <TaskDetails task={task} setTask={setTask} />
        ) : (
          <TaskUpdates task={task} setTask={setTask} />
        )
      )}
    </View>
  );
};

export default TaskScreen;
