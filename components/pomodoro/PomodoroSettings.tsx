import { usePomodoro } from "@/providers/PomodoroContext";
import { BottomSheetTextInput, BottomSheetView } from "@gorhom/bottom-sheet";
import { StyleSheet, Text } from "react-native";

const SettingsComponent: React.FC = () => {
    const {
        pomodoroTime,
        setPomodoroTime,
        shortRestTime,
        setShortRestTime,
        longRestTime,
        setLongRestTime,
        cyclesBeforeLongRest,
        setCyclesBeforeLongRest,
      } = usePomodoro();
    
    const handleInputChange = (text: string, setter: (value: number) => void) => {
        const parsedValue = parseInt(text, 10);
        if (!isNaN(parsedValue)) {
            setter(parsedValue);
        } else if (text === "") {
            setter(0);
        }
    };

    return (
        <BottomSheetView style={styles.settingsContainer}>
            {/* Pomodoro Time Input */}
            <Text style={styles.settingsText}>Pomodoro Time (min):</Text>
            <BottomSheetTextInput
                style={styles.input}
                keyboardType="numeric"
                value={String(pomodoroTime)}
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

export default SettingsComponent;