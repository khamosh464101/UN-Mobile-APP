import React, { useContext } from "react";
import { View, StyleSheet } from "react-native";
import { ThemeContext } from "../../utils/ThemeContext";
import useNetworkStatus from "../../hooks/useNetworkStatus";
import NetworkStatus from "./NetworkStatus";

const NetworkWrapper = ({ children }) => {
  const themeContext = useContext(ThemeContext);
  const { isConnected } = useNetworkStatus();

  // Default styles if theme is not available
  const containerStyle = {
    flex: 1,
    backgroundColor: themeContext?.theme?.colors?.background || "#FFFFFF",
  };

  return (
    <View style={containerStyle}>
      <NetworkStatus />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default NetworkWrapper;
