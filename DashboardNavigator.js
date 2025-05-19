import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  StatusBar,
  ScrollView,
  Dimensions,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import BellIconEmpty from "./assets/icons/bell-icon-empty.svg";
import SearchIconTransparent from "./assets/icons/search.svg";
import SearchSubmitIcon from "./assets/icons/search-submit.svg";
import TaskFilledIcon from "./assets/icons/task-fill.svg";

// Placeholder icons (replace with your SVGs or images)
const TaskFillIcon = () => <TaskFilledIcon width={25} height={25} />;

const TaskIcon = () => (
  <View
    style={{
      width: 32,
      height: 32,
      backgroundColor: "#eee",
      borderRadius: 8,
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <TaskFillIcon width={30} height={30} />
  </View>
);
const BellIcon = () => <BellIconEmpty width={30} height={30} />;
const RefreshIcon = () => <SearchSubmitIcon width={25} height={25} />;
const SearchIcon = () => <SearchIconTransparent width={25} height={25} />;

function HomeScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {/* Top Bar */}
      <View style={styles.topBarWrapper}>
        <View style={styles.topBar}>
          <View style={styles.avatar} />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.userName}>Atiqullah</Text>
            <Text style={styles.userSubtitle}>Sadeqi</Text>
          </View>
          <View style={{ flex: 1 }} />
          <TouchableOpacity style={styles.bellBtn}>
            <BellIcon />
          </TouchableOpacity>
        </View>

        {/* Search Section */}
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
      <View style={styles.scrollViewWrapper}>
        <ScrollView
          contentContainerStyle={styles.scrollView}
          keyboardShouldPersistTaps="handled"
        >
          {/* In Progress Tasks Card */}
          <View style={styles.inProgressCard}>
            <TaskIcon />
            <View style={{ marginLeft: 16 }}>
              <Text style={styles.inProgressCount}>02</Text>
              <Text style={styles.inProgressLabel}>In Progress Tasks</Text>
            </View>
          </View>

          {/* Open/Resolved Tasks Cards */}
          <View style={styles.rowCards}>
            <View style={styles.statCard}>
              <TaskIcon />
              <Text style={styles.statCount}>02</Text>
              <Text style={styles.statLabel}>Open Tasks</Text>
            </View>
            <View style={styles.statCard}>
              <TaskIcon />
              <Text style={styles.statCount}>08</Text>
              <Text style={styles.statLabel}>Resolved Tasks</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

function ProfileScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Profile</Text>
    </View>
  );
}

function SettingsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Settings</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function DashboardNavigator() {
  return (
    <Tab.Navigator initialRouteName="Home">
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 0,
    paddingTop: 36,
  },
  topBarWrapper: {
    paddingHorizontal: 18,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#E0E0E0",
  },
  userName: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#222",
  },
  userSubtitle: {
    fontSize: 13,
    color: "#888",
  },
  bellBtn: {
    padding: 6,
  },
  searchTitle: {
    fontSize: 30,
    fontWeight: 900,
    color: "#111",
    marginBottom: 15,
    marginTop: 35,
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
  inProgressCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#895ADF",
    borderRadius: 14,
    padding: 18,
    marginBottom: 18,
  },
  inProgressCount: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 2,
  },
  inProgressLabel: {
    color: "#fff",
    fontSize: 14,
  },
  rowCards: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    alignItems: "center",
    padding: 18,
    marginRight: 10,
  },
  statCount: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#222",
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 13,
    color: "#888",
  },
  scrollViewWrapper: {
    flex: 1,
    marginTop: 35,
    backgroundColor: "#F0F1F7",
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
  },
  scrollView: {
    flexGrow: 1,
    padding: 18,
    justifyContent: "flex-start",
    alignItems: "center",
  },
});
