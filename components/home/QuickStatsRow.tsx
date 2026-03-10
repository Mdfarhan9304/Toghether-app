import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';

interface StatCardProps {
    label: string;
    icon: keyof typeof MaterialIcons.glyphMap;
    iconColor: string;
    value: string;
    subtitle: string;
}

function StatCard({ label, icon, iconColor, value, subtitle }: StatCardProps) {
    return (
        <View
            style={{
                flex: 1,
                backgroundColor: '#FFFFFF',
                borderRadius: 20,
                padding: 18,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.04,
                shadowRadius: 12,
                elevation: 2,
                boxShadow: '0px 2px 4px 0px rgba(0,0,0,0.15),inset 0px 4px 4px 0px rgba(255,255,255,0.50),inset 0px -4px 4px 0px rgba(0,0,0,0.15)',
            } as any}
        >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <Text
                    className="font-[PlusJakartaSans_500Medium]"
                    style={{ fontSize: 13, color: '#71717A' }}
                >
                    {label}
                </Text>
                <MaterialIcons name={icon} size={18} color={iconColor} />
            </View>
            <Text
                className="font-[PlusJakartaSans_800ExtraBold]"
                style={{ fontSize: 28, color: '#09090B', lineHeight: 34 }}
            >
                {value}
            </Text>
            <Text
                className="font-[PlusJakartaSans_400Regular]"
                style={{ fontSize: 12, color: '#A1A1AA', marginTop: 4 }}
            >
                {subtitle}
            </Text>
        </View>
    );
}

interface QuickStatsRowProps {
    streakDays?: number;
    totalSaved?: string;
    numGoals?: number;
}

export function QuickStatsRow({
    streakDays = 12,
    totalSaved = '$4,250',
    numGoals = 3,
}: QuickStatsRowProps) {
    return (
        <View
            style={{
                flexDirection: 'row',
                paddingHorizontal: 20,
                gap: 12,
                marginBottom: 28,
            }}
        >
            <StatCard
                label="Love Streak"
                icon="favorite"
                iconColor="#F43F5E"
                value={`${streakDays} Days`}
                subtitle="Keep the flame alive!"
            />
            <StatCard
                label="Total Saved"
                icon="diamond"
                iconColor="#3B82F6"
                value={totalSaved}
                subtitle={`across ${numGoals} goals`}
            />
        </View>
    );
}
