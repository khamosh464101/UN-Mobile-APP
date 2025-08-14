import React, { useContext } from "react";
import { Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { ThemeContext } from "../../../../../utils/ThemeContext";

const TaskFilter = ({ activeIndex, setActiveIndex, data }) => {
  const { theme } = useContext(ThemeContext);
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {data.map((item, index) => {
        const isActive = activeIndex === index;
        return (
          <TouchableOpacity
            key={index}
            style={[
              styles.button,
              isActive
                ? { backgroundColor: theme.colors.primary }
                : {
                    backgroundColor: theme.colors.lightBlack,
                  },
            ]}
            onPress={() => setActiveIndex(index)}
          >
            <Text
              style={[
                styles.text,
                { color: theme.colors.secondaryText },
                isActive && styles.activeText,
              ]}
            >
              {item.title} ({item.tickets.length})
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

export default TaskFilter;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    marginBottom: 10,
    flexDirection: "row",
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginRight: 10,
    borderRadius: 5,
    height: 35,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 14,
  },
  activeText: {
    color: "#fff",
  },
});
