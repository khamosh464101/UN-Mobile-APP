import React, { useState, useContext, useEffect, useCallback } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { commonStyles } from "../../../../styles/commonStyles";
import Topbar from "../../../common/Topbar";
import TaskFilter from "./components/TaskFilter";
import tasksData from "../../../../utils/tasks.json";
import TaskCard from "./components/TaskCard";
import { Dimensions } from "react-native";
import { ThemeContext } from "../../../../utils/ThemeContext";
import axios from "../../../../utils/axios";
import { useFocusEffect } from "@react-navigation/native";
import { getErrorMessage } from "../../../../utils/tools";
import Toast from "react-native-toast-message";


const screenHeight = Dimensions.get("window").height;

const TasksScreen = ({ navigation }) => {
  const { theme } = useContext(ThemeContext);
  const [data, setData] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

useFocusEffect(
  useCallback(() => {
    getData();
  }, [])
);

  const getData = async () => {
    const url = `/api/mobile/tickets`;
    try {
      const {data:result} = await axios.post(url);
      setData(result);
    } catch (error) {
      console.log(error);
      Toast.show({
        type: 'error',
        text1: 'Failed!',
        text2: getErrorMessage(error)
      });
    }
  }
  const handleViewDetails = (task) => {
    navigation.navigate("TaskDetails", { id: task.id });
  };



  



  return (
    <View
      style={[
        commonStyles.screenWrapper,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <Topbar />
      <TaskFilter
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
        data={data}
        style={{ paddingVertical: 10 }}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {data[activeIndex]?.tickets?.map((task, index) => (
          <TaskCard
            key={index}
            task={task}
            onPressViewDetails={handleViewDetails}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default TasksScreen;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 15,
    justifyContent: "flex-start",
    minHeight: screenHeight * 0.65,
  },
});
