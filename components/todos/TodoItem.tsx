import React, { useRef, useState } from 'react';
import { Box, HStack, VStack, Text, Badge, IconButton, useTheme } from 'native-base';
import { Swipeable } from 'react-native-gesture-handler';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';

import { MaterialIcons } from '@expo/vector-icons';
import moment from 'moment';
import { useRouter } from 'expo-router';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { ActivityIndicator, Pressable } from 'react-native';
import colors from '@/styles/colors';
import { Todo } from '@/types';
import formatDate from '@/utils/formatDate';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

interface TodoItemProps {
    item: Todo;
    viewMode: 'list' | 'tabbed';
    onDelete: () => void;
    onToggleComplete: () => void;
    loading: boolean
}


const TodoItem = gestureHandlerRootHOC(({ item, viewMode, onDelete, onToggleComplete, loading }: TodoItemProps) => {
    const router = useRouter();
    const theme = useTheme();
    const { title, createdAt, completed, completedDate, priority, description } = item;
    const priorityColors = ["green.400", "yellow.400", "red.400"];
    const [measuredHeight, setMeasuredHeight] = useState<number | null>(null);
    const height = useSharedValue(measuredHeight || 153);
    const opacity = useSharedValue(1);
    const translateX = useSharedValue(0);

    const handleLayout = (event: any) => {
        const { height: newHeight } = event.nativeEvent.layout;
        if (measuredHeight === null) {
            setMeasuredHeight(newHeight);
            height.value = newHeight;
        }
    };

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
        height: height.value,
        opacity: opacity.value,
        overflow: 'hidden',
    }));

    const handleDelete = () => {
        height.value = withTiming(0, { duration: 300 });
        opacity.value = withTiming(0, { duration: 250 }, () => {
            runOnJS(onDelete)();
        });
    };

    const handleSwipe = (direction: string) => {
        height.value = withTiming(0, { duration: 300 });
        const toValue = direction === 'right' ? -500 : 500;
        translateX.value = withTiming(toValue, { duration: 300 }, () => {
            if (direction === 'right') {
                runOnJS(handleDelete)();
            } else if (!completed && viewMode !== 'list') {
                runOnJS(onToggleComplete)();
            }
        });
    }

    return (
        <Animated.View style={animatedStyle}>
            <Swipeable
                friction={1}
                leftThreshold={20}
                rightThreshold={20}
                renderLeftActions={() => (
                    !completed && viewMode !== 'list' && (
                        <Animated.View style={[animatedStyle, { flex: 1 }]}>
                            <Box bg="green.400" flex={1} justifyContent="center" roundedLeft="lg" className='flex'>
                                <IconButton icon={<MaterialIcons name="check" size={24} color="white" />} onPress={onToggleComplete} />
                            </Box>
                        </Animated.View>
                    )
                )}
                renderRightActions={() => (
                    <Animated.View style={[animatedStyle, { flex: 1 }]}>
                        <Box bg="red.500" flex={1} justifyContent="center" roundedRight="lg">
                            <IconButton icon={<MaterialIcons name="delete" size={24} color="white" />} onPress={onDelete} />
                        </Box>
                    </Animated.View>
                )}
                onSwipeableOpen={(direction) => handleSwipe(direction)}
            >
                <Pressable
                    onLayout={handleLayout}
                    onPress={() => router.push({ pathname: '/(tabs)/todos/[id]', params: { id: item.id, name: item.title } })}
                >
                    <Box bg={completed ? "purple.50" : "white"} p={3} m={2} borderRadius="lg" shadow={2} borderLeftWidth={4} borderColor={priorityColors[priority]}>
                        <HStack justifyContent="space-between" alignItems="center">
                            <VStack flex={1}>
                                <Text fontSize="lg" bold textDecorationLine={completed ? 'line-through' : 'none'} color={colors.primary[980]}>{title}</Text>
                                {description ? <Text fontSize="sm" color="gray.500" numberOfLines={2}>{description}</Text> : null}
                            </VStack>
                            {/* <Badge colorScheme={priorityColors[priority]}>{priorityText[priority]}</Badge> */}
                        </HStack>
                        <HStack justifyContent="space-between" alignItems="center" mt={1}>
                            <Text fontSize="xs" color="gray.500">{completed ? `Completed: ${formatDate(completedDate)}` : `Added: ${formatDate(createdAt)}`}</Text>
                            <IconButton
                                icon={
                                    loading ? (
                                        <ActivityIndicator size="small" style={{ height: 24 }} color={colors.primary[500]} />
                                    ) : (
                                        <MaterialIcons
                                            name={completed ? "check-circle" : "radio-button-unchecked"}
                                            size={24}
                                            color={theme.colors.purple[500]}
                                        />
                                    )
                                }
                                onPress={onToggleComplete}
                                isDisabled={loading}
                            />
                        </HStack>
                    </Box>
                </Pressable>
            </Swipeable>
        </Animated.View>
    );
});

export default TodoItem;


