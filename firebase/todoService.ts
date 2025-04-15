import { Todo } from "@/types";
import { doc, updateDoc, deleteDoc, collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from "@/firebase/firebase";
import { getAuth } from 'firebase/auth';

const getCurrentUserId = (): string => {
    const auth = getAuth();
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error('User not authenticated');
    return userId;
};

const getUserTodosRef = () => {
    const userId = getCurrentUserId();
    return collection(db, 'users', userId, 'todos');
};

export const addTodoToFirestore = async (todo: Omit<Todo, 'id'>): Promise<Todo> => {
    try {
        const todosRef = getUserTodosRef();
        const todoRef = await addDoc(todosRef, todo);
        return { ...todo, id: todoRef.id };
    } catch (error) {
        console.error('Error adding todo:', error);
        throw new Error('Failed to add todo');
    }
};

export const updateTodoInFirestore = async (id: string, updatedTodo: Partial<Todo>): Promise<Todo> => {
    try {
        const userId = getCurrentUserId();
        const todoRef = doc(db, 'users', userId, 'todos', id);
        await updateDoc(todoRef, updatedTodo);
        return { ...updatedTodo, id } as Todo;
    } catch (error) {
        console.error('Error updating todo:', error);
        throw new Error('Failed to update todo');
    }
};

export const deleteTodoFromFirestore = async (id: string): Promise<void> => {
    try {
        const userId = getCurrentUserId();
        const todoRef = doc(db, 'users', userId, 'todos', id);
        await deleteDoc(todoRef);
    } catch (error) {
        console.error('Error deleting todo:', error);
        throw new Error('Failed to delete todo');
    }
};

export const fetchTodosFromFirestore = async (): Promise<Todo[]> => {
    try {
        const todosRef = getUserTodosRef();
        const snapshot = await getDocs(todosRef);
        return snapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id
        }) as Todo);
    } catch (error) {
        console.error('Error fetching todos:', error);
        throw new Error('Failed to fetch todos');
    }
};