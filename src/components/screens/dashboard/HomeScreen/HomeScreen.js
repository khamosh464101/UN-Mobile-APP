import React, { useContext, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { SearchContext } from "../../../../utils/SearchContext";
import {
  StyleSheet,
  View,
  ScrollView,
  StatusBar,
  Text,
  Dimensions,
} from "react-native";
import Topbar from "../../../common/Topbar";
import Search from "../../../common/Search";
import { commonStyles } from "../../../../styles/commonStyles";
import { ThemeContext } from "../../../../utils/ThemeContext";
import dashboardData from "../../../../utils/dashboardChartData.json";
import {
  BarChart,
  LineChart,
  PieChart,
  StackedBarChart,
  HorizontalBarChart,
} from "react-native-gifted-charts";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const navigation = useNavigation();
  const { theme } = useContext(ThemeContext);
  const { setSearchKeyword, setSearchResults } = useContext(SearchContext);
  const [selectedDataPoint, setSelectedDataPoint] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);

  // Calculate summary data from the JSON structure
  const calculateSummaryData = () => {
    const totalProjects = dashboardData.length;
    let totalSubProjects = 0;
    let totalTasks = 0;

    dashboardData.forEach((project) => {
      totalSubProjects += project.subProjects.length;
      project.subProjects.forEach((subProject) => {
        totalTasks += subProject.tasks.length;
      });
    });

    return { totalProjects, totalSubProjects, totalTasks };
  };

  // Calculate projects created per month
  const calculateProjectsPerMonth = () => {
    const monthCounts = {};
    const monthProjects = {};

    dashboardData.forEach((project) => {
      const date = new Date(project.createdAt);
      const month = date.toLocaleString("default", { month: "short" });
      monthCounts[month] = (monthCounts[month] || 0) + 1;

      if (!monthProjects[month]) {
        monthProjects[month] = [];
      }
      monthProjects[month].push(project.name);
    });

    return Object.entries(monthCounts).map(([month, count]) => ({
      value: count,
      label: month,
      frontColor: "#4F8EF7",
      gradientColor: "#009FFF",
      projects: monthProjects[month] || [],
    }));
  };

  // Calculate task status distribution
  const calculateTaskStatusDistribution = () => {
    const statusCounts = {};

    dashboardData.forEach((project) => {
      project.subProjects.forEach((subProject) => {
        subProject.tasks.forEach((task) => {
          statusCounts[task.status] = (statusCounts[task.status] || 0) + 1;
        });
      });
    });

    const colorMap = {
      "In Progress": "#4F8EF7",
      Open: "#34C759",
      Completed: "#28A745",
      Canceled: "#FF3B30",
    };

    return Object.entries(statusCounts).map(([status, count]) => ({
      value: count,
      label: status,
      color: colorMap[status] || "#888",
    }));
  };

  // Calculate tasks per user
  const calculateTasksPerUser = () => {
    const userCounts = {};

    dashboardData.forEach((project) => {
      project.subProjects.forEach((subProject) => {
        subProject.tasks.forEach((task) => {
          userCounts[task.assignedTo] = (userCounts[task.assignedTo] || 0) + 1;
        });
      });
    });

    return Object.entries(userCounts).map(([user, count]) => ({
      value: count,
      label: user,
      frontColor: "#4F8EF7",
    }));
  };

  // Calculate tasks per sub-project
  const calculateTasksPerSubProject = () => {
    const subProjectCounts = {};

    dashboardData.forEach((project) => {
      project.subProjects.forEach((subProject) => {
        const key = `${project.name} - ${subProject.name}`;
        subProjectCounts[key] = subProject.tasks.length;
      });
    });

    return Object.entries(subProjectCounts).map(([subProject, count]) => ({
      value: count,
      label:
        subProject.length > 20
          ? subProject.substring(0, 20) + "..."
          : subProject,
      frontColor: "#34C759",
    }));
  };

  // Calculate completed vs canceled tasks per month
  const calculateCompletedVsCanceled = () => {
    const monthData = {};

    dashboardData.forEach((project) => {
      project.subProjects.forEach((subProject) => {
        subProject.tasks.forEach((task) => {
          const date = new Date(task.createdAt);
          const month = date.toLocaleString("default", { month: "short" });

          if (!monthData[month]) {
            monthData[month] = { completed: 0, canceled: 0 };
          }

          if (task.status === "Completed") {
            monthData[month].completed += 1;
          } else if (task.status === "Canceled") {
            monthData[month].canceled += 1;
          }
        });
      });
    });

    const months = Object.keys(monthData).sort((a, b) => {
      const monthOrder = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      return monthOrder.indexOf(a) - monthOrder.indexOf(b);
    });

    const completedData = months.map((month) => monthData[month].completed);
    const canceledData = months.map((month) => monthData[month].canceled);

    return {
      completedData,
      canceledData,
      labels: months,
      multiLineData: [
        {
          data: completedData,
          color: "#34C759",
          label: "Completed",
        },
        {
          data: canceledData,
          color: "#FF3B30",
          label: "Canceled",
        },
      ],
    };
  };

  const handleSearch = (keyword) => {
    // Collect all tasks for search
    const allTasks = [];
    dashboardData.forEach((project) => {
      project.subProjects.forEach((subProject) => {
        subProject.tasks.forEach((task) => {
          allTasks.push({
            ...task,
            projectName: project.name,
            subProjectName: subProject.name,
          });
        });
      });
    });

    const filtered = allTasks.filter(
      (task) =>
        task.title.toLowerCase().includes(keyword.toLowerCase()) ||
        task.id.toLowerCase().includes(keyword.toLowerCase()) ||
        task.projectName.toLowerCase().includes(keyword.toLowerCase()) ||
        task.subProjectName.toLowerCase().includes(keyword.toLowerCase())
    );
    setSearchKeyword(keyword);
    setSearchResults(filtered);
    navigation.navigate("Search");
  };

  // Calculate all data
  const summaryData = calculateSummaryData();
  const projectsPerMonthData = calculateProjectsPerMonth();
  const pieChartData = calculateTaskStatusDistribution();
  const tasksPerUserData = calculateTasksPerUser();
  const tasksPerSubProjectData = calculateTasksPerSubProject();
  const completedVsCanceledData = calculateCompletedVsCanceled();

  return (
    <View
      style={[
        commonStyles.screenWrapper,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <StatusBar barStyle={theme.dark ? "light-content" : "dark-content"} />
      <View style={styles.topBarWrapper}>
        <Topbar />
        {/* <Search onSearch={handleSearch} /> */}
        <Text style={[styles.searchTitle, { color: theme.colors.text }]}>
          Dashboard
        </Text>
      </View>
      <View style={styles.scrollViewWrapper}>
        <ScrollView
          contentContainerStyle={styles.scrollView}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Summary Cards */}
          <View style={styles.summaryRow}>
            <View style={[styles.summaryCard, { backgroundColor: "#4F8EF7" }]}>
              <Text style={styles.summaryTitle}>Projects</Text>
              <Text style={styles.summaryValue}>
                {summaryData.totalProjects}
              </Text>
            </View>
            <View style={[styles.summaryCard, { backgroundColor: "#34C759" }]}>
              <Text style={styles.summaryTitle}>Tasks</Text>
              <Text style={styles.summaryValue}>{summaryData.totalTasks}</Text>
            </View>
            <View style={[styles.summaryCard, { backgroundColor: "#FF9500" }]}>
              <Text style={styles.summaryTitle}>Sub-projects</Text>
              <Text style={styles.summaryValue}>
                {summaryData.totalSubProjects}
              </Text>
            </View>
          </View>

          {/* LineChart: Projects Created per Month */}
          <Text style={styles.chartTitle}>Projects Created per Month</Text>
          <View style={styles.chartContainer}>
            <LineChart
              data={projectsPerMonthData}
              width={width - 40}
              height={180}
              color="#4F8EF7"
              thickness={1}
              hideDataPoints={false}
              xAxisLabelTextStyle={styles.axisLabel}
              yAxisTextStyle={styles.axisLabel}
              areaChart
              startFillColor="#4F8EF7"
              endFillColor="#fff"
              startOpacity={0.4}
              endOpacity={0.1}
              curved
              noOfSections={5}
              yAxisColor="#eee"
              xAxisColor="#eee"
              isAnimated
              pressEnabled={true}
              pressDuration={200}
              onPress={(item, index) => {
                setSelectedDataPoint(item);
                setShowTooltip(true);
              }}
              onPressEnd={() => {
                setShowTooltip(false);
                setSelectedDataPoint(null);
              }}
              customDataPoint={({ x, y, index, item }) => {
                return (
                  <View
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: "#4F8EF7",
                      borderWidth: 2,
                      borderColor: "#fff",
                    }}
                  />
                );
              }}
              customLabel={({ x, y, index, item }) => {
                if (
                  showTooltip &&
                  selectedDataPoint &&
                  selectedDataPoint.label === item.label
                ) {
                  return (
                    <View style={styles.customTooltip}>
                      <View style={styles.tooltipHeader}>
                        <Text style={styles.tooltipTitle}>
                          {selectedDataPoint.label}
                        </Text>
                        <Text style={styles.tooltipCount}>
                          {selectedDataPoint.value} Projects
                        </Text>
                      </View>
                      <ScrollView
                        style={styles.tooltipScroll}
                        showsVerticalScrollIndicator={false}
                      >
                        {selectedDataPoint.projects.map((project, idx) => (
                          <Text key={idx} style={styles.tooltipProject}>
                            • {project}
                          </Text>
                        ))}
                      </ScrollView>
                    </View>
                  );
                }
                return null;
              }}
            />
          </View>

          {/* PieChart: Task Status Distribution */}
          <Text style={styles.chartTitle}>Task Status Distribution</Text>
          <PieChart
            data={pieChartData}
            donut
            showText
            textColor="#222"
            textSize={14}
            radius={70}
            innerRadius={40}
            centerLabelComponent={() => (
              <Text style={{ fontWeight: "bold", fontSize: 16 }}>Tasks</Text>
            )}
            isAnimated
          />

          {/* HorizontalBarChart: Tasks per User */}
          <Text style={styles.chartTitle}>Tasks per User</Text>
          <BarChart
            horizontal
            data={tasksPerUserData}
            width={width - 40}
            height={180}
            barWidth={18}
            noOfSections={4}
            yAxisColor="#eee"
            xAxisColor="#eee"
            xAxisLabelTextStyle={styles.axisLabel}
            yAxisTextStyle={styles.axisLabel}
            isAnimated
          />

          {/* BarChart: Tasks per Sub-Project */}
          <Text style={styles.chartTitle}>Tasks per Sub-Project</Text>
          <BarChart
            data={tasksPerSubProjectData}
            width={width - 40}
            height={180}
            barWidth={28}
            noOfSections={4}
            yAxisColor="#eee"
            xAxisColor="#eee"
            xAxisLabelTextStyle={styles.axisLabel}
            yAxisTextStyle={styles.axisLabel}
            isAnimated
          />

          {/* Multi-LineChart: Completed vs Canceled Tasks (Monthly) */}
          <Text style={styles.chartTitle}>
            Completed vs Canceled Tasks (Monthly)
          </Text>
          <LineChart
            data={completedVsCanceledData.multiLineData}
            width={width - 40}
            height={180}
            thickness={3}
            hideDataPoints={false}
            xAxisLabelTextStyle={styles.axisLabel}
            yAxisTextStyle={styles.axisLabel}
            curved
            noOfSections={4}
            yAxisColor="#eee"
            xAxisColor="#eee"
            xAxisLabels={completedVsCanceledData.labels}
            isAnimated
          />
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topBarWrapper: {
    paddingTop: 0,
    paddingHorizontal: 0,
  },
  scrollViewWrapper: {
    flex: 1,
    paddingVertical: 0,
  },
  scrollView: {
    flexGrow: 1,
    alignItems: "center",
    paddingBottom: 32,
    paddingTop: 8,
  },
  searchTitle: {
    fontSize: 30,
    fontWeight: "900",
    marginBottom: 15,
    marginTop: 15,
  },
  searchEntry: {
    fontWeight: "bold",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: width - 40,
    marginBottom: 24,
    marginTop: 8,
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
    marginHorizontal: 2,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  summaryTitle: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  summaryValue: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  chartTitle: {
    fontSize: 17,
    fontWeight: "600",
    marginTop: 28,
    marginBottom: 10,
    color: "#222",
    alignSelf: "flex-start",
    marginLeft: 8,
    letterSpacing: 0.2,
  },
  axisLabel: {
    color: "#888",
    fontSize: 12,
  },
  legendLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#444",
    marginBottom: 4,
    marginLeft: 8,
  },
  tooltipContainer: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    minWidth: 200,
    maxWidth: 280,
  },
  tooltipHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    paddingBottom: 6,
  },
  tooltipTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  tooltipCount: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4F8EF7",
  },
  tooltipScroll: {
    maxHeight: 120,
  },
  tooltipProject: {
    fontSize: 13,
    color: "#555",
    marginBottom: 4,
    lineHeight: 18,
  },
  chartContainer: {
    position: "relative",
  },
  customTooltip: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    minWidth: 200,
    maxWidth: 280,
    zIndex: 1000,
  },
});
