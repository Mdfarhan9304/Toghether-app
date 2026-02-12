import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useOnboardingStore } from '../store/onboardingStore';

export default function Index() {
    const { hasCompletedOnboarding } = useOnboardingStore();
    const [isReady, setIsReady] = useState(false);

    // Hydration handling for persisted store
    useEffect(() => {
        // Zustand persist is synchronous for AsyncStorage after hydration? 
        // Usually need to wait for hydration. 
        // For simplicity, we assume hydration is fast, or use useOnboardingStore.persist.onFinishHydration
        // But basic check:
        setIsReady(true);
    }, []);

    if (!isReady) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (!hasCompletedOnboarding) {
        return <Redirect href="/onboarding" />;
    }

    return <Redirect href="/(tabs)" />;
}
