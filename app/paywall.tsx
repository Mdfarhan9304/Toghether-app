import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
    Dimensions,
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type PlanType = 'monthly' | 'yearly';

interface FeatureItemProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

function FeatureItem({ icon, title, description }: FeatureItemProps) {
    return (
        <View className="flex-row items-start" style={{ gap: 14, paddingVertical: 10 }}>
            <View
                className="rounded-full items-center justify-center"
                style={{
                    width: 48,
                    height: 48,
                    backgroundColor: '#FFF0F3',
                }}
            >
                {icon}
            </View>
            <View className="flex-1" style={{ gap: 2 }}>
                <Text
                    className="font-[PlusJakartaSans_700Bold] text-foreground"
                    style={{ fontSize: 16, lineHeight: 22 }}
                >
                    {title}
                </Text>
                <Text
                    className="font-[PlusJakartaSans_400Regular]"
                    style={{ fontSize: 14, lineHeight: 20, color: '#71717A' }}
                >
                    {description}
                </Text>
            </View>
        </View>
    );
}

export default function PaywallScreen() {
    const router = useRouter();
    const [selectedPlan, setSelectedPlan] = useState<PlanType>('yearly');

    // Button animation
    const buttonScale = useSharedValue(1);
    const animatedButtonStyle = useAnimatedStyle(() => ({
        transform: [{ scale: buttonScale.value }],
    }));

    const handleUpgrade = () => {
        // TODO: Implement purchase logic
        console.log(`Upgrading to ${selectedPlan} plan`);
    };

    const handleRestore = () => {
        // TODO: Implement restore purchases
        console.log('Restoring purchases');
    };

    const handleClose = () => {
        router.back();
    };

    const handlePressIn = () => {
        buttonScale.value = withSpring(0.96, { damping: 10, stiffness: 300 });
    };

    const handlePressOut = () => {
        buttonScale.value = withSpring(1, { damping: 10, stiffness: 300 });
        handleUpgrade();
    };

    return (
        <View className="flex-1 bg-white">
            <StatusBar style="light" />

            <ScrollView
                bounces={false}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}
            >
                {/* Hero Image Section */}
                <View style={{ height: 340, position: 'relative' }}>
                    <Image
                        source={require('../assets/images/couple-sunset-hero.png')}
                        style={{ width: '100%', height: '100%' }}
                        resizeMode="cover"
                    />

                    {/* Gradient fade at bottom of image */}
                    <LinearGradient
                        colors={['transparent', 'rgba(255,255,255,0.6)', '#FFFFFF']}
                        locations={[0.3, 0.7, 1]}
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: 120,
                        }}
                    />

                    {/* Close & Restore buttons */}
                    <SafeAreaView
                        edges={['top']}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            paddingHorizontal: 20,
                            paddingTop: 8,
                        }}
                    >
                        <TouchableOpacity
                            onPress={handleClose}
                            style={{
                                width: 36,
                                height: 36,
                                borderRadius: 18,
                                backgroundColor: 'rgba(0,0,0,0.25)',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <MaterialIcons name="close" size={20} color="#FFFFFF" />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={handleRestore}>
                            <Text
                                className="font-[PlusJakartaSans_500Medium]"
                                style={{
                                    fontSize: 15,
                                    color: '#FFFFFF',
                                    textShadowColor: 'rgba(0,0,0,0.4)',
                                    textShadowOffset: { width: 0, height: 1 },
                                    textShadowRadius: 4,
                                }}
                            >
                                Restore
                            </Text>
                        </TouchableOpacity>
                    </SafeAreaView>
                </View>

                {/* Content Card */}
                <View
                    style={{
                        marginTop: -40,
                        borderTopLeftRadius: 28,
                        borderTopRightRadius: 28,
                        backgroundColor: '#FFFFFF',
                        paddingHorizontal: 28,
                        paddingTop: 28,
                        paddingBottom: 24,
                        flex: 1,
                    }}
                >
                    {/* Premium Badge */}
                    <View className="items-center" style={{ marginBottom: 20 }}>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                backgroundColor: '#FFF9E6',
                                paddingHorizontal: 16,
                                paddingVertical: 8,
                                borderRadius: 20,
                                gap: 6,
                            }}
                        >
                            <Text style={{ fontSize: 14 }}>⭐</Text>
                            <Text
                                className="font-[PlusJakartaSans_700Bold]"
                                style={{
                                    fontSize: 12,
                                    letterSpacing: 1.5,
                                    color: '#C8902E',
                                }}
                            >
                                PREMIUM ACCESS
                            </Text>
                        </View>
                    </View>

                    {/* Title */}
                    <View className="items-center" style={{ marginBottom: 12 }}>
                        <Text
                            className="font-[PlusJakartaSans_800ExtraBold] text-center"
                            style={{
                                fontSize: 30,
                                lineHeight: 38,
                                color: '#A31645',
                                fontStyle: 'italic',
                                letterSpacing: -0.5,
                            }}
                        >
                            Unlock Your Future{'\n'}Together
                        </Text>
                    </View>

                    {/* Subtitle */}
                    <View className="items-center" style={{ marginBottom: 28 }}>
                        <Text
                            className="font-[PlusJakartaSans_400Regular] text-center"
                            style={{
                                fontSize: 15,
                                lineHeight: 22,
                                color: '#71717A',
                                maxWidth: 300,
                            }}
                        >
                            Invest in your relationship with daily tools for deeper connection.
                        </Text>
                    </View>

                    {/* Features */}
                    <View style={{ marginBottom: 28 }}>
                        <FeatureItem
                            icon={
                                <MaterialIcons name="all-inclusive" size={24} color="#A31645" />
                            }
                            title="Unlimited Goals"
                            description="Track every shared dream without limits."
                        />
                        <FeatureItem
                            icon={
                                <MaterialIcons name="auto-graph" size={24} color="#A31645" />
                            }
                            title="Deep Insights"
                            description="Visual analytics of your relationship health."
                        />
                        <FeatureItem
                            icon={
                                <MaterialIcons name="favorite-border" size={24} color="#A31645" />
                            }
                            title="Date Night Ideas"
                            description="Curated, personalized date suggestions."
                        />
                    </View>

                    {/* Pricing Toggle */}
                    <View className="items-center" style={{ marginBottom: 8 }}>
                        <View
                            style={{
                                flexDirection: 'row',
                                backgroundColor: '#F4F4F5',
                                borderRadius: 30,
                                padding: 4,
                                width: SCREEN_WIDTH - 80,
                            }}
                        >
                            <TouchableOpacity
                                onPress={() => setSelectedPlan('monthly')}
                                style={{
                                    flex: 1,
                                    paddingVertical: 14,
                                    borderRadius: 26,
                                    alignItems: 'center',
                                    backgroundColor:
                                        selectedPlan === 'monthly' ? '#FFFFFF' : 'transparent',
                                    ...(selectedPlan === 'monthly'
                                        ? {
                                            shadowColor: '#000',
                                            shadowOffset: { width: 0, height: 2 },
                                            shadowOpacity: 0.08,
                                            shadowRadius: 8,
                                            elevation: 3,
                                        }
                                        : {}),
                                }}
                            >
                                <Text
                                    className={`font-[PlusJakartaSans_700Bold]`}
                                    style={{
                                        fontSize: 15,
                                        color:
                                            selectedPlan === 'monthly' ? '#09090B' : '#71717A',
                                    }}
                                >
                                    Monthly
                                </Text>
                                <Text
                                    className="font-[PlusJakartaSans_400Regular]"
                                    style={{
                                        fontSize: 13,
                                        color:
                                            selectedPlan === 'monthly' ? '#71717A' : '#A1A1AA',
                                        marginTop: 2,
                                    }}
                                >
                                    $4.99/mo
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => setSelectedPlan('yearly')}
                                style={{
                                    flex: 1,
                                    paddingVertical: 14,
                                    borderRadius: 26,
                                    alignItems: 'center',
                                    backgroundColor:
                                        selectedPlan === 'yearly' ? '#FFFFFF' : 'transparent',
                                    ...(selectedPlan === 'yearly'
                                        ? {
                                            shadowColor: '#000',
                                            shadowOffset: { width: 0, height: 2 },
                                            shadowOpacity: 0.08,
                                            shadowRadius: 8,
                                            elevation: 3,
                                        }
                                        : {}),
                                }}
                            >
                                {/* Yearly top accent line */}
                                {selectedPlan === 'yearly' && (
                                    <View
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            width: 40,
                                            height: 3,
                                            borderRadius: 2,
                                            backgroundColor: '#A31645',
                                        }}
                                    />
                                )}
                                <Text
                                    className={`font-[PlusJakartaSans_700Bold]`}
                                    style={{
                                        fontSize: 15,
                                        color:
                                            selectedPlan === 'yearly' ? '#A31645' : '#71717A',
                                    }}
                                >
                                    Yearly
                                </Text>
                                <Text
                                    className="font-[PlusJakartaSans_400Regular]"
                                    style={{
                                        fontSize: 13,
                                        color:
                                            selectedPlan === 'yearly' ? '#71717A' : '#A1A1AA',
                                        marginTop: 2,
                                    }}
                                >
                                    $3.33/mo
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Billing note */}
                    <View className="items-center" style={{ marginBottom: 24 }}>
                        <Text
                            className="font-[PlusJakartaSans_400Regular]"
                            style={{ fontSize: 13, color: '#A1A1AA' }}
                        >
                            {selectedPlan === 'yearly'
                                ? 'Billed as one payment of $39.99/year'
                                : 'Billed monthly, cancel anytime'}
                        </Text>
                    </View>

                    {/* Upgrade Button */}
                    <Animated.View style={animatedButtonStyle}>
                        <TouchableOpacity
                            activeOpacity={1}
                            onPressIn={handlePressIn}
                            onPressOut={handlePressOut}
                            style={{
                                borderRadius: 30,
                                overflow: 'hidden',
                            }}
                        >
                            <LinearGradient
                                colors={['#C4175C', '#A31645']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    paddingVertical: 18,
                                    paddingHorizontal: 32,
                                    borderRadius: 30,
                                    gap: 10,
                                }}
                            >
                                <Text
                                    className="font-[PlusJakartaSans_700Bold]"
                                    style={{ fontSize: 18, color: '#FFFFFF' }}
                                >
                                    Upgrade Now
                                </Text>
                                <MaterialIcons
                                    name="arrow-forward"
                                    size={20}
                                    color="#FFFFFF"
                                />
                            </LinearGradient>
                        </TouchableOpacity>
                    </Animated.View>

                    {/* Terms & Privacy */}
                    <View
                        className="flex-row justify-center items-center"
                        style={{ marginTop: 20, gap: 24 }}
                    >
                        <TouchableOpacity>
                            <Text
                                className="font-[PlusJakartaSans_400Regular]"
                                style={{
                                    fontSize: 13,
                                    color: '#A1A1AA',
                                    textDecorationLine: 'underline',
                                }}
                            >
                                Terms of Service
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Text
                                className="font-[PlusJakartaSans_400Regular]"
                                style={{
                                    fontSize: 13,
                                    color: '#A1A1AA',
                                    textDecorationLine: 'underline',
                                }}
                            >
                                Privacy Policy
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
