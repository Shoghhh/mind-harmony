import React from 'react';
import { Box, Text, ScrollView, HStack, VStack, Pressable, Image } from 'native-base';
import { LineChart, ProgressChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Timestamp } from 'firebase/firestore';
import formatDate from '@/utils/formatDate';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import ProfileImage from '@/components/MyProfileImage';

const DashboardScreen = () => {
  const router = useRouter()
  const { todos } = useSelector((state: RootState) => state.todos);
  const { user } = useSelector((state: RootState) => state.auth);


  // Stats calculations
  const today = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 7);

  const parseTodoDate = (dateInput: Timestamp | Date | string): Date => {
    if (dateInput instanceof Timestamp) {
      return dateInput.toDate();
    }
    if (dateInput instanceof Date) {
      return dateInput;
    }
    return new Date(dateInput);
  };

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
  const priorityCounts = {
    high: todos.filter(todo => todo.priority === 1).length,
    medium: todos.filter(todo => todo.priority === 2).length,
    low: todos.filter(todo => todo.priority === 0).length
  };

  const totalTodos = todos.length || 1;

  const priorityData = {
    labels: ["High", "Medium", "Low"],
    data: [
      priorityCounts.high / totalTodos,
      priorityCounts.medium / totalTodos,
      priorityCounts.low / totalTodos
    ],
    colors: [
      'rgba(239, 68, 68, 0.8)',
      'rgba(245, 158, 11, 0.8)',
      'rgba(16, 185, 129, 0.8)'
    ]
  };

  const chartConfig = {
    backgroundGradientFrom: "#FFFFFF",
    backgroundGradientTo: "#FFFFFF",
    color: (opacity = 1) => `rgba(140, 139, 196, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    propsForLabels: {
      fontFamily: 'Arial'
    },
    propsForBackgroundLines: {
      strokeWidth: 0.5,
      strokeDasharray: [3, 3],
      stroke: 'rgba(140, 139, 196, 0.2)'
    },
    decimalPlaces: 2,
    style: {
      borderRadius: 16
    }
  };

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1: return 'rose.200';
      case 2: return 'amber.200';
      default: return 'emerald.200';
    }
  };

  const getPriorityText = (priority: number) => {
    switch (priority) {
      case 1: return 'High';
      case 2: return 'Medium';
      default: return 'Low';
    }
  };
  const getLastSevenDaysData = () => {
    const days = [];
    const completionData = [];
    const totalData = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      days.push(dayName);

      const todosForDay = todos.filter(todo => {
        const assignedDate = parseTodoDate(todo.assignedDate);
        return assignedDate.toDateString() === date.toDateString();
      });

      const completedForDay = todosForDay.filter(todo => todo.completed).length;
      completionData.push(completedForDay);
      totalData.push(todosForDay.length);
    }

    return { days, completionData, totalData };
  };
  const { days, completionData, totalData } = getLastSevenDaysData();
  const lineChartConfig = {
    backgroundColor: "#FFFFFF",
    backgroundGradientFrom: "#FFFFFF",
    backgroundGradientTo: "#FFFFFF",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(140, 139, 196, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: "4",
      strokeWidth: "2",
      stroke: "#8C8BC4"
    },
    propsForBackgroundLines: {
      strokeWidth: 0.5,
      strokeDasharray: [3, 3],
      stroke: 'rgba(140, 139, 196, 0.2)'
    }
  };

  return (
    <Box flex={1} mt={10} mb={70}>
      <ScrollView p="4" contentContainerStyle={{ paddingBottom: 50 }}>
        {/* Header with Profile Picture */}
        <HStack justifyContent="space-between" alignItems="center" mb="6">
          <VStack space={1}>
            <Text fontSize="2xl" fontWeight="bold" color="primary.950">
              Hello, {user?.displayName}!
            </Text>
            <Text fontSize="md" color="neutral.grayDark">
              {today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </Text>
          </VStack>
          <Pressable
            onPress={() => router.push("/profile")}
            p="2"
            bg="primary.100"
            borderRadius="full"
          >
            <ProfileImage />
          </Pressable>
        </HStack>

        {/* Stats Grid with Icons */}
        <VStack space={3} mb="6">
          {/* First Row */}
          <HStack space={3}>
            <Pressable
              onPress={() => console.log('View today\'s tasks')}
              flex={1}
              bg="neutral.white"
              p="4"
              borderRadius="xl"
              shadow={2}
              _pressed={{ opacity: 0.8 }}
            >
              <HStack alignItems="center" space={2} mb={2}>
                <Box p="2" bg="primary.100" borderRadius="full">
                  <Feather name="sun" size={16} color="#8C8BC4" />
                </Box>
                <Text fontSize="sm" color="neutral.grayDark">Today</Text>
              </HStack>
              <Text fontSize="2xl" fontWeight="bold" color="primary.600">
                {todosToday.length}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => console.log('View weekly report')}
              flex={1}
              bg="neutral.white"
              p="4"
              borderRadius="xl"
              shadow={2}
              _pressed={{ opacity: 0.8 }}
            >
              <HStack alignItems="center" space={2} mb={2}>
                <Box p="2" bg="primary.100" borderRadius="full">
                  <Feather name="calendar" size={16} color="#8C8BC4" />
                </Box>
                <Text fontSize="sm" color="neutral.grayDark">Last 7 Days</Text>
              </HStack>
              <Text fontSize="2xl" fontWeight="bold" color="primary.600">
                {todosLastSevenDays.length}
              </Text>
            </Pressable>
          </HStack>

          {/* Second Row */}
          <HStack space={3}>
            <Pressable
              onPress={() => console.log('View completed tasks')}
              flex={1}
              bg="neutral.white"
              p="4"
              borderRadius="xl"
              shadow={2}
              _pressed={{ opacity: 0.8 }}
            >
              <HStack alignItems="center" space={2} mb={2}>
                <Box p="2" bg="primary.100" borderRadius="full">
                  <Feather name="check-circle" size={16} color="#8C8BC4" />
                </Box>
                <Text fontSize="sm" color="neutral.grayDark">Completed</Text>
              </HStack>
              <Text fontSize="2xl" fontWeight="bold" color="primary.600">
                {completedTodos}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => console.log('View high priority tasks')}
              flex={1}
              bg="neutral.white"
              p="4"
              borderRadius="xl"
              shadow={2}
              _pressed={{ opacity: 0.8 }}
            >
              <HStack alignItems="center" space={2} mb={2}>
                <Box p="2" bg="primary.100" borderRadius="full">
                  <Feather name="alert-triangle" size={16} color="#8C8BC4" />
                </Box>
                <Text fontSize="sm" color="neutral.grayDark">High Priority</Text>
              </HStack>
              <Text fontSize="2xl" fontWeight="bold" color="primary.600">
                {highPriorityTodos}
              </Text>
            </Pressable>
          </HStack>
        </VStack>

        <VStack space={2} mb="6">
          <HStack justifyContent="space-between" alignItems="center">
            <Text fontSize="xl" fontWeight="bold" color="primary.950">
              Weekly Progress
            </Text>
            <Pressable
              onPress={() => console.log('View detailed weekly report')}
              _pressed={{ opacity: 0.5 }}
            >
              <Text color="primary.600" fontSize="sm">Details</Text>
            </Pressable>
          </HStack>

          <Box bg="white" borderRadius="xl" p="4" shadow={1}>
            <LineChart
              data={{
                labels: days,
                datasets: [
                  {
                    data: completionData,
                    color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`, // Green for completed
                    strokeWidth: 2
                  },
                  {
                    data: totalData,
                    color: (opacity = 1) => `rgba(140, 139, 196, ${opacity})`, // Purple for total
                    strokeWidth: 2
                  }
                ],
                legend: ["Completed", "Total Tasks"]
              }}
              width={Dimensions.get("window").width - 60}
              height={220}
              chartConfig={lineChartConfig}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16
              }}
            />

            {/* Custom Legend */}
            <HStack justifyContent="center" space={4} mt={2}>
              <HStack alignItems="center">
                <Box w="3" h="3" borderRadius="full" bg="emerald.400" mr={1} />
                <Text fontSize="xs" color="neutral.grayDark">Completed</Text>
              </HStack>
              <HStack alignItems="center">
                <Box w="3" h="3" borderRadius="full" bg="primary.600" mr={1} />
                <Text fontSize="xs" color="neutral.grayDark">Total Tasks</Text>
              </HStack>
            </HStack>
          </Box>
        </VStack>

        {/* Priority Distribution with Interactive Legend */}
        <VStack space={2} mb="6">
          <HStack justifyContent="space-between" alignItems="center">
            <Text fontSize="xl" fontWeight="bold" color="primary.950">
              Priority Distribution
            </Text>

          </HStack>

          <Box bg="white" borderRadius="xl" py={4} shadow={1}>
            <ProgressChart
              data={priorityData}
              width={Dimensions.get("window").width - 50}
              height={170}
              strokeWidth={13}
              // style={{backgroundColor: 'red', borderWidth: 1}}
              radius={32}
              chartConfig={chartConfig}
              hideLegend={false}
            />
          </Box>
        </VStack>

        {/* Today's Tasks Section */}
        <VStack space={2} mb="6">
          <HStack justifyContent="space-between" alignItems="center">
            <Text fontSize="xl" fontWeight="bold" color="primary.950">
              Today's Tasks
            </Text>
            <Pressable
              onPress={() => router.push("/(tabs)/todos/add")}
              _pressed={{ opacity: 0.5 }}
              flexDirection="row"
              alignItems="center"
            >
              <MaterialIcons name="add-circle" size={20} color="#8C8BC4" />
              <Text color="primary.600" fontSize="sm" ml={1}>New</Text>
            </Pressable>
          </HStack>

          {todosToday.length > 0 ? (
            todosToday.map((todo, index) => (
              <Pressable
                key={index}
                onPress={() => console.log('View/edit task details')}
                bg="white"
                p="4"
                borderRadius="xl"
                mb="3"
                shadow={1}
                _pressed={{ opacity: 0.8 }}
              >
                <HStack justifyContent="space-between" alignItems="center" mb="2">
                  <Text fontSize="lg" fontWeight="600" color="primary.950" flex={1}>
                    {todo.title}
                  </Text>
                  <Box
                    bg={getPriorityColor(todo.priority)}
                    px="3"
                    py="1"
                    borderRadius="full"
                    flexDirection="row"
                    alignItems="center"
                  >
                    <Feather
                      name={todo.priority === 1 ? 'alert-triangle' : 'info'}
                      size={12}
                      color={todo.priority === 1 ? '#ef4444' : todo.priority === 2 ? '#f59e0b' : '#10b981'}
                      style={{ marginRight: 4 }}
                    />
                    <Text fontSize="xs" fontWeight="600">
                      {getPriorityText(todo.priority)}
                    </Text>
                  </Box>
                </HStack>
                <Text fontSize="sm" color="neutral.grayDark" mb="2" numberOfLines={2}>
                  {todo.description}
                </Text>
                <HStack alignItems="center" space={1}>
                  <Feather name="clock" size={12} color="#8C8BC4" />
                  <Text fontSize="xs" color="primary.600">
                    {formatDate(todo.assignedDate)}
                  </Text>
                </HStack>
              </Pressable>
            ))
          ) : (
            <Pressable
              onPress={() => router.push("/(tabs)/todos/add")}
              bg="neutral.white"
              p="6"
              borderRadius="xl"
              alignItems="center"
              _pressed={{ opacity: 0.8 }}
            >
              <Feather name="plus-circle" size={24} color="#8C8BC4" />
              <Text color="primary.600" mt={2}>Add your first task</Text>
            </Pressable>
          )}
        </VStack>

        {/* Upcoming Tasks Section */}
        <VStack space={2}>
          <HStack justifyContent="space-between" alignItems="center">
            <Text fontSize="xl" fontWeight="bold" color="primary.950">
              Upcoming Tasks
            </Text>
            <Pressable
              onPress={() => router.push('/(tabs)/todos')}
              _pressed={{ opacity: 0.5 }}
            >
              <Text color="primary.600" fontSize="sm">View All</Text>
            </Pressable>
          </HStack>

          {upcomingTodos.length > 0 ? (
            upcomingTodos.slice(0, 3).map((todo, index) => (
              <Pressable
                key={index}
                onPress={() => console.log('View/edit upcoming task')}
                bg="white"
                p="4"
                borderRadius="xl"
                mb="3"
                shadow={1}
                _pressed={{ opacity: 0.8 }}
              >
                <HStack justifyContent="space-between" alignItems="center" mb="2">
                  <Text fontSize="lg" fontWeight="600" color="primary.950" flex={1}>
                    {todo.title}
                  </Text>
                  <Box
                    bg={getPriorityColor(todo.priority)}
                    px="3"
                    py="1"
                    borderRadius="full"
                    flexDirection="row"
                    alignItems="center"
                  >
                    <Feather
                      name={todo.priority === 1 ? 'alert-triangle' : 'calendar'}
                      size={12}
                      color={todo.priority === 1 ? '#ef4444' : todo.priority === 2 ? '#f59e0b' : '#10b981'}
                      style={{ marginRight: 4 }}
                    />
                    <Text fontSize="xs" fontWeight="600">
                      {getPriorityText(todo.priority)}
                    </Text>
                  </Box>
                </HStack>
                <Text fontSize="sm" color="neutral.grayDark" mb="2" numberOfLines={2}>
                  {todo.description}
                </Text>
                <HStack alignItems="center" space={1}>
                  <Feather name="calendar" size={12} color="#8C8BC4" />
                  <Text fontSize="xs" color="primary.600">
                    Due {formatDate(todo.assignedDate)}
                  </Text>
                </HStack>
              </Pressable>
            ))
          ) : (
            <Box bg="neutral.white" p="4" borderRadius="xl" alignItems="center">
              <Feather name="check" size={24} color="#8C8BC4" />
              <Text color="primary.600" mt={2}>No upcoming tasks</Text>
            </Box>
          )}
        </VStack>
      </ScrollView>
    </Box>
  );
};

export default DashboardScreen;