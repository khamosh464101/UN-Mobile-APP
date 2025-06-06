import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import DateTimePicker, { useDefaultStyles } from "react-native-ui-datepicker";
import dayjs from "dayjs";

const DateQuestion = ({ question, value, onChange }) => {
  const defaultStyles = useDefaultStyles();
  const [selected, setSelected] = useState(value || new Date());

  const handleDateChange = ({ date }) => {
    if (date) {
      setSelected(date);
      onChange(date);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.question}>{question}</Text>
      <DateTimePicker
        mode="single"
        date={selected}
        onChange={handleDateChange}
        styles={defaultStyles}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  question: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default DateQuestion;
