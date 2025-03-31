import React, { useCallback } from 'react';
import {
  Box,
  Text,
  Button,
  ScrollView,
  Pressable,
  useTheme,
  HStack,
  VStack,
  Icon,
  useColorModeValue
} from 'native-base';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { useBottomSheet } from '@/providers/BottomSheetProvider';
import SettingsComponent from './PomodoroSettings';
import { usePomodoro } from '@/providers/PomodoroContext';
import ProgressIndicator from './ProgressIndicator';
import { useDispatch, useSelector } from 'react-redux';
import TodoSelectionComponent from './TodoSelectionComponent';
import { RootState } from '@/store/store';
import { usePomodoroTimer } from '@/hooks/usePomodoroTimer';
import { useTimeTracking } from '@/hooks/useTimeTracking';
import { useTimerFeedback } from '@/hooks/useTimerFeedback';
import { Alert } from 'react-native';

type TimerMode = "pomodoro" | "shortRest" | "longRest";

const PomodoroTimer = () => {
  const { colors } = useTheme();
  const { present } = useBottomSheet();

  const {
    pomodoroTime,
    shortRestTime,
    longRestTime,
    cyclesBeforeLongRest,
    selectedTodoId,
    setSelectedTodoId,
    progressStyle,
    autoStart,
    autoSwitch
  } = usePomodoro();

  const todo = useSelector((state: RootState) =>
    state.todos.todos.find((item) => item.id === selectedTodoId)
  );

  const { playSound, triggerFeedback } = useTimerFeedback();
  const dispatch = useDispatch()

  const {
    state,
    startTimer,
    stopTimer,
    resetTimer,
    skipTimer,
    changeMode,
    handleTodoSelection,
    completeCurrentTodo
  } = usePomodoroTimer({
    pomodoroTime,
    shortRestTime,
    longRestTime,
    cyclesBeforeLongRest,
    onModeTransition: () => {
      playSound();
      triggerFeedback();
    },
    selectedTodoId,
    setSelectedTodoId,
    autoStart,
    autoSwitch,
    dispatch,
  });

  useTimeTracking(state.isActive, state.mode, todo?.id);

  // Color scheme
  const cardBg = useColorModeValue('#ffffff9A', 'primary.900');
  const textColor = useColorModeValue('primary.900', 'primary.100');
  const secondaryText = useColorModeValue('primary.600', 'primary.300');

  const openSettingsSheet = useCallback(() => {
    present(SettingsComponent);
  }, [present]);

  const openTodosSelectionSheet = useCallback(() => {
    present(() => <TodoSelectionComponent onSelect={handleTodoSelection} />);
  }, [present]);

  return (
    <Box flex={1} mb={70}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }}>
        <VStack space={4} alignItems="center" pt={6} px={6}>
          <HStack space={3} bg={cardBg} p={1.5} rounded="xl" shadow={1}>
            {(['pomodoro', 'shortRest', 'longRest'] as TimerMode[]).map((mode) => (
              <Pressable
                key={mode}
                onPress={() => !state.isActive && changeMode(mode)}
                bg={state.mode === mode ? colors.primary[600] : 'transparent'}
                px={4}
                py={2}
                rounded="lg"
                _pressed={{ opacity: 0.8 }}
              >
                <Text fontSize="sm" fontWeight="medium" color={state.mode === mode ? 'white' : secondaryText}>
                  {mode === 'pomodoro' ? 'Focus' :
                    mode === 'shortRest' ? 'Short Break' : 'Long Break'}
                </Text>
              </Pressable>
            ))}
          </HStack>

          <Box bg={cardBg} p={2} rounded="full" shadow={3} width={'100%'}>
            <ProgressIndicator
              currentTime={state.time}
              totalTime={state.mode === 'pomodoro' ? pomodoroTime :
                state.mode === 'shortRest' ? shortRestTime : longRestTime}
              mode={state.mode}
              cycles={state.cycles}
              type={progressStyle}
            />
          </Box>

          <Text color={secondaryText} textAlign="center">
            {state.mode === 'pomodoro' ? 'Time to focus!' : 'Take a well-deserved break'}
          </Text>

          {selectedTodoId && todo && (
            <Pressable
              onPress={openTodosSelectionSheet}
              bg={cardBg}
              p={3}
              rounded="xl"
              w="full"
              shadow={1}
              _pressed={{ opacity: 0.8 }}
            >
              <VStack space={2}>
                <HStack justifyContent="space-between" alignItems="center">
                  <Text fontSize="lg" fontWeight="bold" color={textColor} flexShrink={1}>
                    {todo.title}
                  </Text>
                  <Pressable
                    onPress={(e) => {
                      e.stopPropagation();
                      Alert.alert(
                        "Complete Task",
                        "Mark this as completed and reset timer?",
                        [
                          { text: "Cancel", style: "cancel" },
                          {
                            text: "Complete",
                            onPress: completeCurrentTodo,
                            style: "default"
                          }
                        ]
                      );
                    }}
                    p={2}
                    px={3}
                    rounded="md"
                    bg="emerald.500"
                    _pressed={{ bg: "emerald.600", opacity: 0.9 }}
                    flexDirection="row"
                    alignItems="center"
                  >
                    <Icon
                      as={Feather}
                      name="check"
                      color="white"
                      size={4}
                      mr={1}
                    />
                    <Text color="white" fontSize="xs" fontWeight="medium">
                      Done
                    </Text>
                  </Pressable>
                </HStack>

                {todo.description && (
                  <Text fontSize="sm" color={secondaryText} numberOfLines={1}>
                    {todo.description}
                  </Text>
                )}

                <HStack alignItems="center" space={2} mt={1}>
                  <Icon as={Feather} name="check-circle" color="primary.500" size={4} />
                  <Text fontSize="xs" color="primary.500">
                    {state.cycles - 1} pomodoros completed
                  </Text>
                </HStack>
              </VStack>
            </Pressable>
          )}

        </VStack>

        <VStack space={4} width="100%" pb={8} px={6} mt={8}>
          {!selectedTodoId && (
            <Button
              leftIcon={<Icon as={Feather} name="plus" size="md" />}
              onPress={openTodosSelectionSheet}
              variant="outline"
              borderColor="primary.600"
              borderWidth={2}
              _text={{ color: textColor, fontWeight: 'medium' }}
              _pressed={{ bg: 'primary.100' }}
              py={3}
              rounded="xl"
            >
              Select a Todo
            </Button>
          )}

          <Button
            leftIcon={<Icon as={MaterialIcons} name={state.isActive ? "pause" : "play-arrow"} size="md" />}
            onPress={state.isActive ? stopTimer : startTimer}
            bg={state.isActive ? 'primary.300' : 'primary.600'}
            _pressed={{ opacity: 0.8, bg: state.isActive ? 'primary.600' : 'primary.550' }}
            _text={{ fontWeight: 'bold' }}
            py={4}
            rounded="xl"
            shadow={3}
          >
            {state.isActive ? "Pause" : "Start Focus"}
          </Button>

          <HStack space={3}>
            <Button
              flex={1}
              leftIcon={<Icon as={Feather} name="skip-forward" size="md" />}
              onPress={skipTimer}
              bg="primary.600"
              _pressed={{ opacity: 0.8 }}
              _text={{ fontWeight: 'medium' }}
              py={3}
              rounded="xl"
            >
              Skip
            </Button>
            <Button
              flex={1}
              leftIcon={<Icon as={Feather} name="refresh-ccw" size="md" />}
              onPress={resetTimer}
              variant="outline"
              borderColor="primary.600"
              borderWidth={2}
              _text={{ color: textColor, fontWeight: 'medium' }}
              _pressed={{ bg: 'primary.100' }}
              py={3}
              rounded="xl"
            >
              Reset
            </Button>
          </HStack>

          <Button
            leftIcon={<Icon as={Feather} name="settings" size="md" />}
            onPress={openSettingsSheet}
            variant="ghost"
            _text={{ color: secondaryText }}
            _pressed={{ opacity: 0.6 }}
          >
            Timer Settings
          </Button>
        </VStack>
      </ScrollView>
    </Box>
  );
};

export default PomodoroTimer;