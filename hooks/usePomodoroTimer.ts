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
    autoStart: boolean;
    autoSwitch: boolean;
    onModeTransition: () => void;
}

export function usePomodoroTimer({
    pomodoroTime,
    shortRestTime,
    longRestTime,
    cyclesBeforeLongRest,
    autoStart,
    autoSwitch,
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
    const autoStartTimeoutRef = useRef<NodeJS.Timeout>();

    useEffect(() => {
        return () => {
            if (autoStartTimeoutRef.current) {
                clearTimeout(autoStartTimeoutRef.current);
            }
        };
    }, []);

    useEffect(() => {
        setState(prev => {
            if (!prev.isActive) {
                return {
                    ...prev,
                    time: getTimeForMode(prev.mode)
                };
            }
            return prev;
        });
    }, [pomodoroTime, shortRestTime, longRestTime]);

    const getTimeForMode = useCallback((mode: TimerMode) => {
        return mode === "pomodoro" ? pomodoroTime :
            mode === "shortRest" ? shortRestTime :
                longRestTime;
    }, [pomodoroTime, shortRestTime, longRestTime]);

    const handleModeTransition = useCallback((prev: TimerState, isManualAction = false): TimerState => {
        onModeTransition();
        
        if (autoStartTimeoutRef.current) {
            clearTimeout(autoStartTimeoutRef.current);
        }
    
        if (!autoSwitch && !isManualAction) {
            return {
                ...prev,
                time: getTimeForMode(prev.mode),
                isActive: false,
                lastUpdate: Date.now()
            };
        }
    
        let nextState: TimerState;
        
        if (prev.mode === "pomodoro") {
            const isLongRest = prev.cycles % cyclesBeforeLongRest === 0;
            nextState = {
                ...prev,
                mode: isLongRest ? "longRest" : "shortRest",
                time: isLongRest ? longRestTime : shortRestTime,
                cycles: prev.cycles,
                lastUpdate: Date.now(),
                isActive: false
            };
        } else {
            nextState = {
                ...prev,
                mode: "pomodoro",
                time: pomodoroTime,
                cycles: prev.cycles + 1,
                lastUpdate: Date.now(),
                isActive: false
            };
        }
    
        if (autoStart && (autoSwitch || isManualAction)) {
            nextState.isActive = true;
        }
    
        return nextState;
    }, [
        pomodoroTime,
        shortRestTime,
        longRestTime,
        cyclesBeforeLongRest,
        onModeTransition,
        autoStart,
        autoSwitch
    ]);

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

    useEffect(() => {
        if (state.isActive && state.mode === "pomodoro") {
            const interval = setInterval(() => {
                accumulatedTimeRef.current += 1;
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [state.isActive, state.mode]);

    const startTimer = useCallback(() => {
        if (autoStartTimeoutRef.current) {
            clearTimeout(autoStartTimeoutRef.current);
        }
        setState(prev => ({ ...prev, isActive: true, lastUpdate: Date.now() }));
    }, []);

    const stopTimer = useCallback(() => {
        if (autoStartTimeoutRef.current) {
            clearTimeout(autoStartTimeoutRef.current);
        }
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
        accumulatedTimeRef.current = 0;
    }, [stopTimer, pomodoroTime]);

    const skipTimer = useCallback(() => {
        setState(prev => handleModeTransition(prev, true));
    }, [handleModeTransition]);

    const getAccumulatedTime = () => accumulatedTimeRef.current;

    const handleTodoSelection = useCallback((newTodo: Todo) => {
        if (state.isActive && state.mode === "pomodoro" && selectedTodoId !== null) {
            dispatch(updateTodoTimeSpent({
                id: selectedTodoId,
                timeSpent: getAccumulatedTime()
            }));
        }

        resetTimer();
        accumulatedTimeRef.current = 0;
        setSelectedTodoId(newTodo.id);
    }, [state.isActive, state.mode, selectedTodoId, resetTimer, dispatch]);

    const changeMode = useCallback((mode: TimerMode) => {
        if (state.isActive) return;

        setState(prev => ({
            ...prev,
            mode,
            time: getTimeForMode(mode),
            isActive: autoStart 
        }));
    }, [state.isActive, getTimeForMode, autoStart]);

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
        accumulatedTimeRef.current = 0;

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