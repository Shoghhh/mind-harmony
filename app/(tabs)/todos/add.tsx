import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Dropdown from '@/components/Dropdown';
import colors from '@/styles/colors';
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
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={[styles.input, styles.multilineInput]}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
      />
      <Dropdown
        options={[PriorityLabels[Priority.Low], PriorityLabels[Priority.Medium], PriorityLabels[Priority.High]]}
        selectedOption={priority}
        onSelect={setPriority}
        style={styles.dropdown}
      />
      <TouchableOpacity onPress={() => setDatePickerVisibility(true)} style={styles.datePickerButton}>
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

      <TouchableOpacity style={styles.saveButton} onPress={handleSaveTodo}>
        <Text style={globalTextStyles.medium14White}>Save To do</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: colors.background },
  input: {
    borderColor: colors.grayLight,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    backgroundColor: colors.white,
  },
  multilineInput: {
    textAlignVertical: 'top',
    height: 100,
  },
  dropdown: {
    marginVertical: 10,
  },
  datePickerButton: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: colors.secondaryLight,
    borderRadius: 5,
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: colors.secondary,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
});

;
