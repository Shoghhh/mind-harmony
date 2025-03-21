import Header from "@/components/navigation/Header";
import TabBar from "@/components/navigation/TabBar";
import Background from "@/providers/Background";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Background>
      <Tabs
        tabBar={props => <TabBar {...props} />}
        screenOptions={{
          sceneStyle: { backgroundColor: 'transparent' },
        }}
      >
        <Tabs.Screen name="dashboard" options={{ header: () => <Header title={'Dashboard'} /> }} />
        <Tabs.Screen name="todos" options={{ headerShown: false }} />
        <Tabs.Screen name="habits" options={{ header: () => <Header title={'Habits'} /> }} />
        <Tabs.Screen name="pomodoro" options={{ headerShown: false }} />
        <Tabs.Screen name="profile" options={{ header: () => <Header title={'Profile'} /> }} />
      </Tabs>
    </Background>
  );
}
