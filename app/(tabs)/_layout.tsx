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
        <Tabs.Screen name="dashboard" options={{ headerShown: false }} />
        <Tabs.Screen name="todos" options={{ headerShown: false }} />
        <Tabs.Screen name="pomodoro" options={{ headerShown: false }} />
        <Tabs.Screen name="profile" options={{ headerShown: false }} />
      </Tabs>
    </Background>
  );
}