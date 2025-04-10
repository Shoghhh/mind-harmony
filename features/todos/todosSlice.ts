import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Todo } from '../../types';

interface TodosState {
  todos: Todo[];
  loading: boolean;
  error: string | null;
}

const initialState: TodosState = {
  todos: [
    { id: '1', title: 'To do 1', createdAt: '2024-12-29T08:29:33.401Z', assignedDate: '2024-08-16T10:29:33.401Z', completed: false, priority: 0, description: 'Lorem ipsum...', timeSpent: 0, completedDate: null },
    { id: '2', title: 'To do 2', createdAt: '2024-12-30T08:29:33.401Z', assignedDate: '2025-01-13T10:29:33.401Z', completed: true, completedDate: '2024-12-29T08:29:33.401Z', priority: 1, description: 'Lorem ipsum Lorem ipsum', timeSpent: 0 },
    { id: '3', title: 'To do 3', createdAt: '2024-12-28T08:29:33.391Z', assignedDate: '2025-01-14T10:29:33.401Z', completed: false, priority: 2, description: 'Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum vLorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum', timeSpent: 0, completedDate: null },
    { id: '4', title: 'To do 4', createdAt: '2024-12-28T02:29:33.401Z', assignedDate: '2025-01-15T10:29:33.401Z', completed: true, completedDate: '2025-01-01T08:29:33.401Z', priority: 1, description: 'Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum vLorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum', timeSpent: 0 },
    { id: '5', title: 'To do 5', createdAt: '2024-12-28T10:29:33.401Z', assignedDate: '2025-01-16T10:29:33.401Z', completed: false, priority: 0, description: 'Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum vLorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum', timeSpent: 0, completedDate: null },
    { id: '6', title: 'To do 6 isfdjnisfn', createdAt: '2025-01-07T02:29:33.401Z', assignedDate: '2025-02-01T10:29:33.401Z', completed: true, completedDate: '2025-01-01T08:29:33.401Z', priority: 1, description: '', timeSpent: 545 },
    { id: '7', title: 'To do 7', createdAt: '2025-01-08T10:29:33.401Z', assignedDate: '2025-02-05T10:29:33.401Z', completed: false, priority: 0, description: 'Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum vLorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum', timeSpent: 0, completedDate: null },
    { id: '8', title: 'To do 8', createdAt: '2025-01-08T10:28:33.401Z', assignedDate: '2025-02-05T10:29:33.401Z', completed: false, priority: 0, description: 'Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum vLorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum', timeSpent: 0, completedDate: null },
    { id: '9', title: 'To do 9', createdAt: '2025-01-08T10:30:33.401Z', assignedDate: '2025-02-05T10:29:33.401Z', completed: false, priority: 0, description: 'Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum vLorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum', timeSpent: 0, completedDate: null },
    { id: '10', title: 'To do 10', createdAt: '2025-01-08T10:29:33.401Z', assignedDate: '2025-02-05T10:29:33.401Z', completed: false, priority: 0, description: 'Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum vLorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum', timeSpent: 0, completedDate: null },
    { id: '11', title: 'To do 11', createdAt: '2025-01-08T10:29:33.401Z', assignedDate: '2025-02-05T10:29:33.401Z', completed: false, priority: 2, description: 'Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum vLorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum', timeSpent: 0, completedDate: null },
  ],
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
