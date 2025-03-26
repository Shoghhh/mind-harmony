import Icon from '@/assets/icons';
import AnimatedProgress from '@/components/todos/AnimatedProgress';
import TodoItem from '@/components/todos/TodoItem';
import { toggleTodoCompletion } from '@/features/todos/todosSlice';
import { deleteTodo } from '@/features/todos/todosThunks';
import { setDateOption } from '@/features/uiSlice';
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
    const [sortOption, setSortOption] = useState<Sort>(Sort.CreatedDate);
    const dateOption = useSelector((state: RootState) => state.ui.dateOption);

    const handleDateOptionChange = (value: number) => {
        dispatch(setDateOption(value));
    };

    const dateOptions = Object.entries(DateLabels).map(([key, label]) => ({
        value: Number(key) as myDate,
        label,
    }))
    const [isAscending, setIsAscending] = useState(true);
    const [viewMode, setViewMode] = useState<'list' | 'tabbed'>('list');

    const sortOptions = useMemo(() => {
        const allOptions = Object.entries(SortLabels).map(([key, label]) => ({
            value: Number(key) as Sort,
            label,
        }));

        if (dateOption !== myDate.ByDay) {
            return allOptions.filter(option =>
                [Sort.Priority, Sort.CreatedDate].includes(option.value)
            );
        }
        if (viewMode === 'tabbed') {
            return allOptions.filter(option =>
                ![Sort.AssignedDate, Sort.CompletedDate].includes(option.value)
            );
        }
        return allOptions.filter(option => option.value !== Sort.AssignedDate);
    }, [dateOption, viewMode]);

    const handleDateChange = (date: Date) => {
        const utcDate = new Date(Date.UTC(
            date.getFullYear(),
            date.getMonth(),
            date.getDate()
        ));
        setCurrentDate(utcDate)
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

        const filteredByDate = filteredTodos.filter(todo => {
            const todoDate = moment(todo.assignedDate);
            const viewDate = moment(currentDate);

            switch (dateOption) {
                case myDate.ByDay: return todoDate.isSame(viewDate, 'day');
                case myDate.ByMonth: return todoDate.isSame(viewDate, 'month');
                case myDate.ByYear: return todoDate.isSame(viewDate, 'year');
                default: return true;
            }
        });

        let groupedTodos;
        switch (dateOption) {
            case myDate.ByDay:
                groupedTodos = [{
                    title: moment(currentDate).format('YYYY-MM-DD'),
                    data: filteredByDate
                }];
                break;

            case myDate.ByMonth:
                groupedTodos = groupTodosBy(filteredByDate, 'YYYY-MM-DD')
                    .sort((a, b) => moment(a.title).valueOf() - moment(b.title).valueOf());
                break;

            case myDate.ByYear:
                groupedTodos = groupTodosBy(filteredByDate, 'YYYY-MM')
                    .sort((a, b) => moment(a.title).valueOf() - moment(b.title).valueOf());
                break;

            default:
                groupedTodos = filteredByDate.map(todo => ({ title: '', data: [todo] }));
        }

        return groupedTodos.map(group => ({
            ...group,
            data: [...group.data].sort(getSortFunction(sortOption))
        }));
    };

    const getSortFunction = (sortOption: Sort): (a: Todo, b: Todo) => number => {
        const direction = isAscending ? 1 : -1;

        const getDateValue = (dateString?: string): number => {
            if (!dateString) return Infinity * direction;
            const date = new Date(dateString);
            return isNaN(date.getTime()) ? Infinity * direction : date.getTime();
        };

        switch (sortOption) {
            case Sort.CreatedDate:
                return (a, b) => direction * (getDateValue(a.createdDate) - getDateValue(b.createdDate));

            case Sort.CompletedDate:
                return (a, b) => {
                    if (a.completed !== b.completed) {
                        return a.completed ? direction : -direction;
                    }
                    return direction * (getDateValue(a.completedDate) - getDateValue(b.completedDate));
                };

            case Sort.Priority:
                return (a, b) => direction * (a.priority - b.priority);

            case Sort.AssignedDate:
                return (a, b) => direction * (getDateValue(a.assignedDate) - getDateValue(b.assignedDate));

            default:
                return (a, b) => direction * (getDateValue(a.createdDate) - getDateValue(b.createdDate));
        }
    };
    const updateCompletionProgress = () => {
        const allTodos = todos.filter(todo => {
            const selectedDateMoment = moment(currentDate);
            const currentDay = selectedDateMoment.format('YYYY-MM-DD');
            const currentMonth = selectedDateMoment.format('YYYY-MM');
            const currentYear = selectedDateMoment.format('YYYY');

            if (dateOption === myDate.ByDay) {
                return moment(todo.assignedDate).format('YYYY-MM-DD') === currentDay;
            } else if (dateOption === myDate.ByMonth) {
                return moment(todo.assignedDate).format('YYYY-MM') === currentMonth;
            } else if (dateOption === myDate.ByYear) {
                return moment(todo.assignedDate).format('YYYY') === currentYear;
            }
            return true;
        });

        const completedTodos = allTodos.filter((todo) => todo.completed).length;
        const totalTodosNumber = allTodos.length;

        return totalTodosNumber ? (completedTodos / totalTodosNumber) * 100 : 0;
    };

    useEffect(() => {
        setCompletionProgress(updateCompletionProgress());
    }, [todos, currentDate, dateOption]);

    useEffect(() => {
        // dispatch(fetchTodos());
    }, [dispatch]);

    useEffect(() => {
        const validOptions = sortOptions.map(o => o.value);
        if (!validOptions.includes(sortOption)) {
            setSortOption(validOptions[0] || Sort.CreatedDate);
        }
    }, [sortOptions, sortOption]);


    useEffect(() => {
        if (dateOption === myDate.ByMonth) {
            setCurrentDate(prev => {
                const newDate = new Date(prev);
                newDate.setDate(1);
                return newDate;
            });
        } else if (dateOption === myDate.ByYear) {
            setCurrentDate(prev => {
                const newDate = new Date(prev);
                newDate.setMonth(0, 1);
                return newDate;
            });
        }
    }, [dateOption]);

    return (<View className="flex-1 px-5 mb-[70]" >
        <View className="flex flex-col gap-5 mb-5">
            <View className="flex flex-row justify-between items-center">
                <TouchableOpacity onPress={() => changeDate(-1)} className="rounded-2xl bg-primary-600">
                    <Icon name="keyboard-arrow-left" library="MaterialIcons" color={colors.neutral.white} size={37} />
                </TouchableOpacity>
                <View className="flex items-center">
                    <TouchableOpacity
                        className="min-w-[160] bg-primary-600 px-7 py-3 rounded-2xl flex-row items-center justify-center gap-2"
                        onPress={() => setDatePickerVisibility(true)}
                    >
                        <Text className="text-white font-bold">{moment(currentDate).format(dateOption == 0 ? "DD MMM YYYY" : dateOption == 1 ? "MMM YYYY" : "yyyy")}</Text>
                        <Icon name="calendar-check" library="FontAwesome5" color={colors.neutral.white} size={20} />
                    </TouchableOpacity>
                    <Box maxW="300" mt="2">
                        <Select
                            selectedValue={dateOption.toString()}
                            onValueChange={(itemValue) => handleDateOptionChange(+itemValue)}
                            minWidth="120"
                            _selectedItem={{
                                bg: "purple.100",
                                endIcon: <CheckIcon size="5" />,
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                            backgroundColor={colors.neutral.white}
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
                    <Icon name="keyboard-arrow-right" library="MaterialIcons" color={colors.neutral.white} size={37} />
                </TouchableOpacity>
            </View>

            <Box className="flex flex-row justify-between items-center relative">
                <AnimatedProgress value={completionProgress} />
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
                        backgroundColor={colors.neutral.white}
                        borderRadius="md"
                        dropdownIcon={<View className='pr-3'><ChevronDownIcon size={18} color={colors.primary[500]} /></View>}
                    >
                        {sortOptions?.map((option) => (
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
                <TouchableOpacity className={`py-2 px-4 flex-1 items-center  ${selectedTab === "incomplete" ? "border-b-2 border-primary-990" : "border-transparent"}`} onPress={() => setSelectedTab("incomplete")}>
                    <Text className="text-primary-990 font-medium">To Do</Text>
                </TouchableOpacity>
                <TouchableOpacity className={`py-2 px-4 flex-1 items-center  ${selectedTab === "completed" ? "border-b-2 border-primary-990" : "border-transparent"}`} onPress={() => setSelectedTab("completed")}>
                    <Text className="text-primary-990 font-medium">Completed</Text>
                </TouchableOpacity>
            </View>
        )}

        <FlatList
            showsVerticalScrollIndicator={false}
            data={groupTodos()}
            renderItem={({ item }) => (
                <View>
                    {dateOption == 0 ? null : (
                        <Text className="text-primary-990 font-medium">
                            {item.title ? moment(item.title).format(dateOption == 1 ? "DD MMM" : "MMM") : "No Date"}
                        </Text>
                    )}
                    {item.data.map((task: Todo) => (
                        <TodoItem key={task.id} viewMode={viewMode} item={task} onDelete={() => handleDelete(task.id)} onToggleComplete={() => handleToggleComplete(task.id)} />
                    ))}
                </View>
            )}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{ paddingBottom: 20 }}
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

