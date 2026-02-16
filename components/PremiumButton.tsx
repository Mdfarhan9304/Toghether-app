import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

interface PremiumButtonProps {
    title: string;
    onPress: () => void;
    disabled?: boolean;
    icon?: keyof typeof MaterialIcons.glyphMap;
    variant?: 'primary' | 'secondary';
    containerStyle?: ViewStyle;
}

export default function PremiumButton({
    title,
    onPress,
    disabled = false,
    icon,
    variant = 'primary',
    containerStyle,
}: PremiumButtonProps) {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
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
        <Animated.View style={[animatedStyle, containerStyle]}>
            <TouchableOpacity
                activeOpacity={1}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                disabled={disabled}
                className={`flex-row items-center justify-center rounded-full ${disabled ? 'opacity-50' : ''
                    } ${variant === 'primary' ? 'bg-primary' : 'bg-white'}`}
                style={{
                    paddingVertical: 16,
                    paddingHorizontal: 32,
                    gap: 8,
                    boxShadow: variant === 'primary'
                        // Primary darker shadow
                        ? '0px 2px 4px 0px rgba(0,0,0,0.15),inset 0px 4px 4px 0px rgba(255,255,255,0.50),inset 0px -4px 4px 0px rgba(0,0,0,0.15)'
                        // White button shadow (from onboarding)
                        : '0px 4px 12px 0px rgba(0,0,0,0.30),inset 0px 4px 4px 0px rgba(255,255,255,0.80),inset 0px -4px 4px 0px rgba(0,0,0,0.30)',
                    position: 'relative',
                }}
            >
                {/* Icon Left (optional) */}
                {icon && variant === 'primary' && (
                    <MaterialIcons name={icon} size={24} color="#FFF" style={{ marginRight: -4 }} />
                )}
                {icon && variant === 'secondary' && (
                    <MaterialIcons name={icon} size={24} color="#C4175C" />
                )}

                <Text
                    className={`font-[PlusJakartaSans_700Bold] ${variant === 'primary' ? 'text-white' : 'text-secondary'
                        }`}
                    style={{ fontSize: 18, lineHeight: 28 }}
                >
                    {title}
                </Text>

                {/* Icon Right (arrow for primary usually) */}
                {variant === 'primary' && !icon && (
                    <MaterialIcons name="arrow-forward" size={18} color="#FFF" />
                )}
            </TouchableOpacity>
        </Animated.View>
    );
}
