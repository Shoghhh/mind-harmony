import '../global.css';
import store from "@/store/store";
import { Slot } from "expo-router";
import { StatusBar, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";
import { BottomSheetProvider } from "@/providers/BottomSheetProvider";
import { PomodoroProvider } from "@/providers/PomodoroContext";
import Background from "@/providers/Background";
import { NativeBaseProvider } from "native-base";
import { customTheme } from '@/styles/theme';
import { AuthProvider, useAuth } from '@/providers/AuthContext'; // Only import provider here
import { ActivityIndicator } from 'react-native';

export default function RootLayout() {
    return (
        <Provider store={store}>
            <NativeBaseProvider theme={customTheme}>
                <GestureHandlerRootView style={{ flex: 1 }}>
                    <PomodoroProvider>
                        <BottomSheetProvider>
                            <Background>
                                <AuthProvider>
                                    <AuthLayout />
                                    <StatusBar
                                        backgroundColor="transparent"
                                        barStyle="light-content"
                                        translucent
                                    />
                                </AuthProvider>
                            </Background>
                        </BottomSheetProvider>
                    </PomodoroProvider>
                </GestureHandlerRootView>
            </NativeBaseProvider>
        </Provider>
    );
}

function AuthLayout() {
    const { user, initialized } = useAuth();

    if (!initialized) {
        return (
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return <Slot />;
}