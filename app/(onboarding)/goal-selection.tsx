import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import Animated, { FadeInLeft, FadeInRight } from 'react-native-reanimated';
import SelectionCard from '../../components/SelectionCard';
import { OnboardingLayout } from '../../components/onboarding/OnboardingLayout';

const GOAL_OPTIONS = [
    { id: 'trip', icon: 'flight' as const, title: 'Save for a trip', description: 'Plan and save together for vacations' },
    { id: 'communication', icon: 'chat' as const, title: 'Communication', description: 'Build better habits around talking' },
    { id: 'date_nights', icon: 'event' as const, title: 'Plan date nights', description: 'Prioritize dedicating time to each other' },
    { id: 'fitness', icon: 'fitness-center' as const, title: 'Fitness together', description: 'Get healthy and active side-by-side' },
    { id: 'save_money', icon: 'savings' as const, title: 'Save money', description: 'Work towards a mutual financial goal' },
    { id: 'house', icon: 'cottage' as const, title: 'Buy a house', description: 'Save up for your shared dream home' },
    { id: 'custom', icon: 'edit' as const, title: 'Custom', description: 'Create your own unique goal' },
];

export default function GoalSelectionScreen() {
    const router = useRouter();
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

    const toggleOption = (id: string) => {
        setSelectedOptions(prev => {
            if (prev.includes(id)) return prev.filter(item => item !== id);
            if (prev.length >= 3) return prev; // max 3
            return [...prev, id];
        });
    };

    const handleContinue = () => {
        if (selectedOptions.length === 0) return;
        // TODO: Save selection to store
        router.push('/full-name-input');
    };

    return (
        <OnboardingLayout
            step={2}
            title={`Which goals do you\nwant to focus on first?`}
            subtitle="Pick 1–3 to kickstart your journey together."
            onContinue={handleContinue}
            onBack={() => router.back()}
            continueDisabled={selectedOptions.length === 0}
        >
            <ScrollView 
                style={{ marginHorizontal: -12 }}
                contentContainerStyle={{ gap: 12, paddingBottom: 16, paddingHorizontal: 12 }}
                showsVerticalScrollIndicator={false}
            >
                {GOAL_OPTIONS.map((option, index) => (
                    <Animated.View
                        key={option.id}
                        entering={FadeInLeft.delay(index * 80).duration(400).springify().damping(15).stiffness(150)}
                        exiting={FadeInRight.duration(400).springify().damping(15).stiffness(150)}
                    >
                        <SelectionCard
                            icon={option.icon}
                            title={option.title}
                            description={option.description}
                            isSelected={selectedOptions.includes(option.id)}
                            onPress={() => toggleOption(option.id)}
                        />
                    </Animated.View>
                ))}
            </ScrollView>
        </OnboardingLayout>
    );
}
