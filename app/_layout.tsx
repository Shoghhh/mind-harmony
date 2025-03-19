import { auth } from "@/firebase";
import store from "@/store/store";
import { Stack, useRouter, useSegments } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState, useCallback } from "react";
import { ActivityIndicator, SafeAreaView, StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";
import { BottomSheetProvider } from "@/providers/BottomSheetProvider";
import { PomodoroProvider } from "@/providers/PomodoroContext";

export default function RootLayout() {
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState<any>(null);
    const router = useRouter();
    const segments = useSegments();

    const handleAuthStateChange = useCallback((authUser: any) => {
        setUser(authUser);
        setInitializing(false);
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, handleAuthStateChange);
        return () => unsubscribe();
    }, [handleAuthStateChange]);

    // useEffect(() => {
    //     if (initializing) return;

    //     const inTabsGroup = segments[0] === "(tabs)";
    //     if (user && !inTabsGroup) {
    //         router.replace("/(tabs)/dashboard");
    //     } else if (!user && inTabsGroup) {
    //         router.replace("/");
    //     }
    // }, [initializing, user, router, segments]);

    if (initializing) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator color="red" size="large" />
            </SafeAreaView>
        );
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <PomodoroProvider>
                <BottomSheetProvider>
                    <Provider store={store}>
                        <Stack screenOptions={{ headerShown: false }}>
                            <Stack.Screen name="auth" />
                            <Stack.Screen name="(tabs)" />
                            <Stack.Screen name="+not-found" />
                        </Stack>
                        <StatusBar backgroundColor="transparent" barStyle="light-content" translucent />
                    </Provider>
                </BottomSheetProvider>
            </PomodoroProvider>
        </GestureHandlerRootView>
    );
}
