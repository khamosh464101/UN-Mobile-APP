import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import ProfileTickIcon from "../../../../../assets/icons/profile/profile-tick.svg";
import ProfileTickDarkIcon from "../../../../../assets/icons/profile/profile-tick-dark.svg";
import PositionIcon from "../../../../../assets/icons/profile/shield-tick.svg";
import PositionDarkIcon from "../../../../../assets/icons/profile/shield-tick-dark.svg";
import EmailIcon from "../../../../../assets/icons/profile/email.svg";
import EmailDarkIcon from "../../../../../assets/icons/profile/email-dark.svg";
import PhoneIcon from "../../../../../assets/icons/profile/phone.svg";
import PhoneDarkIcon from "../../../../../assets/icons/profile/phone-dark.svg";
import MapIcon from "../../../../../assets/icons/profile/map.svg";
import MapDarkIcon from "../../../../../assets/icons/profile/map-dark.svg";
import CalendarTickIcon from "../../../../../assets/icons/profile/calendar-tick.svg";
import CalendarTickDarkIcon from "../../../../../assets/icons/profile/calendar-tick-dark.svg";
import CalendarIcon from "../../../../../assets/icons/profile/calendar.svg";
import CalendarDarkIcon from "../../../../../assets/icons/profile/calendar-dark.svg";
import CalendarEditIcon from "../../../../../assets/icons/profile/calendar-edit.svg";
import CalendarEditDarkIcon from "../../../../../assets/icons/profile/calendar-edit-dark.svg";
import { ThemeContext } from "../../../../../utils/ThemeContext";

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
  const { theme } = useContext(ThemeContext);
  const isDark = theme.dark;
  return (
    <View>
      <View style={styles.container}>
        <View style={styles.iconWrapper}>
          {isDark ? <ProfileTickDarkIcon /> : <ProfileTickIcon />}
        </View>
        <View
          style={[
            styles.textWrapper,
            { borderBottomColor: theme.colors.lightBlack },
          ]}
        >
          <Text style={[styles.label, { color: theme.colors.secondaryText }]}>
            Status
          </Text>
          <Text style={[styles.value, { color: theme.colors.text }]}>
            {status}
          </Text>
        </View>
      </View>
      <View style={styles.container}>
        <View style={styles.iconWrapper}>
          {isDark ? <PositionDarkIcon /> : <PositionIcon />}
        </View>
        <View
          style={[
            styles.textWrapper,
            { borderBottomColor: theme.colors.lightBlack },
          ]}
        >
          <Text style={[styles.label, { color: theme.colors.secondaryText }]}>
            Position
          </Text>
          <Text style={[styles.value, { color: theme.colors.text }]}>
            {position}
          </Text>
        </View>
      </View>
      <View style={styles.container}>
        <View style={styles.iconWrapper}>
          {isDark ? <EmailDarkIcon /> : <EmailIcon />}
        </View>
        <View
          style={[
            styles.textWrapper,
            { borderBottomColor: theme.colors.lightBlack },
          ]}
        >
          <Text style={[styles.label, { color: theme.colors.secondaryText }]}>
            Email
          </Text>
          <Text style={[styles.value, { color: theme.colors.text }]}>
            {email}
          </Text>
        </View>
      </View>
      <View style={styles.container}>
        <View style={styles.iconWrapper}>
          {isDark ? <PhoneDarkIcon /> : <PhoneIcon />}
        </View>
        <View
          style={[
            styles.textWrapper,
            { borderBottomColor: theme.colors.lightBlack },
          ]}
        >
          <Text style={[styles.label, { color: theme.colors.secondaryText }]}>
            Phone
          </Text>
          <Text style={[styles.value, { color: theme.colors.text }]}>
            {phone}
          </Text>
        </View>
      </View>
      <View style={styles.container}>
        <View style={styles.iconWrapper}>
          {isDark ? <MapDarkIcon /> : <MapIcon />}
        </View>
        <View
          style={[
            styles.textWrapper,
            { borderBottomColor: theme.colors.lightBlack },
          ]}
        >
          <Text style={[styles.label, { color: theme.colors.secondaryText }]}>
            Duty Station
          </Text>
          <Text style={[styles.value, { color: theme.colors.text }]}>
            {duty}
          </Text>
        </View>
      </View>
      <View style={styles.container}>
        <View style={styles.iconWrapper}>
          {isDark ? <CalendarTickDarkIcon /> : <CalendarTickIcon />}
        </View>
        <View
          style={[
            styles.textWrapper,
            { borderBottomColor: theme.colors.lightBlack },
          ]}
        >
          <Text style={[styles.label, { color: theme.colors.secondaryText }]}>
            Date of Joining
          </Text>
          <Text style={[styles.value, { color: theme.colors.text }]}>
            {joined}
          </Text>
        </View>
      </View>
      <View style={styles.container}>
        <View style={styles.iconWrapper}>
          {isDark ? <CalendarDarkIcon /> : <CalendarIcon />}
        </View>
        <View
          style={[
            styles.textWrapper,
            { borderBottomColor: theme.colors.lightBlack },
          ]}
        >
          <Text style={[styles.label, { color: theme.colors.secondaryText }]}>
            Created at
          </Text>
          <Text style={[styles.value, { color: theme.colors.text }]}>
            {created}
          </Text>
        </View>
      </View>
      <View style={styles.container}>
        <View style={styles.iconWrapper}>
          {isDark ? <CalendarEditDarkIcon /> : <CalendarEditIcon />}
        </View>
        <View style={[styles.textWrapper, { borderBottomWidth: 0 }]}>
          <Text style={[styles.label, { color: theme.colors.secondaryText }]}>
            Updated at
          </Text>
          <Text style={[styles.value, { color: theme.colors.text }]}>
            {updated}
          </Text>
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
