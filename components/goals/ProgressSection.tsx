import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface ProgressSectionProps {
    myCompletionRate: number;
    partnerCompletionRate: number;
    coupleStreak: number;
    myStreak: number;
    totalDays: number;
    bothCompletedDays: number;
    userName: string;
    partnerName: string;
    isShared: boolean;
}

function ProgressBar({
    label,
    value,
    color,
    icon,
}: {
    label: string;
    value: number;
    color: string;
    icon: keyof typeof MaterialIcons.glyphMap;
}) {
    return (
        <View style={{ marginBottom: 16 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <MaterialIcons name={icon} size={14} color={color} />
                    <Text style={{
                        fontFamily: 'PlusJakartaSans_600SemiBold',
                        fontSize: 13, color: '#3F3F46',
                    }}>
                        {label}
                    </Text>
                </View>
                <Text style={{
                    fontFamily: 'PlusJakartaSans_700Bold',
                    fontSize: 14, color,
                }}>
                    {value}%
                </Text>
            </View>
            <View style={{
                height: 8, backgroundColor: '#F4F4F5',
                borderRadius: 4, overflow: 'hidden',
            }}>
                <View style={{
                    height: '100%',
                    width: `${Math.min(value, 100)}%`,
                    backgroundColor: color,
                    borderRadius: 4,
                }} />
            </View>
        </View>
    );
}

function StatBlock({ label, value, emoji }: { label: string; value: string; emoji: string }) {
    return (
        <View style={{
            flex: 1,
            backgroundColor: '#FFFFFF',
            borderRadius: 16,
            padding: 14,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: '#F4F4F5',
        }}>
            <Text style={{ fontSize: 20, marginBottom: 4 }}>{emoji}</Text>
            <Text style={{
                fontFamily: 'PlusJakartaSans_800ExtraBold',
                fontSize: 22, color: '#09090B',
            }}>
                {value}
            </Text>
            <Text style={{
                fontFamily: 'PlusJakartaSans_400Regular',
                fontSize: 11, color: '#A1A1AA',
                marginTop: 2, textAlign: 'center',
            }}>
                {label}
            </Text>
        </View>
    );
}

export function ProgressSection({
    myCompletionRate,
    partnerCompletionRate,
    coupleStreak,
    myStreak,
    totalDays,
    bothCompletedDays,
    userName,
    partnerName,
    isShared,
}: ProgressSectionProps) {
    return (
        <Animated.View entering={FadeInDown.delay(300).duration(500)}>
            {/* Section Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <MaterialIcons name="insights" size={18} color="#A31645" />
                <Text style={{
                    fontFamily: 'PlusJakartaSans_700Bold',
                    fontSize: 16, color: '#09090B',
                }}>
                    Progress & Stats
                </Text>
            </View>

            {/* Progress Bars */}
            <View style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 20,
                padding: 18,
                marginBottom: 14,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.04,
                shadowRadius: 12,
                elevation: 2,
            }}>
                <ProgressBar
                    label={userName}
                    value={myCompletionRate}
                    color="#A31645"
                    icon="person"
                />
                {isShared && (
                    <ProgressBar
                        label={partnerName}
                        value={partnerCompletionRate}
                        color="#F472B6"
                        icon="favorite"
                    />
                )}
            </View>

            {/* Stats Row */}
            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 14 }}>
                {isShared && (
                    <StatBlock
                        emoji="🔥"
                        label="Couple Streak"
                        value={`${coupleStreak}d`}
                    />
                )}
                <StatBlock
                    emoji="⚡"
                    label="Your Streak"
                    value={`${myStreak}d`}
                />
                {isShared && (
                    <StatBlock
                        emoji="💕"
                        label="Both Done"
                        value={`${bothCompletedDays}/${totalDays}`}
                    />
                )}
            </View>
        </Animated.View>
    );
}
