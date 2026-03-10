import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Dimensions, Platform, Pressable, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    FadeIn,
    FadeOut,
    runOnJS,
    SlideInDown,
    SlideOutDown,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming
} from 'react-native-reanimated';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// Define the type for the component props that will be passed through the HOC
export interface WithBottomSheetProps {
    onClose: () => void;
}

export interface BottomSheetConfig {
    minHeight?: string | number;
    maxHeight?: string | number;
}

export function withBottomSheet<P extends object>(
    WrappedComponent: React.ComponentType<P & WithBottomSheetProps>,
    config?: BottomSheetConfig
) {
    return function BottomSheetComponent(props: P) {
        const router = useRouter();
        const translateY = useSharedValue(SCREEN_HEIGHT);
        const isDismissing = useSharedValue(false);

        // Reset translate value when component mounts
        useEffect(() => {
            translateY.value = withSpring(0, {
                damping: 50,
                stiffness: 300,
            });
        }, [translateY]);

        const closeBottomSheet = () => {
            if (isDismissing.value) return;
            isDismissing.value = true;

            // Slide down animation
            translateY.value = withTiming(SCREEN_HEIGHT, { duration: 300 }, (finished) => {
                if (finished) {
                    runOnJS(router.back)();
                }
            });
        };

        const panGesture = Gesture.Pan()
            .onUpdate((event) => {
                if (event.translationY > 0) {
                    translateY.value = event.translationY;
                }
            })
            .onEnd((event) => {
                if (event.translationY > 100 || event.velocityY > 500) {
                    // Velocity or distance is enough to close
                    runOnJS(closeBottomSheet)();
                } else {
                    // Snap back to top
                    translateY.value = withSpring(0, {
                        damping: 50,
                        stiffness: 300,
                    });
                }
            });

        const animatedStyle = useAnimatedStyle(() => {
            return {
                transform: [{ translateY: translateY.value }],
            };
        });

        return (
            <View style={styles.container}>
                {/* Backdrop */}
                <Animated.View
                    entering={FadeIn.duration(300)}
                    exiting={FadeOut.duration(300)}
                    style={StyleSheet.absoluteFill}
                >
                    <Pressable
                        style={[styles.backdrop, StyleSheet.absoluteFillObject]}
                        onPress={closeBottomSheet}
                    >
                        <View style={styles.backdrop} />
                    </Pressable>
                </Animated.View>

                {/* Bottom Sheet */}
                <GestureDetector gesture={panGesture}>
                    <Animated.View
                        entering={SlideInDown.springify().damping(50).stiffness(300)}
                        exiting={SlideOutDown.duration(300)}
                        style={[
                            styles.sheetContainer,
                            animatedStyle,
                            {
                                minHeight: (config?.minHeight ?? '50%') as import('react-native').DimensionValue,
                                maxHeight: (config?.maxHeight ?? '90%') as import('react-native').DimensionValue
                            }
                        ]}
                    >
                        {/* Drag Handle */}
                        <View style={styles.dragHandleContainer}>
                            <View style={styles.dragHandle} />
                        </View>

                        <WrappedComponent {...props} onClose={closeBottomSheet} />
                    </Animated.View>
                </GestureDetector>
            </View>
        );
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    sheetContainer: {
        backgroundColor: '#F9FAFB',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingTop: 16,
        overflow: 'hidden',
        // Shadow for iOS
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        // Elevation for Android
        elevation: 10,
    },
    dragHandleContainer: {
        width: '100%',
        alignItems: 'center',
        paddingBottom: 16,
    },
    dragHandle: {
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#D4D4D8',
    },
});
