import Header from "@/components/navigation/Header";
import TabBar from "@/components/navigation/TabBar";
import Background from "@/providers/Background";
import { RootState } from "@/store/store";
import { Redirect, Tabs } from "expo-router";
import { useSelector } from "react-redux";

export default function TabLayout() {
  const { user } = useSelector((state: RootState) => state.auth);

  // This is where we actually enforce protection
  if (!user?.emailVerified) {
    return <Redirect href="/auth" />;
  }

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