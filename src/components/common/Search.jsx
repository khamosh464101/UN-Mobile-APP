import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";

import SearchIconTransparent from "../../assets/icons/search.svg";
import SearchSubmitIcon from "../../assets/icons/search-submit.svg";
import { COLORS } from "../../styles/colors";

const RefreshIcon = () => <SearchSubmitIcon width={25} height={25} />;
const SearchIcon = () => <SearchIconTransparent width={25} height={25} />;

const Search = ({ onSearch, value, onChangeText, placeholder }) => {
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
      <Text style={styles.searchTitle}>
        Search For an {"\n"}
        <Text style={styles.searchEntry}>Entry</Text>
      </Text>
      <View style={styles.searchBarRow}>
        <View style={styles.searchBar}>
          <View style={styles.searchIcon}>
            <SearchIcon />
          </View>
          <TextInput
            style={styles.searchInput}
            value={inputValue}
            onChangeText={setInputValue}
            onSubmitEditing={handleSubmit}
            placeholder={placeholder || "Search by ID or title"}
            returnKeyType="search"
          />
          <TouchableOpacity style={styles.refreshBtn} onPress={handleSubmit}>
            <RefreshIcon />
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
    color: COLORS.primary,
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
    borderColor: COLORS.inputBorder,
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
