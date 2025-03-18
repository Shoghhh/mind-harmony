// components/BottomSheetProvider.tsx
import React, { createContext, useContext, useRef, useCallback, useState, ReactNode } from "react";
import { BottomSheetModal, BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import MyBottomSheet from "@/components/MyBottomSheet";
import { KeyboardAvoidingView, Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

type BottomSheetContextType = {
    present: <T>(component: React.FC<T>, props?: T) => void;
    closeSheet: () => void;
    bottomSheetRef: React.RefObject<BottomSheetModal>;
};

const BottomSheetContext = createContext<BottomSheetContextType | undefined>(undefined);

export const useBottomSheet = () => {
    const context = useContext(BottomSheetContext);
    if (!context) throw new Error("useBottomSheet must be used within a BottomSheetProvider");
    return context;
};

export const BottomSheetProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const [component, setComponent] = useState<React.FC<any> | null>(null);
    const [componentProps, setComponentProps] = useState<any>({});

    const present = useCallback(<T,>(component: React.FC<T>, props?: T) => {
        bottomSheetRef.current?.dismiss();
        setTimeout(() => {
            setComponent(() => component);
            setComponentProps(props);
            bottomSheetRef.current?.present();
        }, 300);
    }, []);

    const closeSheet = useCallback(() => {
        bottomSheetRef.current?.dismiss();
    }, []);

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <BottomSheetContext.Provider value={{ present, closeSheet, bottomSheetRef }}>
                <BottomSheetModalProvider>
                    {children}
                    <MyBottomSheet
                        bottomSheetRef={bottomSheetRef}
                        Component={component}
                        componentProps={componentProps}
                    />
                </BottomSheetModalProvider>
            </BottomSheetContext.Provider>
        </GestureHandlerRootView>
    );
};