import { Stack } from "expo-router";
import { StatusBar } from "react-native";


export default function RootLayout() {
    return (
        <>
            <Stack screenOptions={{
                headerShown: false
            }}>
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="(auth)" />
                <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar backgroundColor={'transparent'} barStyle="light-content" translucent />
        </>
    );
}
