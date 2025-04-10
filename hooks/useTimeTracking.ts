import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateTodoTimeSpent } from '@/features/todos/todosSlice';

export function useTimeTracking(isActive: boolean, mode: string, todoId?: string) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isActive || mode !== "pomodoro" || !todoId) return;

    let lastTrackedTime = Date.now();
    let accumulatedTime = 0;
    
    const trackingInterval = setInterval(() => {
      const now = Date.now();
      accumulatedTime += Math.floor((now - lastTrackedTime) / 1000);
      lastTrackedTime = now;

      if (accumulatedTime >= 5) {
        dispatch(updateTodoTimeSpent({
          id: todoId,
          timeSpent: accumulatedTime
        }));
        accumulatedTime = 0;
      }
    }, 1000);

    return () => {
      if (accumulatedTime > 0) {
        dispatch(updateTodoTimeSpent({
          id: todoId,
          timeSpent: accumulatedTime
        }));
      }
      clearInterval(trackingInterval);
    };
  }, [isActive, mode, todoId, dispatch]);
}