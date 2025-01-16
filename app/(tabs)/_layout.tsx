import Header from "@/components/navigation/Header";
import TabBar from "@/components/navigation/TabBar";
import { Tabs } from "expo-router";

export const screenOptions = (title: string) => ({
  header: () => <Header title={title} />,
  title
});
export default function TabLayout() {
  return (
    <>

      <Tabs
        tabBar={props => <TabBar {...props} />}
      >
        <Tabs.Screen name="dashboard" options={screenOptions('Dashboard')} />
        <Tabs.Screen name="todos" options={{headerShown: false}}/>
        <Tabs.Screen name="habits" options={screenOptions('Habits')} />
        <Tabs.Screen name="pomodoro" options={screenOptions('Pomodoro')} />
        <Tabs.Screen name="profile" options={screenOptions('Profile')} />
      </Tabs>
    </>
  );
}
