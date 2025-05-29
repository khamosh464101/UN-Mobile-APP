import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";

import SearchIconTransparent from "../../assets/icons/search.svg";
import SearchSubmitIcon from "../../assets/icons/search-submit.svg";

const RefreshIcon = () => <SearchSubmitIcon width={25} height={25} />;
const SearchIcon = () => <SearchIconTransparent width={25} height={25} />;

const Search = () => {
  return (
    <View>
      <Text style={styles.searchTitle}>
        Search For an {"\n"}
        <Text style={styles.searchEntry}>Entry</Text>
      </Text>
      <View style={styles.searchBarRow}>
        <View style={styles.searchBar}>
          <SearchIcon />
          <TextInput style={styles.searchInput} placeholder="" />
          <TouchableOpacity style={styles.refreshBtn}>
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
    color: "#111",
    marginBottom: 15,
    marginTop: 15,
  },
  searchEntry: {
    color: "#895ADF",
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
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  refreshBtn: {
    marginLeft: 10,
    backgroundColor: "#fff",
    width: 30,
    height: 42,
    justifyContent: "center",
    alignItems: "center",
  },
});
