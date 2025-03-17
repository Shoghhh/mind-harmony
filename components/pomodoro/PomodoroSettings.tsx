import { BottomSheetTextInput, BottomSheetView } from "@gorhom/bottom-sheet";
import { useEffect } from "react";
import { StyleSheet, Text } from "react-native";

type SettingsProps = {
    pomodoroTime: number;
    setPomodoroTime: (value: number) => void;
    shortRestTime: number;
    setShortRestTime: (value: number) => void;
    longRestTime: number;
    setLongRestTime: (value: number) => void;
    cyclesBeforeLongRest: number;
    setCyclesBeforeLongRest: (value: number) => void;
};

export default function SettingsComponent({
    pomodoroTime,
    setPomodoroTime,
    shortRestTime,
    setShortRestTime,
    longRestTime,
    setLongRestTime,
    cyclesBeforeLongRest,
    setCyclesBeforeLongRest,
}: SettingsProps) {

    useEffect(() => {
        // Force re-render when state changes
    }, [pomodoroTime, shortRestTime, longRestTime, cyclesBeforeLongRest]);
    const handleInputChange = (text: string, setter: (value: number) => void) => {
        // console.log(text)
        const parsedValue = parseInt(text, 10); // Parse input as integer
        if (!isNaN(parsedValue)) {
            setter(parsedValue); // Update state with parsed value
        } else if (text === "") {
            setter(0); // Set to 0 if input is empty
        }
    };


    return (
        <BottomSheetView style={styles.settingsContainer}>
            {/* Pomodoro Time Input */}
            <Text style={styles.settingsText}>Pomodoro Time (min):</Text>
            <BottomSheetTextInput
                style={styles.input}
                keyboardType="numeric"
                value={String(pomodoroTime)} // Ensure value is always a string
                onChangeText={(text) => handleInputChange(text, setPomodoroTime)}
            />

            {/* Short Rest Time Input */}
            <Text style={styles.settingsText}>Short Rest Time (min):</Text>
            <BottomSheetTextInput
                style={styles.input}
                keyboardType="numeric"
                value={String(shortRestTime)} // Ensure value is always a string
                onChangeText={(text) => handleInputChange(text, setShortRestTime)}
            />

            {/* Long Rest Time Input */}
            <Text style={styles.settingsText}>Long Rest Time (min):</Text>
            <BottomSheetTextInput
                style={styles.input}
                keyboardType="numeric"
                value={String(longRestTime)} // Ensure value is always a string
                onChangeText={(text) => handleInputChange(text, setLongRestTime)}
            />

            {/* Cycles Before Long Rest Input */}
            <Text style={styles.settingsText}>Cycles Before Long Rest:</Text>
            <BottomSheetTextInput
                style={styles.input}
                keyboardType="numeric"
                value={String(cyclesBeforeLongRest)} // Ensure value is always a string
                onChangeText={(text) => handleInputChange(text, setCyclesBeforeLongRest)}
            />
        </BottomSheetView>
    );
}

const styles = StyleSheet.create({
    settingsContainer: {
        padding: 20,
    },
    settingsText: {
        fontSize: 16,
        marginBottom: 5,
        color: "#333",
    },
    input: {
        height: 40,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 20,
        paddingHorizontal: 10,
        fontSize: 16,
        backgroundColor: "#fff",
    },
});