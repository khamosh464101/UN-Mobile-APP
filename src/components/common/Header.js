import React from "react";
import { View, Image, TouchableOpacity } from "react-native";
import { commonStyles } from "../../styles/commonStyles";

export const Header = ({
  showBackButton = false,
  onBackPress,
  backIcon,
  style,
}) => {
  return (
    <View style={[commonStyles.headerContainer, style]}>
      <Image
        source={require("../../assets/images/Head.png")}
        style={commonStyles.headerImage}
        resizeMode="cover"
      />
      {/* {showBackButton && (
        <TouchableOpacity style={commonStyles.backButton} onPress={onBackPress}>
          {backIcon}
        </TouchableOpacity>
      )} */}
    </View>
  );
};
