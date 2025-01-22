import store from "@/store/store";
import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { Provider } from "react-redux";

export default function RootLayout() {
    return (
        <Provider store={store}>
            <Stack screenOptions={{
                headerShown: false
            }}>
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="(auth)" />
                <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar backgroundColor={'transparent'} barStyle="light-content" translucent />
        </Provider>
    );
}
