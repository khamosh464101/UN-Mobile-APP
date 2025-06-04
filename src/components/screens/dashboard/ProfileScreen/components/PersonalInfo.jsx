import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import EmailIcon from "../../../../../assets/icons/profile/email.svg";
import EmailDarkIcon from "../../../../../assets/icons/profile/email-dark.svg";
import ProfileIcon from "../../../../../assets/icons/profile/profile.svg";
import ProfileDarkIcon from "../../../../../assets/icons/profile/profile-dark.svg";
import PhoneIcon from "../../../../../assets/icons/profile/phone.svg";
import PhoneDarkIcon from "../../../../../assets/icons/profile/phone-dark.svg";
import StaffDesc from "../../../../../assets/icons/profile/staff-desc.svg";
import StaffDescDark from "../../../../../assets/icons/profile/staff-desc-dark.svg";
import { ThemeContext } from "../../../../../utils/ThemeContext";

const ProfileInfoItem = ({ name, email, phone, staffDesc }) => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme.dark;
  return (
    <View>
      <View style={styles.container}>
        <View style={styles.iconWrapper}>
          {isDark ? <ProfileDarkIcon /> : <ProfileIcon />}
        </View>
        <View
          style={[
            styles.textWrapper,
            { borderBottomColor: theme.colors.lightBlack },
          ]}
        >
          <Text style={[styles.label, { color: theme.colors.secondaryText }]}>
            Name
          </Text>
          <Text style={[styles.value, { color: theme.colors.text }]}>
            {name}
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
          {isDark ? <StaffDescDark /> : <StaffDesc />}
        </View>
        <View style={[styles.textWrapper, { borderBottomWidth: 0 }]}>
          <Text style={[styles.label, { color: theme.colors.secondaryText }]}>
            Staff Description
          </Text>
          <Text
            style={[styles.value, { color: theme.colors.text }]}
            numberOfLines={0}
          >
            {staffDesc}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default ProfileInfoItem;

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
  },
});
