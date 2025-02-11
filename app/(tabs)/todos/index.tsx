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
import { Date as myDate, DateLabels, Sort, SortLabels } from '@/utils/constants';
import { useLocalSearchParams, useRouter } from 'expo-router';
import moment from 'moment';
import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import { Bar } from 'react-native-progress';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

export default function TodoList() {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { date } = useLocalSearchParams();
    const initialDate = Array.isArray(date) ? date[0] : date;
    const parsedDate = initialDate ? new Date(initialDate) : new Date()

    const todos = useSelector((state: RootState) => state.todos.todos);
    // const loading = useSelector((state: RootState) => state.todos.loading);
    // const error = useSelector((state: RootState) => state.todos.error);

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [selectedTab, setSelectedTab] = useState<'incomplete' | 'completed'>('incomplete');
    const [completionProgress, setCompletionProgress] = useState<number>(0);
    const [currentDate, setCurrentDate] = useState(parsedDate);
    const [sortOption, setSortOption] = useState(Sort.AssignedDate);
    const [dateOption, setDateOption] = useState(myDate.ByDay);
    const dateOptions = Object.entries(DateLabels).map(([key, label]) => ({
        value: Number(key) as myDate,
        label,
    }))
    const [isAscending, setIsAscending] = useState(true);
    const [progressBarWidth, setProgressBarWidth] = useState<number>(0);
    const [viewMode, setViewMode] = useState<'list' | 'tabbed'>('list');

    const sortOptions = useMemo(() => {
        const options = Object.entries(SortLabels).map(([key, label]) => ({
            value: Number(key) as Sort,
            label,
        }))
        if (dateOption != myDate.ByDay) {
            setSortOption(Sort.AssignedDate)
            return options.filter(el => el.value == Sort.AssignedDate)
        }
        setSortOption(Sort.CreatedDate)
        if (viewMode == 'tabbed') {
            return options.filter(el => el.value != Sort.AssignedDate && el.value != Sort.CompletedDate)
        }

        return options.filter(el => el.value != Sort.AssignedDate)
    }, [dateOption, viewMode]);

    const handleLayout = (event: any) => {
        setProgressBarWidth(event.nativeEvent.layout.width);
    };

    const handleDateChange = (date: Date) => {
        setCurrentDate(date)
        setDatePickerVisibility(false);
    };

    const changeDate = (n: number) => {
        setCurrentDate((prev) => {
            const newDate = new Date(prev);
            if (dateOption === myDate.ByDay) {
                newDate.setDate(newDate.getDate() + n);
            } else if (dateOption === myDate.ByMonth) {
                newDate.setMonth(newDate.getMonth() + n);
            } else if (dateOption === myDate.ByYear) {
                newDate.setFullYear(newDate.getFullYear() + n);
            }
            return newDate;
        });
    };

    const getSortFunction = (sortOption?: number) => {
        switch (sortOption) {
            case Sort.CreatedDate:
                return (a: Todo, b: Todo) => (isAscending ? new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime() : new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
            case Sort.CompletedDate:
                return (a: Todo, b: Todo) => {
                    const aCompletedDate = a.completedDate ? new Date(a.completedDate).getTime() : Infinity;
                    const bCompletedDate = b.completedDate ? new Date(b.completedDate).getTime() : Infinity;
                    return isAscending ? aCompletedDate - bCompletedDate : bCompletedDate - aCompletedDate;
                };
            case Sort.Priority:
                return (a: Todo, b: Todo) => (isAscending ? a.priority - b.priority : b.priority - a.priority);
            case Sort.AssignedDate:
                return (a: Todo, b: Todo) => isAscending ? new Date(a.assignedDate).getTime() - new Date(b.assignedDate).getTime() : new Date(b.assignedDate).getTime() - new Date(a.assignedDate).getTime()
        }
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

    const groupTodosBy = (todos: Todo[], format: string): { title: string; data: Todo[] }[] => {
        const grouped = todos.reduce((acc: Record<string, Todo[]>, todo) => {
            const key = moment(todo.assignedDate).format(format);
            acc[key] = acc[key] || [];
            acc[key].push(todo);
            return acc;
        }, {});

        return Object.entries(grouped).map(([title, data]) => ({ title, data }));
    };

    const groupTodos = () => {
        const filteredTodos = viewMode === 'list'
            ? todos
            : todos.filter(todo => selectedTab === 'incomplete' ? !todo.completed : todo.completed);

        const selectedDateMoment = moment(currentDate);
        const currentDay = selectedDateMoment.format('YYYY-MM-DD');
        const currentMonth = selectedDateMoment.format('YYYY-MM');
        const currentYear = selectedDateMoment.format('YYYY');

        const filteredByDate = filteredTodos.filter(todo => {
            if (dateOption === myDate.ByDay) {
                return moment(todo.assignedDate).format('YYYY-MM-DD') === currentDay;
            } else if (dateOption === myDate.ByMonth) {
                return moment(todo.assignedDate).format('YYYY-MM') === currentMonth;
            } else if (dateOption === myDate.ByYear) {
                return moment(todo.assignedDate).format('YYYY') === currentYear;
            }
            return true;
        });

        const sortedTodos = [...filteredByDate].sort(getSortFunction(sortOption));

        switch (dateOption) {
            case myDate.ByDay:
                return [{
                    title: currentDay,
                    data: sortedTodos
                }];
            case myDate.ByMonth:
                return groupTodosBy(sortedTodos, 'YYYY-MM-DD');
            case myDate.ByYear:
                return groupTodosBy(sortedTodos, 'YYYY-MM');
            default:
                return sortedTodos.map(todo => ({ title: '', data: [todo] }));
        }
    };


    const updateCompletionProgress = () => {
        const allTodos = groupTodos().flatMap(group => group.data);
        const completedTodos = allTodos.filter((todo) => todo.completed).length;
        const totalTodosNumber = allTodos.length;

        return totalTodosNumber ? (completedTodos / totalTodosNumber) * 100 : 0;
    };

    useEffect(() => {
        setCompletionProgress(updateCompletionProgress());
    }, [todos, currentDate, dateOption, selectedTab]);

    useEffect(() => {
        // dispatch(fetchTodos());
    }, [dispatch]);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={globalStyles.rowSpaceBetween}>
                    <TouchableOpacity onPress={() => changeDate(-1)} style={styles.navButton}>
                        {icons['keyArrowLeft']()}
                    </TouchableOpacity>
                    <View style={globalStyles.alignCenter}>
                        <TouchableOpacity style={styles.pickDateButton} onPress={() => setDatePickerVisibility(true)}>
                            <Text style={globalTextStyles.medium22PrimaryDark}>{moment(currentDate).format(dateOption == 0 ? 'DD MMM YYYY' : dateOption == 1 ? 'MMM YYYY' : 'yyyy')}</Text>
                            {icons['calendarCheck']()}
                        </TouchableOpacity>
                        <Dropdown options={dateOptions} selectedOption={DateLabels[dateOption]} onSelect={setDateOption} style={{ width: 100, padding: 0 }} btnStyle={{ paddingVertical: 0, marginTop: 5 }} />
                    </View>
                    <TouchableOpacity onPress={() => changeDate(1)} style={styles.navButton}>
                        {icons['keyArrowRight']()}
                    </TouchableOpacity>
                </View>

                <View style={globalStyles.rowSpaceBetween} onLayout={handleLayout}>
                    <Bar progress={completionProgress / 100} width={progressBarWidth} height={20} color={completionProgress === 100 ? colors.secondary : colors.secondaryLight} unfilledColor={colors.grayLight} borderRadius={10} />
                    <Text style={styles.progressText}>{Math.round(completionProgress)}%</Text>
                </View>

                <View style={globalStyles.rowSpaceBetween}>
                    <View style={globalStyles.rowStart}>
                        <Dropdown options={sortOptions} selectedOption={SortLabels[sortOption]} onSelect={setSortOption} style={{ width: 140, padding: 0 }} />
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
                data={groupTodos()}
                renderItem={({ item }) => {
                    return (
                        <View style={styles.groupContainer}>
                            {dateOption == 0 ? null : <Text style={styles.groupTitle}>
                                {item.title ? moment(item.title).format(dateOption == 1 ? 'DD MMM' : 'MMM') : 'No Date'}
                            </Text>}
                            {item.data.map((task: Todo) => (
                                <TodoItem key={task.id} viewMode={viewMode} item={task} onDelete={() => handleDelete(task.id)} onToggleComplete={() => handleToggleComplete(task.id)} />
                            ))}
                        </View>
                    );
                }}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={() => (
                    <View style={styles.emptyContainer}>
                        <Text style={globalTextStyles.regular16GrayDark}>No todos available</Text>
                    </View>
                )}
            />
            <DateTimePickerModal display="spinner" isVisible={isDatePickerVisible} date={currentDate} mode="date" onConfirm={handleDateChange} onCancel={() => setDatePickerVisibility(false)} locale="en_GB" />
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
        boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.3)',
        elevation: 5,
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
    groupContainer: {

    },
    groupTitle: {

    }
});