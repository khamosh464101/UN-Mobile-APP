import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import TaskProgressIcon from "../../../../../assets/icons/inProgress.svg";
import Arrowright from "../../../../../assets/icons/arrow-right.svg";

const TaskIcon = () => <TaskProgressIcon width={55} height={55} />;

const ArrowRightIcon = () => <Arrowright width={20} height={20} />;

const MainCardBg = require("../../../../../assets/images/main-card-bg.png");

const HeroCard = ({ TaskCount, TaskType }) => {
  return (
    <View style={styles.inProgressCard}>
      <ImageBackground
        source={MainCardBg}
        resizeMode="cover"
        style={styles.image}
      >
        <View style={styles.inProgressCardContent}>
          <View style={styles.inProgressCardIconWrapper}>
            <TaskIcon />
          </View>
          <View style={styles.inProgressCardContentText}>
            <Text style={styles.inProgressCount}>{TaskCount}</Text>
            <Text style={styles.inProgressLabel}>{TaskType}</Text>
          </View>
        </View>
        <View>
          <TouchableOpacity style={styles.viewAllBtn}>
            <Text style={{ color: "#fff" }}>View All</Text>
            <ArrowRightIcon />
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

export default HeroCard;

const styles = StyleSheet.create({
  inProgressCard: {
    width: "100%",
    height: 200,
    marginBottom: 18,
  },
  image: {
    flex: 1,
    justifyContent: "space-around",
    width: "100%",
    height: "100%",
    borderRadius: 14,
    overflow: "hidden",
  },
  inProgressCardIconWrapper: {
    justifyContent: "center",
    alignItems: "center",
    width: 92,
    height: 92,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginLeft: 30,
  },
  inProgressCardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "",
  },
  inProgressCardContentText: {
    marginLeft: 16,
  },
  inProgressCount: {
    color: "#fff",
    fontSize: 64,
    fontWeight: "bold",
    marginBottom: 2,
    marginTop: -15,
  },
  inProgressLabel: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  viewAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "start",
    marginTop: 10,
    marginLeft: 30,
  },
});
