import { icons } from '@/assets/icons';
import Dropdown from '@/components/Dropdown';
import TodoItem from '@/components/todos/TodoItem';
import { toggleTodoCompletion, updateTodoList } from '@/features/todos/todosSlice';
import { deleteTodo, fetchTodos } from '@/features/todos/todosThunks';
import { AppDispatch, RootState } from '@/store/store';
import colors from '@/styles/colors';
import globalStyles from '@/styles/globalStyles';
import globalTextStyles from '@/styles/globalTextStyles';
import { Todo } from '@/types';
import { Sort, SortLabels } from '@/utils/constants';
import { useLocalSearchParams, useRouter } from 'expo-router';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Bar } from 'react-native-progress';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

const TodoList = () => {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { date } = useLocalSearchParams();
    const initialDate = Array.isArray(date) ? date[0] : date;
    console.log({initialDate})
    const parsedDate = initialDate ? new Date(initialDate) : new Date();
    const todos = useSelector((state: RootState) => state.todos.todos);
    // const loading = useSelector((state: RootState) => state.todos.loading);
    // const error = useSelector((state: RootState) => state.todos.error);

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [selectedTab, setSelectedTab] = useState<'incomplete' | 'completed'>('incomplete');
    const [completionProgress, setCompletionProgress] = useState<number>(0);
    const [currentDate, setCurrentDate] = useState(parsedDate);
    const [sortOption, setSortOption] = useState(Sort.CreatedDate);
    const sortOptions = [SortLabels[Sort.CreatedDate], SortLabels[Sort.CompletedDate], SortLabels[Sort.Priority]];
    const [isAscending, setIsAscending] = useState(true);
    const [progressBarWidth, setProgressBarWidth] = useState<number>(0);
    const [viewMode, setViewMode] = useState<'list' | 'tabbed'>('list');

    useEffect(() => {
        // dispatch(fetchTodos());
    }, [dispatch]);

    useEffect(() => {
        const totalTodos = groupTodosByDay(todos, currentDate);
        const completedTodos = totalTodos.filter((todo) => todo.completed).length;
        const totalTodosNumber = totalTodos.length;
        setCompletionProgress(totalTodosNumber ? (completedTodos / totalTodosNumber) * 100 : 0);
    }, [todos, currentDate]);

    useEffect(() => {
        sortTodos(sortOption);
    }, [sortOption, isAscending]);

    const groupTodosByDay = (todos: Todo[], date: Date) => {
        return todos.filter((todo) => moment(todo.assignedDate).isSame(date, 'day'));
    };

    const handleLayout = (event: any) => {
        setProgressBarWidth(event.nativeEvent.layout.width);
    };

    const handleDateChange = (date: Date) => {
        setCurrentDate(date)
        setDatePickerVisibility(false);
    };

    const goToPreviousDay = () => {
        setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 1)));
    };

    const goToNextDay = () => {
        setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 1)));
    };

    const sortTodos = (option: number) => {
        const sortedTodos = [...todos];
        const sortFunc = getSortFunction(option);
        sortedTodos.sort(sortFunc);
        dispatch(updateTodoList(sortedTodos));
    };

    const getSortFunction = (option: number) => {
        if (option === 0) {
            return (a: Todo, b: Todo) => (isAscending ? new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime() : new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
        }
        if (option === 1) {
            return (a: Todo, b: Todo) => {
                const aCompletedDate = a.completedDate ? new Date(a.completedDate).getTime() : Infinity;
                const bCompletedDate = b.completedDate ? new Date(b.completedDate).getTime() : Infinity;
                return isAscending ? aCompletedDate - bCompletedDate : bCompletedDate - aCompletedDate;
            };
        }
        return (a: Todo, b: Todo) => (isAscending ? a.priority - b.priority : b.priority - a.priority);
    };


    const handleAdd = () => {
        router.push({
            pathname: '/(tabs)/todos/add',
            params: { date: currentDate.toISOString() },
        })
    }

    const handleDelete = (todoId: number) => {
        dispatch(deleteTodo(todoId));
    };
    const handleToggleComplete = (todoId: number) => {
        dispatch(toggleTodoCompletion(todoId));
    };

    const toggleViewMode = () => {
        setViewMode(viewMode === 'list' ? 'tabbed' : 'list');
    };

    const filteredTodos = selectedTab === 'incomplete' ? todos.filter((todo) => !todo.completed) : todos.filter((todo) => todo.completed);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={globalStyles.rowSpaceBetween}>
                    <TouchableOpacity onPress={goToPreviousDay} style={styles.navButton}>
                        {icons['keyArrowLeft']()}
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.pickDateButton} onPress={() => setDatePickerVisibility(true)}>
                        <Text style={globalTextStyles.medium22PrimaryDark}>{currentDate.toISOString().split('T')[0]}</Text>
                        {icons['calendarCheck']()}
                    </TouchableOpacity>
                    <TouchableOpacity onPress={goToNextDay} style={styles.navButton}>
                        {icons['keyArrowRight']()}
                    </TouchableOpacity>
                </View>

                <View style={globalStyles.rowSpaceBetween} onLayout={handleLayout}>
                    <Bar progress={completionProgress / 100} width={progressBarWidth} height={20} color={completionProgress === 100 ? colors.secondary : colors.secondaryLight} unfilledColor={colors.grayLight} borderRadius={10} />
                    <Text style={styles.progressText}>{Math.round(completionProgress)}%</Text>
                </View>

                <View style={globalStyles.rowSpaceBetween}>
                    <View style={globalStyles.rowStart}>
                        <Dropdown options={sortOptions} selectedOption={sortOption} onSelect={setSortOption} style={{ width: 140, padding: 0 }} />
                        <TouchableOpacity style={styles.toggleButton} onPress={() => setIsAscending(!isAscending)}>
                            {icons[isAscending ? 'asc' : 'desc']()}
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.toggleButton} onPress={toggleViewMode}>
                        {icons[viewMode === 'list' ? 'groupedList' : 'list']()}
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.floatingButton} onPress={handleAdd}>
                        {icons['add']()}
                    </TouchableOpacity>
                </View>
            </View>

            {viewMode === 'tabbed' && (
                <View style={styles.tabContainer}>
                    <TouchableOpacity style={[styles.tabButton, selectedTab === 'incomplete' && styles.activeTab]} onPress={() => setSelectedTab('incomplete')}>
                        <Text style={globalTextStyles.medium14PrimaryDark}>To Do</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.tabButton, selectedTab === 'completed' && styles.activeTab]} onPress={() => setSelectedTab('completed')}>
                        <Text style={globalTextStyles.medium14PrimaryDark}>Completed</Text>
                    </TouchableOpacity>
                </View>
            )}

            <FlatList
                showsVerticalScrollIndicator={false}
                data={groupTodosByDay(viewMode === 'tabbed' ? filteredTodos : todos, currentDate)}
                renderItem={({ item }) => (
                    <TodoItem item={item} onDelete={() => handleDelete(item.id)} viewMode={viewMode} onToggleComplete={() => handleToggleComplete(item.id)} />
                )}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={() => (
                    <View style={styles.emptyContainer}>
                        <Text style={globalTextStyles.regular16GrayDark}>No todos available</Text>
                    </View>
                )}
            />

            <DateTimePickerModal isVisible={isDatePickerVisible} mode="date" date={currentDate} onConfirm={handleDateChange} onCancel={() => setDatePickerVisibility(false)} locale="en_GB" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: colors.background },
    toggleButton: {
        borderColor: colors.secondaryLight,
        borderWidth: 1,
        borderRadius: 10,
        ...globalStyles.columnCenter,
        width: 35,
        height: 35,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
    },
    tabContainer: { ...globalStyles.rowSpaceBetween, marginBottom: 20 },
    tabButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
        flex: 1,
        alignItems: 'center',
        marginHorizontal: 8,
    },
    activeTab: { borderBottomColor: colors.secondaryLight },
    listContainer: { paddingBottom: 80 },
    header: { ...globalStyles.column, gap: 20, marginBottom: 20 },
    navButton: { borderRadius: 5 },
    pickDateButton: {
        borderColor: colors.secondaryLight,
        borderWidth: 1,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 10,
        marginHorizontal: 5,
        ...globalStyles.rowCenter,
        gap: 10,
    },
    emptyContainer: { flex: 1, ...globalStyles.columnCenter },
    progressText: {
        position: 'absolute',
        zIndex: 1,
        left: '50%',
        transform: [{ translateX: -20 }],
        ...globalTextStyles.bold14White,
    },
    floatingButton: {
        backgroundColor: colors.backgroundBtn,
        borderRadius: 50,
        padding: 6,
        elevation: 4,
    },
});

export default TodoList;
