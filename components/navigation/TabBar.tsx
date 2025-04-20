import { View, StyleSheet, Platform } from 'react-native'
import React from 'react'
import TabBarButton from './TabBarButton';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import colors from '@/styles/colors';
import { ParamListBase, TabNavigationState } from '@react-navigation/native';
import { KeyboardAvoidingView } from 'native-base';

const TabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation, }) => {
    const currentRoute = state.routes[state.index];
    const nestedState = currentRoute.state as TabNavigationState<ParamListBase> | undefined;
    const currentRouteName = nestedState?.routes?.[nestedState.index]?.name || currentRoute.name;
    const hiddenRoutes = ['add', '[id]'];
    if (hiddenRoutes.includes(currentRouteName)) {
        return null;
    }
    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={0}>
            <View style={styles.tabbar}>
                {state.routes.map((route, index) => {
                    const { options } = descriptors[route.key];
                    const label =
                        options.tabBarLabel !== undefined
                            ? options.tabBarLabel
                            : options.title !== undefined
                                ? options.title
                                : route.name;

                    if (['_sitemap', '+not-found'].includes(route.name)) return null;

                    const isFocused = state.index === index;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name, route.params);
                        }
                    };

                    const onLongPress = () => {
                        navigation.emit({
                            type: 'tabLongPress',
                            target: route.key,
                        });
                    };

                    return (
                        <TabBarButton
                            key={route.name}
                            onPress={onPress}
                            onLongPress={onLongPress}
                            isFocused={isFocused}
                            routeName={route.name}
                            color={colors.primary[isFocused ? 550 : 600]}
                            label={label}
                        />
                    )
                })}
            </View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    tabbar: {
        position: 'absolute',
        bottom: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        marginHorizontal: 20,
        paddingVertical: 15,
        borderRadius: 25,
        borderCurve: 'continuous',
        boxShadow: '0px 10px 10px rgba(0, 0, 0, 0.1)',  // boxShadow for iOS
        elevation: 5,  // For Android
        paddingBottom: 10,
    },
})

export default TabBar