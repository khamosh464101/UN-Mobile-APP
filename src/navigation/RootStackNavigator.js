import { createStackNavigator } from "@react-navigation/stack";
import DashboardNavigator from "./DashboardNavigator";
import TaskScreen from "../components/screens/dashboard/TasksScreen/TaskScreen";

const Stack = createStackNavigator();

export default function RootStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard" component={DashboardNavigator} />
      <Stack.Screen name="TaskDetails" component={TaskScreen} />
    </Stack.Navigator>
  );
}
