import React, { useState, useContext } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";

import SearchIcon from "../../assets/icons/search.svg";
import SearchDarkIcon from "../../assets/icons/search-dark.svg";
import SearchSubmitIcon from "../../assets/icons/search-submit.svg";
import SearchSubmitDarkIcon from "../../assets/icons/search-submit-dark.svg";
import { ThemeContext } from "../../utils/ThemeContext";

const Search = ({ onSearch, value, onChangeText, placeholder }) => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme.dark;
  const [query, setQuery] = useState("");

  const isControlled =
    typeof value === "string" && typeof onChangeText === "function";

  const inputValue = isControlled ? value : query;
  const setInputValue = isControlled ? onChangeText : setQuery;

  const handleSubmit = () => {
    const trimmed = inputValue.trim();
    if (trimmed) {
      onSearch?.(trimmed);
    }
  };
  return (
    <View>
      <Text style={[styles.searchTitle, { color: theme.colors.text }]}>
        Search For an {"\n"}
        <Text style={[styles.searchEntry, { color: theme.colors.primary }]}>
          Entry
        </Text>
      </Text>
      <View style={styles.searchBarRow}>
        <View
          style={[styles.searchBar, { borderColor: theme.colors.lightBlack }]}
        >
          <View style={styles.searchIcon}>
            {isDark ? <SearchDarkIcon /> : <SearchIcon />}
          </View>
          <TextInput
            style={[styles.searchInput, { color: theme.colors.text }]}
            value={inputValue}
            onChangeText={setInputValue}
            onSubmitEditing={handleSubmit}
            placeholder={placeholder || "Search by ID or title"}
            returnKeyType="search"
          />
          <TouchableOpacity style={styles.refreshBtn} onPress={handleSubmit}>
            {isDark ? <SearchSubmitDarkIcon /> : <SearchSubmitIcon />}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
  searchTitle: {
    fontSize: 30,
    fontWeight: "900",
    marginBottom: 15,
    marginTop: 15,
  },
  searchEntry: {
    fontWeight: "bold",
  },
  searchBarRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  refreshBtn: {
    marginLeft: 10,
    width: 30,
    height: 42,
    justifyContent: "center",
    alignItems: "center",
  },
});
