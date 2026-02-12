import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useOnboardingStore } from '../store/onboardingStore';

export default function OnboardingScreen() {
    const router = useRouter();
    const { completeOnboarding } = useOnboardingStore();

    const handleStart = () => {
        completeOnboarding();
        router.replace('/(tabs)');
    };

    const handleLogin = () => {
        // Navigate to login
        // router.push('/auth/login');
        console.log("Navigate to login");
    };

    return (
        <View className="flex-1 bg-primary relative">
            <StatusBar style="light" />

            {/* Background Image */}
            <Image
                source={{ uri: 'https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?q=80&w=2787&auto=format&fit=crop' }} // Placeholder couple image
                className="absolute w-full h-[65%] top-0 left-0"
                resizeMode="cover"
            />

            {/* Gradient Overlay */}
            <LinearGradient
                colors={['transparent', '#A31645', '#A31645']}
                locations={[0, 0.6, 1]}
                style={{ position: 'absolute', width: '100%', height: '100%' }}
            />

            <SafeAreaView className="flex-1 justify-end pb-12 px-6">

                {/* Main Content */}
                <View className="space-y-6">

                    {/* Title and Subtitle */}
                    <View className="space-y-4">
                        <Text className="text-white font-[PlusJakartaSans_800ExtraBold] text-4xl text-center leading-tight">
                            Build Your Future{'\n'}Together
                        </Text>

                        <Text className="text-white/90 font-[PlusJakartaSans_500Medium] text-lg text-center leading-6 px-4">
                            A romantic, modern relationship goal tracking app for couples.
                        </Text>
                    </View>

                    {/* CTA Button */}
                    <View className="pt-8 pb-4">
                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={handleStart}
                            className="bg-white rounded-full flex-row items-center justify-center py-4 px-8 shadow-lg shadow-black/20"
                        >
                            <MaterialIcons name="favorite" size={24} color="#C4175C" style={{ marginRight: 8 }} />
                            <Text className="text-primary-light font-[PlusJakartaSans_700Bold] text-lg">
                                Start as a Couple
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Social Proof */}
                    <View className="flex-row items-center justify-center space-x-3">
                        {/* Avatars Placeholder */}
                        <View className="flex-row -space-x-3">
                            {[1, 2, 3].map((i) => (
                                <View key={i} className="w-8 h-8 rounded-full border-2 border-primary bg-gray-300 overflow-hidden">
                                    <Image
                                        source={{ uri: `https://i.pravatar.cc/100?img=${i + 10}` }}
                                        className="w-full h-full"
                                    />
                                </View>
                            ))}
                        </View>

                        {/* Badge */}
                        <View className="bg-secondary-foreground px-3 py-1 rounded-full border border-primary">
                            <Text className="text-primary font-[PlusJakartaSans_700Bold] text-[10px]">
                                50k+
                            </Text>
                        </View>

                        <Text className="text-white/80 font-[PlusJakartaSans_500Medium] text-sm ml-2">
                            Join 50,000+ couples growing together.
                        </Text>
                    </View>

                    {/* Login Link */}
                    <View className="flex-row justify-center items-center pt-4">
                        <Text className="text-white/60 font-[PlusJakartaSans_500Medium] text-sm">
                            Already have an account?{' '}
                        </Text>
                        <TouchableOpacity onPress={handleLogin}>
                            <Text className="text-white/60 font-[PlusJakartaSans_500Medium] text-sm underline">
                                Log in
                            </Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </SafeAreaView>
        </View>
    );
}
