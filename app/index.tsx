import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useOnboardingStore } from '../store/onboardingStore';
import { supabase } from '../lib/supabase';

export default function Index() {
    const { hasCompletedOnboarding } = useOnboardingStore();
    const [isReady, setIsReady] = useState(false);
    const [hasSession, setHasSession] = useState<boolean | null>(null);

    // Hydration handling for persisted store & auth session
    useEffect(() => {
        let isMounted = true;

        async function initialize() {
            // 1. Wait for Zustand hydration
            if (!useOnboardingStore.persist.hasHydrated()) {
                await new Promise<void>((resolve) => {
                    const unsub = useOnboardingStore.persist.onFinishHydration(() => {
                        unsub();
                        resolve();
                    });
                });
            }

            // 2. Wait for Supabase Auth checking
            const { data } = await supabase.auth.getSession();
            
            if (isMounted) {
                setHasSession(!!data.session);
                setIsReady(true);
            }
        }

        initialize();

        return () => {
            isMounted = false;
        };
    }, []);

    if (!isReady || hasSession === null) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#A31645" />
            </View>
        );
    }

    // Always prefer existing session route
    if (hasSession) {
        return <Redirect href="/(tabs)" />;
    }

    if (!hasCompletedOnboarding) {
        return <Redirect href="/onboarding" />;
    }

    // Default route if onboarding is complete but no active session exists
    return <Redirect href="/(auth)/login" />;
}
