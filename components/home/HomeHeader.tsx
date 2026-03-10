import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

interface HomeHeaderProps {
    greeting?: string;
    names?: string;
    avatar1?: string;
    avatar2?: string;
    onSettingsPress?: () => void;
}

export function HomeHeader({
    greeting = 'WELCOME BACK',
    names = 'Hi, Sarah & Tom!',
    avatar1 = 'https://i.pravatar.cc/100?img=47',
    avatar2 = 'https://i.pravatar.cc/100?img=12',
    onSettingsPress,
}: HomeHeaderProps) {
    return (
        <View
            style={{
                paddingHorizontal: 24,
                paddingTop: 12,
                paddingBottom: 20,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}
        >
            <View>
                <Text
                    className="font-[PlusJakartaSans_700Bold]"
                    style={{
                        fontSize: 11,
                        letterSpacing: 1.8,
                        color: '#E11D48',
                        marginBottom: 4,
                    }}
                >
                    {greeting}
                </Text>
                <Text
                    className="font-[PlusJakartaSans_800ExtraBold]"
                    style={{ fontSize: 26, color: '#09090B', lineHeight: 32 }}
                >
                    {names}
                </Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                {/* Couple avatars */}
                <View style={{ flexDirection: 'row' }}>
                    <Image
                        source={{ uri: avatar1 }}
                        style={{
                            width: 38,
                            height: 38,
                            borderRadius: 19,
                            borderWidth: 2,
                            borderColor: '#FFFFFF',
                        }}
                    />
                    <Image
                        source={{ uri: avatar2 }}
                        style={{
                            width: 38,
                            height: 38,
                            borderRadius: 19,
                            borderWidth: 2,
                            borderColor: '#FFFFFF',
                            marginLeft: -12,
                        }}
                    />
                </View>
                <TouchableOpacity onPress={onSettingsPress}>
                    <MaterialIcons name="settings" size={24} color="#A1A1AA" />
                </TouchableOpacity>
            </View>
        </View>
    );
}
