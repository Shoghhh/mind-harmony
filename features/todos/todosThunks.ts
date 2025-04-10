import {
  fetchTodosStart,
  fetchTodosSuccess,
  fetchTodosFailure,
  addTodoStart,
  addTodoSuccess,
  addTodoFailure,
  updateTodoStart,
  updateTodoSuccess,
  updateTodoFailure,
  deleteTodoStart,
  deleteTodoSuccess,
  deleteTodoFailure,
  toggleTodoCompletion,
} from './todosSlice';
import { Todo } from '../../types';
import { AppThunk } from '@/store/store';
import { addTodoToFirestore, updateTodoInFirestore, deleteTodoFromFirestore, fetchTodosFromFirestore } from '@/firebase/todoService';

export const fetchTodos = (): AppThunk => async (dispatch, getState) => {

  dispatch(fetchTodosStart());
  try {
    const todos = await fetchTodosFromFirestore();
    dispatch(fetchTodosSuccess(todos));
  } catch (error: unknown) {
    if (error instanceof Error) {
      dispatch(fetchTodosFailure(error.message));
    } else {
      dispatch(fetchTodosFailure('An unknown error occurred'));
    }
  }
};

// Add a Todo
export const addTodo = (todo: Todo): AppThunk => async (dispatch) => {
  dispatch(addTodoStart());
  try {
    const newTodo = await addTodoToFirestore(todo);
    dispatch(addTodoSuccess(newTodo));
  } catch (error: unknown) {
    if (error instanceof Error) {
      dispatch(addTodoFailure(error.message));
    } else {
      dispatch(addTodoFailure('An unknown error occurred'));
    }
  }
};

// Update a Todo
export const updateTodo = (id: string, updatedTodo: Todo): AppThunk => async (dispatch) => {
  dispatch(updateTodoStart());
  try {
    const updated = await updateTodoInFirestore(id, updatedTodo);
    dispatch(updateTodoSuccess(updated));
  } catch (error: unknown) {
    if (error instanceof Error) {
      dispatch(updateTodoFailure(error.message));
    } else {
      dispatch(updateTodoFailure('An unknown error occurred'));
    }
  }
};

// Delete a Todo
export const deleteTodo = (id: string): AppThunk => async (dispatch) => {
  dispatch(deleteTodoStart());
  try {
    await deleteTodoFromFirestore(id);
    dispatch(deleteTodoSuccess(id));
  } catch (error: unknown) {
    if (error instanceof Error) {
      dispatch(deleteTodoFailure(error.message));
    } else {
      dispatch(deleteTodoFailure('An unknown error occurred'));
    }
  }
};

export const toggleTodoCompletionAsync = (id: string): AppThunk => async (dispatch, getState) => {
  const currentTodo = getState().todos.todos.find((todo: Todo) => todo.id === id);
  if (!currentTodo) {
    console.error("Todo not found.");
    return;
  }
  const newCompletionStatus = !currentTodo.completed;  // Toggle the completion state

  try {
    dispatch(toggleTodoCompletion(id));
    const updatedTodo = await updateTodoInFirestore(id, { completed: newCompletionStatus });
    dispatch(updateTodoSuccess(updatedTodo));
  } catch (error) {
    dispatch(toggleTodoCompletion(id));
    console.error("Error toggling todo completion:", error);
  }
};