import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInUp, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import PremiumButton from "../components/PremiumButton";
import ProgressDots from '../components/ProgressDots';
import SelectionCard from '../components/SelectionCard';

// Define options
const genderOptions = [
    {
        id: 'male',
        icon: 'male' as const,
        title: 'Man',
        description: '', // Card expects description, can be empty or we remove it
    },
    {
        id: 'female',
        icon: 'female' as const,
        title: 'Woman',
        description: '',
    },
];

export default function GenderSelectionScreen() {
    const router = useRouter();
    const [selectedGender, setSelectedGender] = useState<string | null>(null);
    const buttonOpacity = useSharedValue(0.5);

    useEffect(() => {
        buttonOpacity.value = withSpring(selectedGender ? 1 : 0.5, { damping: 12, stiffness: 200 });
    }, [selectedGender]);

    const buttonStyle = useAnimatedStyle(() => ({
        opacity: buttonOpacity.value,
    }));

    const handleContinue = () => {
        if (!selectedGender) return;
        // TODO: Save to store
        router.push('/dob-input');
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
                        <ProgressDots steps={6} currentStep={4} />
                    </Animated.View>
                </View>

                {/* Content */}
                <View className="flex-1 px-6 pt-8">
                    {/* Title Section */}
                    <Animated.View entering={FadeInDown.delay(200).duration(500)} style={{ marginBottom: 32 }}>
                        <Text
                            className="text-[#111827] font-[PlusJakartaSans_800ExtraBold] text-center mb-3"
                            style={{ fontSize: 30, lineHeight: 36, letterSpacing: -0.75 }}
                        >
                            How do you identify?
                        </Text>
                        <Text
                            className="text-[#6B7280] font-[PlusJakartaSans_500Medium] text-center"
                            style={{ fontSize: 16, lineHeight: 24 }}
                        >
                            This helps us personalize your journey.
                        </Text>
                    </Animated.View>

                    {/* Options */}
                    <View style={{ gap: 16 }}>
                        {genderOptions.map((option, index) => (
                            <Animated.View
                                key={option.id}
                                entering={FadeInDown.delay(400 + index * 100).duration(500)}
                            >
                                <SelectionCard
                                    icon={option.icon}
                                    title={option.title}
                                    description={option.description}
                                    isSelected={selectedGender === option.id}
                                    onPress={() => setSelectedGender(option.id)}
                                />
                            </Animated.View>
                        ))}
                    </View>
                </View>

                {/* Continue Button */}
                <Animated.View
                    entering={FadeInUp.delay(800).duration(500)}
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
                            disabled={!selectedGender}
                        />
                    </Animated.View>
                </Animated.View>
            </SafeAreaView>
        </View>
    );
}
