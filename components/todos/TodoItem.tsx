// import React from 'react';
// import { Box, HStack, VStack, Text, Badge, IconButton, Pressable, useTheme } from 'native-base';
// import { Swipeable } from 'react-native-gesture-handler';
// import { MaterialIcons } from '@expo/vector-icons';
// import moment from 'moment';
// import { useRouter } from 'expo-router';
// import { Todo } from '@/types';

// const TodoItem = ({ item, viewMode, onDelete, onToggleComplete } : any) => {
//     const router = useRouter();
//     const theme = useTheme();
//     const { title, createdDate, completed, completedDate, priority, description } = item;

//     const priorityColors = ["purple.400", "yellow.400", "red.400"];
//     const priorityText = ["Low", "Medium", "High"];

//     const formatDate = (dateStr: string) => {
//         const date = moment(dateStr);
//         return date.isSame(moment(), 'day') ? `Today, ${date.format('hh:mm A')}` : date.format('MMM D, hh:mm A');
//     };

//     return (
//         <Swipeable
//             renderLeftActions={() => (
//                 !completed && viewMode !== 'list' && (
//                     <Box bg="green.400" px={4} justifyContent="center" roundedLeft="lg">
//                         <IconButton icon={<MaterialIcons name="check" size={24} color="white" />} onPress={onToggleComplete} />
//                     </Box>
//                 )
//             )}
//             renderRightActions={() => (
//                 <Box bg="red.500" px={4} justifyContent="center" roundedRight="lg">
//                     <IconButton icon={<MaterialIcons name="delete" size={24} color="white" />} onPress={onDelete} />
//                 </Box>
//             )}
//         >
//             <Pressable
//                 onPress={() => router.push({ pathname: '/(tabs)/todos/[id]', params: { id: item.id, name: item.title } })}
//             >
//                 <Box bg={completed ? "gray.200" : "white"} p={4} m={2} borderRadius="lg" shadow={2}>
//                     <HStack justifyContent="space-between" alignItems="center">
//                         <VStack flex={1}>
//                             <Text fontSize="lg" bold textDecorationLine={completed ? 'line-through' : 'none'}>{title}</Text>
//                             {description ? <Text fontSize="sm" color="gray.500" numberOfLines={2}>{description}</Text> : null}
//                         </VStack>
//                         <Badge colorScheme={priorityColors[priority]}>{priorityText[priority]}</Badge>
//                     </HStack>
//                     <HStack justifyContent="space-between" alignItems="center" mt={2}>
//                         <Text fontSize="xs" color="gray.500">{completed ? `Completed: ${formatDate(completedDate)}` : `Added: ${formatDate(createdDate)}`}</Text>
//                         <IconButton
//                             icon={<MaterialIcons name={completed ? "check-circle" : "radio-button-unchecked"} size={24} color={theme.colors.purple[500]} />}
//                             onPress={onToggleComplete}
//                         />
//                     </HStack>
//                 </Box>
//             </Pressable>
//         </Swipeable>
//     );
// };

// export default TodoItem;



//todo
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import colors from '@/styles/colors';
import globalStyles from '@/styles/globalStyles';
import moment from 'moment';
import { useRouter } from 'expo-router';
// import { icons } from '@/assets/icons';
import globalTextStyles from '@/styles/globalTextStyles';
import { Todo } from '@/types';

const TodoItem = ({
    item,
    viewMode,
    onDelete,
    onToggleComplete,
}: {
    item: Todo;
    viewMode: string
    onDelete: () => void;
    onToggleComplete: () => void;
}) => {
    const router = useRouter()
    const { title, createdDate, completed, completedDate, priority, description } = item;

    // const getPriorityColor = (priority: number) => {
    //     const colorsMap = [colors.primaryLight, colors.warning, colors.error];
    //     return colorsMap[priority] || colors.primaryLight;
    // };

    const formatDate = (dateStr: string) => {
        const date = moment(dateStr);
        const now = moment();

        if (date.isSame(now, 'year')) {
            if (date.isSame(now, 'day')) return `Today, ${date.format('hh:mm A')}`;
            if (date.isSame(now.subtract(1, 'day'), 'day')) return `Yesterday, ${date.format('hh:mm A')}`;
            if (date.isSame(now, 'week')) return `${date.format('dddd')}, ${date.format('hh:mm A')}`;
            return date.format('MMMM D, hh:mm A');
        }
        return date.format('MMMM D, YYYY, hh:mm A');
    };

    const renderLeftActions = () => (
        <TouchableOpacity onPress={onToggleComplete} style={styles.leftAction}>
            {/* {icons['check']()} */}
        </TouchableOpacity>
    );

    const renderRightActions = () => (
        <TouchableOpacity onPress={onDelete} style={styles.rightAction}>
            {/* {icons['trash']()} */}
        </TouchableOpacity>
    );

    return (
        <Swipeable
            renderLeftActions={completed || viewMode === 'list' ? () => null : renderLeftActions}
            renderRightActions={renderRightActions}
            onSwipeableOpen={(direction) => (direction === 'right' ? onDelete() : completed || viewMode === 'list' ? null : onToggleComplete())}
        >
            <TouchableOpacity
                style={[
                    styles.taskItem,
                    // completed && { backgroundColor: colors.backgroundLight },
                ]}

                onPress={() => router.push({
                    pathname: '/(tabs)/todos/[id]',
                    params: { id: item.id, name: item.title },
                })}
            >
                <View style={styles.titlePriorityContainer}>
                    {/* <Text style={[styles.taskTitle, completed && { textDecorationLine: 'line-through', textDecorationColor: colors.primary, fontWeight: 'light' }]}>{title}</Text> */}
                    <View
                        style={[
                            styles.priorityCircle,
                            // { backgroundColor: getPriorityColor(priority) },
                        ]}
                    />
                </View>

                {description && (
                    <Text style={styles.taskDescription} numberOfLines={2}>
                        {description}
                    </Text>
                )}

                <View style={globalStyles.rowSpaceBetween}>
                    <Text style={globalTextStyles.regular12Secondary}>
                        {completed && completedDate
                            ? `Completed on: ${formatDate(completedDate)}`
                            : `Added on: ${formatDate(createdDate)}`}
                    </Text>
                    {<TouchableOpacity onPress={onToggleComplete}>
                        {/* {icons[completed ? 'check' : 'uncheckedCircle']()} */}
                    </TouchableOpacity>}
                </View>
            </TouchableOpacity>
        </Swipeable>
    );
};

const styles = StyleSheet.create({
    taskItem: {
        backgroundColor: colors.white,
        padding: 18,
        marginVertical: 12,
        marginHorizontal: 8,
        borderRadius: 12,
        boxShadow: '0px 3px 8px rgba(0, 0, 0, 0.4)',  // boxShadow for iOS
        elevation: Platform.OS === 'android' ? 5 : 0,  // For Android
    },
    taskTitle: {
        ...globalTextStyles.bold18Primary,
        flex: 1,
    },
    priorityCircle: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginTop: 5,
    },
    taskDescription: {
        ...globalTextStyles.regular14Primary,
        marginBottom: 5,
    },
    leftAction: {
        flex: 1,
        // backgroundColor: colors.secondaryLight,
        ...globalStyles.justifyCenter,
        ...globalStyles.alignStart,
        paddingLeft: 20,
        borderRadius: 12,
    },
    rightAction: {
        flex: 1,
        // backgroundColor: colors.lightError,
        ...globalStyles.justifyCenter,
        ...globalStyles.alignEnd,
        paddingRight: 20,
        borderRadius: 12,
    },
    titlePriorityContainer: {
        ...globalStyles.rowSpaceBetween,
        ...globalStyles.alignStart,
        marginBottom: 10,
    }
});

export default TodoItem;
