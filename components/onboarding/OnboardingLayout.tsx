import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import Animated, {
    FadeIn,
    FadeInDown,
    FadeInUp,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import PremiumButton from '../PremiumButton';
import ProgressDots from '../ProgressDots';

interface OnboardingLayoutProps {
    /** Current step index (1-based) */
    step: number;
    /** Total number of steps */
    totalSteps?: number;
    /** Screen title */
    title: string;
    /** Subtitle below title */
    subtitle?: string;
    /** Button label */
    buttonLabel?: string;
    /** Called when continue is pressed */
    onContinue: () => void;
    /** Whether the continue button is disabled */
    continueDisabled?: boolean;
    /** Called when back button is pressed */
    onBack: () => void;
    /** Whether to wrap content in KeyboardAvoidingView */
    avoidKeyboard?: boolean;
    /** Screen content */
    children: React.ReactNode;
}

/**
 * Shared layout wrapper for all onboarding screens.
 * Handles: background blur circles, back nav, progress dots,
 * animated title/subtitle, and a fixed bottom continue button.
 */
export function OnboardingLayout({
    step,
    totalSteps = 6,
    title,
    subtitle,
    buttonLabel = 'Continue',
    onContinue,
    continueDisabled = false,
    onBack,
    avoidKeyboard = false,
    children,
}: OnboardingLayoutProps) {
    const buttonOpacity = useSharedValue(continueDisabled ? 0.5 : 1);

    React.useEffect(() => {
        buttonOpacity.value = withSpring(continueDisabled ? 0.5 : 1, {
            damping: 12,
            stiffness: 200,
        });
    }, [continueDisabled, buttonOpacity]);

    const buttonStyle = useAnimatedStyle(() => ({
        opacity: buttonOpacity.value,
    }));

    const content = (
        <View style={{ flex: 1 }}>
            {/* Header: back button + progress dots */}
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 16,
                    paddingVertical: 16,
                    minHeight: 56,
                }}
            >
                <TouchableOpacity
                    onPress={onBack}
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'absolute',
                        left: 16,
                        zIndex: 10,
                    }}
                >
                    <MaterialIcons name="arrow-back" size={24} color="#4B5563" />
                </TouchableOpacity>

                <Animated.View
                    entering={FadeIn.duration(400)}
                    style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
                >
                    <ProgressDots steps={totalSteps} currentStep={step} />
                </Animated.View>
            </View>

            {/* Title and subtitle */}
            <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 32 }}>
                <Animated.View entering={FadeInDown.delay(200).duration(500)} style={{ marginBottom: 32 }}>
                    <Text
                        className="font-[PlusJakartaSans_800ExtraBold] text-center"
                        style={{
                            fontSize: 30,
                            lineHeight: 36,
                            letterSpacing: -0.75,
                            color: '#111827',
                            marginBottom: 12,
                        }}
                    >
                        {title}
                    </Text>
                    {subtitle ? (
                        <Text
                            className="font-[PlusJakartaSans_500Medium] text-center"
                            style={{ fontSize: 16, lineHeight: 24, color: '#6B7280' }}
                        >
                            {subtitle}
                        </Text>
                    ) : null}
                </Animated.View>

                {/* Screen-specific content */}
                <Animated.View entering={FadeInDown.delay(400).duration(500)} style={{ flex: 1 }}>
                    {children}
                </Animated.View>
            </View>

            {/* Continue button */}
            <Animated.View
                entering={FadeInUp.delay(600).duration(500)}
                style={{
                    paddingHorizontal: 24,
                    paddingVertical: 24,
                    paddingBottom: 24,
                }}
            >
                <Animated.View style={buttonStyle}>
                    <PremiumButton
                        title={buttonLabel}
                        onPress={onContinue}
                        disabled={continueDisabled}
                    />
                </Animated.View>
            </Animated.View>
        </View>
    );

    return (
        <View style={{ flex: 1, backgroundColor: '#F8F6F7' }}>
            <StatusBar style="dark" />

            {/* Background decorative circles */}
            <View
                style={{
                    position: 'absolute',
                    width: 256,
                    height: 256,
                    borderRadius: 128,
                    backgroundColor: 'rgba(196,23,92,0.05)',
                    top: -80,
                    right: -32,
                }}
            />
            <View
                style={{
                    position: 'absolute',
                    width: 320,
                    height: 320,
                    borderRadius: 160,
                    backgroundColor: 'rgba(196,23,92,0.05)',
                    bottom: -100,
                    left: -80,
                }}
            />

            <SafeAreaView style={{ flex: 1 }}>
                {avoidKeyboard ? (
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={{ flex: 1 }}
                    >
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            {content}
                        </TouchableWithoutFeedback>
                    </KeyboardAvoidingView>
                ) : (
                    content
                )}
            </SafeAreaView>
        </View>
    );
}
