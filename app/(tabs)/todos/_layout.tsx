import { Stack } from "expo-router"
import { screenOptions } from "../_layout"

export default function TodosLayout() {
    return (
        <Stack screenOptions={{ contentStyle: { backgroundColor: '#f8f8f8', } }} >
            <Stack.Screen name="index" options={screenOptions('To Do')} />
            <Stack.Screen name="[id]" options={({ route }: any) => {
                const { id } = route.params;
                return {
                    headerTitle: `Task ${id}`,
                };
            }} />
        </Stack>
    )
}