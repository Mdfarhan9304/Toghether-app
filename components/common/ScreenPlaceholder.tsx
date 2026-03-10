import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ScreenPlaceholderProps {
    icon: keyof typeof MaterialIcons.glyphMap;
    title: string;
    description: string;
}

export function ScreenPlaceholder({ icon, title, description }: ScreenPlaceholderProps) {
    return (
        <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
            <SafeAreaView
                edges={['top']}
                style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 }}
            >
                <MaterialIcons name={icon} size={56} color="#E4E4E7" />
                <Text
                    className="font-[PlusJakartaSans_700Bold]"
                    style={{ fontSize: 22, color: '#09090B', marginTop: 16, marginBottom: 8 }}
                >
                    {title}
                </Text>
                <Text
                    className="font-[PlusJakartaSans_400Regular] text-center"
                    style={{ fontSize: 15, color: '#A1A1AA', lineHeight: 22 }}
                >
                    {description}
                </Text>
            </SafeAreaView>
        </View>
    );
}
