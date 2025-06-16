import React, { useState, useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import DateTimePicker, {
  useDefaultStyles,
  CalendarComponents,
} from "react-native-ui-datepicker";
import dayjs from "dayjs";
import { ThemeContext } from "../../../../../utils/ThemeContext";
import CalendarNavigationLeft from "./CalendarNavigationLeft";
import CalendarNavigationRight from "./CalendarNavigationRight";

const DateQuestion = ({
  question,
  value,
  onChange,
  required = false,
  hint = "",
}) => {
  const { theme } = useContext(ThemeContext);
  const defaultStyles = useDefaultStyles();
  const [selected, setSelected] = useState(value || new Date());
  const [hasSelected, setHasSelected] = useState(!!value);

  const handleDateChange = ({ date }) => {
    if (date) {
      setSelected(date);
      setHasSelected(true);
      onChange(date);
    }
  };

  const formatSelectedDate = (date) => {
    return dayjs(date).format("D MMM, YYYY");
  };

  const components = {
    IconPrev: <CalendarNavigationLeft />,
    IconNext: <CalendarNavigationRight />,
  };

  return (
    <View style={styles.container}>
      <View style={styles.questionHeader}>
        <Text style={[styles.question, { color: theme.colors.text }]}>
          {question}
          {required && <Text style={{ color: theme.colors.error }}> *</Text>}
        </Text>
        {hint ? (
          <Text
            style={[styles.hintText, { color: theme.colors.secondaryText }]}
          >
            {hint}
          </Text>
        ) : null}
      </View>
      <DateTimePicker
        mode="single"
        date={selected}
        onChange={handleDateChange}
        components={components}
        navigationPosition="right"
        styles={{
          ...defaultStyles,
          header: {
            backgroundColor: theme.colors.lightBlack,
            paddingHorizontal: 10,
          },
          today: {
            borderWidth: 1,
            borderBottomColor: theme.colors.primary,
            borderTopColor: "transparent",
            borderLeftColor: "transparent",
            borderRightColor: "transparent",
            borderRadius: 0,
          },
          today_label: {
            color: theme.colors.text,
          },
          selected: { backgroundColor: theme.colors.primary },
          days: {
            backgroundColor: theme.colors.lightBlack,
          },
          weekdays: {
            backgroundColor: theme.colors.lightBlack,
          },
          day_label: {
            color: theme.colors.text,
          },
          month_selector_label: {
            color: theme.colors.text,
            fontSize: 20,
          },
          year_selector_label: {
            color: theme.colors.text,
            fontSize: 20,
          },
          years: {
            backgroundColor: theme.colors.lightBlack,
          },
          year: { borderWidth: 0 },
          year_label: {
            color: theme.colors.text,
          },
          selected_year: {
            backgroundColor: theme.colors.primary,
            borderWidth: 0,
          },
          months: {
            backgroundColor: theme.colors.lightBlack,
          },
          month: { borderWidth: 0 },
          month_label: {
            color: theme.colors.text,
          },
          selected_month: {
            backgroundColor: theme.colors.primary,
            borderWidth: 0,
          },
        }}
      />
      <Text style={[styles.selectedDate, { color: theme.colors.text }]}>
        {hasSelected
          ? `Selected date: ${formatSelectedDate(selected)}`
          : "No date selected"}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  questionHeader: {
    marginBottom: 10,
  },
  question: {
    fontSize: 16,
    fontWeight: "bold",
  },
  hintText: {
    fontSize: 13,
    marginTop: 5,
    fontStyle: "italic",
  },
  selectedDate: {
    fontSize: 14,
    marginTop: 50,
    textAlign: "center",
  },
});

export default DateQuestion;
