import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import todosReducer from '@/features/todos/todosSlice';
import authReducer from '@/features/auth/authSlice';
import uiReducer from '@/features/uiSlice'

export const store = configureStore({
    reducer: {
        todos: todosReducer,
        ui: uiReducer,
        auth: authReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});
export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = any> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;
