import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';

interface CategoryCardProps {
    icon: keyof typeof MaterialIcons.glyphMap;
    title: string;
    description: string;
    isSelected: boolean;
    onPress: () => void;
    gradientColors?: readonly [string, string, ...string[]];
}

export default function CategoryCard({
    icon,
    title,
    description,
    isSelected,
    onPress,
    gradientColors = ['#A31645', '#C4175C'],
}: CategoryCardProps) {
    const scale = useSharedValue(1);

    const cardStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePressIn = () => {
        scale.value = withSpring(0.96, { damping: 10, stiffness: 300 });
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
                style={{
                    borderRadius: 24,
                    overflow: 'hidden',
                    borderWidth: isSelected ? 3 : 0,
                    borderColor: '#A31645',
                }}
            >
                <LinearGradient
                    colors={
                        isSelected
                            ? (gradientColors as [string, string, ...string[]])
                            : ['#FFF1F2', '#FECDD3']
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                        padding: 20,
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 16,
                        minHeight: 100,
                    }}
                >
                    <View
                        style={{
                            width: 48,
                            height: 48,
                            borderRadius: 24,
                            backgroundColor: isSelected
                                ? 'rgba(255,255,255,0.25)'
                                : 'rgba(163,22,69,0.1)',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <MaterialIcons
                            name={icon}
                            size={24}
                            color={isSelected ? '#FFFFFF' : '#A31645'}
                        />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text
                            style={{
                                fontSize: 20,
                                fontFamily: 'PlusJakartaSans_700Bold',
                                color: isSelected ? '#FFFFFF' : '#111827',
                                marginBottom: 4,
                            }}
                        >
                            {title}
                        </Text>
                        <Text
                            style={{
                                fontSize: 13,
                                fontFamily: 'PlusJakartaSans_500Medium',
                                color: isSelected
                                    ? 'rgba(255,255,255,0.8)'
                                    : '#6B7280',
                                lineHeight: 18,
                            }}
                        >
                            {description}
                        </Text>
                    </View>
                    {isSelected && (
                        <View
                            style={{
                                width: 28,
                                height: 28,
                                borderRadius: 14,
                                backgroundColor: 'rgba(255,255,255,0.3)',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <MaterialIcons name="check" size={18} color="#FFF" />
                        </View>
                    )}
                </LinearGradient>
            </TouchableOpacity>
        </Animated.View>
    );
}
