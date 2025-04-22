import '../global.css';
import store, { AppDispatch, RootState } from "@/store/store";
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
import colors from '@/styles/colors';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { fetchTodos } from '@/features/todos/todosThunks';
import i18n from '@/i18n';
import { I18nextProvider } from 'react-i18next';

// completed update doesnt update in the firestore +
// call fetch todos somewhere at the beginning +
// todo id while saving +
// add page priority colors +
// toasts +
// implement dashboard +
// user image, name register +
// implement profile +
// translation arm eng
// reset defaults in the bottomsheet pomodoro settings
// move sign out to service +
// check image null +
// wrap withAuthCheck all calls and handle
// logout +
// google sign in  +

export default function RootLayout() {
    return (
        <Provider store={store}>
            <I18nextProvider i18n={i18n} defaultNS={'translation'}>
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
            </I18nextProvider>
        </Provider>
    );
}

function ReduxAuthLayout() {
    const { initialized, user } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        if (initialized && user) {
            dispatch(fetchTodos());
        }
    }, [initialized, user, dispatch]);

    if (!initialized) {
        return (
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <ActivityIndicator size="large" color={colors.primary[600]} />
            </View>
        );
    }

    return <Slot />;
}