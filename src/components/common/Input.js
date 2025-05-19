import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { commonStyles } from "../../styles/commonStyles";

export const Input = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  secureTextEntry,
  keyboardType = "default",
  autoCapitalize = "none",
  rightIcon,
  onRightIconPress,
  style,
  ...props
}) => {
  return (
    <View style={[commonStyles.inputContainer, style]}>
      {label && <Text style={commonStyles.inputLabel}>{label}</Text>}
      <View style={commonStyles.passwordContainer}>
        <TextInput
          style={commonStyles.passwordInput}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#A9A9A9"
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          {...props}
        />
        {rightIcon && (
          <TouchableOpacity
            style={commonStyles.eyeIcon}
            onPress={onRightIconPress}
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
      {error ? <Text style={commonStyles.errorText}>{error}</Text> : null}
    </View>
  );
};
