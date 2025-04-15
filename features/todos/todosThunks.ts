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
import { NewTodo, Todo } from '../../types';
import { AppThunk } from '@/store/store';
import { addTodoToFirestore, updateTodoInFirestore, deleteTodoFromFirestore, fetchTodosFromFirestore } from '@/firebase/todoService';
import { Timestamp } from 'firebase/firestore';

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
export const addTodo = (todo: NewTodo): AppThunk => async (dispatch) => {
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
export const updateTodo = (id: string, updatedTodo: NewTodo): AppThunk => async (dispatch) => {
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
  const completionStatus = !currentTodo.completed;
  const completedDate = !completionStatus ? null : Timestamp.now()

  dispatch(updateTodoStart())
  try {
    const updatedTodo = await updateTodoInFirestore(id, { completed: completionStatus, completedDate });
    dispatch(toggleTodoCompletion({ id: updatedTodo.id, completedDate: updatedTodo.completedDate, completed: updatedTodo.completed }));
  } catch (error) {
    dispatch(toggleTodoCompletion({ id, completedDate, completed: false }));
    console.error("Error toggling todo completion:", error);
  }
};