import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInLeft, FadeInRight, FadeInUp, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProgressDots from '../components/ProgressDots';
import SelectionCard from '../components/SelectionCard';

const goalOptions = [
    {
        id: 'trip',
        icon: 'flight' as const,
        title: 'Save for a trip',
    },
    {
        id: 'communication',
        icon: 'chat' as const,
        title: 'Improve communication',
    },
    {
        id: 'date_nights',
        icon: 'event',
        title: 'Plan date nights',
    },
    {
        id: 'fitness',
        icon: 'fitness-center' as const,
        title: 'Fitness together',
    },
    {
        id: 'save_money',
        icon: 'savings' as const,
        title: 'Save money',
    },
    {
        id: 'house',
        icon: 'cottage' as const,
        title: 'Buy a house',
    },
    {
        id: 'custom',
        icon: 'edit' as const,
        title: 'Custom',
    },
];

export default function GoalSelectionScreen() {
    const router = useRouter();
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const buttonOpacity = useSharedValue(0.5);

    useEffect(() => {
        buttonOpacity.value = withSpring(selectedOptions.length > 0 ? 1 : 0.5, { damping: 12, stiffness: 200 });
    }, [selectedOptions]);

    const buttonStyle = useAnimatedStyle(() => ({
        opacity: buttonOpacity.value,
    }));

    const toggleOption = (id: string) => {
        setSelectedOptions(prev => {
            if (prev.includes(id)) {
                return prev.filter(item => item !== id);
            }
            if (prev.length >= 3) {
                // Max 3 selection limit
                return prev;
            }
            return [...prev, id];
        });
    };

    const handleContinue = () => {
        if (selectedOptions.length === 0) return;
        // TODO: Save selection to store
        // Navigate to next screen
        router.push('/full-name-input');
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
                    // Blur approximation
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
                {/* Header - Back Button + Progress */}
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
                        <ProgressDots steps={3} currentStep={1} />
                    </Animated.View>
                </View>

                <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 16 }}>
                    {/* Title Section */}
                    <Animated.View entering={FadeInDown.delay(200).duration(500)} style={{ marginBottom: 32 }}>
                        <Text
                            className="text-[#111827] font-[PlusJakartaSans_800ExtraBold] text-center mb-3"
                            style={{ fontSize: 30, lineHeight: 36, letterSpacing: -0.75 }}
                        >
                            Which goals do you{'\n'}want to focus on first?
                        </Text>
                        <Text
                            className="text-[#6B7280] font-[PlusJakartaSans_500Medium] text-center"
                            style={{ fontSize: 16, lineHeight: 24 }}
                        >
                            Pick 1-3 to kickstart your journey together.
                        </Text>
                    </Animated.View>

                    {/* Selection Cards */}
                    <View style={{ gap: 12, paddingBottom: 120 }}>
                        {goalOptions.map((option, index) => (
                            <Animated.View
                                key={option.id}
                                entering={FadeInLeft.delay(400 + index * 100)
                                    .duration(500)
                                    .springify()
                                    .damping(15)
                                    .stiffness(150)}
                                exiting={FadeInRight.duration(500).springify().damping(15).stiffness(150)}
                            >
                                <SelectionCard
                                    icon={option.icon}
                                    title={option.title}
                                    isSelected={selectedOptions.includes(option.id)}
                                    onPress={() => toggleOption(option.id)}
                                />
                            </Animated.View>
                        ))}
                    </View>
                </ScrollView>

                {/* Fixed Continue Button */}
                <Animated.View
                    entering={FadeInUp.delay(800).duration(500)}
                    className="absolute bottom-0 left-0 right-0"
                    style={{
                        paddingHorizontal: 24,
                        paddingVertical: 24,
                        paddingBottom: 24,
                        // Gradient fade (approximated with shadow)
                        shadowColor: '#F8F6F7',
                        shadowOffset: { width: 0, height: -20 },
                        shadowOpacity: 1,
                        shadowRadius: 20,
                    }}
                >
                    <Animated.View style={buttonStyle}>
                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={handleContinue}
                            disabled={selectedOptions.length === 0}
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
            </SafeAreaView>
        </View>
    );
}
