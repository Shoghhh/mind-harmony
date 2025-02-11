import colors from '@/styles/colors';
import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import globalTextStyles from '@/styles/globalTextStyles';
import { router } from 'expo-router';
import { icons } from '@/assets/icons';
import globalStyles from '@/styles/globalStyles';

interface HeaderProps {
    title: string;
    showBack?: boolean;
    showEdit?: boolean;
    leftAction?: () => void;
}

const Header = memo(({ title, showBack, showEdit, leftAction }: HeaderProps) => {

    return (
        <LinearGradient colors={[colors.secondary, colors.background,]} style={styles.header}>
            {showBack && <TouchableOpacity onPress={() => router.back()} style={[styles.leftSection, showEdit ? { bottom: 10 } : {}]}>
                {icons['keyArrowLeft']({ color: colors.secondaryDark, size: 45 })}
            </TouchableOpacity>}
            <View style={styles.centerSection}>
                <Text style={globalTextStyles.medium20SecondaryDark}>{title}</Text>
                {showEdit && <Text style={globalTextStyles.regular12Secondary}>Title</Text>}
            </View>
            {showEdit && <TouchableOpacity onPress={leftAction} style={styles.rightSection}>
                {icons['edit']({ color: colors.secondaryDark, size: 24 })}
            </TouchableOpacity>}
        </LinearGradient>
    );
});

Header.displayName = "HeaderComponent";

const styles = StyleSheet.create({
    header: {
        ...globalStyles.rowSpaceBetween,
        backgroundColor: colors.secondaryLight,
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