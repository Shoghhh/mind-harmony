import { useBottomSheet } from "@/providers/BottomSheetProvider";
import { usePomodoro } from "@/providers/PomodoroContext";
import { AppDispatch, RootState } from "@/store/store";
import { Todo } from "@/types";
import { Box, FlatList, Pressable, Text, HStack, Icon, View, Divider } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { useEffect, useMemo } from "react";
import { format, isToday, isYesterday, parseISO } from "date-fns";
import { Timestamp } from 'firebase/firestore';
import { useDispatch } from "react-redux";
import { fetchTodos } from "@/features/todos/todosThunks";
import { ActivityIndicator } from "react-native";
import colors from "@/styles/colors";

const TodoSelectionComponent = ({ onSelect }: { onSelect: (todo: Todo) => void }) => {
    const {todos, loading} = useSelector((state: RootState) => state.todos);
    const { selectedTodoId, setSelectedTodoId } = usePomodoro();
    const { closeSheet } = useBottomSheet();
    const dispatch = useDispatch<AppDispatch>()

    const groupedTodos = useMemo(() => {
        const currentYear = new Date().getFullYear();
        const incompleteTodos = todos.filter(todo => !todo.completed);

        const grouped = incompleteTodos.reduce((acc, todo) => {
            let date: Date;
            if (todo.assignedDate instanceof Timestamp) {
                date = todo.assignedDate.toDate();
            } else if (typeof todo.assignedDate === 'string') {
                date = parseISO(todo.assignedDate);
            } else {
                date = new Date();
            }

            if (isNaN(date.getTime())) return acc;

            const dateYear = date.getFullYear();
            let dateKey: string;

            if (isToday(date)) {
                dateKey = "Today";
            } else if (isYesterday(date)) {
                dateKey = "Yesterday";
            } else {
                dateKey = format(
                    date,
                    dateYear === currentYear
                        ? "EEEE, MMMM d"
                        : "EEEE, MMMM d, yyyy"
                );
            }

            if (!acc[dateKey]) {
                acc[dateKey] = {
                    todos: [],
                    date: date
                };
            }
            acc[dateKey].todos.push(todo);
            return acc;
        }, {} as Record<string, { todos: Todo[]; date: Date }>);

        return Object.entries(grouped)
            .sort(([_, a], [__, b]) => b.date.getTime() - a.date.getTime())
            .reduce((acc, [dateKey, group]) => {
                acc[dateKey] = group.todos;
                return acc;
            }, {} as Record<string, Todo[]>);
    }, [todos]);
    const onSelectItem = (item: Todo) => {
        onSelect(item);
        setSelectedTodoId(selectedTodoId === item.id ? null : item.id);
        closeSheet();
    };


    return (
        <Box p={4} flex={1}>
            <View flexDirection={'row'} justifyContent={'space-between'}>
                <Text fontSize="xl" fontWeight="bold" mb={4}>Select a Todo</Text>
            </View>

            {loading ? <ActivityIndicator color={colors.primary[600]} size={'large'}/> : <FlatList
                data={Object.entries(groupedTodos)}
                keyExtractor={([date]) => date}
                contentContainerStyle={{ paddingBottom: 100 }}
                renderItem={({ item: [date, todos] }) => (
                    <Box mb={4}>
                        <Text fontSize="sm" color="gray.500" mb={2}>
                            {date}
                        </Text>
                        <Divider mb={2} />
                        {todos.map((todo) => (
                            <Pressable
                                key={todo.id}
                                onPress={() => onSelectItem(todo)}
                                p={3}
                                mb={2}
                                bg={selectedTodoId === todo.id ? 'primary.200' : 'primary.100'}
                                rounded="lg"
                                borderWidth={1}
                                borderColor={selectedTodoId === todo.id ? 'primary.600' : 'primary.200'}
                                _pressed={{
                                    bg: selectedTodoId === todo.id ? 'primary.300' : 'primary.200',
                                    opacity: selectedTodoId === todo.id ? 1 : 0.8
                                }}
                            >
                                <HStack space={3} alignItems="center">
                                    <Box flex={1}>
                                        <Text fontWeight="medium" fontSize="md">
                                            {todo.title}
                                        </Text>
                                        {todo.description && (
                                            <Text
                                                fontSize="sm"
                                                color="gray.500"
                                                numberOfLines={1}
                                                ellipsizeMode="tail"
                                                mt={1}
                                            >
                                                {todo.description}
                                            </Text>
                                        )}
                                        <HStack mt={2} space={2}>
                                            {todo.timeSpent > 0 && (
                                                <Text fontSize="xs" color="gray.400">
                                                    {Math.floor(todo.timeSpent / 60)}m spent
                                                </Text>
                                            )}
                                        </HStack>
                                    </Box>
                                    {selectedTodoId === todo.id && (
                                        <Icon
                                            as={MaterialIcons}
                                            name="check-circle"
                                            color="primary.800"
                                            size={5}
                                        />
                                    )}
                                </HStack>
                            </Pressable>
                        ))}
                    </Box>
                )}
                showsVerticalScrollIndicator={false}
            />}
        </Box>
    );
};

export default TodoSelectionComponent;