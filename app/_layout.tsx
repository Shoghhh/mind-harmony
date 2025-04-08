import '../global.css';
import store from "@/store/store";
import { Slot } from "expo-router";
import { StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";
import { BottomSheetProvider } from "@/providers/BottomSheetProvider";
import { PomodoroProvider } from "@/providers/PomodoroContext";
import Background from "@/providers/Background";
import { NativeBaseProvider } from "native-base";
import { customTheme } from '@/styles/theme';

export default function RootLayout() {


    return (
        <Provider store={store}>
            <NativeBaseProvider theme={customTheme}>
                <GestureHandlerRootView style={{ flex: 1 }}>
                    <PomodoroProvider>
                        <BottomSheetProvider>
                            <Background>
                                <Slot />
                                <StatusBar
                                    backgroundColor="transparent"
                                    barStyle="light-content"
                                    translucent
                                />
                            </Background>
                        </BottomSheetProvider>
                    </PomodoroProvider>
                </GestureHandlerRootView>
            </NativeBaseProvider>
        </Provider>
    );
}
