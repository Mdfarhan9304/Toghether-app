import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import SelectionCard from '../../components/SelectionCard';
import { OnboardingLayout } from '../../components/onboarding/OnboardingLayout';
import { useOnboardingStore } from '../../store/onboardingStore';

const GENDER_OPTIONS = [
    { id: 'male', icon: 'male' as const, title: 'Man', description: '' },
    { id: 'female', icon: 'female' as const, title: 'Woman', description: '' },
];

export default function GenderSelectionScreen() {
    const router = useRouter();
    const [selectedGender, setSelectedGender] = useState<string | null>(null);
    const { setGender } = useOnboardingStore();

    const handleContinue = () => {
        if (!selectedGender) return;
        setGender(selectedGender);
        router.push('/dob-input');
    };

    return (
        <OnboardingLayout
            step={4}
            title="How do you identify?"
            subtitle="This helps us personalize your journey."
            onContinue={handleContinue}
            onBack={() => router.back()}
            continueDisabled={!selectedGender}
        >
            <View style={{ gap: 16 }}>
                {GENDER_OPTIONS.map((option, index) => (
                    <Animated.View
                        key={option.id}
                        entering={FadeInDown.delay(index * 100).duration(400)}
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
        </OnboardingLayout>
    );
}
