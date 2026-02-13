import { View } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';

interface ProgressDotsProps {
    steps: number;
    currentStep: number;
}

export default function ProgressDots({ steps, currentStep }: ProgressDotsProps) {
    return (
        <View className="flex-row" style={{ gap: 8 }}>
            {Array.from({ length: steps }).map((_, index) => (
                <ProgressDot key={index} isActive={index === currentStep} />
            ))}
        </View>
    );
}

function ProgressDot({ isActive }: { isActive: boolean }) {
    const animatedStyle = useAnimatedStyle(() => ({
        backgroundColor: withSpring(
            isActive ? '#C41758' : '#E5E7EB',
            { damping: 15, stiffness: 150 }
        ),
    }));

    return (
        <Animated.View
            className="rounded-full"
            style={[
                { width: 32, height: 6 },
                animatedStyle
            ]}
        />
    );
}
