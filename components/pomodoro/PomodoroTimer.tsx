import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Audio } from 'expo-av';
import BackgroundTimer from 'react-native-background-timer';
import { ProgressBar } from 'react-native-paper'; // Add ProgressBar
import { useBottomSheet } from '@/providers/BottomSheetProvider';
import SettingsComponent from './PomodoroSettings';

const PomodoroTimer = () => {
  const [time, setTime] = useState(5); // Default to 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [cycles, setCycles] = useState(1);

  const [pomodoroTime, setPomodoroTime] = useState<number>(5); // Default 25 minutes
  const [shortRestTime, setShortRestTime] = useState<number>(3); // Default 5 minutes
  const [longRestTime, setLongRestTime] = useState<number>(4); // Default 15 minutes
  const [cyclesBeforeLongRest, setCyclesBeforeLongRest] = useState<number>(4); // Default to 4 cycles

  const intervalId = useRef<number | null>(null);
  const [mode, setMode] = useState("pomodoro");
  const { present, closeSheet, bottomSheetRef } = useBottomSheet();

  const getValidTime = (value: number | null, defaultValue: number) => {
    return value ?? defaultValue;
  };


  const startTimer = () => {
    if (!pomodoroTime || !shortRestTime || !longRestTime || !cyclesBeforeLongRest) {
      return;
    }

    setIsActive(true);

    intervalId.current = BackgroundTimer.setInterval(() => {
      setTime((prevTime) => {
        if (prevTime === 0) {
          setMode((prevMode) => {
            if (prevMode === "pomodoro") {
              setCycles((prevCycles) => {
                const isLongRest = prevCycles % getValidTime(cyclesBeforeLongRest, 4) === 0;

                setTime(isLongRest ? getValidTime(longRestTime, 15) : getValidTime(shortRestTime, 5));
                setMode(isLongRest ? "longRest" : "shortRest");

                return prevCycles;
              });
              return prevMode;
            }

            if (prevMode === "shortRest" || prevMode === "longRest") {
              setTime(getValidTime(pomodoroTime, 25));
              setCycles((prevCycle) => prevCycle + 1)
              return "pomodoro";
            }

            return prevMode;
          });

          return prevTime;
        }

        return prevTime - 1;
      });
    }, 1000);
  };


  const stopTimer = () => {
    if (intervalId.current) {
      BackgroundTimer.clearInterval(intervalId.current);
    }
    setIsActive(false);
  };

  const resetTimer = () => {
    if (intervalId.current) {
      BackgroundTimer.clearInterval(intervalId.current);
    }
    setIsActive(false);
    setMode("pomodoro");
    setCycles(1);
    setTime(getValidTime(pomodoroTime, 25));
  };


  const skipTimer = () => {
    setMode((prevMode) => {
      if (prevMode === "pomodoro") {
        if (cycles % getValidTime(cyclesBeforeLongRest, 4) == 0) {
          // setCycles(1);
          setTime(getValidTime(longRestTime, 15));
          return "longRest";
        } else {
          setTime(getValidTime(shortRestTime, 5));
          return "shortRest";
        }
      } else if (prevMode === "shortRest") {
        setTime(getValidTime(pomodoroTime, 25));
        setCycles((prevCycles) => prevCycles + 1);
        return "pomodoro";
      } else if (prevMode === "longRest") {
        setTime(getValidTime(pomodoroTime, 25));
        setCycles((prevCycles) => prevCycles + 1);
        // setCycles(1);
        return "pomodoro";
      }

      return prevMode;
    });
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  const progress = time / ((mode === "pomodoro" ? (pomodoroTime ?? 25) : mode === "shortRest" ? (shortRestTime ?? 5) : (longRestTime ?? 15)) * 60);

  const openSettingsSheet = () => {
    present(SettingsComponent);
  };
  return (
    <View style={{ flex: 1, }}>

      <ScrollView style={styles.container} contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            onPress={() => { if (!isActive) { setMode("pomodoro"); setTime(getValidTime(pomodoroTime, 25)); } }}
            style={mode === "pomodoro" ? styles.activeTab : styles.tab}
          >
            <Text style={styles.tabText}>Pomodoro</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => { if (!isActive) { setMode("longRest"); setTime(getValidTime(longRestTime, 15)); } }}
            style={mode === "longRest" ? styles.activeTab : styles.tab}
          >
            <Text style={styles.tabText}>Rest</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => { if (!isActive) { setMode("shortRest"); setTime(getValidTime(shortRestTime, 5)); } }}
            style={mode === "shortRest" ? styles.activeTab : styles.tab}
          >
            <Text style={styles.tabText}>Short Rest</Text>
          </TouchableOpacity>
        </View>

        <Text
          style={[
            styles.timerText,
            mode === "pomodoro" ? styles.pomodoroColor :
              mode === "shortRest" ? styles.shortRestColor :
                styles.restColor
          ]}
        >
          {formatTime(time)}
        </Text>


        {/* Progress Bar */}
        {/* <ProgressBar progress={progress} color={isPomodoro ? '#e74c3c' : isShortRest ? '#f39c12' : '#2ecc71'} style={styles.progressBar} /> */}

        {/* Cycle Info */}
        <Text style={styles.cyclesText}>Cycle: #{cycles}</Text>

        {/* Controls */}
        <View style={styles.controls}>
          {!isActive ? (
            <Button title="Start" onPress={startTimer} />
          ) : (
            <Button title="Stop" onPress={stopTimer} />
          )}
          <Button title="Reset" onPress={resetTimer} />
          <Button title="Skip" onPress={skipTimer} />
        </View>
        <TouchableOpacity
          onPress={openSettingsSheet}
        >
          <Text>Open Settings</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#f7f7f7',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tab: {
    padding: 15,
    backgroundColor: '#ddd',
    margin: 5,
    borderRadius: 10,
  },
  activeTab: {
    padding: 15,
    backgroundColor: '#4caf50',
    margin: 5,
    borderRadius: 10,
  },
  tabText: {
    fontSize: 18,
    color: '#fff',
  },
  timerText: {
    fontSize: 48,
    marginVertical: 20,
  },
  pomodoroColor: {
    color: '#e74c3c',
  },
  shortRestColor: {
    color: '#f39c12',
  },
  restColor: {
    color: '#2ecc71',
  },
  progressBar: {
    width: '80%',
    height: 10,
    marginVertical: 10,
  },
  cyclesText: {
    fontSize: 20,
    marginVertical: 10,
  },
  controls: {
    marginTop: 20,
  },

});

export default PomodoroTimer;
