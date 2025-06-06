import Icon from '@/assets/icons';
import AnimatedProgress from '@/components/todos/AnimatedProgress';
import TodoItem from '@/components/todos/TodoItem';
import { deleteTodo, fetchTodos, toggleTodoCompletionAsync } from '@/features/todos/todosThunks';
import { setDateOption } from '@/features/uiSlice';
import { AppDispatch, RootState } from '@/store/store';
import colors from '@/styles/colors';
import { Todo } from '@/types';
import { Date as myDate, DateLabels, Sort, SortLabels } from '@/utils/constants';
import formatDate from '@/utils/formatDate';

import { useLocalSearchParams, useRouter } from 'expo-router';
import { Timestamp } from 'firebase/firestore';
import moment from 'moment';
import { Box, CheckIcon, ChevronDownIcon, Progress, Select } from 'native-base';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useSelector, useDispatch } from 'react-redux';

export default function TodoList() {
    const { t } = useTranslation();
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { date } = useLocalSearchParams();
    const initialDate = Array.isArray(date) ? date[0] : date;
    const parsedDate = initialDate ? new Date(initialDate) : new Date()

    const { todos, loading } = useSelector((state: RootState) => state.todos);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [selectedTab, setSelectedTab] = useState<'incomplete' | 'completed'>('incomplete');
    const [completionProgress, setCompletionProgress] = useState<number>(0);
    const [currentDate, setCurrentDate] = useState(parsedDate);
    const [sortOption, setSortOption] = useState<Sort>(Sort.CreatedDate);
    const dateOption = useSelector((state: RootState) => state.ui.dateOption);
    const [currentlyUpdatingId, setCurrentlyUpdatingId] = useState<string | null>(null);

    const handleDateOptionChange = (value: number) => {
        dispatch(setDateOption(value));
    };

    const dateOptions = [
        { value: myDate.ByDay, label: t('byDay') },
        { value: myDate.ByMonth, label: t('byMonth') },
        { value: myDate.ByYear, label: t('byYear') }
      ]
    const [isAscending, setIsAscending] = useState(true);
    const [viewMode, setViewMode] = useState<'list' | 'tabbed'>('list');

    const sortOptions = useMemo(() => {
        const options = [
            { value: Sort.Priority, label: t('priority') },
            { value: Sort.CreatedDate, label: t('createdDate') },
            { value: Sort.CompletedDate, label: t('completedDate') },
            { value: Sort.AssignedDate, label: t('assignedDate') }
        ];

        if (dateOption !== myDate.ByDay) {
            return options.filter(option =>
                [Sort.Priority, Sort.CreatedDate].includes(option.value))
        }
        if (viewMode === 'tabbed') {
            return options.filter(option =>
                ![Sort.AssignedDate, Sort.CompletedDate].includes(option.value))
        }
        return options.filter(option => option.value !== Sort.AssignedDate);
    }, [dateOption, viewMode]);

    const handleDateChange = (date: Date) => {
        setCurrentDate(date);
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

    const handleDelete = (todoId: string) => {
        dispatch(deleteTodo(todoId));
    };

    const handleToggleComplete = (todoId: string) => {
        setCurrentlyUpdatingId(todoId);
        dispatch(toggleTodoCompletionAsync(todoId))
            .finally(() => setCurrentlyUpdatingId(null));
    };


    const toggleViewMode = () => {
        setViewMode(viewMode === 'list' ? 'tabbed' : 'list');
    };

    const groupTodos = () => {
        const filteredTodos = viewMode === 'list'
            ? todos
            : todos.filter(todo => selectedTab === 'incomplete' ? !todo.completed : todo.completed);

        const filteredByDate = filteredTodos.filter(todo => {
            try {
                const todoDate = (todo.assignedDate as Timestamp).toDate();
                const viewDate = new Date(currentDate);

                const todoUTCDate = new Date(Date.UTC(
                    todoDate.getFullYear(),
                    todoDate.getMonth(),
                    todoDate.getDate()
                ));

                const viewUTCDate = new Date(Date.UTC(
                    viewDate.getFullYear(),
                    viewDate.getMonth(),
                    viewDate.getDate()
                ));

                switch (dateOption) {
                    case myDate.ByDay:
                        return todoUTCDate.toDateString() === viewUTCDate.toDateString();
                    case myDate.ByMonth:
                        return todoUTCDate.getUTCFullYear() === viewUTCDate.getUTCFullYear() &&
                            todoUTCDate.getUTCMonth() === viewUTCDate.getUTCMonth();
                    case myDate.ByYear:
                        return todoUTCDate.getUTCFullYear() === viewUTCDate.getUTCFullYear();
                    default:
                        return true;
                }
            } catch (error) {
                console.error('Error processing todo:', todo.id, error);
                return false;
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
                groupedTodos = filteredByDate.reduce((groups: Record<string, Todo[]>, todo) => {
                    const date = (todo.assignedDate as Timestamp).toDate();
                    const key = moment(date).format('YYYY-MM-DD');
                    groups[key] = groups[key] || [];
                    groups[key].push(todo);
                    return groups;
                }, {});

                groupedTodos = Object.entries(groupedTodos)
                    .map(([title, data]) => ({ title, data }))
                    .sort((a, b) => moment(a.title).valueOf() - moment(b.title).valueOf());
                break;

            case myDate.ByYear:
                groupedTodos = filteredByDate.reduce((groups: Record<string, Todo[]>, todo) => {
                    const date = (todo.assignedDate as Timestamp).toDate();
                    const key = moment(date).format('YYYY-MM');
                    groups[key] = groups[key] || [];
                    groups[key].push(todo);
                    return groups;
                }, {});

                groupedTodos = Object.entries(groupedTodos)
                    .map(([title, data]) => ({ title, data }))
                    .sort((a, b) => moment(a.title).valueOf() - moment(b.title).valueOf());
                break;

            default:
                groupedTodos = [{ title: '', data: filteredByDate }];
        }

        return groupedTodos.map(group => ({
            ...group,
            data: [...group.data].sort(getSortFunction(sortOption))
        }));
    };

    const getSortFunction = (sortOption: Sort): (a: Todo, b: Todo) => number => {
        const direction = isAscending ? 1 : -1;

        const getDateValue = (dateString: string | null): number => {
            if (!dateString) return Infinity * direction;
            const date = new Date(dateString);
            return isNaN(date.getTime()) ? Infinity * direction : date.getTime();
        };

        switch (sortOption) {
            case Sort.CreatedDate:
                return (a, b) => direction * (getDateValue(a.createdAt) - getDateValue(b.createdAt));

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
                return (a, b) => direction * (getDateValue(a.createdAt) - getDateValue(b.createdAt));
        }
    };
    const updateCompletionProgress = () => {
        const allTodos = todos.filter(todo => {
            const selectedDateMoment = moment(currentDate);
            const currentDay = selectedDateMoment.format('YYYY-MM-DD');
            const currentMonth = selectedDateMoment.format('YYYY-MM');
            const currentYear = selectedDateMoment.format('YYYY');

            const todoDate = todo.assignedDate instanceof Timestamp
                ? todo.assignedDate.toDate()
                : new Date(todo.assignedDate);

            const todoMoment = moment(todoDate);

            if (dateOption === myDate.ByDay) {
                return todoMoment.format('YYYY-MM-DD') === currentDay;
            } else if (dateOption === myDate.ByMonth) {
                return todoMoment.format('YYYY-MM') === currentMonth;
            } else if (dateOption === myDate.ByYear) {
                return todoMoment.format('YYYY') === currentYear;
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
                    <Text className="text-primary-990 font-medium">{t('toDo')}</Text>
                </TouchableOpacity>
                <TouchableOpacity className={`py-2 px-4 flex-1 items-center  ${selectedTab === "completed" ? "border-b-2 border-primary-990" : "border-transparent"}`} onPress={() => setSelectedTab("completed")}>
                    <Text className="text-primary-990 font-medium">{t('completed')}</Text>
                </TouchableOpacity>
            </View>
        )}

        {loading ? <ActivityIndicator size={'large'} color={colors.primary[600]} /> : <FlatList
            showsVerticalScrollIndicator={false}
            data={groupTodos()}
            onRefresh={() => dispatch(fetchTodos())}
            refreshing={loading}
            renderItem={({ item }) => (
                <View>
                    {dateOption == 0 ? null : (
                        <Text className="text-primary-990 font-medium">
                            {item.title ? moment(item.title).format(dateOption == 1 ? "DD MMM" : "MMM") : t('noDate')}
                        </Text>
                    )}
                    {item.data.map((task: Todo) => (
                        <TodoItem key={task.id} loading={currentlyUpdatingId === task.id} viewMode={viewMode} item={task} onDelete={() => handleDelete(task.id)} onToggleComplete={() => handleToggleComplete(task.id)} />
                    ))}
                </View>
            )}

            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{ paddingBottom: 20 }}
            ListEmptyComponent={() => (
                <View className="flex items-center justify-center">
                    <Text className="text-gray-500">{t('noTodosAvailable')}</Text>
                </View>
            )}
        />}
        <DateTimePickerModal display="spinner" isVisible={isDatePickerVisible} date={currentDate} mode="date" onConfirm={handleDateChange} onCancel={() => setDatePickerVisibility(false)} locale="hy-AM" />
    </View>
    );
};

