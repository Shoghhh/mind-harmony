import React, { useEffect, useState } from 'react';
import { Platform, TextInput } from 'react-native';
import { Box, Button, Text, VStack, HStack, Pressable, Badge, ScrollView, KeyboardAvoidingView } from 'native-base';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Priority, PriorityLabels } from '@/utils/constants';
import { Todo } from '@/types';
import { useDispatch, useSelector } from 'react-redux';
import { addTodo, updateTodo } from '@/features/todos/todosThunks';
import { AppDispatch, RootState } from '@/store/store';

export default function AddTodo() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState(Priority.Low);
  const { date, id } = useLocalSearchParams();
  const initialDate = Array.isArray(date) ? date[0] : date;
  const parsedDate = initialDate ? new Date(initialDate) : new Date();
  const [assignedDate, setAssignedDate] = useState(parsedDate);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const priorityOptions = Object.entries(PriorityLabels).map(([key, label]) => ({
    value: Number(key) as Priority,
    label,
  }));

  const existingTodo = useSelector((state: RootState) =>
    id ? state.todos.todos.find((todo) => todo.id === parseInt(id as string)) : null
  );

  useEffect(() => {
    if (existingTodo) {
      setTitle(existingTodo.title);
      setDescription(existingTodo.description);
      setPriority(existingTodo.priority);
      setAssignedDate(new Date(existingTodo.assignedDate));
    }
  }, [existingTodo]);

  const handleSaveTodo = () => {
    if (!title.trim()) {
      alert('Task name is required');
      return;
    }

    const todoId = id ? parseInt(id.toString()) : Date.now();
    const formattedAssignedDate = `${assignedDate.getFullYear()}-${(assignedDate.getMonth() + 1).toString().padStart(2, '0')}-${assignedDate.getDate().toString().padStart(2, '0')}`;

    const updatedTodo: Todo = {
      id: todoId,
      title,
      description,
      priority,
      createdAt: existingTodo?.createdAt || new Date().toISOString(),
      assignedDate: formattedAssignedDate,
      completed: existingTodo?.completed || false,
      completedDate: existingTodo?.completedDate,
      timeSpent: existingTodo?.timeSpent || 0,
    };

    const navigate = () => router.push({
      pathname: '/(tabs)/todos',
      params: { date: updatedTodo.assignedDate }
    });

    if (id) {
      dispatch(updateTodo(updatedTodo.id, updatedTodo))
        .then(navigate)
        .catch((error: string) => console.error('Update failed:', error));
    } else {
      dispatch(addTodo(updatedTodo))
        .then(navigate)
        .catch((error: string) => console.error('Creation failed:', error));
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
              Task Name
            </Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              className="text-2xl rounded-none border-0 border-b-2 border-primary-600 text-primary-525 h-[60]"
              style={{ marginTop: 0, margin: 0 }}
            />
          </Box>

          <Box>
            <Text fontSize="md" color="primary.600" marginBottom={5} >
              Select Priority
            </Text>
            <HStack space={3}>
              {priorityOptions.map(({ value, label }) => (
                <Pressable key={value} onPress={() => setPriority(value)}>
                  <Badge
                    px={6}
                    py={2}
                    borderRadius="md"
                    colorScheme={priority === value ? 'purple.600' : 'primary.525'}
                    borderWidth={1}
                    borderColor={"primary.600"}
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
              Assigned Date
            </Text>
            <Pressable onPress={() => setDatePickerVisibility(true)} className="text-xl rounded-none border-0 border-b-2 border-primary-600 h-[40] mt-[15]">
              <Text fontSize="2xl" color="primary.525">
                {`${assignedDate.getFullYear()}-${(assignedDate.getMonth() + 1).toString().padStart(2, '0')}-${assignedDate.getDate().toString().padStart(2, '0')}`}
              </Text>
            </Pressable>
          </Box>
          <Box>
            <Text fontSize="md" color="primary.600" >
              Task Description
            </Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              className="text-2xl rounded-none border-1 border-b-2 border-primary-600 text-primary-525 min-h-[50]"
              multiline
              numberOfLines={6}
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
          >
            {id ? "Save" : 'Create Task'}
          </Button>
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            display="spinner"
            date={assignedDate}
            onConfirm={(date) => {

              const utcDate = new Date(Date.UTC(
                date.getFullYear(),
                date.getMonth(),
                date.getDate()
              ));
              setAssignedDate(utcDate);
              setDatePickerVisibility(false);
            }}
            onCancel={() => setDatePickerVisibility(false)}
          />
        </VStack>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
