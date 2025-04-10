import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Todo } from '../../types';

interface TodosState {
  todos: Todo[];
  loading: boolean;
  error: string | null;
}

const initialState: TodosState = {
  todos: [],
  loading: false,
  error: null,
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
      state.loading = true;
      state.error = null;
    },
    updateTodoSuccess(state, action: PayloadAction<Todo>) {
      state.loading = false;
      const index = state.todos.findIndex((todo) => todo.id === action.payload.id);
      if (index !== -1) {
        state.todos[index] = action.payload;
      }
    },
    updateTodoFailure(state, action: PayloadAction<string>) {
      state.loading = false;
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
      state.loading = true;
      state.error = null;
    },
    deleteTodoSuccess(state, action: PayloadAction<string>) {
      state.loading = false;
      state.todos = state.todos.filter((todo) => todo.id !== action.payload);
    },
    deleteTodoFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    updateTodoList(state, action: PayloadAction<Todo[]>) {
      state.todos = action.payload;
    },
    toggleTodoCompletion(state, action: PayloadAction<string>) {
      const index = state.todos.findIndex((todo) => todo.id === action.payload);
      if (index !== -1) {
        const todo = state.todos[index];
        const wasCompleted = todo.completed;
        state.todos[index] = {
          ...todo,
          completed: !wasCompleted,
          completedDate: wasCompleted ? null : new Date().toISOString()
        };
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
  updateTodoList,
  toggleTodoCompletion
} = todosSlice.actions;

export default todosSlice.reducer;
