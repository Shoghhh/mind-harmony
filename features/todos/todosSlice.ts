import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Todo } from '../../types';
import { Timestamp } from 'firebase/firestore';

interface TodosState {
  todos: Todo[];
  loading: boolean;
  error: string | null;
  updateLoading: boolean
  deleteLoading: boolean;
}

const initialState: TodosState = {
  todos: [],
  loading: false,
  error: null,
  updateLoading: false,
  deleteLoading: false
};

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    fetchTodosStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchTodosSuccess(state, action: PayloadAction<Todo[]>) {
      state.loading = false;
      state.todos = action.payload;
    },
    fetchTodosFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    addTodoStart(state) {
      state.loading = true;
      state.error = null;
    },
    addTodoSuccess(state, action: PayloadAction<Todo>) {
      state.loading = false;
      state.todos.push(action.payload);
    },
    addTodoFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    updateTodoStart(state) {
      state.updateLoading = true;
      state.error = null;
    },
    updateTodoSuccess(state, action: PayloadAction<Todo>) {
      state.updateLoading = false;
      const index = state.todos.findIndex((todo) => todo.id === action.payload.id);
      if (index !== -1) {
        state.todos[index] = action.payload;
      }
    },
    updateTodoFailure(state, action: PayloadAction<string>) {
      state.updateLoading = false;
      state.error = action.payload;
    },
    updateTodoTimeSpent(state, action: PayloadAction<any, any>) {
      const index = state.todos.findIndex((todo) => todo.id === action.payload.id);
      console.log(action.payload.timeSpent, action.payload.id)
      if (index !== -1) {
        state.todos[index].timeSpent += action.payload.timeSpent;
      }
    },
    deleteTodoStart(state) {
      state.deleteLoading = true;
      state.error = null;
    },
    deleteTodoSuccess(state, action: PayloadAction<string>) {
      state.deleteLoading = false;
      state.todos = state.todos.filter((todo) => todo.id !== action.payload);
    },
    deleteTodoFailure(state, action: PayloadAction<string>) {
      state.deleteLoading = false;
      state.error = action.payload;
    },
    toggleTodoCompletion(state, action: PayloadAction<{ id: string, completedDate: Timestamp | null, completed: boolean }>) {
      const index = state.todos.findIndex((todo) => todo.id === action.payload.id);
      if (index !== -1) {
        const todo = state.todos[index];
        state.todos[index] = {
          ...todo,
          completed: action.payload.completed,
          completedDate: action.payload.completedDate
        };
        state.updateLoading = false
      }
    },
  },
});

export const {
  fetchTodosStart,
  fetchTodosSuccess,
  fetchTodosFailure,
  addTodoStart,
  addTodoSuccess,
  addTodoFailure,
  updateTodoStart,
  updateTodoSuccess,
  updateTodoFailure,
  updateTodoTimeSpent,
  deleteTodoStart,
  deleteTodoSuccess,
  deleteTodoFailure,
  toggleTodoCompletion
} = todosSlice.actions;

export default todosSlice.reducer;
