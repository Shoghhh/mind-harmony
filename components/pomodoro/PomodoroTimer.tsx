import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Audio } from 'expo-av';
import BackgroundTimer from 'react-native-background-timer';
import { useBottomSheet } from '@/providers/BottomSheetProvider';
import SettingsComponent from './PomodoroSettings';
import { usePomodoro } from '@/providers/PomodoroContext';

const PomodoroTimer = () => {
  const [time, setTime] = useState(5);
  const [isActive, setIsActive] = useState(false);
  const [cycles, setCycles] = useState(1);

  const {
    pomodoroTime,
    shortRestTime,
    longRestTime,
    cyclesBeforeLongRest,
  } = usePomodoro();

  const intervalId = useRef<number | null>(null);
  const [mode, setMode] = useState("pomodoro");
  const { present, closeSheet, bottomSheetRef } = useBottomSheet();

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
                const isLongRest = prevCycles % cyclesBeforeLongRest === 0;

                setTime(isLongRest ? longRestTime : shortRestTime);
                setMode(isLongRest ? "longRest" : "shortRest");

                return prevCycles;
              });
              return prevMode;
            }

            if (prevMode === "shortRest" || prevMode === "longRest") {
              setTime(pomodoroTime);
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
    setTime(pomodoroTime);
  };

  const skipTimer = () => {
    setMode((prevMode) => {
      if (prevMode === "pomodoro") {
        if (cycles % cyclesBeforeLongRest == 0) {
          // setCycles(1);
          setTime(longRestTime);
          return "longRest";
        } else {
          setTime(shortRestTime);
          return "shortRest";
        }
      } else if (prevMode === "shortRest") {
        setTime(pomodoroTime);
        setCycles((prevCycles) => prevCycles + 1);
        return "pomodoro";
      } else if (prevMode === "longRest") {
        setTime(pomodoroTime);
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

  // const progress = time / ((mode === "pomodoro" ? (pomodoroTime ?? 25) : mode === "shortRest" ? (shortRestTime ?? 5) : (longRestTime ?? 15)) * 60);

  const openSettingsSheet = () => {
    present(SettingsComponent);
  };
  return (
    <View style={{ flex: 1, }}>

      <ScrollView style={styles.container} contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            onPress={() => { if (!isActive) { setMode("pomodoro"); setTime(pomodoroTime); } }}
            style={mode === "pomodoro" ? styles.activeTab : styles.tab}
          >
            <Text style={styles.tabText}>Pomodoro</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => { if (!isActive) { setMode("longRest"); setTime(longRestTime); } }}
            style={mode === "longRest" ? styles.activeTab : styles.tab}
          >
            <Text style={styles.tabText}>Rest</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => { if (!isActive) { setMode("shortRest"); setTime(shortRestTime); } }}
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
