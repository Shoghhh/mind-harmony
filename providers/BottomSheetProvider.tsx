// components/BottomSheetProvider.tsx
import React, { createContext, useContext, useRef, useCallback, useState, ReactNode } from "react";
import { BottomSheetModal, BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import MyBottomSheet from "@/components/MyBottomSheet";
import { KeyboardAvoidingView, Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

type BottomSheetContextType = {
    openSheet: (component: () => ReactNode) => void;
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
    const [component, setComponent] = useState<() => ReactNode>(() => () => null);


    const openSheet = useCallback((component: () => React.ReactNode) => {
        setComponent(() => component);
        if (bottomSheetRef.current) {
            bottomSheetRef.current.expand(); // Force presenting the bottom sheet
            console.log("✅ BottomSheet Presented!");
        } else {
            console.log("❌ BottomSheet Ref is NULL, unable to present");
        }
    }, []);

    const closeSheet = useCallback(() => {
        bottomSheetRef.current?.dismiss();
    }, []);

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <BottomSheetContext.Provider value={{ openSheet, closeSheet, bottomSheetRef }}>
                <BottomSheetModalProvider>
                    {children}
                    <MyBottomSheet bottomSheetRef={bottomSheetRef} component={component} />
                </BottomSheetModalProvider>
            </BottomSheetContext.Provider>
        </GestureHandlerRootView>
    );
};
