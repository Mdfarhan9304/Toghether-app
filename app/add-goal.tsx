import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

type Category = 'Travel' | 'Finance' | 'Health';

const CATEGORIES: { label: Category; icon: keyof typeof MaterialIcons.glyphMap; color: string }[] = [
    { label: 'Travel', icon: 'flight-takeoff', color: '#A31645' },
    { label: 'Finance', icon: 'diamond', color: '#C4175C' },
    { label: 'Health', icon: 'favorite', color: '#E11D48' },
];

export default function AddGoalScreen() {
    const router = useRouter();
    const [selectedCategory, setSelectedCategory] = useState<Category>('Travel');
    const [goalName, setGoalName] = useState('Trip to Paris');
    const [targetDate, setTargetDate] = useState('October 24, 2024');
    const [targetAmount, setTargetAmount] = useState('3,500');
    const [reason, setReason] = useState('');

    // CTA button animation
    const buttonScale = useSharedValue(1);
    const animatedButtonStyle = useAnimatedStyle(() => ({
        transform: [{ scale: buttonScale.value }],
    }));

    const handlePressIn = () => {
        buttonScale.value = withSpring(0.96, { damping: 10, stiffness: 300 });
    };

    const handlePressOut = () => {
        buttonScale.value = withSpring(1, { damping: 10, stiffness: 300 });
        handleCreate();
    };

    const handleCreate = () => {
        // TODO: save goal
        console.log('Creating goal:', { selectedCategory, goalName, targetDate, targetAmount, reason });
        router.back();
    };

    const handleCancel = () => {
        router.back();
    };

    return (
        <View className="flex-1" style={{ backgroundColor: '#F9FAFB' }}>
            <StatusBar style="dark" />

            <SafeAreaView edges={['top']} style={{ flex: 1 }}>
                {/* ─── Header ─── */}
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingHorizontal: 20,
                        paddingVertical: 14,
                    }}
                >
                    <TouchableOpacity
                        onPress={handleCancel}
                        style={{ position: 'absolute', left: 20 }}
                    >
                        <Text
                            className="font-[PlusJakartaSans_500Medium]"
                            style={{ fontSize: 16, color: '#E11D48' }}
                        >
                            Cancel
                        </Text>
                    </TouchableOpacity>
                    <Text
                        className="font-[PlusJakartaSans_700Bold]"
                        style={{ fontSize: 18, color: '#09090B' }}
                    >
                        New Shared Goal
                    </Text>
                </View>

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                >
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
                    >
                        {/* ─── Together Banner ─── */}
                        <View
                            style={{
                                backgroundColor: '#FFF0F3',
                                borderRadius: 20,
                                paddingVertical: 28,
                                alignItems: 'center',
                                marginTop: 8,
                                marginBottom: 24,
                            }}
                        >
                            <View
                                style={{
                                    width: 52,
                                    height: 52,
                                    borderRadius: 26,
                                    backgroundColor: '#FCE4EC',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: 10,
                                }}
                            >
                                <MaterialIcons name="favorite" size={28} color="#E11D48" />
                            </View>
                            <Text
                                className="font-[PlusJakartaSans_700Bold]"
                                style={{
                                    fontSize: 12,
                                    letterSpacing: 1.6,
                                    color: '#E11D48',
                                }}
                            >
                                TOGETHER
                            </Text>
                        </View>

                        {/* ─── Category ─── */}
                        <View style={{ marginBottom: 24 }}>
                            <Text
                                className="font-[PlusJakartaSans_700Bold]"
                                style={{
                                    fontSize: 12,
                                    letterSpacing: 1.4,
                                    color: '#71717A',
                                    marginBottom: 12,
                                }}
                            >
                                CATEGORY
                            </Text>
                            <View style={{ flexDirection: 'row', gap: 10 }}>
                                {CATEGORIES.map((cat) => {
                                    const isSelected = selectedCategory === cat.label;
                                    return (
                                        <TouchableOpacity
                                            key={cat.label}
                                            onPress={() => setSelectedCategory(cat.label)}
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                paddingHorizontal: 16,
                                                paddingVertical: 10,
                                                borderRadius: 20,
                                                backgroundColor: isSelected ? '#A31645' : '#FFFFFF',
                                                borderWidth: isSelected ? 0 : 1,
                                                borderColor: '#E4E4E7',
                                                gap: 6,
                                            }}
                                        >
                                            <MaterialIcons
                                                name={cat.icon}
                                                size={16}
                                                color={isSelected ? '#FFFFFF' : cat.color}
                                            />
                                            <Text
                                                className="font-[PlusJakartaSans_500Medium]"
                                                style={{
                                                    fontSize: 14,
                                                    color: isSelected ? '#FFFFFF' : '#09090B',
                                                }}
                                            >
                                                {cat.label}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>

                        {/* ─── Goal Name ─── */}
                        <View style={{ marginBottom: 24 }}>
                            <TextInput
                                value={goalName}
                                onChangeText={setGoalName}
                                placeholder="Enter goal name"
                                placeholderTextColor="#D4D4D8"
                                style={{
                                    fontSize: 26,
                                    fontFamily: 'PlusJakartaSans_700Bold',
                                    color: '#09090B',
                                    borderBottomWidth: 1.5,
                                    borderBottomColor: '#E4E4E7',
                                    paddingBottom: 12,
                                }}
                            />
                        </View>

                        {/* ─── Target Date ─── */}
                        <TouchableOpacity
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                backgroundColor: '#FFFFFF',
                                borderRadius: 18,
                                padding: 18,
                                marginBottom: 12,
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 1 },
                                shadowOpacity: 0.03,
                                shadowRadius: 8,
                                elevation: 1,
                            }}
                        >
                            <View
                                style={{
                                    width: 44,
                                    height: 44,
                                    borderRadius: 22,
                                    backgroundColor: '#FFF0F3',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginRight: 14,
                                }}
                            >
                                <MaterialIcons name="calendar-today" size={20} color="#E11D48" />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text
                                    className="font-[PlusJakartaSans_700Bold]"
                                    style={{
                                        fontSize: 11,
                                        letterSpacing: 1.2,
                                        color: '#E11D48',
                                        marginBottom: 2,
                                    }}
                                >
                                    TARGET DATE
                                </Text>
                                <Text
                                    className="font-[PlusJakartaSans_500Medium]"
                                    style={{ fontSize: 16, color: '#09090B' }}
                                >
                                    {targetDate}
                                </Text>
                            </View>
                            <MaterialIcons name="chevron-right" size={24} color="#D4D4D8" />
                        </TouchableOpacity>

                        {/* ─── Target Amount ─── */}
                        <TouchableOpacity
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                backgroundColor: '#FFFFFF',
                                borderRadius: 18,
                                padding: 18,
                                marginBottom: 28,
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 1 },
                                shadowOpacity: 0.03,
                                shadowRadius: 8,
                                elevation: 1,
                            }}
                        >
                            <View
                                style={{
                                    width: 44,
                                    height: 44,
                                    borderRadius: 22,
                                    backgroundColor: '#ECFDF5',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginRight: 14,
                                }}
                            >
                                <MaterialIcons name="attach-money" size={22} color="#16A34A" />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text
                                    className="font-[PlusJakartaSans_700Bold]"
                                    style={{
                                        fontSize: 11,
                                        letterSpacing: 1.2,
                                        color: '#E11D48',
                                        marginBottom: 2,
                                    }}
                                >
                                    TARGET AMOUNT
                                </Text>
                                <Text
                                    className="font-[PlusJakartaSans_500Medium]"
                                    style={{ fontSize: 16, color: '#09090B' }}
                                >
                                    ${targetAmount}
                                </Text>
                            </View>
                            <MaterialIcons name="edit" size={20} color="#A1A1AA" />
                        </TouchableOpacity>

                        {/* ─── Why It Matters ─── */}
                        <View style={{ marginBottom: 16 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 14 }}>
                                <MaterialIcons name="favorite" size={16} color="#E11D48" />
                                <Text
                                    className="font-[PlusJakartaSans_700Bold]"
                                    style={{
                                        fontSize: 12,
                                        letterSpacing: 1.2,
                                        color: '#71717A',
                                    }}
                                >
                                    WHY DOES THIS MATTER TO US?
                                </Text>
                            </View>
                            <TextInput
                                value={reason}
                                onChangeText={setReason}
                                placeholder="This goal brings us closer because..."
                                placeholderTextColor="#D4D4D8"
                                multiline
                                numberOfLines={4}
                                textAlignVertical="top"
                                style={{
                                    backgroundColor: '#FFFFFF',
                                    borderRadius: 18,
                                    padding: 18,
                                    fontSize: 15,
                                    fontFamily: 'PlusJakartaSans_400Regular',
                                    color: '#09090B',
                                    minHeight: 120,
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 1 },
                                    shadowOpacity: 0.03,
                                    shadowRadius: 8,
                                    elevation: 1,
                                    lineHeight: 22,
                                }}
                            />
                        </View>

                        {/* ─── Helper Text ─── */}
                        <View className="items-center" style={{ marginBottom: 24 }}>
                            <Text
                                className="font-[PlusJakartaSans_400Regular] text-center"
                                style={{ fontSize: 13, color: '#A1A1AA', lineHeight: 18 }}
                            >
                                Keep each other motivated on your way to the goal.
                            </Text>
                        </View>

                        {/* ─── Create Button ─── */}
                        <Animated.View style={animatedButtonStyle}>
                            <TouchableOpacity
                                activeOpacity={1}
                                onPressIn={handlePressIn}
                                onPressOut={handlePressOut}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: '#A31645',
                                    paddingVertical: 18,
                                    paddingHorizontal: 32,
                                    borderRadius: 30,
                                    gap: 10,
                                    shadowColor: '#A31645',
                                    shadowOffset: { width: 0, height: 6 },
                                    shadowOpacity: 0.3,
                                    shadowRadius: 12,
                                    elevation: 6,
                                }}
                            >
                                <Text
                                    className="font-[PlusJakartaSans_700Bold]"
                                    style={{ fontSize: 18, color: '#FFFFFF' }}
                                >
                                    Create Goal Together
                                </Text>
                                <MaterialIcons name="arrow-forward" size={20} color="#FFFFFF" />
                            </TouchableOpacity>
                        </Animated.View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}
