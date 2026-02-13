import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInUp, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProgressDots from '../components/ProgressDots';

export default function FullNameInputScreen() {
    const router = useRouter();
    const [fullName, setFullName] = useState('');
    const buttonOpacity = useSharedValue(0.5);

    useEffect(() => {
        const isValid = fullName.trim().length > 1;
        buttonOpacity.value = withSpring(isValid ? 1 : 0.5, { damping: 12, stiffness: 200 });
    }, [fullName]);

    const buttonStyle = useAnimatedStyle(() => ({
        opacity: buttonOpacity.value,
    }));

    const handleContinue = () => {
        if (fullName.trim().length <= 1) return;
        // TODO: Save name to store
        router.replace('/(tabs)');
    };

    return (
        <View className="flex-1 bg-[#F8F6F7] relative">
            <StatusBar style="dark" />

            {/* Floating Blur Circles */}
            <View
                className="absolute rounded-full bg-primary/5"
                style={{
                    width: 256,
                    height: 256,
                    top: -80,
                    right: -32,
                }}
            />
            <View
                className="absolute rounded-full bg-primary/5"
                style={{
                    width: 320,
                    height: 320,
                    bottom: -100,
                    left: -80,
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
                                    <ProgressDots steps={3} currentStep={2} />
                                </Animated.View>
                            </View>

                            <View className="flex-1 px-6 pt-8">
                                {/* Title Section */}
                                <Animated.View entering={FadeInDown.delay(200).duration(500)}>
                                    <Text
                                        className="text-[#111827] font-[PlusJakartaSans_800ExtraBold] text-center mb-3"
                                        style={{ fontSize: 36, lineHeight: 40, letterSpacing: -0.9 }}
                                    >
                                        What's your name?
                                    </Text>
                                    <Text
                                        className="text-[#6B7280] font-[PlusJakartaSans_500Medium] text-center mb-10"
                                        style={{ fontSize: 18, lineHeight: 28 }}
                                    >
                                        Let's get to know you.
                                    </Text>
                                </Animated.View>

                                {/* Input Field */}
                                <Animated.View entering={FadeInDown.delay(400).duration(500)}>
                                    <View
                                        className="bg-white rounded-2xl flex-row items-center relative"
                                        style={{
                                            paddingVertical: 3,
                                            paddingHorizontal: 24,
                                            borderWidth: 2,
                                            borderColor: 'rgba(224, 92, 143, 0.3)', // #E05C8F 30%
                                            borderRadius: 50,
                                        }}
                                    >
                                        <TextInput
                                            className="flex-1 font-[PlusJakartaSans_600SemiBold] text-[#111827] "
                                            style={{ fontSize: 20 }}
                                            placeholder="Your First Name"
                                            placeholderTextColor="#9CA3AF"
                                            value={fullName}
                                            onChangeText={setFullName}
                                            autoFocus={true}
                                            autoCapitalize="words"
                                            autoCorrect={false}
                                        />
                                        <MaterialIcons name="edit" size={24} color="#C41758" style={{ marginLeft: 8 }} />
                                    </View>

                                    {/* Helper Text */}
                                    <View className="flex-row mt-6 pr-6">
                                        <MaterialIcons name="sentiment_satisfied_alt" size={20} color="#E05C8F" style={{ marginTop: 2, marginRight: 8 }} />
                                        <Text
                                            className="text-[#6B7280] font-[PlusJakartaSans_400Regular] flex-1"
                                            style={{ fontSize: 14, lineHeight: 22 }}
                                        >
                                            Makes the app feel personal. We use this for dashboard headers like "Alex & Sara’s Goals".
                                        </Text>
                                    </View>
                                </Animated.View>
                            </View>

                            {/* Continue Button */}
                            <Animated.View
                                entering={FadeInUp.delay(600).duration(500)}
                                className="w-full px-6 pb-6 pt-4"
                            >
                                <Animated.View style={buttonStyle}>
                                    <TouchableOpacity
                                        activeOpacity={0.9}
                                        onPress={handleContinue}
                                        disabled={fullName.trim().length <= 1}
                                        className="bg-primary rounded-full flex-row items-center justify-center"
                                        style={{
                                            paddingVertical: 16,
                                            gap: 8,
                                            shadowColor: '#000',
                                            shadowOffset: { width: 0, height: 4 },
                                            shadowOpacity: 0.1,
                                            shadowRadius: 6,
                                            elevation: 4,
                                        }}
                                    >
                                        <Text
                                            className="text-white font-[PlusJakartaSans_700Bold]"
                                            style={{ fontSize: 16, lineHeight: 24 }}
                                        >
                                            Continue
                                        </Text>
                                        <MaterialIcons name="arrow-forward" size={18} color="#FFF" />
                                    </TouchableOpacity>
                                </Animated.View>
                            </Animated.View>
                        </View>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}
