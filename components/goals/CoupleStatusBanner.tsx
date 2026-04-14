import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

type CoupleStatus = 'both' | 'user_only' | 'partner_only' | 'none';

interface CoupleStatusBannerProps {
    status: CoupleStatus;
    userName: string;
    partnerName: string;
}

const STATUS_CONFIG: Record<CoupleStatus, {
    icon: keyof typeof MaterialIcons.glyphMap;
    text: (u: string, p: string) => string;
    color: string;
    bg: string;
    iconBg: string;
}> = {
    both: {
        icon: 'celebration',
        text: () => 'Both completed today!',
        color: '#A31645',
        bg: '#FFF0F3',
        iconBg: '#FCE4EC',
    },
    user_only: {
        icon: 'hourglass-top',
        text: (_u, p) => `Waiting for ${p}...`,
        color: '#C4175C',
        bg: '#FFF0F3',
        iconBg: '#FCE4EC',
    },
    partner_only: {
        icon: 'notifications-active',
        text: (u) => `${u}, your turn!`,
        color: '#E11D48',
        bg: '#FFF0F3',
        iconBg: '#FCE4EC',
    },
    none: {
        icon: 'schedule',
        text: () => 'Neither completed yet today',
        color: '#71717A',
        bg: '#F4F4F5',
        iconBg: '#E4E4E7',
    },
};

export function CoupleStatusBanner({ status, userName, partnerName }: CoupleStatusBannerProps) {
    const config = STATUS_CONFIG[status];

    return (
        <Animated.View
            entering={FadeInDown.delay(200).duration(400)}
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: config.bg,
                borderRadius: 16,
                padding: 14,
                marginBottom: 20,
                gap: 12,
            }}
        >
            <View style={{
                width: 40, height: 40, borderRadius: 12,
                backgroundColor: config.iconBg,
                alignItems: 'center', justifyContent: 'center',
            }}>
                <MaterialIcons name={config.icon} size={20} color={config.color} />
            </View>
            <Text style={{
                flex: 1,
                fontFamily: 'PlusJakartaSans_700Bold',
                fontSize: 14,
                color: config.color,
            }}>
                {config.text(userName, partnerName)}
            </Text>
            {status === 'both' && (
                <Text style={{ fontSize: 20 }}>🎉</Text>
            )}
        </Animated.View>
    );
}
