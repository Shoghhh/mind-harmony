import { toggleTodoCompletion, updateTodoTimeSpent } from '@/features/todos/todosSlice';
import { AppDispatch } from '@/store/store';
import { Todo } from '@/types';
import { Toast } from 'native-base';
import { useState, useEffect, useCallback, useRef } from 'react';

type TimerMode = "pomodoro" | "shortRest" | "longRest";

interface TimerState {
    time: number;
    isActive: boolean;
    cycles: number;
    mode: TimerMode;
    lastUpdate: number;
}

interface UsePomodoroTimerParams {
    pomodoroTime: number;
    shortRestTime: number;
    longRestTime: number;
    cyclesBeforeLongRest: number;
    onModeTransition: () => void;
}

export function usePomodoroTimer({
    pomodoroTime,
    shortRestTime,
    longRestTime,
    cyclesBeforeLongRest,
    onModeTransition,
    selectedTodoId,
    setSelectedTodoId,
    dispatch
}: UsePomodoroTimerParams & {
    selectedTodoId: number | null;
    setSelectedTodoId: (id: number | null) => void;
    dispatch: AppDispatch;
}) {
    const [state, setState] = useState<TimerState>({
        time: pomodoroTime,
        isActive: false,
        cycles: 1,
        mode: "pomodoro",
        lastUpdate: Date.now(),
    });
    const accumulatedTimeRef = useRef(0);
    const handleModeTransition = useCallback((prev: TimerState): TimerState => {
        onModeTransition();

        if (prev.mode === "pomodoro") {
            const isLongRest = prev.cycles % cyclesBeforeLongRest === 0;
            return {
                ...prev,
                mode: isLongRest ? "longRest" : "shortRest",
                time: isLongRest ? longRestTime : shortRestTime,
                lastUpdate: Date.now()
            };
        }

        return {
            ...prev,
            mode: "pomodoro",
            time: pomodoroTime,
            cycles: prev.cycles + 1,
            lastUpdate: Date.now()
        };
    }, [pomodoroTime, shortRestTime, longRestTime, cyclesBeforeLongRest, onModeTransition]);

    // Timer countdown logic
    useEffect(() => {
        if (!state.isActive) return;

        const interval = setInterval(() => {
            setState(prev => {
                const now = Date.now();
                const elapsedSeconds = Math.floor((now - prev.lastUpdate) / 1000);
                const newTime = prev.time - elapsedSeconds;

                return newTime <= 0 ? handleModeTransition(prev) : {
                    ...prev,
                    time: newTime,
                    lastUpdate: now
                };
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [state.isActive, handleModeTransition]);

    const startTimer = useCallback(() => {
        setState(prev => ({ ...prev, isActive: true, lastUpdate: Date.now() }));
    }, []);

    const stopTimer = useCallback(() => {
        setState(prev => ({ ...prev, isActive: false }));
    }, []);

    const resetTimer = useCallback(() => {
        stopTimer();
        setState({
            time: pomodoroTime,
            isActive: false,
            cycles: 1,
            mode: "pomodoro",
            lastUpdate: Date.now(),
        });
    }, [stopTimer, pomodoroTime]);

    const skipTimer = useCallback(() => {
        setState(prev => handleModeTransition(prev));
    }, [handleModeTransition]);

    useEffect(() => {
        if (state.isActive && state.mode === "pomodoro") {
            const interval = setInterval(() => {
                accumulatedTimeRef.current += 1;
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [state.isActive, state.mode]);

    const getAccumulatedTime = () => accumulatedTimeRef.current;

    const handleTodoSelection = useCallback((newTodo: Todo) => {
        if (state.isActive && state.mode === "pomodoro" && selectedTodoId !== null) {
            dispatch(updateTodoTimeSpent({
                id: selectedTodoId,
                timeSpent: getAccumulatedTime()
            }));
        }

        resetTimer();
    }, [state.isActive, state.mode, selectedTodoId, stopTimer]);

    const changeMode = useCallback((mode: TimerMode) => {
        if (state.isActive) return;

        setState(prev => ({
            ...prev,
            mode,
            time: mode === "pomodoro" ? pomodoroTime :
                mode === "shortRest" ? shortRestTime :
                    longRestTime
        }));
    }, [state.isActive, pomodoroTime, shortRestTime, longRestTime]);

    const completeCurrentTodo = useCallback(() => {
        if (!selectedTodoId) return;

        dispatch(toggleTodoCompletion(selectedTodoId));

        stopTimer();
        setState({
            time: pomodoroTime,
            isActive: false,
            cycles: 1,
            mode: "pomodoro",
            lastUpdate: Date.now(),
        });

        Toast.show({
            title: "Task Completed!",
            description: "Great work! 🎉",
            duration: 3000
        });

        setSelectedTodoId(null);
    }, [selectedTodoId, stopTimer, pomodoroTime, dispatch]);

    return {
        state,
        startTimer,
        stopTimer,
        resetTimer,
        skipTimer,
        changeMode,
        handleTodoSelection,
        completeCurrentTodo
    };
}