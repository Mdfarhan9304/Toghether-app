import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View, ScrollView } from 'react-native';
import Animated, { FadeInLeft, FadeInRight } from 'react-native-reanimated';
import SelectionCard from '../../components/SelectionCard';
import { OnboardingLayout } from '../../components/onboarding/OnboardingLayout';
import { useOnboardingStore } from '../../store/onboardingStore';

const RELATIONSHIP_OPTIONS = [
    { id: 'dating', icon: 'favorite' as const, title: 'Dating', description: 'Just started or been together a while' },
    { id: 'engaged', icon: 'diamond' as const, title: 'Engaged', description: 'Planning the big day' },
    { id: 'married', icon: 'home' as const, title: 'Married', description: 'Building a life together' },
    { id: 'long_distance', icon: 'flight' as const, title: 'Long Distance', description: 'Love across the miles' },
];

export default function PartnerSelectionScreen() {
    const router = useRouter();
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const { setRelationshipStatus } = useOnboardingStore();

    const handleContinue = () => {
        if (!selectedOption) return;
        setRelationshipStatus(selectedOption);
        router.push('/goal-selection');
    };

    return (
        <OnboardingLayout
            step={1}
            title={`Where are you two in\nyour journey?`}
            subtitle="We'll tailor your goals based on your stage."
            onContinue={handleContinue}
            onBack={() => router.back()}
            continueDisabled={!selectedOption}
        >
            <ScrollView 
                style={{ marginHorizontal: -12 }}
                contentContainerStyle={{ gap: 16, paddingBottom: 20, paddingHorizontal: 12 }}
                showsVerticalScrollIndicator={false}
            >
                {RELATIONSHIP_OPTIONS.map((item, index) => (
                    <Animated.View
                        key={item.id}
                        entering={FadeInLeft.delay(index * 100).duration(400).springify().damping(15).stiffness(150)}
                        exiting={FadeInRight.duration(400).springify().damping(15).stiffness(150)}
                    >
                        <SelectionCard
                            icon={item.icon}
                            title={item.title}
                            description={item.description}
                            isSelected={selectedOption === item.id}
                            onPress={() => setSelectedOption(item.id)}
                        />
                    </Animated.View>
                ))}
            </ScrollView>
        </OnboardingLayout>
    );
}
