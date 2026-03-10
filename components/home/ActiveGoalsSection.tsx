import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { GoalCard, GoalCardProps } from './GoalCard';

interface ActiveGoalsSectionProps {
    goals: GoalCardProps[];
    onViewAll?: () => void;
}

export function ActiveGoalsSection({ goals, onViewAll }: ActiveGoalsSectionProps) {
    return (
        <View style={{ paddingHorizontal: 20 }}>
            {/* Section header */}
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 16,
                }}
            >
                <Text
                    className="font-[PlusJakartaSans_800ExtraBold]"
                    style={{ fontSize: 20, color: '#09090B' }}
                >
                    Active Goals
                </Text>
                <TouchableOpacity onPress={onViewAll}>
                    <Text
                        className="font-[PlusJakartaSans_700Bold]"
                        style={{ fontSize: 14, color: '#E11D48' }}
                    >
                        View All
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Goal list */}
            {goals.map((goal, index) => (
                <GoalCard key={index} {...goal} />
            ))}
        </View>
    );
}
