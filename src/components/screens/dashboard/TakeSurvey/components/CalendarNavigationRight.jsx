import React, { useContext } from "react";
import { View } from "react-native";
import RightArrowDarkIcon from "../../../../../assets/icons/chevron-right-dark.svg";
import RightArrowIcon from "../../../../../assets/icons/chevron-right.svg";
import { ThemeContext } from "../../../../../utils/ThemeContext";

const CalendarNavigationRight = () => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme.dark;
  return <View>{isDark ? <RightArrowDarkIcon /> : <RightArrowIcon />}</View>;
};

export default CalendarNavigationRight;
