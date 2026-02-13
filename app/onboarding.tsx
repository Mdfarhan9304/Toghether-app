import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useOnboardingStore } from '../store/onboardingStore';

export default function OnboardingScreen() {
    const router = useRouter();
    const { completeOnboarding } = useOnboardingStore();

    const handleStart = () => {
        // Navigate to partner selection screen
        router.push('/partner-selection');
    };

    const handleLogin = () => {
        // Navigate to login
        // router.push('/auth/login');
        console.log("Navigate to login");
    };

    return (
        <View className="flex-1 bg-primary relative">
            <StatusBar style="light" />

            {/* Background Image */}
            <Image
                source={require('../assets/images/Couple holding hands.png')}
                className="absolute w-full h-[65%] top-0 left-0"
                resizeMode="cover"
            />

            {/* Gradient Overlay */}
            <LinearGradient
                colors={['transparent', '#A31645', '#A31645']}
                locations={[0, 0.6, 1]}
                style={{ position: 'absolute', width: '100%', height: '100%' }}
            />

            <SafeAreaView style={{ flex: 1, justifyContent: 'flex-end', paddingBottom: 40, paddingHorizontal: 32 }}>


                {/* Main Content */}
                <View>


                    {/* Title and Subtitle */}
                    <View className="pb-8" style={{ gap: 16 }}>
                        <Text
                            className="text-white font-[PlusJakartaSans_800ExtraBold] text-center"
                            style={{
                                fontSize: 36,
                                lineHeight: 39.6,
                                letterSpacing: -0.9
                            }}
                        >
                            Build Your Future{'\n'}
                            <Text className="text-secondary-foreground">Together</Text>
                        </Text>

                        <Text
                            className="text-white/90 font-[PlusJakartaSans_500Medium] text-center"
                            style={{
                                fontSize: 18,
                                lineHeight: 29.25
                            }}
                        >
                            A romantic, modern relationship{'\n'}goal tracking app for couples.
                        </Text>
                    </View>

                    {/* CTA Button */}
                    <View className="pb-6">
                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={handleStart}
                            className="bg-white rounded-full flex-row items-center justify-center shadow-lg shadow-black/10"
                            style={{
                                paddingVertical: 16,
                                paddingHorizontal: 32,
                                gap: 8
                            }}
                        >
                            <MaterialIcons name="favorite" size={24} color="#C4175C" />
                            <Text
                                className="text-secondary font-[PlusJakartaSans_700Bold]"
                                style={{ fontSize: 18, lineHeight: 28 }}
                            >
                                Start as a Couple
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Social Proof */}
                    <View className="flex-row items-center justify-center" style={{ gap: 12 }}>
                        {/* Avatars - Overlapping */}
                        <View className="flex-row" style={{ gap: -12 }}>
                            {[1, 2, 3].map((i) => (
                                <View key={i} className="w-8 h-8 rounded-full border-2 border-primary overflow-hidden -ml-4">
                                    <Image
                                        source={{ uri: `https://i.pravatar.cc/100?img=${i + 10}` }}
                                        className="w-full h-full"
                                    />
                                </View>
                            ))}

                            {/* Badge */}
                            <View
                                className="w-8 h-8 rounded-full border-2 border-primary bg-secondary-foreground items-center justify-center"
                                style={{ paddingTop: 6, paddingBottom: 7, marginLeft: -10 }}
                            >
                                <Text
                                    className="text-secondary font-[PlusJakartaSans_700Bold]"
                                    style={{ fontSize: 10, lineHeight: 15 }}
                                >
                                    50k+
                                </Text>
                            </View>
                        </View>

                        <Text
                            className="text-white/80 font-[PlusJakartaSans_500Medium]"
                            style={{ fontSize: 14, lineHeight: 20 }}
                        >
                            Join 50,000+ couples growing together.
                        </Text>
                    </View>

                    {/* Login Link */}
                    <View className="flex-row justify-center items-center pt-6">
                        <Text
                            className="text-white/60 font-[PlusJakartaSans_500Medium]"
                            style={{ fontSize: 14, lineHeight: 20 }}
                        >
                            Already have an account?{' '}
                        </Text>
                        <TouchableOpacity onPress={handleLogin}>
                            <Text
                                className="text-white/60 font-[PlusJakartaSans_500Medium] underline"
                                style={{ fontSize: 14, lineHeight: 20 }}
                            >
                                Log in
                            </Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </SafeAreaView>
        </View>
    );
}
