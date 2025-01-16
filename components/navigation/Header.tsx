import colors from '@/styles/colors';
import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import globalTextStyles from '@/styles/globalTextStyles';
const Header = memo(({ title }: { title: string }) => {

    return (
        <LinearGradient colors={[colors.secondaryDark, colors.secondaryDark, colors.secondaryLight, colors.background]} style={styles.header}>
            <View style={styles.centerSection}>
                <Text style={globalTextStyles.medium20White}>{title}</Text>
            </View>
        </LinearGradient>
    );
});

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.secondaryLight,
        paddingTop: 60,
        paddingBottom: 10,
        paddingHorizontal: 20,
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    centerSection: {
        flex: 1,
    },
    rightSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});


export default Header