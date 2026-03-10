import { Gyroscope } from 'expo-sensors';
import { useEffect } from 'react';
import { Dimensions } from 'react-native';
import { useSharedValue, withSpring } from 'react-native-reanimated';

/**
 * Hook that listens to the device gyroscope and provides
 * animated shared values for X and Y tilt.
 */
export function useGyroscopeNav(enabled = true) {
    const tiltX = useSharedValue(0);
    const tiltY = useSharedValue(0);

    useEffect(() => {
        if (!enabled) return;

        let subscription: ReturnType<typeof Gyroscope.addListener> | null = null;

        (async () => {
            const isAvailable = await Gyroscope.isAvailableAsync();
            if (!isAvailable) return;

            // ~60 Hz
            Gyroscope.setUpdateInterval(16);
            subscription = Gyroscope.addListener((data) => {
                // Adjust sensitivity by multiplying data
                tiltX.value = withSpring(data.y * (Dimensions.get('window').width - 100), { damping: 20, stiffness: 90 });
                tiltY.value = withSpring(data.x * (Dimensions.get('window').height - 100), { damping: 20, stiffness: 90 });
            });
        })();

        return () => {
            subscription?.remove();
        };
    }, [enabled, tiltX, tiltY]);

    return { tiltX, tiltY };
}
