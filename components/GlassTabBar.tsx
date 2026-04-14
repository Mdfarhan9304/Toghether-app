import { MaterialIcons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import React, { useMemo } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';



/** Map route names to icon names */
const ICON_MAP: Record<string, keyof typeof MaterialIcons.glyphMap> = {
    index: 'home',
    timeline: 'schedule',
    quiz: 'quiz',
    chat: 'chat-bubble-outline',
    profile: 'person-outline',
};

export default function GlassTabBar({
    state,
    descriptors,
    navigation,
}: BottomTabBarProps) {
    const insets = useSafeAreaInsets();

    // Filter out hidden tabs (href: null)
    const visibleRoutes = useMemo(
        () =>
            state.routes.filter((route) => {
                const options = descriptors[route.key]?.options;
                return (options as any)?.href !== null;
            }),
        [state.routes, descriptors],
    );

    // Current active index among visible routes
    const activeVisibleIndex = useMemo(
        () =>
            visibleRoutes.findIndex(
                (r) => r.key === state.routes[state.index]?.key,
            ),
        [visibleRoutes, state.routes, state.index],
    );

    return (
        <View
            style={[
                styles.container,
                { paddingBottom: Math.max(insets.bottom, 8) },
            ]}
        >
            {/* Top accent line */}
            <View style={styles.topAccent} />

            {/* Tabs row */}
            <View style={styles.tabRow}>
                {visibleRoutes.map((route) => {
                    const isActive =
                        route.key === state.routes[state.index]?.key;
                    const options = descriptors[route.key]?.options;
                    const label =
                        (options?.tabBarLabel as string) ??
                        options?.title ??
                        route.name;
                    const iconName = ICON_MAP[route.name] ?? 'circle';

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });
                        if (!event.defaultPrevented) {
                            navigation.navigate(route.name);
                            Haptics.impactAsync(
                                Haptics.ImpactFeedbackStyle.Light,
                            ).catch(() => { });
                        }
                    };

                    return (
                        <TouchableOpacity
                            key={route.key}
                            onPress={onPress}
                            activeOpacity={0.7}
                            style={[styles.tab, isActive && styles.tabActive]}
                        >

                            <View style={styles.iconContainer}>
                                <MaterialIcons
                                    name={iconName}
                                    size={24}
                                    color={isActive ? '#A31645' : '#A1A1AA'}
                                />
                                {route.name === 'chat' && (
                                    <View style={styles.badge} />
                                )}
                            </View>
                            <Text
                                style={[
                                    styles.label,
                                    isActive
                                        ? styles.labelActive
                                        : styles.labelInactive,
                                ]}
                                numberOfLines={1}
                            >
                                {label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#F4F4F5',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -4 },
                shadowOpacity: 0.04,
                shadowRadius: 12,
            },
            android: {
                elevation: 8,
            },
        }),
    },
    topAccent: {
        height: 2,
        backgroundColor: 'transparent',
    },
    tabRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingTop: 8,
        paddingHorizontal: 8,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        borderRadius: 16,
        marginHorizontal: 4,
        gap: 4,
    },
    tabActive: {
        backgroundColor: 'rgba(163, 22, 69, 0.1)',
        boxShadow: '0px 1px 2px 0px rgba(0,0,0,0.15),inset 0px 2px 2px 0px rgba(255,255,255,0.50),inset 0px -2px 2px 0px rgba(0,0,0,0.15)',
    },
    iconContainer: {
        position: 'relative',
    },
    badge: {
        position: 'absolute',
        top: -2,
        right: -6,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#E11D48',
        borderWidth: 1.5,
        borderColor: '#FFFFFF',
    },
    label: {
        fontFamily: 'PlusJakartaSans_500Medium',
        fontSize: 11,
        marginTop: 2,
    },
    labelActive: {
        color: '#A31645',
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    labelInactive: {
        color: '#A1A1AA',
    },
});
