import React, { useState } from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import Topbar from "../../../common/Topbar";
import { commonStyles } from "../../../../styles/commonStyles";
import TabSwitcher from "../../../common/TabSwitcher";

import personalInfo from "../../../../utils/personalinfo.json";
// import ProfileInfoItem fro./components/PersonalInfotem";
import PersonalInfo from "./components/PersonalInfo";

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState("personal");

  const tabs = [
    { key: "personal", label: "Personal Info" },
    { key: "official", label: "Official Info" },
  ];

  return (
    <View style={commonStyles.screenWrapper}>
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
        >
          {personalInfo?.map((item, index) => {
            return (
              <PersonalInfo
                key={index}
                name={item.name}
                email={item.email}
                phone={item.phone}
                staffDesc={item.staffDesc}
              />
            );
          })}
        </ScrollView>
      ) : (
        <View>
          <Text>Official Info</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
  },
});
