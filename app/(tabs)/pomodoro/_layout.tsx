import { router, Stack } from "expo-router"
import Header from "@/components/navigation/Header";

export default function PomodoroLayout() {
    return (
        <Stack screenOptions={{ contentStyle: { backgroundColor: 'transparent' } }} >
            <Stack.Screen name="index" options={{header: () => <Header title={'Pomodoro'}/>}} />
        </Stack>
    )
}