import Header from "@/components/navigation/Header";
import TabBar from "@/components/navigation/TabBar";
import { BottomSheetProvider } from "@/providers/BottomSheetProvider";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Tabs } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function TabLayout() {
  return (
    <Tabs
      tabBar={props => <TabBar {...props} />}
    >
      <Tabs.Screen name="dashboard" options={{ header: () => <Header title={'Dashboard'} /> }} />
      <Tabs.Screen name="todos" options={{ headerShown: false }} />
      <Tabs.Screen name="habits" options={{ header: () => <Header title={'Habits'} /> }} />
      <Tabs.Screen name="pomodoro" options={{ headerShown: false }} />
      <Tabs.Screen name="profile" options={{ header: () => <Header title={'Profile'} /> }} />
    </Tabs>
  );
}
