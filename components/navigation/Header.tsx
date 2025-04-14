import colors from '@/styles/colors';
import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import Icon from '@/assets/icons';
import { Icon as MyIcon } from 'native-base';
import globalStyles from '@/styles/globalStyles';
import { Button } from 'native-base';
import { Feather } from '@expo/vector-icons';

interface HeaderProps {
    title: string;
    showBack?: boolean;
    showEdit?: boolean;
    showSettings?: boolean;
    leftAction?: () => void;
    onPressSettings?: any
}

const Header = memo(({ title, showBack, showEdit, leftAction, showSettings, onPressSettings }: HeaderProps) => {

    return (
        <View style={styles.header}>
            {showBack && <TouchableOpacity onPress={() => router.back()} style={[styles.leftSection, showEdit ? { bottom: 10 } : {}]}>
                <Icon name="keyboard-arrow-left" library="MaterialIcons" color={colors.primary[525]} size={45} />
            </TouchableOpacity>}
            <View style={styles.centerSection}>
                <Text className='text-2xl text-primary-525 font-medium' >{title}</Text>
                {showEdit && <Text >Title</Text>}
            </View>
            {showEdit && <TouchableOpacity onPress={leftAction} style={styles.rightSection}>
                <Icon name="edit" library="FontAwesome5" color={colors.primary[525]} size={24} />
            </TouchableOpacity>}
            {showSettings &&
                <Button
                    position={'absolute'}
                    right={2}
                    bottom={1}
                    leftIcon={<MyIcon as={Feather} name="settings" size="xl" />}
                    onPress={onPressSettings}
                    variant="ghost"
                    _pressed={{ opacity: 0.6 }}
                >
                </Button>
            }
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