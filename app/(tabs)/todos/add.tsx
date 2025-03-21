import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import globalTextStyles from '@/styles/globalTextStyles';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Priority, PriorityLabels } from '@/utils/constants';
import { Todo } from '@/types';
import { useDispatch } from 'react-redux';
import { addTodo, updateTodo } from '@/features/todos/todosThunks';
import { AppDispatch, RootState } from '@/store/store';
import { useSelector } from 'react-redux';

export default function AddTodo() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>()
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
  }))

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
      Alert.alert('Validation Error', 'Title is required!');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Validation Error', 'Description is required!');
      return;
    }

    const newTodo: Todo = {
      id: id ? parseInt(id as string) : Date.now(),
      title,
      description,
      priority,
      createdDate: new Date().toISOString(),
      assignedDate: assignedDate.toISOString().split('T')[0],
      completed: false,
    };

    const navigate = () => router.push({ pathname: '/(tabs)/todos', params: { date: newTodo.assignedDate } })

    if (id) {
      dispatch(updateTodo(newTodo.id, newTodo)).finally(navigate);
    } else {
      dispatch(addTodo(newTodo)).finally(navigate);
    }
  };

  const handleDateChange = (date: Date) => {
    setAssignedDate(date);
    setDatePickerVisibility(false);
  };

  return (
    <View>
      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
      />
      {/* <Dropdown
        options={priorityOptions}
        selectedOption={PriorityLabels[priority]}
        onSelect={setPriority}
      /> */}
      <TouchableOpacity onPress={() => setDatePickerVisibility(true)}>
        <Text style={globalTextStyles.medium16Primary}>
          Assigned Date: {assignedDate.toISOString().split('T')[0]}
        </Text>
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        date={assignedDate}
        onConfirm={handleDateChange}
        onCancel={() => setDatePickerVisibility(false)}
        minimumDate={new Date()}
      />

      <TouchableOpacity onPress={handleSaveTodo}>
        <Text style={globalTextStyles.medium14White}>Save To do</Text>
      </TouchableOpacity>
    </View>
  );
};
