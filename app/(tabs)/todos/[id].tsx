import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { deleteTodo } from '@/features/todos/todosThunks';
import { toggleTodoCompletion } from '@/features/todos/todosSlice';
import { Priority, PriorityLabels } from '@/utils/constants';
import { Box, Button, Text, VStack, HStack, Badge, ScrollView, Divider, Icon } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import colors from '@/styles/colors';
import formatDate from '@/utils/formatDate';

export default function TodoDetail() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const dispatch = useDispatch<AppDispatch>();

    const todoId = Array.isArray(id) ? id[0] : id;

    const todo = useSelector((state: RootState) =>
        state.todos.todos.find((item) => item.id === todoId)
    );

    if (!todoId || typeof todoId !== 'string') {
        return (
            <Box flex={1} justifyContent="center" alignItems="center">
                <Text fontSize="xl" color="neutral.grayDark" fontWeight="medium">
                    Invalid Todo ID
                </Text>
            </Box>
        );
    }

    if (!todo) {
        return (
            <Box flex={1} justifyContent="center" alignItems="center">
                <Text fontSize="xl" color="neutral.grayDark" fontWeight="medium">
                    Todo not found
                </Text>
            </Box>
        );
    }
    const handleDelete = () => {
        dispatch(deleteTodo(todoId));
        router.push('/(tabs)/todos');
    };

    const handleToggleComplete = () => {
        dispatch(toggleTodoCompletion(todoId));
    };

    const getPriorityColorScheme = () => {
        switch (todo.priority) {
            case Priority.High:
                return 'red';
            case Priority.Medium:
                return 'orange';
            case Priority.Low:
                return 'green';
            default:
                return 'gray';
        }
    };

    const formatTimeSpent = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;

        let formatted = '';
        if (hours > 0) formatted += `${hours}h `;
        if (minutes > 0) formatted += `${minutes}m `;
        if (remainingSeconds > 0 || formatted === '') {
            formatted += `${remainingSeconds}s`;
        }
        return formatted.trim();
    };

    return (
        <ScrollView flex={1} p={6} marginBottom={3}>
            <VStack space={4} marginBottom={16}>
                <Box>
                    <Badge
                        alignSelf="flex-start"
                        px={3}
                        py={1}
                        borderRadius="full"
                        colorScheme={todo.completed ? 'green' : 'orange'}
                        _text={{
                            fontSize: 'sm',
                            fontWeight: 'bold',
                            textTransform: 'uppercase',
                        }}
                    >
                        {todo.completed ? 'Completed' : 'In Progress'}
                    </Badge>
                </Box>

                <VStack space={4} p={4} bg={colors.neutral.white + "7A"} borderRadius="lg">
                    <Box>
                        <HStack alignItems="center" space={2}>
                            <Icon as={MaterialIcons} name="add" size="sm" color="primary.600" />
                            <Text fontSize="md" color="primary.600" fontWeight="medium">
                                Added to app:
                            </Text>
                        </HStack>
                        <Text fontSize="lg" color="primary.525" ml={6} mt={1}>
                            {formatDate(todo.createdAt)}
                        </Text>
                    </Box>

                    <Box>
                        <HStack alignItems="center" space={2}>
                            <Icon as={MaterialIcons} name="event-available" size="sm" color="primary.600" />
                            <Text fontSize="md" color="primary.600" fontWeight="medium">
                                Target completion date:
                            </Text>
                        </HStack>
                        <Text fontSize="lg" color="primary.525" ml={6} mt={1}>
                            {moment(todo.assignedDate.toDate()).format('DD MMMM YYYY')}
                        </Text>
                    </Box>

                    {todo.completedDate && (
                        <Box>
                            <HStack alignItems="center" space={2}>
                                <Icon as={MaterialIcons} name="done-all" size="sm" color="primary.600" />
                                <Text fontSize="md" color="primary.600" fontWeight="medium">
                                    Actually completed:
                                </Text>
                            </HStack>
                            <Text fontSize="lg" color="primary.525" ml={6} mt={1}>
                                {formatDate(todo.completedDate)}
                            </Text>
                            {todo.timeSpent > 0 && (
                                <HStack alignItems="center" space={2} ml={6} mt={1}>
                                    <Icon as={MaterialIcons} name="timer" size="sm" color="primary.600" />
                                    <Text fontSize="md" color="primary.600">
                                        Time spent: {formatTimeSpent(todo.timeSpent)}
                                    </Text>
                                </HStack>
                            )}
                        </Box>
                    )}
                </VStack>
                <Box p={4} bg={colors.neutral.white + "7A"} borderRadius="lg">
                    <HStack alignItems="center" space={2}>
                        <Icon as={MaterialIcons} name="priority-high" size="sm" color="primary.600" />
                        <Text fontSize="md" color="primary.600" fontWeight="medium">
                            Priority:
                        </Text>
                    </HStack>
                    <Badge
                        mt={2}
                        px={4}
                        py={1.5}
                        borderRadius="md"
                        alignSelf="flex-start"
                        colorScheme={getPriorityColorScheme()}
                        bg={`${getPriorityColorScheme()}.300`}
                        variant="solid"
                        _text={{
                            fontSize: 'md',
                            fontWeight: 'bold',
                        }}
                    >
                        {PriorityLabels[todo.priority as Priority]}
                    </Badge>
                </Box>

                <Box p={4} bg={colors.neutral.white + "7A"} borderRadius="lg">
                    <HStack alignItems="center" space={2}>
                        <Icon as={MaterialIcons} name="description" size="sm" color="primary.600" />
                        <Text fontSize="md" color="primary.600" fontWeight="medium">
                            Description:
                        </Text>
                    </HStack>
                    {todo.description.length ? (
                        <Text fontSize="lg" color="primary.525" mt={2} ml={6}>
                            {todo.description}
                        </Text>
                    ) : (
                        <Text fontSize="lg" color="gray.500" mt={2} ml={6} fontStyle="italic">
                            No description provided
                        </Text>
                    )}
                </Box>

                <VStack space={4} mt={6}>
                    <Button
                        size="lg"
                        borderRadius="lg"
                        py={3}
                        leftIcon={
                            <Icon
                                as={MaterialIcons}
                                name={todo.completed ? 'undo' : 'check-circle'}
                                size="sm"
                            />
                        }
                        bg={(todo.completed ? 'gray' : 'green') + '.400'}
                        _pressed={{
                            bg: (todo.completed ? 'gray' : 'green') + '.600',
                        }}
                        _text={{ fontSize: 'md', fontWeight: 'bold' }}
                        onPress={handleToggleComplete}
                    >
                        {todo.completed ? 'Mark as Incomplete' : 'Mark as Complete'}
                    </Button>

                    <Button
                        size="lg"
                        borderRadius="lg"
                        py={3}
                        leftIcon={<Icon as={MaterialIcons} name="delete" size="sm" />}
                        colorScheme="red"
                        variant="outline"
                        borderWidth={2}
                        _text={{ fontSize: 'md', fontWeight: 'bold' }}
                        borderColor={'red.400'}
                        onPress={handleDelete}
                    >
                        Delete Todo
                    </Button>
                </VStack>
            </VStack>
        </ScrollView>
    );
}