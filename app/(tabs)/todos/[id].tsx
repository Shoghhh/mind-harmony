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

    if (todoId === undefined || isNaN(todoId)) {
        return <Text>Invalid Todo ID</Text>;
    }

    const todo = useSelector((state: RootState) =>
        state.todos.todos.find((item) => item.id === todoId)
    );

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
        <View style={styles.container}>
            <View style={styles.todoDetails}>
                <Text style={[globalTextStyles.medium14PrimaryDark, styles.detailLabel]}>
                    Created:
                </Text>
                <Text style={styles.detailValue}>
                    {moment(todo.createdDate).format('YYYY-MM-DD HH:mm')}
                </Text>

                <Text style={[globalTextStyles.medium14PrimaryDark, styles.detailLabel]}>
                    Assigned:
                </Text>
                <Text style={styles.detailValue}>
                    {moment(todo.assignedDate).format('YYYY-MM-DD HH:mm')}
                </Text>

                {todo.completedDate && (
                    <>
                        <Text style={[globalTextStyles.medium14PrimaryDark, styles.detailLabel]}>
                            Completed:
                        </Text>
                        <Text style={styles.detailValue}>
                            {moment(todo.completedDate).format('YYYY-MM-DD HH:mm')}
                        </Text>
                    </>
                )}

                <Text style={[globalTextStyles.medium14PrimaryDark, styles.detailLabel]}>
                    Priority:
                </Text>
                <Text style={styles.detailValue}>
                    {Priority[todo.priority]}
                </Text>

                <Text style={[globalTextStyles.medium14PrimaryDark, styles.detailLabel]}>
                    Description:
                </Text>
                <Text style={styles.detailValue}>
                    {todo.description}
                </Text>
            </View>

            <View style={styles.actions}>
                <TouchableOpacity
                    onPress={handleToggleComplete}
                    style={[styles.button, todo.completed && styles.completedButton]}
                >
                    <Text style={styles.buttonText}>
                        {todo.completed ? 'Mark as Incomplete' : 'Mark as Complete'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleDelete} style={[styles.button, styles.deleteButton]}>
                    <Text style={styles.buttonText}>Delete Todo</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: colors.background,
    },
    todoDetails: {
        marginBottom: 30,
    },
    detailLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.primary,
        marginBottom: 5,
    },
    detailValue: {
        fontSize: 16,
        color: colors.primaryDark,
        marginBottom: 15,
    },
    actions: {
        marginTop: 20,
    },
    button: {
        backgroundColor: colors.secondary,
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        alignItems: 'center',
    },
    completedButton: {
        backgroundColor: 'green',
    },
    deleteButton: {
        backgroundColor: colors.warning,
    },
    buttonText: {
        color: colors.white,
        fontSize: 16,
    },
});