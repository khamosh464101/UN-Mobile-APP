import React from "react";
import { TouchableOpacity, Text, ActivityIndicator } from "react-native";
import { commonStyles } from "../../styles/commonStyles";
import { COLORS } from "../../styles/colors";

export const Button = ({
  onPress,
  title,
  loading = false,
  disabled = false,
  style,
  textStyle,
  variant = "primary", // primary, secondary, danger
}) => {
  const getBackgroundColor = () => {
    switch (variant) {
      case "secondary":
        return COLORS.secondary;
      case "danger":
        return COLORS.danger;
      default:
        return COLORS.primary;
    }
  };

  return (
    <TouchableOpacity
      style={[
        commonStyles.button,
        { backgroundColor: getBackgroundColor() },
        disabled && { opacity: 0.7 },
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={COLORS.white} />
      ) : (
        <Text style={[commonStyles.buttonText, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};
