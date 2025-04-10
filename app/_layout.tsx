import '../global.css';
import store, { RootState } from "@/store/store";
import { Slot } from "expo-router";
import { StatusBar, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";
import { BottomSheetProvider } from "@/providers/BottomSheetProvider";
import { PomodoroProvider } from "@/providers/PomodoroContext";
import Background from "@/providers/Background";
import { NativeBaseProvider } from "native-base";
import { customTheme } from '@/styles/theme';
import AuthListener from '@/providers/AuthListener';
import { ActivityIndicator } from 'react-native';
import { ToastProvider } from '@/providers/ToastProvider';
import { useSelector } from 'react-redux';

export default function RootLayout() {
    return (
        <Provider store={store}>
            <NativeBaseProvider theme={customTheme}>
                <ToastProvider>
                    <GestureHandlerRootView style={{ flex: 1 }}>
                        <PomodoroProvider>
                            <BottomSheetProvider>
                                <Background>
                                    <AuthListener />
                                    <ReduxAuthLayout />
                                    <StatusBar
                                        backgroundColor="transparent"
                                        barStyle="light-content"
                                        translucent
                                    />
                                </Background>
                            </BottomSheetProvider>
                        </PomodoroProvider>
                    </GestureHandlerRootView>
                </ToastProvider>
            </NativeBaseProvider>
        </Provider>
    );
}

function ReduxAuthLayout() {
    const { initialized } = useSelector((state: RootState) => state.auth);

    if (!initialized) {
        return (
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return <Slot />;
}