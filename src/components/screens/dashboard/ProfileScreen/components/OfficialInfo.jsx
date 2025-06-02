import React from "react";
import { View, Text, StyleSheet } from "react-native";
import ProfileTickIcon from "../../../../../assets/icons/profile/profile-tick.svg";
import PositionIcon from "../../../../../assets/icons/profile/shield-tick.svg";
import EmailIcon from "../../../../../assets/icons/profile/email.svg";
import PhoneIcon from "../../../../../assets/icons/profile/phone.svg";
import MapIcon from "../../../../../assets/icons/profile/map.svg";
import CalendarTickIcon from "../../../../../assets/icons/profile/calendar-tick.svg";
import CalendarIcon from "../../../../../assets/icons/profile/calendar.svg";
import CalendarEditIcon from "../../../../../assets/icons/profile/calendar-edit.svg";

const OfficialInfo = ({
  status,
  position,
  email,
  phone,
  duty,
  joined,
  created,
  updated,
}) => {
  return (
    <View>
      <View style={styles.container}>
        <View style={styles.iconWrapper}>
          <ProfileTickIcon />
        </View>
        <View style={styles.textWrapper}>
          <Text style={styles.label}>Status</Text>
          <Text style={styles.value}>{status}</Text>
        </View>
      </View>
      <View style={styles.container}>
        <View style={styles.iconWrapper}>
          <PositionIcon />
        </View>
        <View style={styles.textWrapper}>
          <Text style={styles.label}>Position</Text>
          <Text style={styles.value}>{position}</Text>
        </View>
      </View>
      <View style={styles.container}>
        <View style={styles.iconWrapper}>
          <EmailIcon />
        </View>
        <View style={styles.textWrapper}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{email}</Text>
        </View>
      </View>
      <View style={styles.container}>
        <View style={styles.iconWrapper}>
          <PhoneIcon />
        </View>
        <View style={styles.textWrapper}>
          <Text style={styles.label}>Phone</Text>
          <Text style={styles.value}>{phone}</Text>
        </View>
      </View>
      <View style={styles.container}>
        <View style={styles.iconWrapper}>
          <MapIcon />
        </View>
        <View style={styles.textWrapper}>
          <Text style={styles.label}>Duty Station</Text>
          <Text style={styles.value}>{duty}</Text>
        </View>
      </View>
      <View style={styles.container}>
        <View style={styles.iconWrapper}>
          <CalendarTickIcon />
        </View>
        <View style={styles.textWrapper}>
          <Text style={styles.label}>Date of Joining</Text>
          <Text style={styles.value}>{joined}</Text>
        </View>
      </View>
      <View style={styles.container}>
        <View style={styles.iconWrapper}>
          <CalendarIcon />
        </View>
        <View style={styles.textWrapper}>
          <Text style={styles.label}>Created at</Text>
          <Text style={styles.value}>{created}</Text>
        </View>
      </View>
      <View style={styles.container}>
        <View style={styles.iconWrapper}>
          <CalendarEditIcon />
        </View>
        <View style={[styles.textWrapper, { borderBottomWidth: 0 }]}>
          <Text style={styles.label}>Updated at</Text>
          <Text style={styles.value}>{updated}</Text>
        </View>
      </View>
    </View>
  );
};

export default OfficialInfo;
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingVertical: 12,
    alignItems: "flex-start",
    gap: 10,
  },
  iconWrapper: {
    alignItems: "center",
    paddingTop: 7,
  },
  textWrapper: {
    width: "100%",
    flex: 1,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  label: {
    fontSize: 14,
    color: "#888",
  },
  value: {
    color: "#000",
    marginTop: 2,
    lineHeight: 20,
    textAlign: "justify",
    marginTop: 2,
  },
});
