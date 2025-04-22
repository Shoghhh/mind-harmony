import React, { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { deleteTodo, toggleTodoCompletionAsync } from '@/features/todos/todosThunks';
import { Priority, PriorityLabels } from '@/utils/constants';
import { Box, Button, Text, VStack, HStack, Badge, ScrollView, Divider, Icon } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import colors from '@/styles/colors';
import formatDate from '@/utils/formatDate';
import ConfirmationDialog from '@/components/MyDialog';
import { useTranslation } from 'react-i18next';

export default function TodoDetail() {
    const { t } = useTranslation();
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const dispatch = useDispatch<AppDispatch>();

    const todoId = Array.isArray(id) ? id[0] : id;
    const todo = useSelector((state: RootState) =>
        state.todos.todos.find((item) => item.id === todoId)
    );
    const { updateLoading, deleteLoading } = useSelector((state: RootState) =>
        state.todos
    );

    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const handleDelete = () => {
        dispatch(deleteTodo(todoId));
        router.push('/(tabs)/todos');
    };

    const handleToggleComplete = () => {
        dispatch(toggleTodoCompletionAsync(todoId));
    };

    const formatTimeSpent = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;

        let formatted = '';
        if (hours > 0) formatted += `${hours}${t('hourAbbr')} `;
        if (minutes > 0) formatted += `${minutes}${t('minuteAbbr')} `;
        if (remainingSeconds > 0 || formatted === '') {
            formatted += `${remainingSeconds}${t('secondAbbr')}`;
        }
        return formatted.trim();
    };

    const getPriorityColorScheme = () => {
        switch (todo?.priority) {
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

    if (!todoId || typeof todoId !== 'string') {
        return (
            <Box flex={1} justifyContent="center" alignItems="center">
                <Text fontSize="xl" color="neutral.grayDark" fontWeight="medium">
                    {t('invalidTodoId')}
                </Text>
            </Box>
        );
    }

    if (!todo) {
        return (
            <Box flex={1} justifyContent="center" alignItems="center">
                <Text fontSize="xl" color="neutral.grayDark" fontWeight="medium">
                    {t('todoNotFound')}
                </Text>
            </Box>
        );
    }

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
                        {todo.completed ? t('completed') : t('inProgress')}
                    </Badge>
                </Box>

                <VStack space={4} p={4} bg={colors.neutral.white + "7A"} borderRadius="lg">
                    <Box>
                        <HStack alignItems="center" space={2}>
                            <Icon as={MaterialIcons} name="add" size="sm" color="primary.600" />
                            <Text fontSize="md" color="primary.600" fontWeight="medium">
                                {t('addedToApp')}:
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
                                {t('targetCompletionDate')}:
                            </Text>
                        </HStack>
                        <Text fontSize="lg" color="primary.525" ml={6} mt={1}>
                            {formatDate(todo.assignedDate)}
                        </Text>
                    </Box>

                    {todo.completedDate && (
                        <Box>
                            <HStack alignItems="center" space={2}>
                                <Icon as={MaterialIcons} name="done-all" size="sm" color="primary.600" />
                                <Text fontSize="md" color="primary.600" fontWeight="medium">
                                    {t('actuallyCompleted')}:
                                </Text>
                            </HStack>
                            <Text fontSize="lg" color="primary.525" ml={6} mt={1}>
                                {formatDate(todo.completedDate)}
                            </Text>
                            {todo.timeSpent > 0 && (
                                <HStack alignItems="center" space={2} ml={6} mt={1}>
                                    <Icon as={MaterialIcons} name="timer" size="sm" color="primary.600" />
                                    <Text fontSize="md" color="primary.600">
                                        {t('timeSpent')}: {formatTimeSpent(todo.timeSpent)}
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
                            {t('priority')}:
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
                        {t(PriorityLabels[todo.priority as Priority])}
                    </Badge>
                </Box>

                <Box p={4} bg={colors.neutral.white + "7A"} borderRadius="lg">
                    <HStack alignItems="center" space={2}>
                        <Icon as={MaterialIcons} name="description" size="sm" color="primary.600" />
                        <Text fontSize="md" color="primary.600" fontWeight="medium">
                            {t('description')}:
                        </Text>
                    </HStack>
                    {todo.description.length ? (
                        <Text fontSize="lg" color="primary.525" mt={2} ml={6}>
                            {todo.description}
                        </Text>
                    ) : (
                        <Text fontSize="lg" color="gray.500" mt={2} ml={6} fontStyle="italic">
                            {t('noDescription')}
                        </Text>
                    )}
                </Box>

                <VStack space={4} mt={6}>
                    <Button
                        size="lg"
                        borderRadius="lg"
                        py={3}
                        isLoading={updateLoading}
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
                        {todo.completed ? t('markIncomplete') : t('markComplete')}
                    </Button>

                    <Button
                        size="lg"
                        borderRadius="lg"
                        py={3}
                        isLoading={deleteLoading}
                        leftIcon={<Icon as={MaterialIcons} name="delete" size="sm" />}
                        colorScheme="red"
                        variant="outline"
                        borderWidth={2}
                        _text={{ fontSize: 'md', fontWeight: 'bold' }}
                        borderColor={'red.400'}
                        onPress={() => setIsDeleteOpen(true)}
                    >
                        {t('deleteTodo')}
                    </Button>
                </VStack>
                <ConfirmationDialog
                    isOpen={isDeleteOpen}
                    onClose={() => setIsDeleteOpen(false)}
                    onConfirm={() => handleDelete()}
                    type="delete"
                />
            </VStack>
        </ScrollView>
    );
}