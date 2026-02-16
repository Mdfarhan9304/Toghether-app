import { MaterialIcons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInUp, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import PremiumButton from "../components/PremiumButton";
import ProgressDots from '../components/ProgressDots';

export default function InvitePartnerScreen() {
    const router = useRouter();
    const [copied, setCopied] = useState(false);
    const buttonOpacity = useSharedValue(0);

    // Mock code - in real app fetching from backend
    const COUPLE_CODE = "529-841";

    useEffect(() => {
        buttonOpacity.value = withSpring(1, { damping: 12, stiffness: 200 });
    }, []);

    const buttonStyle = useAnimatedStyle(() => ({
        opacity: buttonOpacity.value,
    }));

    const handleCopy = async () => {
        await Clipboard.setStringAsync(COUPLE_CODE);
        setCopied(true);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        // Reset copy state after 2 seconds
        setTimeout(() => setCopied(false), 2000);
    };

    const handleContinue = () => {
        router.push('/(tabs)');
    };

    const handleEnterCode = () => {
        router.push('/enter-code');
    };

    return (
        <View className="flex-1 bg-[#F8F6F7] relative">
            <StatusBar style="dark" />

            {/* Floating Blur Circles */}
            <View
                className="absolute rounded-full bg-primary/5"
                style={{
                    width: 256, height: 256, top: -80, right: -32,
                }}
            />
            <View
                className="absolute rounded-full bg-primary/5"
                style={{
                    width: 320, height: 320, bottom: -100, left: -80,
                }}
            />

            <SafeAreaView style={{ flex: 1 }}>
                {/* Header */}
                <View className="flex-row items-center px-4 py-4 relative min-h-[56px]">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="w-10 h-10 rounded-full items-center justify-center absolute left-4 z-10"
                    >
                        <MaterialIcons name="arrow-back" size={24} color="#4B5563" />
                    </TouchableOpacity>

                    <Animated.View
                        entering={FadeIn.duration(400)}
                        className="flex-1 flex-row items-center justify-center"
                    >
                        <ProgressDots steps={6} currentStep={5} />
                    </Animated.View>
                </View>

                {/* Content */}
                <View className="flex-1 px-6 pt-8 items-center">
                    {/* Title Section */}
                    <Animated.View entering={FadeInDown.delay(200).duration(500)} style={{ marginBottom: 40, alignItems: 'center' }}>
                        <Text
                            className="text-[#111827] font-[PlusJakartaSans_800ExtraBold] text-center mb-3"
                            style={{ fontSize: 30, lineHeight: 36, letterSpacing: -0.75 }}
                        >
                            Invite Your Partner
                        </Text>
                        <Text
                            className="text-[#6B7280] font-[PlusJakartaSans_500Medium] text-center px-4"
                            style={{ fontSize: 16, lineHeight: 24 }}
                        >
                            Share this code with your partner to link your accounts.
                        </Text>
                    </Animated.View>

                    {/* Code Card */}
                    <Animated.View
                        entering={FadeInDown.delay(400).duration(500)}
                        className="bg-white rounded-[32px] w-full items-center justify-center relative"
                        style={{
                            padding: 32,
                            boxShadow: '0px 10px 40px -10px rgba(224,92,143,0.15)',
                            elevation: 5,
                            borderWidth: 1,
                            borderColor: 'white',
                            marginBottom: 40
                        }}
                    >
                        {/* Pink top border line (simulated with view) */}
                        <View className="absolute top-0 w-24 h-1 bg-primary rounded-b-full opacity-50" />

                        <Text className="text-[#9CA3AF] font-[PlusJakartaSans_600SemiBold] tracking-widest text-xs uppercase mb-4">
                            Your Couple Code
                        </Text>

                        <Text className="text-primary font-[PlusJakartaSans_800ExtraBold] text-5xl tracking-tight mb-6">
                            {COUPLE_CODE}
                        </Text>

                        <Text className="text-[#9CA3AF] font-[PlusJakartaSans_500Medium] text-sm">
                            Code expires in 24 hours
                        </Text>
                    </Animated.View>

                    {/* Copy Button */}
                    <Animated.View
                        entering={FadeInDown.delay(600).duration(500)}
                        className="w-full flex-row justify-center space-x-4"
                    >
                        <TouchableOpacity
                            onPress={handleCopy}
                            activeOpacity={0.8}
                            className="bg-white rounded-2xl flex-row items-center justify-center"
                            style={{
                                paddingVertical: 16,
                                paddingHorizontal: 32,
                                width: '100%',
                                boxShadow: '0px 2px 8px rgba(0,0,0,0.05)',
                                borderWidth: 1,
                                borderColor: copied ? '#E05C8F' : 'transparent'
                            }}
                        >
                            <MaterialIcons
                                name={copied ? "check" : "content-copy"}
                                size={20}
                                color={copied ? "#E05C8F" : "#4B5563"}
                            />
                            <Text
                                className={`font-[PlusJakartaSans_600SemiBold] ml-2 ${copied ? 'text-primary' : 'text-[#374151]'}`}
                                style={{ fontSize: 16 }}
                            >
                                {copied ? "Copied!" : "Copy Code"}
                            </Text>
                        </TouchableOpacity>
                    </Animated.View>

                    {/* Enter Code Link */}
                    <Animated.View
                        entering={FadeInDown.delay(800).duration(500)}
                        className="mt-12"
                    >
                        <TouchableOpacity
                            onPress={handleEnterCode}
                            className="flex-row items-center"
                        >
                            <Text className="text-primary font-[PlusJakartaSans_600SemiBold] text-base mr-1">
                                Already have a code? Enter it here
                            </Text>
                            <MaterialIcons name="arrow-forward" size={16} color="#E05C8F" />
                        </TouchableOpacity>
                    </Animated.View>

                </View>

                {/* Fixed Continue Button */}
                <Animated.View
                    entering={FadeInUp.delay(1000).duration(500)}
                    className="absolute bottom-0 left-0 right-0"
                    style={{
                        paddingHorizontal: 24,
                        paddingVertical: 24,
                        paddingBottom: 24,
                    }}
                >
                    <Animated.View style={buttonStyle}>
                        <PremiumButton
                            title="Continue"
                            onPress={handleContinue}
                        />
                    </Animated.View>
                </Animated.View>
            </SafeAreaView>
        </View>
    );
}
