import React, { useState, useContext } from "react";
import { useRoute } from "@react-navigation/native";
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
const TaskScreen = () => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme.dark;
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState("details");
  const route = useRoute();
  const { task } = route.params;

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
      {activeTab === "details" ? (
        <TaskDetails task={task} />
      ) : (
        <TaskUpdates task={task} />
      )}
    </View>
  );
};

export default TaskScreen;
