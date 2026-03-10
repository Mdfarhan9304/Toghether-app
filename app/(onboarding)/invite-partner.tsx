import { MaterialIcons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { OnboardingLayout } from '../../components/onboarding/OnboardingLayout';

// Mock code — in real app fetch from backend
const COUPLE_CODE = '529-841';

export default function InvitePartnerScreen() {
    const router = useRouter();
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await Clipboard.setStringAsync(COUPLE_CODE);
        setCopied(true);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <OnboardingLayout
            step={5}
            title="Invite Your Partner"
            subtitle="Share this code with your partner to link your accounts."
            buttonLabel="Continue"
            onContinue={() => router.push('/paywall')}
            onBack={() => router.back()}
            continueDisabled={false}
        >
            {/* Code Card */}
            <Animated.View
                entering={FadeInDown.delay(100).duration(400)}
                style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 32,
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 32,
                    marginBottom: 24,
                    borderWidth: 1,
                    borderColor: '#FFFFFF',
                    shadowColor: 'rgba(224,92,143,0.15)',
                    shadowOffset: { width: 0, height: 10 },
                    shadowOpacity: 1,
                    shadowRadius: 40,
                    elevation: 5,
                } as any}
            >
                {/* Top pink border accent */}
                <View
                    style={{
                        position: 'absolute',
                        top: 0,
                        width: 96,
                        height: 4,
                        backgroundColor: '#C4175C',
                        borderBottomLeftRadius: 4,
                        borderBottomRightRadius: 4,
                        opacity: 0.5,
                    }}
                />

                <Text
                    className="font-[PlusJakartaSans_600SemiBold]"
                    style={{ fontSize: 11, letterSpacing: 3, color: '#9CA3AF', textTransform: 'uppercase', marginBottom: 16 }}
                >
                    Your Couple Code
                </Text>

                <Text
                    className="font-[PlusJakartaSans_800ExtraBold]"
                    style={{ fontSize: 48, color: '#C4175C', letterSpacing: -1, marginBottom: 24 }}
                >
                    {COUPLE_CODE}
                </Text>

                <Text
                    className="font-[PlusJakartaSans_500Medium]"
                    style={{ fontSize: 13, color: '#9CA3AF' }}
                >
                    Code expires in 24 hours
                </Text>
            </Animated.View>

            {/* Copy button */}
            <Animated.View entering={FadeInDown.delay(250).duration(400)}>
                <TouchableOpacity
                    onPress={handleCopy}
                    activeOpacity={0.8}
                    style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: 16,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingVertical: 16,
                        paddingHorizontal: 32,
                        borderWidth: 1,
                        borderColor: copied ? '#C4175C' : 'transparent',
                        shadowColor: '#000',
                        shadowOpacity: 0.05,
                        shadowRadius: 8,
                        shadowOffset: { width: 0, height: 2 },
                        elevation: 2,
                        marginBottom: 24,
                    } as any}
                >
                    <MaterialIcons
                        name={copied ? 'check' : 'content-copy'}
                        size={20}
                        color={copied ? '#C4175C' : '#4B5563'}
                    />
                    <Text
                        className="font-[PlusJakartaSans_600SemiBold]"
                        style={{ fontSize: 16, color: copied ? '#C4175C' : '#374151', marginLeft: 8 }}
                    >
                        {copied ? 'Copied!' : 'Copy Code'}
                    </Text>
                </TouchableOpacity>
            </Animated.View>

            {/* Already have a code link */}
            <Animated.View entering={FadeInDown.delay(400).duration(400)} style={{ alignItems: 'center' }}>
                <TouchableOpacity
                    onPress={() => router.push('/enter-code')}
                    style={{ flexDirection: 'row', alignItems: 'center' }}
                >
                    <Text
                        className="font-[PlusJakartaSans_600SemiBold]"
                        style={{ fontSize: 15, color: '#C4175C', marginRight: 4 }}
                    >
                        Already have a code? Enter it here
                    </Text>
                    <MaterialIcons name="arrow-forward" size={16} color="#C4175C" />
                </TouchableOpacity>
            </Animated.View>
        </OnboardingLayout>
    );
}
