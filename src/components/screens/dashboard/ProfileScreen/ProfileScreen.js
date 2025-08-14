import React, { useState, useContext, useCallback } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import Topbar from "../../../common/Topbar";
import { commonStyles } from "../../../../styles/commonStyles";
import TabSwitcher from "../../../common/TabSwitcher";

import personalInfo from "../../../../utils/personalinfo.json";
import PersonalInfo from "./components/PersonalInfo";
import OfficialInfo from "./components/OfficialInfo";

import { ThemeContext } from "../../../../utils/ThemeContext";
import axios from "../../../../utils/axios";
import { getErrorMessage } from "../../../../utils/tools";
import { useFocusEffect } from "@react-navigation/native";
import Toast from "react-native-toast-message";

export default function ProfileScreen() {
  const { theme } = useContext(ThemeContext);
  const [activeTab, setActiveTab] = useState("personal");
  const [staff, setStaff] = useState({});

  const tabs = [
    { key: "personal", label: "Personal Info" },
    { key: "official", label: "Official Info" },
  ];

   useFocusEffect(
    useCallback(() => {
      getStaff();
    }, [])
  );

   const getStaff = async () => {
    try {
      const {data:result} = await axios.get(`/api/user/profile`);
    if (result.id) {
      setStaff({
        ...result
      });
    }
    } catch (error) {
       Toast.show({
          type: 'error',
          text1: 'Failed!',
          text2: getErrorMessage(error)
        });
    }
  };

  return (
    <View
      style={[
        commonStyles.screenWrapper,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <Topbar />
      <TabSwitcher
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      {activeTab === "personal" ? (
        <ScrollView
          contentContainerStyle={styles.scrollView}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {staff?.id && (
              <PersonalInfo
                staff={staff}
                setStaff={setStaff}
              />
            
          )}
        </ScrollView>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollView}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {staff?.id && (
              <OfficialInfo
                staff={staff}
              />
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    paddingBottom: 20,
  },
});
