import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withSpring,
    withTiming,
} from 'react-native-reanimated';

interface QuizOptionProps {
    text: string;
    index: number;
    isSelected: boolean;
    isCorrect?: boolean;
    showResult: boolean;
    isOptional?: boolean;
    onPress: () => void;
    disabled?: boolean;
}

export default function QuizOption({
    text,
    index,
    isSelected,
    isCorrect,
    showResult,
    isOptional,
    onPress,
    disabled,
}: QuizOptionProps) {
    const scale = useSharedValue(1);

    const animStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePress = () => {
        if (disabled) return;
        scale.value = withSequence(
            withTiming(0.95, { duration: 80 }),
            withSpring(1, { damping: 10, stiffness: 300 })
        );
        onPress();
    };

    const getBackgroundColor = () => {
        if (!showResult) {
            return isSelected ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.65)';
        }
        if (isOptional && isSelected) return '#F3E8FF';
        if (isCorrect && isSelected) return '#DCFCE7';
        if (!isCorrect && isSelected) return '#FEE2E2';
        if (isCorrect) return '#DCFCE7';
        return 'rgba(255,255,255,0.65)';
    };

    const getBorderColor = () => {
        if (!showResult) {
            return isSelected ? '#A31645' : 'rgba(255,255,255,0.8)';
        }
        if (isOptional && isSelected) return '#A855F7';
        if (isCorrect) return '#16A34A';
        if (!isCorrect && isSelected) return '#EF4444';
        return 'rgba(255,255,255,0.8)';
    };

    const getIcon = ():
        | { name: keyof typeof MaterialIcons.glyphMap; color: string }
        | null => {
        if (!showResult) return null;
        if (isOptional && isSelected) return { name: 'check-circle', color: '#A855F7' };
        if (isCorrect && isSelected)
            return { name: 'check-circle', color: '#16A34A' };
        if (!isCorrect && isSelected) return { name: 'cancel', color: '#EF4444' };
        if (isCorrect) return { name: 'check-circle', color: '#16A34A' };
        return null;
    };

    const labels = ['A', 'B', 'C', 'D'];
    const icon = getIcon();

    return (
        <Animated.View style={animStyle}>
            <TouchableOpacity
                activeOpacity={0.85}
                onPress={handlePress}
                disabled={disabled}
                style={[
                    styles.option,
                    {
                        backgroundColor: getBackgroundColor(),
                        borderColor: getBorderColor(),
                        borderWidth: (!showResult && !isSelected) ? 1 : 2,
                        boxShadow: '0px 1px 4px 1px rgba(0,0,0,0.15),inset 0px 4px 4px 0px rgba(255,255,255,0.50),inset 0px -4px 4px 0px rgba(0,0,0,0.06)',
                        shadowColor: isSelected && !showResult ? '#A31645' : '#000',
                    },
                ]}
            >
                {/* Letter label */}
                <View
                    style={[
                        styles.letterCircle,
                        {
                            backgroundColor: isSelected && !showResult
                                ? '#A31645'
                                : showResult && isOptional && isSelected
                                    ? '#A855F7'
                                : showResult && isCorrect
                                    ? '#16A34A'
                                    : showResult && isSelected && !isCorrect
                                        ? '#EF4444'
                                        : '#F3F4F6',
                        },
                    ]}
                >
                    <Text
                        style={[
                            styles.letterText,
                            {
                                color:
                                    isSelected || (showResult && (isCorrect || isSelected))
                                        ? '#FFF'
                                        : '#6B7280',
                            },
                        ]}
                    >
                        {labels[index]}
                    </Text>
                </View>

                {/* Option text */}
                <Text style={styles.optionText} numberOfLines={2}>
                    {text}
                </Text>

                {/* Result icon */}
                {icon && (
                    <MaterialIcons name={icon.name} size={24} color={icon.color} />
                )}
            </TouchableOpacity>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
        padding: 20,
        borderRadius: 32,
        marginBottom: 12,
    },
    letterCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    letterText: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 15,
    },
    optionText: {
        flex: 1,
        fontFamily: 'PlusJakartaSans_600SemiBold',
        fontSize: 15,
        color: '#111827',
        lineHeight: 22,
    },
});
