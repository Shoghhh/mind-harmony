import { DurationOption, ProgressStyle, SoundOption } from "@/components/pomodoro/PomodoroSettings";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface PomodoroContextType {
  pomodoroTime: number;
  setPomodoroTime: (time: number) => void;
  shortRestTime: number;
  setShortRestTime: (time: number) => void;
  longRestTime: number;
  setLongRestTime: (time: number) => void;
  cyclesBeforeLongRest: number;
  setCyclesBeforeLongRest: (cycles: number) => void;
  selectedTodoId: string | null;
  setSelectedTodoId: (id: string | null) => void;
  alarmVolume: number;
  setAlarmVolume: (volume: number) => void;
  alarmSound: SoundOption;
  setAlarmSound: (sound: SoundOption) => void;
  alarmDuration: DurationOption;
  setAlarmDuration: (duration: DurationOption) => void;
  vibration: boolean;
  setVibration: (vibration: boolean) => void;
  progressStyle: ProgressStyle;
  setProgressStyle: (style: ProgressStyle) => void;
  autoStart: boolean;
  setAutoStart: (value: boolean) => void;
  autoSwitch: boolean;
  setAutoSwitch: (value: boolean) => void;
  defaults: any,
}

const PomodoroContext = createContext<PomodoroContextType | undefined>(undefined);

export const usePomodoro = () => {
  const context = useContext(PomodoroContext);
  if (!context) {
    throw new Error("usePomodoro must be used within a PomodoroProvider");
  }
  return context;
};

export const PomodoroProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [pomodoroTime, setPomodoroTime] = useState(25);
  const [shortRestTime, setShortRestTime] = useState(5);
  const [longRestTime, setLongRestTime] = useState(15);
  const [cyclesBeforeLongRest, setCyclesBeforeLongRest] = useState(4);
  const [selectedTodoId, setSelectedTodoId] = useState<string | null>(null)
  const [alarmVolume, setAlarmVolume] = useState(7);
  const [alarmSound, setAlarmSound] = useState<SoundOption>('bell');
  const [alarmDuration, setAlarmDuration] = useState<DurationOption>('once');
  const [vibration, setVibration] = useState<boolean>(true);
  const [progressStyle, setProgressStyle] = useState<ProgressStyle>('circle');
  const [autoStart, setAutoStart] = useState<boolean>(true)
  const [autoSwitch, setAutoSwitch] = useState<boolean>(true)

  const defaults = {
    focusDuration: 25,
    shortBreak: 5,
    longBreak: 15,
    cycles: 4,
    alarmVolume: 7,
    alarmSound: 'bell' as SoundOption,
    alarmDuration: 'once' as DurationOption,
    vibration: true,
    progressStyle: 'circle' as ProgressStyle,
    autoStart: true,
    autoSwitch: true,
  };

  // Load settings on initial render
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedSettings = await AsyncStorage.getItem('@pomodoroSettings');
        if (savedSettings) {
          const settings = JSON.parse(savedSettings);
          setPomodoroTime(settings.pomodoroTime)
          setShortRestTime(settings.shortRestTime)
          setLongRestTime(settings.longRestTime)
          setCyclesBeforeLongRest(settings.cyclesBeforeLongRest)
          setVibration(settings.vibration)
          setAlarmVolume(settings.alarmVolume)
          setAlarmSound(settings.alarmSound)
          setAlarmDuration(settings.alarmDuration)
          setProgressStyle(settings.progressStyle)
          setAutoStart(settings.autoStart)
          setAutoSwitch(settings.autoSwitch)
        }
      } catch (e) {
        console.error('Failed to load settings', e);
      }
    };
    loadSettings();
  }, []);

  // Save settings when they change
  useEffect(() => {
    const saveSettings = async () => {
      try {
        await AsyncStorage.setItem('@pomodoroSettings', JSON.stringify({
          pomodoroTime,
          shortRestTime,
          longRestTime,
          cyclesBeforeLongRest,
          vibration,
          alarmVolume,
          alarmSound,
          alarmDuration,
          progressStyle,
          autoStart,
          autoSwitch
        }));
      } catch (e) {
        console.error('Failed to save settings', e);
      }
    };
    saveSettings();
  }, [
    pomodoroTime,
    shortRestTime,
    longRestTime,
    cyclesBeforeLongRest,
    vibration,
    alarmSound,
    alarmVolume,
    alarmDuration,
    progressStyle,
    autoStart,
    autoSwitch
  ]);


  return (
    <PomodoroContext.Provider
      value={{
        defaults,
        pomodoroTime,
        setPomodoroTime,
        shortRestTime,
        setShortRestTime,
        longRestTime,
        setLongRestTime,
        cyclesBeforeLongRest,
        setCyclesBeforeLongRest,
        selectedTodoId,
        setSelectedTodoId,
        alarmSound,
        setAlarmSound,
        alarmVolume,
        setAlarmVolume,
        alarmDuration,
        setAlarmDuration,
        vibration,
        setVibration,
        progressStyle,
        setProgressStyle,
        autoStart,
        setAutoStart,
        autoSwitch,
        setAutoSwitch
      }}
    >
      {children}
    </PomodoroContext.Provider>
  );
};
