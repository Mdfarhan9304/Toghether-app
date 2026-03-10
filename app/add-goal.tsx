import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import { withBottomSheet, WithBottomSheetProps } from '../components/hocs/withBottomSheet';

type Category = 'Travel' | 'Finance' | 'Health';

const CATEGORIES: { label: Category; icon: keyof typeof MaterialIcons.glyphMap; color: string }[] = [
    { label: 'Travel', icon: 'flight-takeoff', color: '#A31645' },
    { label: 'Finance', icon: 'diamond', color: '#C4175C' },
    { label: 'Health', icon: 'favorite', color: '#E11D48' },
];

export default withBottomSheet(
    function AddGoalScreen({ onClose }: WithBottomSheetProps) {
        const router = useRouter();
        const [selectedCategory, setSelectedCategory] = useState<Category>('Travel');
        const [goalName, setGoalName] = useState('Trip to Paris');
        const [targetDate, setTargetDate] = useState('October 24, 2024');
        const [targetAmount, setTargetAmount] = useState('3,500');
        const [reason, setReason] = useState('');
        const [goalType, setGoalType] = useState<'Shared' | 'Individual'>('Shared');

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
            console.log('Creating goal:', { goalType, selectedCategory, goalName, targetDate, targetAmount, reason });
            router.back();
        };

        const handleCancel = () => {
            onClose();
        };

        return (
            <View className="flex-1" style={{ backgroundColor: '#F9FAFB' }}>
                <StatusBar style="dark" />

                <View style={{ flex: 1 }}>
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
                            New Goal
                        </Text>
                    </View>

                    <View style={{ flex: 1 }}>
                        <KeyboardAwareScrollView
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="handled"
                            enableOnAndroid={true}
                            extraHeight={100}
                            extraScrollHeight={100}
                            contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
                        >
                            {/* ─── Goal Type Selection ─── */}
                            <View style={{ marginBottom: 24, marginTop: 8, flexDirection: 'row', backgroundColor: '#F4F4F5', borderRadius: 24, padding: 4 }}>
                                <TouchableOpacity
                                    onPress={() => setGoalType('Shared')}
                                    style={{ flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 20, backgroundColor: goalType === 'Shared' ? '#FFFFFF' : 'transparent', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: goalType === 'Shared' ? 0.05 : 0, shadowRadius: 4, elevation: goalType === 'Shared' ? 2 : 0 }}
                                >
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                        <MaterialIcons name="people" size={16} color={goalType === 'Shared' ? '#A31645' : '#A1A1AA'} />
                                        <Text style={{ fontFamily: goalType === 'Shared' ? 'PlusJakartaSans_700Bold' : 'PlusJakartaSans_500Medium', color: goalType === 'Shared' ? '#09090B' : '#71717A', fontSize: 14 }}>Shared</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => setGoalType('Individual')}
                                    style={{ flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 20, backgroundColor: goalType === 'Individual' ? '#FFFFFF' : 'transparent', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: goalType === 'Individual' ? 0.05 : 0, shadowRadius: 4, elevation: goalType === 'Individual' ? 2 : 0 }}
                                >
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                        <MaterialIcons name="person" size={16} color={goalType === 'Individual' ? '#A31645' : '#A1A1AA'} />
                                        <Text style={{ fontFamily: goalType === 'Individual' ? 'PlusJakartaSans_700Bold' : 'PlusJakartaSans_500Medium', color: goalType === 'Individual' ? '#09090B' : '#71717A', fontSize: 14 }}>Individual</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>

                            {/* ─── Together Banner ─── */}
                            {goalType === 'Shared' && (
                                <View
                                    style={{
                                        backgroundColor: '#FFF0F3',
                                        borderRadius: 20,
                                        paddingVertical: 20,
                                        alignItems: 'center',
                                        marginBottom: 24,
                                    }}
                                >
                                    <View
                                        style={{
                                            width: 48,
                                            height: 48,
                                            borderRadius: 24,
                                            backgroundColor: '#FCE4EC',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginBottom: 8,
                                        }}
                                    >
                                        <MaterialIcons name="favorite" size={24} color="#E11D48" />
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
                            )}

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
                                        WHY DOES THIS MATTER TO {goalType === 'Shared' ? 'US' : 'ME'}?
                                    </Text>
                                </View>
                                <TextInput
                                    value={reason}
                                    onChangeText={setReason}
                                    placeholder={goalType === 'Shared' ? "This goal brings us closer because..." : "This goal is important to me because..."}
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
                                        {goalType === 'Shared' ? 'Create Goal Together' : 'Create Goal'}
                                    </Text>
                                    <MaterialIcons name="arrow-forward" size={20} color="#FFFFFF" />
                                </TouchableOpacity>
                            </Animated.View>
                        </KeyboardAwareScrollView>
                    </View>
                </View>
            </View>
        );
    },
    { minHeight: '90%', maxHeight: '95%' }
);
