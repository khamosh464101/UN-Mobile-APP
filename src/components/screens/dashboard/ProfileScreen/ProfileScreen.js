import React, { useState, useContext } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import Topbar from "../../../common/Topbar";
import { commonStyles } from "../../../../styles/commonStyles";
import TabSwitcher from "../../../common/TabSwitcher";

import personalInfo from "../../../../utils/personalinfo.json";
import officialInfo from "../../../../utils/officialinfo.json";
import PersonalInfo from "./components/PersonalInfo";
import OfficialInfo from "./components/OfficialInfo";

import { ThemeContext } from "../../../../utils/ThemeContext";

export default function ProfileScreen() {
  const { theme } = useContext(ThemeContext);
  const [activeTab, setActiveTab] = useState("personal");

  const tabs = [
    { key: "personal", label: "Personal Info" },
    { key: "official", label: "Official Info" },
  ];

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
        <ScrollView
          contentContainerStyle={styles.scrollView}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {officialInfo?.map((item, index) => {
            return (
              <OfficialInfo
                key={index}
                status={item.status}
                position={item.position}
                email={item.email}
                phone={item.phone}
                duty={item.duty}
                joined={item.joined}
                created={item.created}
                updated={item.updated}
              />
            );
          })}
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
