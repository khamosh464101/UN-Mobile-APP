import React, { useState, useEffect } from "react";
import { useRoute } from "@react-navigation/native";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { commonStyles } from "../../../../styles/commonStyles";
import { COLORS } from "../../../../styles/colors";
import Topbar from "../../../common/Topbar";
import TabSwitcher from "../../../common/TabSwitcher";

const TaskDetails = () => {
  const [activeTab, setActiveTab] = useState("details");
  const route = useRoute();
  const { task } = route.params;

  const tabs = [
    { key: "details", label: "Task Details" },
    { key: "update", label: "Updates" },
  ];

  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(task.status);
  const [items, setItems] = useState([
    { label: "Open", value: "open" },
    { label: "In Progress", value: "in_progress" },
    { label: "Closed", value: "closed" },
  ]);

  useEffect(() => {
    if (status !== task.status) {
      console.log(`Status changed to ${status}`);
    }
  }, [status]);

  return (
    <View style={commonStyles.screenWrapper}>
      <Topbar />
      <TabSwitcher
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      {activeTab === "details" ? (
        <ScrollView
          contentContainerStyle={styles.scrollView}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.taskInfo}>
            <Text>Assigned By</Text>
            <View style={styles.avatarWrapper}>
              <View style={styles.avatar}></View>
              <Text>{task.assignedBy.name}</Text>
            </View>
          </View>
          <View style={styles.taskInfo}>
            <Text>Status</Text>
            <View style={styles.avatarWrapper}>
              <View>
                <DropDownPicker
                  listMode="SCROLLVIEW"
                  open={open}
                  value={status}
                  items={items}
                  setOpen={setOpen}
                  setValue={setStatus}
                  setItems={setItems}
                  placeholder={status}
                  style={{
                    borderColor: "#ccc",
                    borderRadius: 8,
                    width: 150,
                  }}
                  dropDownContainerStyle={{
                    borderColor: "#ccc",
                  }}
                />
              </View>
            </View>
          </View>
          <View style={styles.taskInfo}>
            <Text>Estimation</Text>
            <View style={styles.avatarWrapper}>
              <Text>{task.estimationHours} Hours</Text>
            </View>
          </View>
          <View style={styles.taskInfo}>
            <Text>Deadline</Text>
            <View style={styles.avatarWrapper}>
              <Text>{task.deadline}</Text>
            </View>
          </View>
        </ScrollView>
      ) : (
        <View>
          <Text>Task Updates</Text>
        </View>
      )}
    </View>
  );
};

export default TaskDetails;

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
  },
  taskInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  avatarWrapper: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
  },
  avatar: {
    height: 25,
    width: 25,
    borderRadius: 25,
    backgroundColor: COLORS.lightGray,
  },
});
