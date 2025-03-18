import React, { createContext, useContext, useState, ReactNode } from "react";

interface SettingsContextType {
  pomodoroTime: number;
  setPomodoroTime: (time: number) => void;
  shortRestTime: number;
  setShortRestTime: (time: number) => void;
  longRestTime: number;
  setLongRestTime: (time: number) => void;
  cyclesBeforeLongRest: number;
  setCyclesBeforeLongRest: (cycles: number) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [pomodoroTime, setPomodoroTime] = useState(25);
  const [shortRestTime, setShortRestTime] = useState(5);
  const [longRestTime, setLongRestTime] = useState(15);
  const [cyclesBeforeLongRest, setCyclesBeforeLongRest] = useState(4);

  return (
    <SettingsContext.Provider
      value={{
        pomodoroTime,
        setPomodoroTime,
        shortRestTime,
        setShortRestTime,
        longRestTime,
        setLongRestTime,
        cyclesBeforeLongRest,
        setCyclesBeforeLongRest,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
