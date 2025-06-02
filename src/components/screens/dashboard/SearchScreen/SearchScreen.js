import React, { useContext, useState, useEffect } from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import { commonStyles } from "../../../../styles/commonStyles";
import Topbar from "../../../common/Topbar";
import Search from "../../../common/Search";
import { SearchContext } from "../../../../utils/SearchContext";
import tasksData from "../../../../utils/tasks.json";
import TaskCard from "../TasksScreen/components/TaskCard";

export default function SearchScreen({ navigation }) {
  const handleViewDetails = (task) => {
    navigation.navigate("Tasks", {
      screen: "TaskDetails",
      params: { task },
    });
  };

  const { searchKeyword, setSearchKeyword, searchResults, setSearchResults } =
    useContext(SearchContext);
  const [localKeyword, setLocalKeyword] = useState(searchKeyword || "");

  useEffect(() => {
    if (searchKeyword) {
      performSearch(searchKeyword);
    }
  }, [searchKeyword]);

  useEffect(() => {
    if (searchKeyword !== localKeyword) {
      setLocalKeyword(searchKeyword);
    }
  }, [searchKeyword]);

  const performSearch = (keyword) => {
    const filtered = tasksData.filter(
      (task) =>
        task.title.toLowerCase().includes(keyword.toLowerCase()) ||
        task.id.toLowerCase().includes(keyword.toLowerCase())
    );
    setSearchResults(filtered);
  };

  const handleChange = (text) => {
    setLocalKeyword(text);
    setSearchKeyword(text);
    performSearch(text);
  };

  return (
    <View style={commonStyles.screenWrapper}>
      <Topbar />
      <Search
        value={localKeyword}
        onChangeText={handleChange}
        placeholder="Search by title or ID..."
      />
      <ScrollView>
        {searchResults?.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onPressViewDetails={handleViewDetails}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 18,
    color: "#222",
  },
});
