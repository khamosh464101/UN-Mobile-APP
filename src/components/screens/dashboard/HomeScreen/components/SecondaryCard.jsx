import React from "react";
import { StyleSheet, View, Text, ImageBackground } from "react-native";
import TasksIcon from "../../../../../assets/icons/task-white.svg";
import { COLORS } from "../../../../../styles/colors";

const TaskIcon = () => <TasksIcon width={35} height={35} />;

const SecondaryCard = ({ TaskCount, TaskType }) => {
  return (
    <View style={styles.statCard}>
      <ImageBackground
        source={require("../../../../../assets/images/secondar-card-bg.png")}
        style={styles.image}
      >
        <View style={styles.CardContent}>
          <View style={styles.CardIconWrapper}>
            <TaskIcon />
          </View>
          <View style={styles.CardContentText}>
            <Text style={styles.statCount}>{TaskCount}</Text>
            <Text style={styles.statLabel}>{TaskType}</Text>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

export default SecondaryCard;

const styles = StyleSheet.create({
  image: {
    flex: 1,
    justifyContent: "space-around",
    width: "100%",
    height: "100%",
    borderRadius: 14,
    overflow: "hidden",
  },
  CardContent: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 30,
  },
  CardIconWrapper: {
    marginRight: 10,
    height: 56,
    width: 56,
    backgroundColor: COLORS.primary,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  CardContentText: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  statCard: {
    flex: 1,
    borderRadius: 14,
    height: 108,
    width: "100%",
  },
  statCount: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#222",
    marginTop: -8,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 14,
    color: "#888",
  },
});
