import { useRouter } from 'expo-router';
import { useState } from 'react';
import { TextInput, View } from 'react-native';
import { OnboardingLayout } from '../../components/onboarding/OnboardingLayout';

export default function FullNameInputScreen() {
    const router = useRouter();
    const [fullName, setFullName] = useState('');
    const isValid = fullName.trim().length > 1;

    const handleContinue = () => {
        if (!isValid) return;
        // TODO: Save name to store
        router.push('/gender-selection');
    };

    return (
        <OnboardingLayout
            step={3}
            title="What's your name?"
            subtitle="Let's get to know you."
            onContinue={handleContinue}
            onBack={() => router.back()}
            continueDisabled={!isValid}
            avoidKeyboard
        >
            <View
                style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 50,
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 16,
                    paddingHorizontal: 24,
                    borderWidth: 2,
                    borderColor: 'rgba(224, 92, 143, 0.3)',
                }}
            >
                <TextInput
                    className="flex-1 font-[PlusJakartaSans_600SemiBold] text-[#111827]"
                    style={{ fontSize: 20 }}
                    placeholder="Your First Name"
                    placeholderTextColor="#9CA3AF"
                    value={fullName}
                    onChangeText={setFullName}
                    autoFocus
                    autoCapitalize="words"
                    autoCorrect={false}
                />
            </View>
        </OnboardingLayout>
    );
}
