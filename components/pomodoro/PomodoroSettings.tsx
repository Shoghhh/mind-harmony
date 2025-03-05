import { BottomSheetTextInput, BottomSheetView, TouchableWithoutFeedback, useBottomSheetInternal, useBottomSheetModalInternal } from "@gorhom/bottom-sheet";
import { useCallback, useEffect } from "react";
import { KeyboardAvoidingView, NativeSyntheticEvent, ScrollView, StyleSheet, Text, TextInput, TextInputFocusEventData, View } from "react-native";

type SettingsProps = {
    pomodoroTime: any;
    setPomodoroTime: any;
    shortRestTime: number;
    setShortRestTime: (value: number) => void;
    longRestTime: number;
    setLongRestTime: (value: number) => void;
    cyclesBeforeLongRest: number;
    setCyclesBeforeLongRest: (value: number) => void;
};


export default function SettingsComponent({ pomodoroTime, setPomodoroTime, shortRestTime, setShortRestTime, longRestTime, setLongRestTime, cyclesBeforeLongRest, setCyclesBeforeLongRest }: SettingsProps) {


    return <BottomSheetView>
        {/* <View style={styles.settingsContainer}> */}
        {/* <Text style={styles.settingsText}>Pomodoro Time (min):</Text>
            <TextInput/> */}
        {/* <KeyboardAvoidingView> */}

        {/* <TextInput
                keyboardType="numeric"
                style={styles.input}
                value={pomodoroTime}
                onChangeText={(text) => setPomodoroTime(text)}
            /> */}


        {/* </KeyboardAvoidingView> */}
        <Text style={styles.settingsText}>Short Rest Time (min):</Text>
        <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={shortRestTime !== null ? String(shortRestTime) : ""}
            onChangeText={(text) => {
                const parsedValue = parseInt(text);
                if (text === "" || parsedValue >= 1) {
                    setShortRestTime(parsedValue);
                }
            }}
        />

        <Text style={styles.settingsText}>Long Rest Time (min):</Text>
        <BottomSheetTextInput
            style={styles.input}
            keyboardType="numeric"
            value={longRestTime !== null ? String(longRestTime) : ""}
            onChangeText={(text) => {
                const parsedValue = parseInt(text);
                if (text === "" || parsedValue >= 1) {
                    setLongRestTime(parsedValue);
                }
            }}
        />




        <Text style={styles.settingsText}>Cycles Before Long Rest:</Text>
        <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={cyclesBeforeLongRest !== null ? String(cyclesBeforeLongRest) : ""}
            onChangeText={(text) => {
                const parsedValue = parseInt(text);
                if (text === "" || parsedValue >= 1) {
                    setCyclesBeforeLongRest(parsedValue);
                }
            }}
        />
        {/* </View> */}
    </BottomSheetView>
}


const styles = StyleSheet.create({
    settingsContainer: {
        marginTop: 30,
        width: '80%',
        // alignItems: 'center'
    },
    settingsText: {
        fontSize: 18,
        marginBottom: 5,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
        fontSize: 18,
    },
})