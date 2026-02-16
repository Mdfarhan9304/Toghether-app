import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInUp, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import PremiumButton from "../components/PremiumButton";
import ProgressDots from '../components/ProgressDots';

export default function EnterCodeScreen() {
    const router = useRouter();
    const [code, setCode] = useState('');
    const buttonOpacity = useSharedValue(0.5);

    // Format code as XXX-XXX
    const handleCodeChange = (text: string) => {
        // Remove non-alphanumeric chars
        const cleaned = text.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

        // Limit to 6 chars
        const trimmed = cleaned.slice(0, 6);

        // Add hyphen if needed
        let formatted = trimmed;
        if (trimmed.length > 3) {
            formatted = `${trimmed.slice(0, 3)}-${trimmed.slice(3)}`;
        }

        setCode(formatted);
    };

    useEffect(() => {
        const isValid = code.replace('-', '').length === 6;
        buttonOpacity.value = withSpring(isValid ? 1 : 0.5, { damping: 12, stiffness: 200 });
    }, [code]);

    const buttonStyle = useAnimatedStyle(() => ({
        opacity: buttonOpacity.value,
    }));

    const handleContinue = () => {
        if (code.replace('-', '').length !== 6) return;
        // TODO: Verify code API call
        router.push('/(tabs)');
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
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                >
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View className="flex-1">
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

                            <View className="flex-1 px-6 pt-8">
                                {/* Title Section */}
                                <Animated.View entering={FadeInDown.delay(200).duration(500)}>
                                    <Text
                                        className="text-[#111827] font-[PlusJakartaSans_800ExtraBold] text-center mb-3"
                                        style={{ fontSize: 30, lineHeight: 36, letterSpacing: -0.75 }}
                                    >
                                        Enter Partner Code
                                    </Text>
                                    <Text
                                        className="text-[#6B7280] font-[PlusJakartaSans_500Medium] text-center mb-10"
                                        style={{ fontSize: 16, lineHeight: 24 }}
                                    >
                                        Enter the 6-digit code shared by your partner.
                                    </Text>
                                </Animated.View>

                                {/* Input Field */}
                                <Animated.View entering={FadeInDown.delay(400).duration(500)}>
                                    <View
                                        className="bg-white rounded-2xl flex-row items-center relative"
                                        style={{
                                            paddingVertical: 16,
                                            paddingHorizontal: 24,
                                            borderWidth: 2,
                                            borderColor: 'rgba(224, 92, 143, 0.3)',
                                            borderRadius: 20,
                                        }}
                                    >
                                        <TextInput
                                            className="flex-1 font-[PlusJakartaSans_700Bold] text-[#111827] text-center tracking-[8px]"
                                            style={{ fontSize: 28 }}
                                            placeholder="XXX-XXX"
                                            placeholderTextColor="#9CA3AF"
                                            value={code}
                                            onChangeText={handleCodeChange}
                                            autoFocus={true}
                                            autoCapitalize="characters"
                                            autoCorrect={false}
                                            keyboardType="default"
                                            maxLength={7} // 6 chars + hyphen
                                        />
                                    </View>
                                </Animated.View>
                            </View>

                            {/* Continue Button */}
                            <Animated.View
                                entering={FadeInUp.delay(600).duration(500)}
                                className="w-full px-6 pb-6 pt-4"
                            >
                                <Animated.View style={buttonStyle}>
                                    <PremiumButton
                                        title="Link Accounts"
                                        onPress={handleContinue}
                                        disabled={code.replace('-', '').length !== 6}
                                    />
                                </Animated.View>
                            </Animated.View>
                        </View>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}
