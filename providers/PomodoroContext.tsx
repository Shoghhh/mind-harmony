import { Todo } from "@/types";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface PomodoroContextType {
  pomodoroTime: number;
  setPomodoroTime: (time: number) => void;
  shortRestTime: number;
  setShortRestTime: (time: number) => void;
  longRestTime: number;
  setLongRestTime: (time: number) => void;
  cyclesBeforeLongRest: number;
  setCyclesBeforeLongRest: (cycles: number) => void;
  selectedTodoId: number | null;
  setSelectedTodoId: (id: number | null) => void;
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
  const [selectedTodoId, setSelectedTodoId] = useState<number | null>(null)

  return (
    <PomodoroContext.Provider
      value={{
        pomodoroTime,
        setPomodoroTime,
        shortRestTime,
        setShortRestTime,
        longRestTime,
        setLongRestTime,
        cyclesBeforeLongRest,
        setCyclesBeforeLongRest,
        selectedTodoId,
        setSelectedTodoId
      }}
    >
      {children}
    </PomodoroContext.Provider>
  );
};
