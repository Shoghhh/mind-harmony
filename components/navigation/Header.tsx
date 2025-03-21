import colors from '@/styles/colors';
import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import globalTextStyles from '@/styles/globalTextStyles';
import { router } from 'expo-router';
import Icon from '@/assets/icons';
import globalStyles from '@/styles/globalStyles';

interface HeaderProps {
    title: string;
    showBack?: boolean;
    showEdit?: boolean;
    leftAction?: () => void;
}

const Header = memo(({ title, showBack, showEdit, leftAction }: HeaderProps) => {

    return (
        <View  style={styles.header}>
            {showBack && <TouchableOpacity onPress={() => router.back()} style={[styles.leftSection, showEdit ? { bottom: 10 } : {}]}>
                <Icon name="keyboard-arrow-left" library="MaterialIcons" color={colors.white} size={45} />
            </TouchableOpacity>}
            <View style={styles.centerSection}>
                <Text style={globalTextStyles.medium20SecondaryDark}>{title}</Text>
                {showEdit && <Text style={globalTextStyles.regular12Secondary}>Title</Text>}
            </View>
            {showEdit && <TouchableOpacity onPress={leftAction} style={styles.rightSection}>
                <Icon name="edit" library="FontAwesome5" color={colors.white} size={24} />
            </TouchableOpacity>}
        </View>
    );
});

Header.displayName = "HeaderComponent";

const styles = StyleSheet.create({
    header: {
        ...globalStyles.rowSpaceBetween,
        // backgroundColor: colors.secondary,
        paddingTop: 60,
        paddingBottom: 10,
        paddingHorizontal: 20,
        position: 'relative',
    },
    leftSection: {
        position: 'absolute',
        left: 10,
        bottom: 0,
    },
    centerSection: {
        flex: 1,
        alignItems: 'center'
    },
    rightSection: {
        position: 'absolute',
        right: 15,
        bottom: 20
    },
});


export default Header