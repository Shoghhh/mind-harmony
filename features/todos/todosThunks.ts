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
import {
  fetchTodosApi,
  addTodoApi,
  updateTodoApi,
  deleteTodoApi,
} from '../../services/todoApi';
import { Todo } from '../../types';
import { AppThunk } from '@/store/store';

// Fetch all Todos
export const fetchTodos = (): AppThunk => async (dispatch) => {
  dispatch(fetchTodosStart());
  try {
    const todos = await fetchTodosApi();
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
    // const newTodo = await addTodoApi(todo);
    dispatch(addTodoSuccess(todo));
  } catch (error: unknown) {
    if (error instanceof Error) {
      dispatch(addTodoFailure(error.message));
    } else {
      dispatch(addTodoFailure('An unknown error occurred'));
    }
  }
};

// Update a Todo
export const updateTodo = (id: number, updatedTodo: Todo): AppThunk => async (dispatch) => {
  dispatch(updateTodoStart());
  try {
    // const updated = await updateTodoApi(id, updatedTodo);
    dispatch(updateTodoSuccess(updatedTodo));
  } catch (error: unknown) {
    if (error instanceof Error) {
      dispatch(updateTodoFailure(error.message));
    } else {
      dispatch(addTodoFailure('An unknown error occurred'));
    }
  }
};

// Delete a Todo
export const deleteTodo = (id: number): AppThunk => async (dispatch) => {
  dispatch(deleteTodoStart());
  try {
    // await deleteTodoApi(id);
    dispatch(deleteTodoSuccess(id));
  } catch (error: unknown) {
    if (error instanceof Error) {
      dispatch(deleteTodoFailure(error.message));
    } else {
      dispatch(addTodoFailure('An unknown error occurred'));
    }
  }
};


export const toggleTodoCompletionAsync = (id: number): AppThunk => async (dispatch, getState) => {
  const currentTodo = getState().todos.todos.find((todo: Todo) => todo.id === id);
  if (!currentTodo) {
    console.error("Todo not found.");
    return;
  }
  const newCompletionStatus = !currentTodo.completed;  // Toggle the completion state

  try {
    dispatch(toggleTodoCompletion(id));
    // const updatedTodo = await updateTodoApi(id, { completed: newCompletionStatus });
    dispatch(updateTodoSuccess({ ...currentTodo, completed: newCompletionStatus }));
  } catch (error) {
    dispatch(toggleTodoCompletion(id));
    // Handle error (show toast, alert, etc.)
    console.error("Error toggling todo completion:", error);
    // Optionally, dispatch a failure action or show a message to the user
  }
};