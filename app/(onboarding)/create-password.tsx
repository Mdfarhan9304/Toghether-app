import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, {
    FadeIn,
    FadeInDown,
    FadeInUp,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import PremiumButton from '../../components/PremiumButton';
import ProgressDots from '../../components/ProgressDots';
import { supabase } from '../../lib/supabase';
import { useOnboardingStore } from '../../store/onboardingStore';

export default function CreatePasswordScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { fullName, gender, dob, relationshipStatus, selectedGoals } = useOnboardingStore();

    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    const passwordValid = password.length >= 6;
    const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;
    const canContinue = emailValid && passwordValid && passwordsMatch;

    const strengthScore = (): { label: string; color: string; width: string } => {
        if (password.length === 0) return { label: '', color: '#E5E7EB', width: '0%' };
        if (password.length < 6) return { label: 'Too short', color: '#EF4444', width: '25%' };
        if (password.length < 8) return { label: 'Weak', color: '#F59E0B', width: '50%' };
        if (/[A-Z]/.test(password) && /[0-9]/.test(password)) return { label: 'Strong', color: '#10B981', width: '100%' };
        return { label: 'Fair', color: '#A31645', width: '75%' };
    };

    const strength = strengthScore();

    const handleContinue = async () => {
        if (!canContinue) return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        if (password !== confirmPassword) {
            Alert.alert('Password Mismatch', 'Both passwords must match.');
            return;
        }

        setIsLoading(true);

        console.log("=== DEBUG SIGNUP (CREATE PASSWORD) ===");
        console.log("Attempting sign up with Email:", email.trim());
        console.log("Password length:", password.length, "Password exact:", `'${password}'`);
        console.log("Metadata Payload:", { full_name: fullName, gender, dob, relationship_status: relationshipStatus });

        // Create the user with email and password, passing onboarding answers as metadata
        const { data: authData, error } = await supabase.auth.signUp({
            email: email.trim(),
            password,
            options: {
                data: {
                    full_name: fullName,
                    gender,
                    dob,
                    relationship_status: relationshipStatus,
                    selected_goals: selectedGoals,
                }
            }
        });
        
        console.log("Signup returned AuthData:", JSON.stringify(authData, null, 2));
        console.log("Signup returned Error:", error);
        if (error) {
            setIsLoading(false);
            Alert.alert('Error', error.message);
            return;
        }

        if (authData?.user) {
            let inviteCode = '';
            for (let i = 0; i < 3; i++) {
                inviteCode = Math.floor(100000 + Math.random() * 900000).toString();
                const { error: insertError } = await supabase.from('profiles').upsert({
                    id: authData.user.id,
                    full_name: fullName,
                    gender,
                    dob,
                    relationship_status: relationshipStatus,
                    selected_goals: selectedGoals,
                    invite_code: `${inviteCode.slice(0, 3)}-${inviteCode.slice(3)}`
                }, { onConflict: 'id' });

                if (!insertError) break;
            }
        }

        setIsLoading(false);

        // Navigate to invite partner
        router.push('/invite-partner');
    };

    return (
        <View style={styles.root}>
            {/* Background decorative circles */}
            <View style={styles.circleTR} />
            <View style={styles.circleBL} />

            <SafeAreaView style={styles.flex}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.flex}
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity
                            onPress={() => router.back()}
                            style={styles.backBtn}
                        >
                            <MaterialIcons name="arrow-back" size={24} color="#4B5563" />
                        </TouchableOpacity>
                        <Animated.View entering={FadeIn.duration(400)} style={styles.dotsWrapper}>
                            <ProgressDots steps={6} currentStep={6} />
                        </Animated.View>
                    </View>

                    <ScrollView
                        style={styles.flex}
                        contentContainerStyle={styles.scrollContent}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Title */}
                        <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.titleBlock}>
                            <Text style={styles.title}>Create your account</Text>
                            <Text style={styles.subtitle}>
                                Set up your email and password so you can log back in anytime.
                            </Text>
                        </Animated.View>

                        <Animated.View entering={FadeInDown.delay(350).duration(500)} style={styles.form}>
                            {/* Email */}
                            <View style={styles.field}>
                                <Text style={styles.label}>Email</Text>
                                <View style={[styles.inputWrapper, emailValid && email.length > 0 && styles.inputValid]}>
                                    <TextInput
                                        value={email}
                                        onChangeText={setEmail}
                                        placeholder="you@example.com"
                                        placeholderTextColor="#9CA3AF"
                                        autoCapitalize="none"
                                        keyboardType="email-address"
                                        autoCorrect={false}
                                        style={styles.input}
                                    />
                                    {emailValid && email.length > 0 && (
                                        <MaterialIcons name="check-circle" size={20} color="#10B981" style={styles.inputIcon} />
                                    )}
                                </View>
                            </View>

                            {/* Password */}
                            <View style={styles.field}>
                                <Text style={styles.label}>Password</Text>
                                <View style={[styles.inputWrapper, passwordValid && styles.inputValid]}>
                                    <TextInput
                                        value={password}
                                        onChangeText={setPassword}
                                        placeholder="Minimum 6 characters"
                                        placeholderTextColor="#9CA3AF"
                                        secureTextEntry={!showPassword}
                                        autoCapitalize="none"
                                        textContentType="oneTimeCode"
                                        style={[styles.input, { flex: 1 }]}
                                    />
                                    <TouchableOpacity onPress={() => setShowPassword(p => !p)} style={styles.inputIcon}>
                                        <MaterialIcons
                                            name={showPassword ? 'visibility-off' : 'visibility'}
                                            size={20}
                                            color="#9CA3AF"
                                        />
                                    </TouchableOpacity>
                                </View>

                                {/* Password strength bar */}
                                {password.length > 0 && (
                                    <View style={styles.strengthContainer}>
                                        <View style={styles.strengthBarBg}>
                                            <View
                                                style={[
                                                    styles.strengthBarFill,
                                                    {
                                                        width: strength.width as any,
                                                        backgroundColor: strength.color,
                                                    },
                                                ]}
                                            />
                                        </View>
                                        <Text style={[styles.strengthLabel, { color: strength.color }]}>
                                            {strength.label}
                                        </Text>
                                    </View>
                                )}
                            </View>

                            {/* Confirm Password */}
                            <View style={[styles.field, { marginBottom: 0 }]}>
                                <Text style={styles.label}>Confirm Password</Text>
                                <View style={[
                                    styles.inputWrapper,
                                    passwordsMatch && styles.inputValid,
                                    !passwordsMatch && confirmPassword.length > 0 && styles.inputError,
                                ]}>
                                    <TextInput
                                        value={confirmPassword}
                                        onChangeText={setConfirmPassword}
                                        placeholder="Re-enter your password"
                                        placeholderTextColor="#9CA3AF"
                                        secureTextEntry={!showConfirm}
                                        autoCapitalize="none"
                                        textContentType="oneTimeCode"
                                        style={[styles.input, { flex: 1 }]}
                                    />
                                    <TouchableOpacity onPress={() => setShowConfirm(p => !p)} style={styles.inputIcon}>
                                        <MaterialIcons
                                            name={showConfirm ? 'visibility-off' : 'visibility'}
                                            size={20}
                                            color="#9CA3AF"
                                        />
                                    </TouchableOpacity>
                                </View>
                                {!passwordsMatch && confirmPassword.length > 0 && (
                                    <Text style={styles.errorText}>Passwords don't match</Text>
                                )}
                            </View>
                        </Animated.View>

                        {/* Info note */}
                        <Animated.View entering={FadeInDown.delay(500).duration(500)} style={styles.infoBox}>
                            <MaterialIcons name="lock" size={16} color="#A31645" />
                            <Text style={styles.infoText}>
                                Your data is safe. You can always log in later with these credentials.
                            </Text>
                        </Animated.View>
                    </ScrollView>

                    {/* Bottom CTA */}
                    <Animated.View entering={FadeInUp.delay(600).duration(500)} style={styles.bottom}>
                        {isLoading ? (
                            <View style={styles.loadingBtn}>
                                <ActivityIndicator color="#FFF" />
                            </View>
                        ) : (
                            <PremiumButton
                                title="Save & Continue"
                                onPress={handleContinue}
                                disabled={!canContinue}
                            />
                        )}
                    </Animated.View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#F8F6F7',
    },
    flex: { flex: 1 },
    circleTR: {
        position: 'absolute',
        width: 256,
        height: 256,
        borderRadius: 128,
        backgroundColor: 'rgba(196,23,92,0.05)',
        top: -80,
        right: -32,
    },
    circleBL: {
        position: 'absolute',
        width: 320,
        height: 320,
        borderRadius: 160,
        backgroundColor: 'rgba(196,23,92,0.05)',
        bottom: -100,
        left: -80,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
        minHeight: 56,
        position: 'relative',
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        left: 16,
        zIndex: 10,
    },
    dotsWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: 16,
    },
    titleBlock: {
        marginBottom: 32,
    },
    title: {
        fontFamily: 'PlusJakartaSans_800ExtraBold',
        fontSize: 30,
        lineHeight: 36,
        letterSpacing: -0.75,
        color: '#111827',
        textAlign: 'center',
        marginBottom: 12,
    },
    subtitle: {
        fontFamily: 'PlusJakartaSans_500Medium',
        fontSize: 16,
        lineHeight: 24,
        color: '#6B7280',
        textAlign: 'center',
    },
    form: {
        gap: 20,
        marginBottom: 20,
    },
    field: {
        marginBottom: 4,
    },
    label: {
        fontFamily: 'PlusJakartaSans_600SemiBold',
        fontSize: 12,
        color: '#6B7280',
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        marginBottom: 8,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        borderWidth: 2,
        borderColor: 'rgba(224, 92, 143, 0.15)',
        paddingHorizontal: 16,
    },
    inputValid: {
        borderColor: 'rgba(16, 185, 129, 0.4)',
    },
    inputError: {
        borderColor: 'rgba(239, 68, 68, 0.5)',
    },
    input: {
        fontFamily: 'PlusJakartaSans_600SemiBold',
        fontSize: 17,
        color: '#111827',
        paddingVertical: 16,
        flex: 1,
    },
    inputIcon: {
        paddingLeft: 8,
    },
    strengthContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginTop: 8,
    },
    strengthBarBg: {
        flex: 1,
        height: 4,
        backgroundColor: '#E5E7EB',
        borderRadius: 2,
        overflow: 'hidden',
    },
    strengthBarFill: {
        height: '100%',
        borderRadius: 2,
    },
    strengthLabel: {
        fontFamily: 'PlusJakartaSans_600SemiBold',
        fontSize: 12,
        minWidth: 50,
        textAlign: 'right',
    },
    errorText: {
        fontFamily: 'PlusJakartaSans_500Medium',
        fontSize: 12,
        color: '#EF4444',
        marginTop: 6,
    },
    infoBox: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: 'rgba(163,22,69,0.06)',
        borderRadius: 12,
        padding: 12,
        gap: 8,
        marginTop: 8,
    },
    infoText: {
        fontFamily: 'PlusJakartaSans_500Medium',
        fontSize: 13,
        color: '#6B7280',
        flex: 1,
        lineHeight: 18,
    },
    bottom: {
        paddingHorizontal: 24,
        paddingVertical: 24,
    },
    loadingBtn: {
        backgroundColor: '#111827',
        borderRadius: 999,
        paddingVertical: 18,
        alignItems: 'center',
    },
});
