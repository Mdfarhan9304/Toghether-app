import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInLeft, FadeInRight, FadeInUp, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import PremiumButton from "../components/PremiumButton";
import ProgressDots from '../components/ProgressDots';
import SelectionCard from '../components/SelectionCard';

const relationshipOptions = [
    {
        id: 'dating',
        icon: 'favorite' as const,
        title: 'Dating',
        description: 'Just started or been together a while',
    },
    {
        id: 'engaged',
        icon: 'diamond' as const,
        title: 'Engaged',
        description: 'Planning the big day',
    },
    {
        id: 'married',
        icon: 'home' as const,
        title: 'Married',
        description: 'Building a life together',
    },
    {
        id: 'long_distance',
        icon: 'flight' as const,
        title: 'Long Distance',
        description: 'Love across the miles',
    },
];

export default function PartnerSelectionScreen() {
    const router = useRouter();
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const buttonOpacity = useSharedValue(0.5);

    useEffect(() => {
        buttonOpacity.value = withSpring(selectedOption ? 1 : 0.5, { damping: 12, stiffness: 200 });
    }, [selectedOption]);

    const buttonStyle = useAnimatedStyle(() => ({
        opacity: buttonOpacity.value,
    }));

    const handleContinue = () => {
        if (!selectedOption) return;
        // TODO: Save selection to store
        router.push('/goal-selection');
    };

    const renderItem = ({ item, index }: { item: typeof relationshipOptions[0], index: number }) => (
        <Animated.View
            entering={FadeInLeft.delay(400 + index * 100)
                .duration(500)
                .springify()
                .damping(15)
                .stiffness(150)}
            exiting={FadeInRight.duration(500).springify().damping(15).stiffness(150)}
            style={{ marginBottom: 16 }}
        >
            <SelectionCard
                icon={item.icon}
                title={item.title}
                description={item.description}
                isSelected={selectedOption === item.id}
                onPress={() => setSelectedOption(item.id)}
            />
        </Animated.View>
    );

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
                        <ProgressDots steps={6} currentStep={1} />
                    </Animated.View>
                </View>

                {/* FlatList Content */}
                <FlatList
                    data={relationshipOptions}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 120 }}
                    ListHeaderComponent={
                        <Animated.View entering={FadeInDown.delay(200).duration(500)} style={{ marginBottom: 32 }}>
                            <Text
                                className="text-[#111827] font-[PlusJakartaSans_800ExtraBold] text-center mb-3"
                                style={{ fontSize: 30, lineHeight: 36, letterSpacing: -0.75 }}
                            >
                                Where are you two in{'\n'}your journey?
                            </Text>
                            <Text
                                className="text-[#6B7280] font-[PlusJakartaSans_500Medium] text-center"
                                style={{ fontSize: 16, lineHeight: 24 }}
                            >
                                We'll tailor your goals based on your stage.
                            </Text>
                        </Animated.View>
                    }
                    showsVerticalScrollIndicator={false}
                />

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
                        <PremiumButton
                            title="Continue"
                            onPress={handleContinue}
                            disabled={!selectedOption}
                        />
                    </Animated.View>
                </Animated.View>
            </SafeAreaView>
        </View>
    );
}
