import React, { useContext } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { ThemeContext } from "../../utils/ThemeContext";
import useNetworkStatus from "../../hooks/useNetworkStatus";

const NetworkStatus = () => {
  const { theme } = useContext(ThemeContext);
  const { isConnected, connectionType } = useNetworkStatus();
  const [animation] = React.useState(new Animated.Value(0));

  React.useEffect(() => {
    if (!isConnected) {
      Animated.sequence([
        Animated.timing(animation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(3000),
        Animated.timing(animation, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isConnected]);

  if (isConnected) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.error,
          transform: [
            {
              translateY: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [-50, 0],
              }),
            },
          ],
        },
      ]}
    >
      <Text style={styles.text}>
        {isConnected
          ? `Connected to ${connectionType}`
          : "No internet connection"}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    padding: 10,
    zIndex: 1000,
  },
  text: {
    color: "white",
    textAlign: "center",
    fontSize: 14,
  },
});

export default NetworkStatus;
