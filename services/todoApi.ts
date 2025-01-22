import { Todo } from "@/types";
import { fetchHelper } from "./fetchHelper";

export const fetchTodosApi = (): Promise<Todo[]> => fetchHelper<Todo[]>('/todos');

export const addTodoApi = (todo: Omit<Todo, 'id'>): Promise<Todo> =>
  fetchHelper<Todo>('/todos', 'POST', todo);

export const updateTodoApi = (id: number, updatedTodo: Partial<Todo>): Promise<Todo> =>
  fetchHelper<Todo>(`/todos/${updatedTodo.id}`, 'PUT', updatedTodo);

export const deleteTodoApi = (id: number): Promise<void> =>
  fetchHelper<void>(`/todos/${id}`, 'DELETE');
