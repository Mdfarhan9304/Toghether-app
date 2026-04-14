import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, TextInput, View } from 'react-native';
import { OnboardingLayout } from '../../components/onboarding/OnboardingLayout';
import { supabase } from '../../lib/supabase';

export default function EnterCodeScreen() {
    const router = useRouter();
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const isValid = code.replace('-', '').length === 6;

    const handleCodeChange = (text: string) => {
        const cleaned = text.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 6);
        setCode(cleaned.length > 3 ? `${cleaned.slice(0, 3)}-${cleaned.slice(3)}` : cleaned);
    };

    const handleContinue = async () => {
        if (!isValid) return;
        setIsLoading(true);

        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            setIsLoading(false);
            Alert.alert('Error', 'Not authenticated.');
            return;
        }

        const myId = session.user.id;

        // 1. Find profile with this invite code
        const { data: partnerData, error: findError } = await supabase
            .from('profiles')
            .select('id')
            .eq('invite_code', code)
            .single();

        if (findError || !partnerData) {
            setIsLoading(false);
            Alert.alert('Invalid Code', 'Could not find a partner with this code. Please check and try again.');
            return;
        }

        const partnerId = partnerData.id;

        if (partnerId === myId) {
            setIsLoading(false);
            Alert.alert('Error', 'You cannot enter your own code.');
            return;
        }

        // 2. Link them together
        // Update my partner_id
        await supabase.from('profiles').update({ partner_id: partnerId }).eq('id', myId);
        // Update their partner_id
        await supabase.from('profiles').update({ partner_id: myId }).eq('id', partnerId);

        setIsLoading(false);
        router.push('/paywall');
    };

    return (
        <OnboardingLayout
            step={5}
            title="Enter Partner Code"
            subtitle="Enter the 6-digit code shared by your partner."
            buttonLabel={isLoading ? "Linking..." : "Link Accounts"}
            onContinue={handleContinue}
            onBack={() => router.back()}
            continueDisabled={!isValid || isLoading}
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
