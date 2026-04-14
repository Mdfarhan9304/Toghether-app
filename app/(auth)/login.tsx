import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PremiumButton from '../../components/PremiumButton';
import { supabase } from '../../lib/supabase';

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Missing Fields", "Please enter both email and password.");
            return;
        }

        setIsLoading(true);

        console.log("=== DEBUG LOGIN ===");
        console.log("Attempting login with Email:", email.trim());
        console.log("Password length:", password.length, "Password exact:", `'${password}'`);

        const { data: authData, error } = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
        });
        console.log("Login Result Data:", JSON.stringify(authData, null, 2));
        console.log("Login Result Error:", error);
        
        setIsLoading(false);

        if (error) {
            Alert.alert("Login Failed", error.message);
        } else {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                const { data } = await supabase.from('profiles').select('partner_id, full_name, invite_code').eq('id', session.user.id).single();
                if (data?.partner_id) {
                    router.replace('/paywall');
                } else if (data?.invite_code || data?.full_name) {
                    // Profile exists but no partner yet -> Go to invite screen
                    router.replace('/invite-partner');
                } else {
                    // No profile -> Start onboarding
                    router.replace('/partner-selection');
                }
            } else {
                router.replace('/partner-selection');
            }
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={styles.backBtn}
                    >
                        <MaterialIcons name="arrow-back" size={24} color="#4B5563" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Log In</Text>
                </View>

                <View style={styles.content}>
                    <Text style={styles.headline}>Welcome Back</Text>
                    <Text style={styles.subheadline}>Sign in to continue growing together.</Text>

                    {/* Email */}
                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            value={email}
                            onChangeText={setEmail}
                            placeholder="you@example.com"
                            autoCapitalize="none"
                            keyboardType="email-address"
                            style={styles.input}
                            placeholderTextColor="#9CA3AF"
                        />
                    </View>

                    {/* Password */}
                    <View style={[styles.fieldGroup, { marginBottom: 32 }]}>
                        <Text style={styles.label}>Password</Text>
                        <TextInput
                            value={password}
                            onChangeText={setPassword}
                            placeholder="••••••••"
                            secureTextEntry
                            style={styles.input}
                            placeholderTextColor="#9CA3AF"
                        />
                    </View>

                    {isLoading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator color="#FFF" />
                        </View>
                    ) : (
                        <PremiumButton
                            title="Log In"
                            onPress={handleLogin}
                        />
                    )}
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F8F6F7',
    },
    flex: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 24,
        paddingTop: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
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
        left: 24,
        zIndex: 10,
    },
    headerTitle: {
        color: '#111827',
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 18,
        textAlign: 'center',
        flex: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        justifyContent: 'center',
    },
    headline: {
        color: '#111827',
        fontFamily: 'PlusJakartaSans_800ExtraBold',
        fontSize: 30,
        marginBottom: 8,
        letterSpacing: -0.5,
    },
    subheadline: {
        color: '#6B7280',
        fontFamily: 'PlusJakartaSans_500Medium',
        fontSize: 16,
        marginBottom: 32,
    },
    fieldGroup: {
        marginBottom: 16,
    },
    label: {
        color: '#6B7280',
        fontSize: 12,
        fontFamily: 'PlusJakartaSans_600SemiBold',
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 0.8,
    },
    input: {
        backgroundColor: '#FFFFFF',
        color: '#111827',
        fontFamily: 'PlusJakartaSans_600SemiBold',
        fontSize: 18,
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: 'rgba(224, 92, 143, 0.1)',
    },
    loadingContainer: {
        backgroundColor: '#111827',
        borderRadius: 999,
        paddingVertical: 18,
        alignItems: 'center',
    },
});
