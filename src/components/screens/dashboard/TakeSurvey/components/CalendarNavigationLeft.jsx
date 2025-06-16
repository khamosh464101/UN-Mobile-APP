import React, { useContext } from "react";
import { View } from "react-native";
import LeftArrowDarkIcon from "../../../../../assets/icons/chevron-left-dark.svg";
import LeftArrowIcon from "../../../../../assets/icons/chevron-left.svg";
import { ThemeContext } from "../../../../../utils/ThemeContext";

const CalendarNavigationLeft = () => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme.dark;
  return <View>{isDark ? <LeftArrowDarkIcon /> : <LeftArrowIcon />}</View>;
};

export default CalendarNavigationLeft;
