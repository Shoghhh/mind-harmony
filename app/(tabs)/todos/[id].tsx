import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import moment from 'moment';
import colors from '@/styles/colors';
import globalTextStyles from '@/styles/globalTextStyles';
import { useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { useDispatch } from 'react-redux';
import { deleteTodo } from '@/features/todos/todosThunks';
import { toggleTodoCompletion } from '@/features/todos/todosSlice';
import { Priority } from '@/utils/constants';

export default function TodoDetail() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const dispatch = useDispatch<AppDispatch>();
    const todoId = typeof id === 'string' ? parseInt(id, 10) : undefined;

    const todo = useSelector((state: RootState) =>
        state.todos.todos.find((item) => item.id === todoId)
    );

    if (todoId === undefined || isNaN(todoId)) {
        return <Text>Invalid Todo ID</Text>;
    }

    if (!todo) {
        return <Text>Todo not found</Text>;
    }

    const handleDelete = () => {
        dispatch(deleteTodo(todoId));
        router.back();
    };

    const handleToggleComplete = () => {
        dispatch(toggleTodoCompletion(todoId));
    };

    return (
        <View>
            <View>
                <Text style={[globalTextStyles.medium14PrimaryDark,]}>
                    Created:
                </Text>
                <Text>
                    {moment(todo.createdDate).format('YYYY-MM-DD HH:mm')}
                </Text>
                <Text style={[globalTextStyles.medium14PrimaryDark,]}>
                    Assigned:
                </Text>
                <Text>
                    {moment(todo.assignedDate).format('YYYY-MM-DD HH:mm')}
                </Text>
                {todo.completedDate && (
                    <>
                        <Text style={[globalTextStyles.medium14PrimaryDark,]}>
                            Completed:
                        </Text>
                        <Text>
                            {moment(todo.completedDate).format('YYYY-MM-DD HH:mm')}
                        </Text>
                    </>
                )}
                <Text style={[globalTextStyles.medium14PrimaryDark,]}>
                    Priority:
                </Text>
                <Text>
                    {Priority[todo.priority]}
                </Text>
                <Text style={[globalTextStyles.medium14PrimaryDark,]}>
                    Description:
                </Text>
                <Text>
                    {todo.description}
                </Text>
            </View>
            <View>
                <TouchableOpacity
                    onPress={handleToggleComplete}
                >
                    <Text>
                        {todo.completed ? 'Mark as Incomplete' : 'Mark as Complete'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleDelete}>
                    <Text>Delete Todo</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};
