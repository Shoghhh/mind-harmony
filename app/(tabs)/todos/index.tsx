import { icons } from '@/assets/icons';
import Dropdown from '@/components/Dropdown';
import TaskItem, { Task } from '@/components/tasks/TaskItem';
import colors from '@/styles/colors';
import globalStyles from '@/styles/globalStyles';
import globalTextStyles from '@/styles/globalTextStyles';
import { useRouter } from 'expo-router';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Bar } from 'react-native-progress';

const TaskList = () => {
    const router = useRouter();
    const [tasks, setTasks] = useState<Task[]>([
        { id: '1', title: 'Task 1', date: '2024-12-29T08:29:33.401Z', completed: false, priority: 1, description: 'Lorem ipsum...' },
        { id: '2', title: 'Task 2', date: '2024-12-30T08:29:33.401Z', completed: true, completedDate: '2024-12-29T08:29:33.401Z', priority: 2, description: 'Lorem ipsum Lorem ipsum' },
        { id: '3', title: 'Task 3', date: '2024-12-28T08:29:33.391Z', completed: false, priority: 3, description: 'Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum vLorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum' },
        { id: '4', title: 'Task 4', date: '2024-12-28T02:29:33.401Z', completed: true, completedDate: '2025-01-01T08:29:33.401Z', priority: 2, description: 'Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum vLorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum' },
        { id: '5', title: 'Task 5', date: '2024-12-28T10:29:33.401Z', completed: false, priority: 1, description: 'Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum vLorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum' },
        { id: '6', title: 'Task 6 efrkjn  isfdjnisfn iuashid', date: '2025-01-07T02:29:33.401Z', completed: true, completedDate: '2025-01-01T08:29:33.401Z', priority: 2, description: '' },
        { id: '7', title: 'Task 7', date: '2025-01-08T10:29:33.401Z', completed: false, priority: 1, description: 'Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum vLorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum' },
        { id: '8', title: 'Task 8', date: '2025-01-08T10:29:33.401Z', completed: false, priority: 1, description: 'Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum vLorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum' },
        { id: '9', title: 'Task 9', date: '2025-01-08T10:29:33.401Z', completed: false, priority: 1, description: 'Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum vLorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum' },
        { id: '10', title: 'Task 10', date: '2025-01-08T10:29:33.401Z', completed: false, priority: 1, description: 'Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum vLorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum' },
    ]);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [selectedTab, setSelectedTab] = useState<'incomplete' | 'completed'>('incomplete');
    const [completionProgress, setCompletionProgress] = useState<number>(0);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [sortOption, setSortOption] = useState('Date Created');
    const [isAscending, setIsAscending] = useState(true);
    const [progressBarWidth, setProgressBarWidth] = useState<number>(0);
    const [viewMode, setViewMode] = useState<'list' | 'tabbed'>('list');


    useEffect(() => {
        const totalTasks = groupTasksByDay(tasks, currentDate);
        const completedTasks = totalTasks.filter((task) => task.completed).length;
        const totalTasksNumber = totalTasks.length;
        setCompletionProgress(totalTasksNumber ? (completedTasks / totalTasksNumber) * 100 : 0);
    }, [tasks, currentDate]);

    useEffect(() => {
        sortTasks(sortOption);
    }, [sortOption, isAscending]);

    const groupTasksByDay = (tasks: Task[], date: Date) => {
        return tasks.filter((task) => moment(task.date).isSame(date, 'day'));
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

    const sortTasks = (option: string) => {
        const sortedTasks = [...tasks];
        const sortFunc = getSortFunction(option);
        sortedTasks.sort(sortFunc);
        setTasks(sortedTasks);
    };

    const getSortFunction = (option: string) => {
        if (option === 'Date Created') {
            return (a: Task, b: Task) => (isAscending ? new Date(a.date).getTime() - new Date(b.date).getTime() : new Date(b.date).getTime() - new Date(a.date).getTime());
        }
        if (option === 'Date Completed') {
            return (a: Task, b: Task) => {
                const aCompletedDate = a.completedDate ? new Date(a.completedDate).getTime() : Infinity;
                const bCompletedDate = b.completedDate ? new Date(b.completedDate).getTime() : Infinity;
                return isAscending ? aCompletedDate - bCompletedDate : bCompletedDate - aCompletedDate;
            };
        }
        return (a: Task, b: Task) => (isAscending ? a.priority - b.priority : b.priority - a.priority);
    };


    const handleAdd = () => {
        router.push('/(tabs)/todos/add')
    }

    const handleDelete = (taskId: string) => {
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    };

    const handleToggleComplete = (taskId: string) => {
        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task.id === taskId
                    ? { ...task, completed: !task.completed, completedDate: task.completed ? undefined : new Date().toISOString() }
                    : task
            )
        );
    };

    const toggleViewMode = () => {
        setViewMode(viewMode === 'list' ? 'tabbed' : 'list');
    };

    const filteredTasks = selectedTab === 'incomplete' ? tasks.filter((task) => !task.completed) : tasks.filter((task) => task.completed);

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
                        <Dropdown options={['Date Created', 'Date Completed', 'Priority']} selectedOption={sortOption} onSelect={setSortOption} style={{ width: 140, padding: 0 }} />
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
                data={groupTasksByDay(viewMode === 'tabbed' ? filteredTasks : tasks, currentDate)}
                renderItem={({ item }) => (
                    <TaskItem item={item} onDelete={() => handleDelete(item.id)} viewMode={viewMode} onToggleComplete={() => handleToggleComplete(item.id)} />
                )}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={() => (
                    <View style={styles.emptyContainer}>
                        <Text style={globalTextStyles.regular16GrayDark}>No tasks available</Text>
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

export default TaskList;
