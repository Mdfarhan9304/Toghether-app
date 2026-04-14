import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { useGyroscopeNav } from '../../hooks/useGyroscopeNav';
import { ScoreCircle } from './ScoreCircle';

interface ScoreCardProps {
    score?: number;
    title?: string;
    subtitle?: string;
    weeklyChange?: string;
    rank?: string;
}

export function ScoreCard({
    score = 84,
    title = 'Together Score',
    subtitle = "You're doing great,\nlovebirds! Keep it up.",
    weeklyChange = '+2.4% this week',
    rank = 'Top 10% of couples',
}: ScoreCardProps) {
    const { tiltX, tiltY } = useGyroscopeNav();

    const circleAnimatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: tiltX.value },
            { translateY: tiltY.value },
        ],
    }));

    return (
        <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
            <View
                style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: 24,
                    padding: 24,
                    overflow: 'hidden',
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    borderWidth: 1,
                    boxShadow: '0px 8px 32px 0px rgba(163, 22, 69, 0.3)',
                } as any}
            >
                {/* Gyroscope-driven circle */}
                <Animated.View
                    style={[
                        {
                            position: 'absolute',
                            top: -40,
                            right: -40,
                            width: 160,
                            height: 160,
                            borderRadius: 80,
                            backgroundColor: 'rgba(255,255,255,0.06)',
                        },
                        circleAnimatedStyle,
                    ]}
                />

                {/* Score row */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ flex: 1, marginRight: 16 }}>
                        <Text
                            className="font-[PlusJakartaSans_700Bold]"
                            style={{ fontSize: 20, color: '#FFFFFF', marginBottom: 6 }}
                        >
                            {title}
                        </Text>
                        <Text
                            className="font-[PlusJakartaSans_400Regular]"
                            style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', lineHeight: 20 }}
                        >
                            {subtitle}
                        </Text>
                    </View>
                    <ScoreCircle score={score} />
                </View>

                {/* Stats chips row */}
                <View style={{ flexDirection: 'row', marginTop: 20, gap: 10 }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: 'rgba(255,255,255,0.15)',
                            paddingHorizontal: 14,
                            paddingVertical: 8,
                            borderRadius: 20,
                            gap: 6,
                        }}
                    >
                        <MaterialIcons name="trending-up" size={14} color="#FFFFFF" />
                        <Text
                            className="font-[PlusJakartaSans_500Medium]"
                            style={{ fontSize: 12, color: '#FFFFFF' }}
                        >
                            {weeklyChange}
                        </Text>
                    </View>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: 'rgba(255,255,255,0.15)',
                            paddingHorizontal: 14,
                            paddingVertical: 8,
                            borderRadius: 20,
                            gap: 6,
                        }}
                    >
                        <Text
                            className="font-[PlusJakartaSans_500Medium]"
                            style={{ fontSize: 12, color: '#FFFFFF' }}
                        >
                            {rank}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
}
