import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Image, Text, View } from 'react-native';

export interface GoalCardProps {
    image?: string;
    icon?: keyof typeof MaterialIcons.glyphMap;
    iconBgColor?: string;
    iconColor?: string;
    title: string;
    subtitle: string;
    progress?: number; // 0–1
    progressColor?: string;
    leftLabel?: string;
    leftLabelColor?: string;
    rightLabel?: string;
    badge?: string;
    badgeColor?: string;
    liked?: boolean;
}

export function GoalCard({
    image,
    icon,
    iconBgColor = '#F4F4F5',
    iconColor = '#71717A',
    title,
    subtitle,
    progress,
    progressColor = '#A31645',
    leftLabel,
    leftLabelColor = '#A31645',
    rightLabel,
    badge,
    badgeColor = '#16A34A',
    liked = false,
}: GoalCardProps) {
    return (
        <View
            style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 20,
                padding: 16,
                marginBottom: 12,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.04,
                shadowRadius: 12,
                elevation: 2,
            }}
        >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                {/* Thumbnail */}
                {image ? (
                    <Image
                        source={{ uri: image }}
                        style={{ width: 52, height: 52, borderRadius: 14 }}
                    />
                ) : icon ? (
                    <View
                        style={{
                            width: 52,
                            height: 52,
                            borderRadius: 14,
                            backgroundColor: iconBgColor,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <MaterialIcons name={icon} size={24} color={iconColor} />
                    </View>
                ) : null}

                {/* Content */}
                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text
                            className="font-[PlusJakartaSans_700Bold]"
                            style={{ fontSize: 16, color: '#09090B' }}
                        >
                            {title}
                        </Text>
                        <MaterialIcons
                            name={liked ? 'favorite' : 'favorite-border'}
                            size={20}
                            color={liked ? '#E11D48' : '#D4D4D8'}
                        />
                    </View>
                    <Text
                        className="font-[PlusJakartaSans_400Regular]"
                        style={{ fontSize: 13, color: '#A1A1AA', marginTop: 2 }}
                    >
                        {subtitle}
                    </Text>

                    {/* Progress bar */}
                    {progress !== undefined && (
                        <View
                            style={{
                                height: 5,
                                backgroundColor: '#F4F4F5',
                                borderRadius: 3,
                                marginTop: 10,
                                overflow: 'hidden',
                            }}
                        >
                            <View
                                style={{
                                    height: '100%',
                                    width: `${Math.min(progress * 100, 100)}%`,
                                    backgroundColor: progressColor,
                                    borderRadius: 3,
                                }}
                            />
                        </View>
                    )}

                    {/* Labels row */}
                    {(leftLabel || rightLabel || badge) && (
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginTop: 6,
                            }}
                        >
                            {leftLabel && (
                                <Text
                                    className="font-[PlusJakartaSans_500Medium]"
                                    style={{ fontSize: 12, color: leftLabelColor }}
                                >
                                    {leftLabel}
                                </Text>
                            )}
                            {badge && (
                                <View
                                    style={{
                                        backgroundColor: badgeColor + '18',
                                        paddingHorizontal: 10,
                                        paddingVertical: 3,
                                        borderRadius: 10,
                                    }}
                                >
                                    <Text
                                        className="font-[PlusJakartaSans_700Bold]"
                                        style={{ fontSize: 11, color: badgeColor }}
                                    >
                                        {badge}
                                    </Text>
                                </View>
                            )}
                            {rightLabel && (
                                <Text
                                    className="font-[PlusJakartaSans_400Regular]"
                                    style={{ fontSize: 12, color: '#A1A1AA' }}
                                >
                                    {rightLabel}
                                </Text>
                            )}
                        </View>
                    )}
                </View>
            </View>
        </View>
    );
}
