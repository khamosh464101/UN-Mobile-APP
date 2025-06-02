import React from "react";
import { View, Text, StyleSheet } from "react-native";
import EmailIcon from "../../../../../assets/icons/profile/email.svg";
import ProfileIcon from "../../../../../assets/icons/profile/profile.svg";
import PhoneIcon from "../../../../../assets/icons/profile/phone.svg";
import StaffDesc from "../../../../../assets/icons/profile/staff-desc.svg";

const ProfileInfoItem = ({ name, email, phone, staffDesc }) => {
  return (
    <View>
      <View style={styles.container}>
        <View style={styles.iconWrapper}>
          <ProfileIcon />
        </View>
        <View style={styles.textWrapper}>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.value}>{name}</Text>
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
          <StaffDesc />
        </View>
        <View style={[styles.textWrapper, { borderBottomWidth: 0 }]}>
          <Text style={styles.label}>Staff Description</Text>
          <Text style={styles.value} numberOfLines={0}>
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
