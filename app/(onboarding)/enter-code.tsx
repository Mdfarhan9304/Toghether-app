import { useRouter } from 'expo-router';
import { useState } from 'react';
import { TextInput, View } from 'react-native';
import { OnboardingLayout } from '../../components/onboarding/OnboardingLayout';

export default function EnterCodeScreen() {
    const router = useRouter();
    const [code, setCode] = useState('');
    const isValid = code.replace('-', '').length === 6;

    const handleCodeChange = (text: string) => {
        const cleaned = text.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 6);
        setCode(cleaned.length > 3 ? `${cleaned.slice(0, 3)}-${cleaned.slice(3)}` : cleaned);
    };

    const handleContinue = () => {
        if (!isValid) return;
        // TODO: Verify code API call
        router.push('/paywall');
    };

    return (
        <OnboardingLayout
            step={5}
            title="Enter Partner Code"
            subtitle="Enter the 6-digit code shared by your partner."
            buttonLabel="Link Accounts"
            onContinue={handleContinue}
            onBack={() => router.back()}
            continueDisabled={!isValid}
            avoidKeyboard
        >
            <View
                style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 20,
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 16,
                    paddingHorizontal: 24,
                    borderWidth: 2,
                    borderColor: 'rgba(224, 92, 143, 0.3)',
                }}
            >
                <TextInput
                    className="flex-1 font-[PlusJakartaSans_700Bold] text-[#111827] text-center"
                    style={{ fontSize: 28, letterSpacing: 8 }}
                    placeholder="XXX-XXX"
                    placeholderTextColor="#9CA3AF"
                    value={code}
                    onChangeText={handleCodeChange}
                    autoFocus
                    autoCapitalize="characters"
                    autoCorrect={false}
                    keyboardType="default"
                    maxLength={7}
                />
            </View>
        </OnboardingLayout>
    );
}
