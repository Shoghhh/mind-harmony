import { router, Stack } from "expo-router"
import Header from "@/components/navigation/Header";

export default function PomodoroLayout() {
    return (
        <Stack screenOptions={{ contentStyle: { backgroundColor: '#f8f8f8' } }} >
            <Stack.Screen name="index" options={{header: () => <Header title={'Pomodoro'}/>}} />
        </Stack>
    )
}