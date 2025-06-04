import React, { useContext } from "react";
import { StyleSheet, View, Text, ImageBackground } from "react-native";
import TasksIcon from "../../../../../assets/icons/task-white.svg";
import { COLORS } from "../../../../../styles/colors";
import { ThemeContext } from "../../../../../utils/ThemeContext";

const TaskIcon = () => <TasksIcon width={35} height={35} />;

const SecondaryCard = ({ TaskCount, TaskType }) => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme.dark;
  const backgroundImage = isDark
    ? require("../../../../../assets/images/secondary-card-bg-dark.png")
    : require("../../../../../assets/images/secondar-card-bg.png");
  return (
    <View style={styles.statCard}>
      <ImageBackground source={backgroundImage} style={styles.image}>
        <View style={styles.CardContent}>
          <View
            style={[
              styles.CardIconWrapper,
              { backgroundColor: theme.colors.primary },
            ]}
          >
            <TaskIcon />
          </View>
          <View style={styles.CardContentText}>
            <Text style={[styles.statCount, { color: theme.colors.text }]}>
              {TaskCount}
            </Text>
            <Text
              style={[styles.statLabel, { color: theme.colors.secondaryText }]}
            >
              {TaskType}
            </Text>
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
    marginTop: -8,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 14,
  },
});
