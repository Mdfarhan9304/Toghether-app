import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
    return (
        <View className="flex-1" style={{ backgroundColor: '#F9FAFB' }}>
            <StatusBar style="dark" />
            <SafeAreaView edges={['top']} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 }}>
                <MaterialIcons name="person-outline" size={56} color="#E4E4E7" />
                <Text
                    className="font-[PlusJakartaSans_700Bold]"
                    style={{ fontSize: 22, color: '#09090B', marginTop: 16, marginBottom: 8 }}
                >
                    Profile
                </Text>
                <Text
                    className="font-[PlusJakartaSans_400Regular] text-center"
                    style={{ fontSize: 15, color: '#A1A1AA', lineHeight: 22 }}
                >
                    Manage your account, preferences, and relationship settings.
                </Text>
            </SafeAreaView>
        </View>
    );
}
