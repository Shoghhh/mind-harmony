import { Stack } from "expo-router"
import Header from "@/components/navigation/Header";

export default function ProfileLayout() {
    return (
        <Stack screenOptions={{ contentStyle: { backgroundColor: 'transparent' }, animation: 'none' }} >
            <Stack.Screen name="index" options={{header: () => <Header title={'Profile'} />}} />
            <Stack.Screen name="edit" options={{header: () => <Header title={'Edit Profile'} showBack/>}} />
            <Stack.Screen name="change-password" options={{header: () => <Header title={'Change Password'} showBack/>}} />
            <Stack.Screen name="language" options={{header: () => <Header title={'Language'} showBack/>}} />
        </Stack>
    )
}