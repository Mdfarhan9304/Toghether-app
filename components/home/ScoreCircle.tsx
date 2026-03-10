import React from 'react';
import { Text, View } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

interface ScoreCircleProps {
    score: number;
}

export function ScoreCircle({ score }: ScoreCircleProps) {
    const size = 72;
    const strokeWidth = 5;

    return (
        <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
            <AnimatedCircularProgress
                size={size}
                width={strokeWidth}
                fill={score}
                tintColor="#FFFFFF"
                backgroundColor="rgba(255,255,255,0.25)"
                rotation={0}
                lineCap="round"
                duration={1500}
            >
                {
                    (fill: number) => (
                        <View
                            style={{
                                width: size - strokeWidth * 4,
                                height: size - strokeWidth * 4,
                                borderRadius: (size - strokeWidth * 4) / 2,
                                backgroundColor: '#FFFFFF',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Text
                                className="font-[PlusJakartaSans_800ExtraBold]"
                                style={{ fontSize: 24, color: '#A31645', lineHeight: 28 }}
                            >
                                {Math.round(fill)}
                            </Text>
                        </View>
                    )
                }
            </AnimatedCircularProgress>
        </View>
    );
}
