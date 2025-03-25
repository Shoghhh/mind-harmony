import Icon from '@/assets/icons';
import AnimatedProgress from '@/components/todos/AnimatedProgress';
import TodoItem from '@/components/todos/TodoItem';
import { toggleTodoCompletion } from '@/features/todos/todosSlice';
import { deleteTodo } from '@/features/todos/todosThunks';
import { AppDispatch, RootState } from '@/store/store';
import colors from '@/styles/colors';
import { Todo } from '@/types';
import { Date as myDate, DateLabels, Sort, SortLabels } from '@/utils/constants';
import { useLocalSearchParams, useRouter } from 'expo-router';
import moment from 'moment';
import { Box, CheckIcon, ChevronDownIcon, Progress, Select } from 'native-base';
import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useSelector, useDispatch } from 'react-redux';

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

    return (<View className="flex-1 px-5">
        <View className="flex flex-col gap-5 mb-5">
            <View className="flex flex-row justify-between items-center">
                <TouchableOpacity onPress={() => changeDate(-1)} className="rounded-2xl bg-primary-600">
                    <Icon name="keyboard-arrow-left" library="MaterialIcons" color={colors.white} size={37} />
                </TouchableOpacity>
                <View className="flex items-center">
                    <TouchableOpacity
                        className="min-w-[160] bg-primary-600 px-7 py-3 rounded-2xl flex-row items-center justify-center gap-2"
                        onPress={() => setDatePickerVisibility(true)}
                    >
                        <Text className="text-white font-bold">{moment(currentDate).format(dateOption == 0 ? "DD MMM YYYY" : dateOption == 1 ? "MMM YYYY" : "yyyy")}</Text>
                        <Icon name="calendar-check" library="FontAwesome5" color={colors.white} size={20} />
                    </TouchableOpacity>
                    <Box maxW="300" mt="2">
                        <Select
                            selectedValue={dateOption.toString()}
                            minWidth="120"
                            _selectedItem={{
                                bg: "purple.100",
                                endIcon: <CheckIcon size="5" />,
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                            onValueChange={(itemValue) => setDateOption(+itemValue)}
                            backgroundColor={colors.white}
                            borderRadius="2xl"
                            paddingTop="1"
                            paddingBottom='1'
                            dropdownIcon={<View className='pr-3'><ChevronDownIcon size={18} color={colors.primary[500]} /></View>}
                        >
                            {dateOptions.map((option) => (
                                <Select.Item key={option.value} label={option.label} value={option.value.toString()} />
                            ))}
                        </Select>
                    </Box>
                </View>
                <TouchableOpacity onPress={() => changeDate(1)} className="rounded-2xl bg-primary-600">
                    <Icon name="keyboard-arrow-right" library="MaterialIcons" color={colors.white} size={37} />
                </TouchableOpacity>
            </View>

            <Box className="flex flex-row justify-between items-center relative">
                <AnimatedProgress value={completionProgress}/>
                <Text className="absolute z-10 left-1/2 -translate-x-4 text-white font-bold">
                    {Math.round(completionProgress)}%
                </Text>
            </Box>
            <View className="flex flex-row justify-between items-center">
                <View className="flex flex-row items-center gap-2">
                    <Select
                        selectedValue={sortOption.toString()}
                        minWidth="140"
                        _selectedItem={{
                            bg: "purple.100",
                            endIcon: <CheckIcon size="5" />,
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                        onValueChange={(itemValue) => setSortOption(+itemValue)}
                        backgroundColor={colors.white}
                        borderRadius="md"
                        dropdownIcon={<View className='pr-3'><ChevronDownIcon size={18} color={colors.primary[500]} /></View>}
                    >
                        {sortOptions.map((option) => (
                            <Select.Item key={option.value} label={option.label} value={option.value.toString()} />
                        ))}
                    </Select>
                    <TouchableOpacity className="rounded-lg w-9 h-9 flex items-center justify-center  bg-white" onPress={() => setIsAscending(!isAscending)}>
                        <Icon
                            name={isAscending ? "sort-ascending" : "sort-descending"}
                            library="MaterialCommunityIcons"
                            color={colors.primary[600]}
                            size={24}
                        />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity className="rounded-lg w-9 h-9 flex items-center justify-center  bg-white" onPress={toggleViewMode}>
                    <Icon
                        name={viewMode === "list" ? "format-list-group" : "format-list-bulleted"}
                        library="MaterialCommunityIcons"
                        color={colors.primary[600]}
                    />
                </TouchableOpacity>
                <TouchableOpacity className="rounded-full bg-white p-2 shadow-md" onPress={handleAdd}>
                    <Icon
                        name="add"
                        library="MaterialIcons"
                        color={colors.primary[600]}
                    />
                </TouchableOpacity>
            </View>
        </View>

        {viewMode === "tabbed" && (
            <View className="flex flex-row justify-between mb-5">
                <TouchableOpacity className={`py-2 px-4 flex-1 items-center border-b-2 ${selectedTab === "incomplete" ? "border-secondary-light" : "border-transparent"}`} onPress={() => setSelectedTab("incomplete")}>
                    <Text className="text-primary-dark font-medium">To Do</Text>
                </TouchableOpacity>
                <TouchableOpacity className={`py-2 px-4 flex-1 items-center border-b-2 ${selectedTab === "completed" ? "border-secondary-light" : "border-transparent"}`} onPress={() => setSelectedTab("completed")}>
                    <Text className="text-primary-dark font-medium">Completed</Text>
                </TouchableOpacity>
            </View>
        )}

        <FlatList
            showsVerticalScrollIndicator={false}
            data={groupTodos()}
            renderItem={({ item }) => (
                <View>
                    {dateOption == 0 ? null : (
                        <Text className="text-primary-dark font-medium">
                            {item.title ? moment(item.title).format(dateOption == 1 ? "DD MMM" : "MMM") : "No Date"}
                        </Text>
                    )}
                    {item.data.map((task: Todo) => (
                        <TodoItem key={task.id} viewMode={viewMode} item={task} onDelete={() => handleDelete(task.id)} onToggleComplete={() => handleToggleComplete(task.id)} />
                    ))}
                </View>
            )}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{ paddingBottom: 80 }}
            ListEmptyComponent={() => (
                <View className="flex items-center justify-center">
                    <Text className="text-gray-500">No todos available</Text>
                </View>
            )}
        />
        <DateTimePickerModal display="spinner" isVisible={isDatePickerVisible} date={currentDate} mode="date" onConfirm={handleDateChange} onCancel={() => setDatePickerVisibility(false)} locale="en_GB" />
    </View>
    );
};

