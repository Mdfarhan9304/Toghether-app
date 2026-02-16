import { MaterialIcons } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

interface SelectionCardProps {
    icon: keyof typeof MaterialIcons.glyphMap;
    title: string;
    description: string;
    isSelected: boolean;
    onPress: () => void;
}

export default function SelectionCard({ icon, title, description, isSelected, onPress }: SelectionCardProps) {
    const scale = useSharedValue(1);

    const cardStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const checkOpacity = useAnimatedStyle(() => ({
        opacity: withSpring(isSelected ? 1 : 0, { damping: 12, stiffness: 200 }),
    }));

    const handlePressIn = () => {
        scale.value = withSpring(0.98, { damping: 10, stiffness: 300 });
    };

    const handlePressOut = () => {
        scale.value = withSpring(1, { damping: 10, stiffness: 300 });
        onPress();
    };

    return (
        <Animated.View style={cardStyle}>
            <TouchableOpacity
                activeOpacity={0.9}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                className={`rounded-[32px] flex-row items-center bg-white/65 ${isSelected ? 'border-2 border-primary bg-white/85' : 'border border-white/80'
                    }`}
                style={{
                    padding: 20,
                    gap: 20,
                    boxShadow: '0px 1px 4px 1px rgba(0,0,0,0.15),inset 0px 4px 4px 0px rgba(255,255,255,0.50),inset 0px -4px 4px 0px rgba(0,0,0,0.06)',
                    position: 'relative',
                    // Backdrop blur effect (approximated)
                    shadowColor: isSelected ? '#C41758' : '#000',
                    // shadowOffset: { width: 0, height: isSelected ? 3 : 0 },
                    // shadowOpacity: isSelected ? 0.2 : 0,
                    // shadowRadius: isSelected ? 30 : 0,

                }}
            >
                {/* Icon Circle */}
                <View className="w-14 h-14 rounded-full bg-primary/10 items-center justify-center">
                    <MaterialIcons name={icon} size={24} color="#C41758" />
                </View>

                {/* Text Content */}
                <View className="flex-1" style={{ gap: 0 }}>
                    <Text className="text-[#111827] font-[PlusJakartaSans_700Bold]" style={{ fontSize: 18, lineHeight: 28 }}>
                        {title}
                    </Text>
                    <Text className="text-[#6B7280] font-[PlusJakartaSans_400Regular]" style={{ fontSize: 14, lineHeight: 20 }}>
                        {description}
                    </Text>
                </View>

                {/* Checkbox */}
                <View
                    className={`w-6 h-6 rounded-full items-center justify-center ${isSelected ? '' : 'border-2 border-[#D1D5DB]'
                        }`}
                >
                    <Animated.View style={checkOpacity}>
                        <MaterialIcons name="check" size={14} color="#FFF" />
                    </Animated.View>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
}
