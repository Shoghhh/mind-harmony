import { router, Stack } from "expo-router"
import Header from "@/components/navigation/Header";

export default function TodosLayout() {
    return (
        <Stack screenOptions={{ contentStyle: {backgroundColor: 'transparent'} }} >
            <Stack.Screen name="index" options={{ header: () => <Header title={''} />, }} />
            <Stack.Screen name="add" options={({ route }: any) => {
                const { id } = route.params;
                return {
                    header: () => <Header title={id ? 'Edit To do' : 'Add To Do'} showBack/>,
                };
            }} />
            <Stack.Screen name="[id]" options={({ route }: any) => {
                const { name, id } = route.params;
                return {
                    header: () => <Header title={name} showBack showEdit leftAction={() => router.push({
                        pathname: '/(tabs)/todos/add',
                        params: { id, name },
                    })} />,
                };
            }} />

        </Stack>
    )
}