import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ProgressChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { useDispatch } from 'react-redux';
import { fetchTodos } from '@/features/todos/todosThunks';
import { Timestamp } from 'firebase/firestore';
import formatDate from '@/utils/formatDate';

const DashboardScreen = () => {
  const userName = "User";
  const { todos } = useSelector((state: RootState) => state.todos)



  // Stats calculations
  const today = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 7);

  // Helper function to convert to Date object
  const parseTodoDate = (dateInput: Timestamp | Date | string): Date => {
    if (dateInput instanceof Timestamp) {
      return dateInput.toDate();
    }
    if (dateInput instanceof Date) {
      return dateInput;
    }
    return new Date(dateInput); // fallback for string dates
  };

  // Filtering logic using proper date comparison
  const todosToday = todos.filter(todo => {
    const assignedDate = parseTodoDate(todo.assignedDate);
    return assignedDate.toDateString() === today.toDateString();
  });

  const todosLastSevenDays = todos.filter(todo => {
    const assignedDate = parseTodoDate(todo.assignedDate);
    return assignedDate >= sevenDaysAgo && assignedDate <= today;
  });

  const upcomingTodos = todos.filter(todo => {
    const assignedDate = parseTodoDate(todo.assignedDate);
    return !todo.completed && assignedDate > today;
  });

  const completedTodos = todos.filter(todo => todo.completed).length;
  const highPriorityTodos = todos.filter(todo => todo.priority === 1).length;

  // Priority distribution for chart
  const priorityData = {
    labels: ["High", "Medium", "Low"],
    data: [
      todos.filter(todo => todo.priority === 2).length / todos.length || 0,
      todos.filter(todo => todo.priority === 1).length / todos.length || 0,
      todos.filter(todo => todo.priority === 0).length / todos.length || 0,
    ]
  };

  const chartConfig = {
    backgroundGradientFrom: "#FAE6FA",
    backgroundGradientTo: "#FAE6FA",
    color: (opacity = 1) => `rgba(140, 139, 196, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello, {userName}!</Text>
        <Text style={styles.date}>{today.toDateString()}</Text>
      </View>

      {/* Stats Overview */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{todosToday.length}</Text>
          <Text style={styles.statLabel}>Today</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{todosLastSevenDays.length}</Text>
          <Text style={styles.statLabel}>Last 7 Days</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{completedTodos}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{highPriorityTodos}</Text>
          <Text style={styles.statLabel}>High Priority</Text>
        </View>
      </View>

      {/* Priority Distribution */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Priority Distribution</Text>
        <View style={styles.chartContainer}>
          <ProgressChart
            data={priorityData}
            width={Dimensions.get("window").width - 40}
            height={220}
            strokeWidth={16}
            radius={32}
            chartConfig={chartConfig}
            hideLegend={false}
          />
        </View>
      </View>

      {/* Today's Tasks */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today's Tasks</Text>
        {todosToday.length > 0 ? (
          todosToday.map((todo, index) => (
            <TouchableOpacity key={index} style={styles.taskCard}>
              <View style={styles.taskHeader}>
                <Text style={styles.taskTitle}>{todo.title}</Text>
                <View style={[
                  styles.priorityBadge,
                  todo.priority === 1 ? styles.highPriority :
                    todo.priority === 2 ? styles.mediumPriority :
                      styles.lowPriority
                ]}>
                  <Text style={styles.priorityText}>
                    {todo.priority === 1 ? "High" : todo.priority === 2 ? "Medium" : "Low"}
                  </Text>
                </View>
              </View>
              <Text style={styles.taskDescription} numberOfLines={2}>{todo.description}</Text>
              <Text style={styles.taskTime}>
              {formatDate(todo.assignedDate)}
              </Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.emptyMessage}>No tasks for today</Text>
        )}
      </View>

      {/* Upcoming Tasks */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upcoming Tasks</Text>
        {upcomingTodos.length > 0 ? (
          upcomingTodos.slice(0, 3).map((todo, index) => (
            <TouchableOpacity key={index} style={styles.taskCard}>
              <View style={styles.taskHeader}>
                <Text style={styles.taskTitle}>{todo.title}</Text>
                <View style={[
                  styles.priorityBadge,
                  todo.priority === 1 ? styles.highPriority :
                    todo.priority === 2 ? styles.mediumPriority :
                      styles.lowPriority
                ]}>
                  <Text style={styles.priorityText}>
                    {todo.priority === 1 ? "High" : todo.priority === 2 ? "Medium" : "Low"}
                  </Text>
                </View>
              </View>
              <Text style={styles.taskDescription} numberOfLines={2}>{todo.description}</Text>
              <Text style={styles.taskDate}>
              {formatDate(todo.assignedDate)}
              </Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.emptyMessage}>No upcoming tasks</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#FAE6FA',
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#301934',
  },
  date: {
    fontSize: 16,
    color: '#4B5563',
    marginTop: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    width: '48%',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8C8BC4',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#4B5563',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#301934',
    marginBottom: 15,
  },
  chartContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  taskCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#301934',
    flex: 1,
  },
  priorityBadge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginLeft: 10,
  },
  highPriority: {
    backgroundColor: 'rgba(255, 59, 48, 0.2)',
  },
  mediumPriority: {
    backgroundColor: 'rgba(255, 149, 0, 0.2)',
  },
  lowPriority: {
    backgroundColor: 'rgba(52, 199, 89, 0.2)',
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '600',
  },
  taskDescription: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 8,
  },
  taskTime: {
    fontSize: 12,
    color: '#8C8BC4',
  },
  taskDate: {
    fontSize: 12,
    color: '#8C8BC4',
  },
  emptyMessage: {
    textAlign: 'center',
    color: '#4B5563',
    fontStyle: 'italic',
    marginVertical: 15,
  },
});

export default DashboardScreen;