import { Stack } from "expo-router"
import Header from "@/components/navigation/Header";
import { useBottomSheet } from "@/providers/BottomSheetProvider";
import SettingsComponent from "@/components/pomodoro/PomodoroSettings";

export default function PomodoroLayout() {
    const { present } = useBottomSheet();
    
    const handleSettingsPress = () => {
        present(SettingsComponent);
    };
    
    return (
        <Stack screenOptions={{ contentStyle: { backgroundColor: 'transparent' } }} >
            <Stack.Screen name="index" options={{header: () => <Header title={'Pomodoro'} showSettings onPressSettings={handleSettingsPress}/>}} />
        </Stack>
    )
}