import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Topbar from "../../../common/Topbar";
import { commonStyles } from "../../../../styles/commonStyles";
import TabSwitcher from "../../../common/TabSwitcher";

import personalInfo from "../../../../utils/personalinfo.json";
import officialInfo from "../../../../utils/officialinfo.json";
import PersonalInfo from "./components/PersonalInfo";
import OfficialInfo from "./components/OfficialInfo";
import { COLORS } from "../../../../styles/colors";
import LogoutIcon from "../../../../assets/icons/logout.svg";
import LogoutButton from "../../../common/LogoutButton";

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
          <LogoutButton />
        </ScrollView>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollView}
          keyboardShouldPersistTaps="handled"
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
          <LogoutButton />
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
