import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import colors from '@/styles/colors';
import globalStyles from '@/styles/globalStyles';
import moment from 'moment';
import { useRouter } from 'expo-router';
import { icons } from '@/assets/icons';
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

    const getPriorityColor = (priority: number) => {
        const colorsMap = [colors.primaryLight, colors.warning, colors.error];
        return colorsMap[priority] || colors.primaryLight;
    };

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
            {icons['check']()}
        </TouchableOpacity>
    );

    const renderRightActions = () => (
        <TouchableOpacity onPress={onDelete} style={styles.rightAction}>
            {icons['trash']()}
        </TouchableOpacity>
    );

    return (
        <GestureHandlerRootView>
            <Swipeable
                renderLeftActions={completed || viewMode === 'list' ? () => null : renderLeftActions}
                renderRightActions={renderRightActions}
                onSwipeableOpen={(direction) => (direction === 'right' ? onDelete() : completed || viewMode === 'list' ? null : onToggleComplete())}
            >
                <TouchableOpacity
                    style={[
                        styles.taskItem,
                        completed && { backgroundColor: colors.backgroundLight },
                    ]}

                    onPress={() => router.push({
                        pathname: '/(tabs)/todos/[id]',
                        params: { id: item.id, name: item.title },
                    })}
                >
                    <View style={styles.titlePriorityContainer}>
                        <Text style={[styles.taskTitle, completed && { textDecorationLine: 'line-through', textDecorationColor: colors.primary, fontWeight: 'light' }]}>{title}</Text>
                        <View
                            style={[
                                styles.priorityCircle,
                                { backgroundColor: getPriorityColor(priority) },
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
                            {icons[completed ? 'check' : 'uncheckedCircle']()}
                        </TouchableOpacity>}
                    </View>
                </TouchableOpacity>
            </Swipeable>
        </GestureHandlerRootView>
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
        backgroundColor: colors.secondaryLight,
        ...globalStyles.justifyCenter,
        ...globalStyles.alignStart,
        paddingLeft: 20,
        borderRadius: 12,
    },
    rightAction: {
        flex: 1,
        backgroundColor: colors.lightError,
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
