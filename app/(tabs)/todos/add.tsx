import React, { useEffect, useState } from 'react';
import { Platform, TextInput } from 'react-native';
import { Box, Button, Text, VStack, HStack, Pressable, Badge, ScrollView, KeyboardAvoidingView } from 'native-base';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Priority, PriorityLabels } from '@/utils/constants';
import { NewTodo } from '@/types';
import { useDispatch, useSelector } from 'react-redux';
import { addTodo, updateTodo } from '@/features/todos/todosThunks';
import { AppDispatch, RootState } from '@/store/store';
import { Timestamp } from 'firebase/firestore';
import moment from 'moment';
import { setToastMessage } from '@/features/auth/authSlice';
import { useTranslation } from 'react-i18next';

export default function AddTodo() {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState(Priority.Low);
  const { date, id } = useLocalSearchParams();
  const todoId = Array.isArray(id) ? id[0] : id;

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const priorityOptions = Object.entries(PriorityLabels).map(([key, label]) => ({
    value: Number(key) as Priority,
    label: t(label),
  }));

  const existingTodo = useSelector((state: RootState) =>
    todoId ? state.todos.todos.find((todo) => todo.id === todoId) : null
  );
  const { loading, updateLoading } = useSelector((state: RootState) => state.todos);

  const [assignedDate, setAssignedDate] = useState<Date | null>(null);

  useEffect(() => {
    if (existingTodo) {
      setTitle(existingTodo.title);
      setDescription(existingTodo.description);
      setPriority(existingTodo.priority);
      const assigned = existingTodo.assignedDate instanceof Timestamp
        ? existingTodo.assignedDate.toDate()
        : new Date(existingTodo.assignedDate);
      setAssignedDate(assigned);
    } else if (!assignedDate) {
      const initialDateParam = Array.isArray(date) ? date[0] : date;
      const initialDate = initialDateParam ? new Date(initialDateParam) : new Date();
      setAssignedDate(initialDate);
    }
  }, [existingTodo]);

  const handleSaveTodo = async () => {
    if (!title.trim()) {
      dispatch(setToastMessage({ 
        title: t('error'), 
        status: 'error', 
        description: t('taskNameRequired') 
      }));
      return;
    }

    if (!(assignedDate instanceof Date) || isNaN(assignedDate.getTime())) {
      dispatch(setToastMessage({ 
        title: t('error'), 
        status: 'error', 
        description: t('invalidDate') 
      }));
      return;
    }

    const updatedTodo: NewTodo = {
      title,
      description,
      priority,
      createdAt: existingTodo?.createdAt instanceof Timestamp
        ? existingTodo.createdAt
        : Timestamp.now(),
      assignedDate: assignedDate ? Timestamp.fromDate(assignedDate) : null,
      completed: existingTodo?.completed ?? false,
      completedDate: existingTodo?.completedDate instanceof Timestamp
        ? existingTodo.completedDate
        : (existingTodo?.completedDate
          ? Timestamp.fromDate(new Date(existingTodo.completedDate))
          : null),
      timeSpent: existingTodo?.timeSpent || 0,
    };

    const navigate = () => router.push({
      pathname: '/(tabs)/todos',
      params: { date: assignedDate.toISOString() }
    });

    try {
      if (todoId) {
        await dispatch(updateTodo(todoId, updatedTodo));
      } else {
        await dispatch(addTodo(updatedTodo));
      }
      navigate();
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error(t('unknownError'));
      }
    }
  };

  const getPriorityColorScheme = (value: Priority) => {
    switch (value) {
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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView flex={1} px={4} py={6} >
        <VStack space={6}>
          <Box>
            <Text fontSize="md" color="primary.600" >
              {t('taskName')}
            </Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              className="text-2xl rounded-none border-0 border-b-2 border-primary-600 text-primary-525 h-[60]"
              style={{ marginTop: 0, margin: 0 }}
              placeholder={t('enterTaskName')}
            />
          </Box>

          <Box>
            <Text fontSize="md" color="primary.600" marginBottom={5} >
              {t('selectPriority')}
            </Text>
            <HStack space={3}>
              {priorityOptions.map(({ value, label }) => (
                <Pressable key={value} onPress={() => setPriority(value)}>
                  <Badge
                    px={6}
                    py={2}
                    borderRadius="md"
                    colorScheme={priority === value ? 'purple.600' : 'primary.525'}
                    variant={priority === value ? 'solid' : 'subtle'}
                    _text={{
                      fontSize: 'lg',
                      fontWeight: 'semibold',
                    }}
                  >
                    {label}
                  </Badge>
                </Pressable>
              ))}
            </HStack>
          </Box>

          <Box>
            <Text fontSize="md" color="primary.600">
              {t('assignedDate')}
            </Text>
            <Pressable onPress={() => setDatePickerVisibility(true)} className="text-xl rounded-none border-0 border-b-2 border-primary-600 h-[40] mt-[15]">
              <Text fontSize="2xl" color="primary.525">
                {moment(assignedDate).format('DD MMMM YYYY')}
              </Text>
            </Pressable>
          </Box>
          <Box>
            <Text fontSize="md" color="primary.600" >
              {t('taskDescription')}
            </Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              className="text-2xl rounded-none border-1 border-b-2 border-primary-600 text-primary-525 min-h-[50]"
              multiline
              numberOfLines={6}
              placeholder={t('enterTaskDescription')}
            />
          </Box>
          <Button
            bg="primary.600"
            borderRadius="lg"
            py={4}
            mt={10}
            _text={{ fontSize: 'md', fontWeight: 'bold' }}
            onPress={handleSaveTodo}
            _pressed={{
              bg: 'primary.600',
              opacity: 0.8,
              _text: {
                color: 'white'
              }
            }}
            _disabled={{
              bg: 'primary.500',
              opacity: 0.5
            }}
            isLoading={loading || updateLoading}
          >
            {todoId ? t('save') : t('createTask')}
          </Button>
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            display="spinner"
            date={assignedDate ?? undefined}
            onConfirm={(date) => {
              setAssignedDate(date);
              setDatePickerVisibility(false);
            }}
            onCancel={() => setDatePickerVisibility(false)}
            locale={t('datePickerLocale')}
          />
        </VStack>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}