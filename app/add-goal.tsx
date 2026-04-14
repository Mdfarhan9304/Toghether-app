import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    Modal,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import { TrackingTypePicker } from '../components/goals/TrackingTypePicker';
import { withBottomSheet, WithBottomSheetProps } from '../components/hocs/withBottomSheet';
import { VoiceRecorder, type ExtractedGoal } from '../components/ai/VoiceRecorder';
import { supabase } from '../lib/supabase';
import { useGoalStore, type Category, type TrackingType } from '../store/goalStore';

const CATEGORIES: { label: Category; icon: keyof typeof MaterialIcons.glyphMap; color: string }[] = [
    { label: 'Finance', icon: 'diamond', color: '#16A34A' },
    { label: 'Travel', icon: 'flight-takeoff', color: '#3B82F6' },
    { label: 'Health', icon: 'favorite', color: '#E11D48' },
    { label: 'Fitness', icon: 'fitness-center', color: '#F59E0B' },
    { label: 'Home', icon: 'home', color: '#8B5CF6' },
    { label: 'Knowledge', icon: 'menu-book', color: '#06B6D4' },
    { label: 'Milestone', icon: 'emoji-events', color: '#EC4899' },
];

const CURRENCIES = [
    { symbol: '$', code: 'USD', name: 'US Dollar' },
    { symbol: '€', code: 'EUR', name: 'Euro' },
    { symbol: '£', code: 'GBP', name: 'British Pound' },
    { symbol: '₹', code: 'INR', name: 'Indian Rupee' },
    { symbol: '¥', code: 'JPY', name: 'Japanese Yen' },
];

function AddGoalScreen({ onClose }: WithBottomSheetProps) {
    const router = useRouter();
    const createGoal = useGoalStore(s => s.createGoal);
    const updateGoal = useGoalStore(s => s.updateGoal);

    const [selectedCategory, setSelectedCategory] = useState<Category>('Finance');
    const [goalName, setGoalName] = useState('');
    const [trackingType, setTrackingType] = useState<TrackingType>('boolean');

    const [date, setDate] = useState(() => {
        const d = new Date();
        d.setMonth(d.getMonth() + 1);
        return d;
    });
    const [showDatePicker, setShowDatePicker] = useState(false);

    const [targetValue, setTargetValue] = useState('');
    const [unit, setUnit] = useState('');
    const [currency, setCurrency] = useState(CURRENCIES[0]);
    const [showCurrencySelector, setShowCurrencySelector] = useState(false);

    const [reason, setReason] = useState('');
    const [goalType, setGoalType] = useState<'Shared' | 'Individual'>('Shared');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imageUri, setImageUri] = useState<string | null>(null);

    const params = useLocalSearchParams();
    const [isEditMode, setIsEditMode] = useState(false);
    const [goalId, setGoalId] = useState<string | null>(null);

    const [showAIBanner, setShowAIBanner] = useState(false);
    const [aiTranscript, setAiTranscript] = useState('');

    const handleGoalExtracted = (goal: ExtractedGoal) => {
        // Pre-fill all form fields from AI response
        if (goal.name) setGoalName(goal.name);
        if (goal.category && ['Finance','Travel','Health','Fitness','Home','Knowledge','Milestone'].includes(goal.category)) {
            setSelectedCategory(goal.category as Category);
        }
        if (goal.goal_type === 'Shared' || goal.goal_type === 'Individual') setGoalType(goal.goal_type);
        if (goal.tracking_type) setTrackingType(goal.tracking_type as TrackingType);
        if (goal.target_value !== null && goal.target_value !== undefined) setTargetValue(String(goal.target_value));
        if (goal.unit) setUnit(goal.unit);
        if (goal.reason) setReason(goal.reason);
        if (goal.target_date) {
            const d = new Date(goal.target_date);
            if (!isNaN(d.getTime())) setDate(d);
        }
        if (goal.currency) {
            const matched = CURRENCIES.find(c => c.code === goal.currency);
            if (matched) setCurrency(matched);
        }
        if (goal.transcript) setAiTranscript(goal.transcript);
        setShowAIBanner(true);
    };

    const handleVoiceError = (message: string) => {
        Alert.alert('Voice Goal', message);
    };

    useEffect(() => {
        if (params.goalStr && typeof params.goalStr === 'string') {
            try {
                const goal = JSON.parse(params.goalStr);
                setIsEditMode(true);
                setGoalId(goal.id);
                if (goal.name) setGoalName(goal.name);
                if (goal.category) setSelectedCategory(goal.category as Category);
                if (goal.goal_type) setGoalType(goal.goal_type);
                if (goal.tracking_type) setTrackingType(goal.tracking_type);
                if (goal.reason) setReason(goal.reason);
                if (goal.target_date) setDate(new Date(goal.target_date));
                if (goal.target_value) setTargetValue(String(goal.target_value));
                if (goal.target_amount) setTargetValue(String(goal.target_amount));
                if (goal.unit) setUnit(goal.unit);
                if (goal.currency) {
                    const matched = CURRENCIES.find(c => c.code === goal.currency);
                    if (matched) setCurrency(matched);
                }
                if (goal.image_url) setImageUri(goal.image_url);
            } catch (e) {
                console.error("Failed to parse goalStr", e);
            }
        }
    }, [params.goalStr]);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.5,
        });

        if (!result.canceled && result.assets[0]) {
            setImageUri(result.assets[0].uri);
        }
    };

    const formattedDate = date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });

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

    const handleCreate = async () => {
        if (!goalName.trim()) {
            Alert.alert('Validation Error', 'Please enter a goal name.');
            return;
        }
        if ((trackingType === 'number' || trackingType === 'amount') && !targetValue.trim()) {
            Alert.alert('Validation Error', 'Please enter a target value.');
            return;
        }

        setIsSubmitting(true);

        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !session) {
            Alert.alert('Authentication Error', 'You must be logged in to create a goal.');
            setIsSubmitting(false);
            return;
        }

        // Handle image upload
        let imageUrl = isEditMode ? imageUri : null;
        if (imageUri && !imageUri.startsWith('http')) {
            const fileName = `${session.user.id}-${Date.now()}.jpg`;
            try {
                const formData = new FormData();
                formData.append('file', {
                    uri: imageUri,
                    name: fileName,
                    type: 'image/jpeg',
                } as any);

                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('image')
                    .upload(fileName, formData);

                if (uploadError) {
                    console.error('Image upload failed:', uploadError);
                    Alert.alert('Upload Error', 'Could not save the image.');
                    setIsSubmitting(false);
                    return;
                }

                const { data: publicUrlData } = supabase.storage.from('image').getPublicUrl(fileName);
                imageUrl = publicUrlData.publicUrl;
            } catch (err) {
                console.error('Upload Error:', err);
                Alert.alert('Upload Error', 'Could not process the selected image.');
                setIsSubmitting(false);
                return;
            }
        }

        const parsedTarget = parseFloat(targetValue) || null;

        const goalPayload = {
            goal_type: goalType,
            category: selectedCategory,
            name: goalName.trim(),
            tracking_type: trackingType,
            target_date: date.toISOString().split('T')[0],
            target_value: trackingType === 'progress' ? 100 : parsedTarget,
            target_amount: trackingType === 'amount' ? parsedTarget : null,
            current_amount: 0,
            unit: trackingType === 'number' ? unit.trim() || null : null,
            currency: trackingType === 'amount' ? currency.code : null,
            image_url: imageUrl,
            reason: reason.trim(),
        };

        try {
            if (isEditMode && goalId) {
                await updateGoal(goalId, goalPayload);
            } else {
                await createGoal(goalPayload);
            }
            router.back();
        } catch (e) {
            console.error('Error saving goal:', e);
            Alert.alert('Error', 'Could not save the goal. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        onClose();
    };

    const showTargetInput = trackingType === 'number' || trackingType === 'amount';

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
                        {isEditMode ? 'Edit Goal' : 'New Goal'}
                    </Text>
                </View>

                <View style={{ flex: 1 }}>
                    <KeyboardAwareScrollView
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                        enableOnAndroid={true}
                        extraHeight={100}
                        extraScrollHeight={100}
                        contentContainerStyle={{ paddingBottom: 40 }}
                    >
                        {/* ─── AI Voice Input ─── */}
                        {!isEditMode && (
                            <VoiceRecorder
                                onGoalExtracted={handleGoalExtracted}
                                onError={handleVoiceError}
                            />
                        )}

                        {/* ─── AI Success Banner ─── */}
                        {showAIBanner && aiTranscript ? (
                            <View style={{
                                marginHorizontal: 24, marginBottom: 16,
                                backgroundColor: '#ECFDF5', borderRadius: 16,
                                padding: 14, flexDirection: 'row', gap: 10,
                                borderWidth: 1, borderColor: '#BBF7D0',
                            }}>
                                <Text style={{ fontSize: 18 }}>✨</Text>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontFamily: 'PlusJakartaSans_700Bold', fontSize: 12, color: '#16A34A', marginBottom: 2 }}>
                                        AI HEARD YOU SAY
                                    </Text>
                                    <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 13, color: '#166534', lineHeight: 18 }} numberOfLines={2}>
                                        "{aiTranscript}"
                                    </Text>
                                    <Text style={{ fontFamily: 'PlusJakartaSans_500Medium', fontSize: 11, color: '#22C55E', marginTop: 4 }}>
                                        Form filled ↓ Review and adjust below
                                    </Text>
                                </View>
                                <TouchableOpacity onPress={() => { setShowAIBanner(false); setAiTranscript(''); }}>
                                    <Text style={{ fontSize: 16, color: '#86EFAC' }}>✕</Text>
                                </TouchableOpacity>
                            </View>
                        ) : null}

                        {/* ─── Goal Type Selection ─── */}
                        <View style={{ marginBottom: 24, marginTop: 8, marginHorizontal: 24, flexDirection: 'row', backgroundColor: '#F4F4F5', borderRadius: 24, padding: 4 }}>
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

                        {/* ─── Together Banner & Image Picker ─── */}
                        <View
                            style={{
                                backgroundColor: goalType === 'Shared' ? '#FFF0F3' : 'transparent',
                                borderRadius: 20,
                                paddingVertical: goalType === 'Shared' ? 20 : 0,
                                alignItems: 'center',
                                marginBottom: 24,
                                marginHorizontal: 24,
                            }}
                        >
                            {goalType === 'Shared' && (
                                <>

                                </>
                            )}

                            <TouchableOpacity
                                onPress={pickImage}
                                style={{
                                    width: 120, height: 120, borderRadius: 16,
                                    backgroundColor: goalType === 'Shared' ? '#FFFFFF' : '#F4F4F5',
                                    alignItems: 'center', justifyContent: 'center',
                                    borderWidth: 2,
                                    borderColor: goalType === 'Shared' ? '#FCE4EC' : '#E4E4E7',
                                    borderStyle: 'dashed',
                                    overflow: 'hidden'
                                }}
                            >
                                {imageUri ? (
                                    <Image source={{ uri: imageUri }} style={{ width: '100%', height: '100%', resizeMode: 'cover' }} />
                                ) : (
                                    <>
                                        <MaterialIcons name="add-a-photo" size={24} color={goalType === 'Shared' ? '#E11D48' : '#A1A1AA'} />
                                        <Text style={{ fontSize: 10, color: goalType === 'Shared' ? '#E11D48' : '#A1A1AA', marginTop: 4, fontFamily: 'PlusJakartaSans_500Medium' }}>Photo</Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        </View>

                        {/* ─── Category ─── */}
                        <View style={{ marginBottom: 24 }}>
                            <Text
                                className="font-[PlusJakartaSans_700Bold]"
                                style={{ fontSize: 12, letterSpacing: 1.4, color: '#71717A', marginBottom: 12, paddingHorizontal: 24 }}
                            >
                                CATEGORY
                            </Text>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                keyboardShouldPersistTaps="handled"
                                contentContainerStyle={{ paddingHorizontal: 24 }}
                            >
                                {CATEGORIES.map((cat, index) => {
                                    const isSelected = selectedCategory === cat.label;
                                    return (
                                        <TouchableOpacity
                                            key={cat.label}
                                            onPress={() => setSelectedCategory(cat.label)}
                                            style={{
                                                flexDirection: 'row', alignItems: 'center',
                                                paddingHorizontal: 16, paddingVertical: 10,
                                                borderRadius: 20,
                                                backgroundColor: isSelected ? '#A31645' : '#FFFFFF',
                                                borderWidth: isSelected ? 0 : 1,
                                                borderColor: '#E4E4E7',
                                                marginRight: index === CATEGORIES.length - 1 ? 0 : 10,
                                                gap: 6,
                                            }}
                                        >
                                            <MaterialIcons name={cat.icon} size={16} color={isSelected ? '#FFFFFF' : cat.color} />
                                            <Text
                                                className="font-[PlusJakartaSans_500Medium]"
                                                style={{ fontSize: 14, color: isSelected ? '#FFFFFF' : '#09090B' }}
                                            >
                                                {cat.label}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </ScrollView>
                        </View>

                        {/* ─── Goal Name ─── */}
                        <View style={{ marginBottom: 24, paddingHorizontal: 24 }}>
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

                        {/* ─── Tracking Type ─── */}
                        <TrackingTypePicker
                            selected={trackingType}
                            onSelect={setTrackingType}
                        />

                        {/* ─── Target Date ─── */}
                        <TouchableOpacity
                            onPress={() => setShowDatePicker(true)}
                            style={{
                                flexDirection: 'row', alignItems: 'center',
                                backgroundColor: '#FFFFFF', borderRadius: 18,
                                padding: 18, marginBottom: 12, marginHorizontal: 24,
                                shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
                                shadowOpacity: 0.03, shadowRadius: 8, elevation: 1,
                            }}
                        >
                            <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFF0F3', alignItems: 'center', justifyContent: 'center', marginRight: 14 }}>
                                <MaterialIcons name="calendar-today" size={20} color="#E11D48" />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text className="font-[PlusJakartaSans_700Bold]" style={{ fontSize: 11, letterSpacing: 1.2, color: '#E11D48', marginBottom: 2 }}>
                                    TARGET DATE
                                </Text>
                                <Text className="font-[PlusJakartaSans_500Medium]" style={{ fontSize: 16, color: '#09090B' }}>
                                    {formattedDate}
                                </Text>
                            </View>
                            <MaterialIcons name="chevron-right" size={24} color="#D4D4D8" />
                        </TouchableOpacity>

                        {/* ─── Target Value (number / amount types) ─── */}
                        {showTargetInput && (
                            <View
                                style={{
                                    flexDirection: 'row', alignItems: 'center',
                                    backgroundColor: '#FFFFFF', borderRadius: 18,
                                    padding: 18, marginBottom: 12, marginHorizontal: 24,
                                    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
                                    shadowOpacity: 0.03, shadowRadius: 8, elevation: 1,
                                }}
                            >
                                {trackingType === 'amount' ? (
                                    <TouchableOpacity
                                        onPress={() => setShowCurrencySelector(true)}
                                        style={{
                                            width: 44, height: 44, borderRadius: 22,
                                            backgroundColor: '#ECFDF5',
                                            alignItems: 'center', justifyContent: 'center', marginRight: 14,
                                        }}
                                    >
                                        <Text className="font-[PlusJakartaSans_700Bold]" style={{ fontSize: 20, color: '#16A34A' }}>
                                            {currency.symbol}
                                        </Text>
                                    </TouchableOpacity>
                                ) : (
                                    <View style={{
                                        width: 44, height: 44, borderRadius: 22,
                                        backgroundColor: '#EFF6FF',
                                        alignItems: 'center', justifyContent: 'center', marginRight: 14,
                                    }}>
                                        <MaterialIcons name="tag" size={20} color="#3B82F6" />
                                    </View>
                                )}
                                <View style={{ flex: 1 }}>
                                    <Text className="font-[PlusJakartaSans_700Bold]" style={{ fontSize: 11, letterSpacing: 1.2, color: trackingType === 'amount' ? '#16A34A' : '#3B82F6', marginBottom: 2 }}>
                                        {trackingType === 'amount' ? 'TARGET AMOUNT' : 'TARGET VALUE'}
                                    </Text>
                                    <TextInput
                                        value={targetValue}
                                        onChangeText={setTargetValue}
                                        keyboardType="numeric"
                                        placeholder="0"
                                        placeholderTextColor="#D4D4D8"
                                        className="font-[PlusJakartaSans_700Bold]"
                                        style={{ fontSize: 22, color: '#09090B', padding: 0 }}
                                    />
                                </View>
                                <MaterialIcons name="edit" size={20} color="#A1A1AA" />
                            </View>
                        )}

                        {/* ─── Unit label (number type only) ─── */}
                        {trackingType === 'number' && (
                            <View
                                style={{
                                    flexDirection: 'row', alignItems: 'center',
                                    backgroundColor: '#FFFFFF', borderRadius: 18,
                                    padding: 18, marginBottom: 12, marginHorizontal: 24,
                                    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
                                    shadowOpacity: 0.03, shadowRadius: 8, elevation: 1,
                                }}
                            >
                                <View style={{
                                    width: 44, height: 44, borderRadius: 22,
                                    backgroundColor: '#F5F3FF',
                                    alignItems: 'center', justifyContent: 'center', marginRight: 14,
                                }}>
                                    <MaterialIcons name="label" size={20} color="#8B5CF6" />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text className="font-[PlusJakartaSans_700Bold]" style={{ fontSize: 11, letterSpacing: 1.2, color: '#8B5CF6', marginBottom: 2 }}>
                                        UNIT LABEL
                                    </Text>
                                    <TextInput
                                        value={unit}
                                        onChangeText={setUnit}
                                        placeholder="e.g. steps, pages, hours"
                                        placeholderTextColor="#D4D4D8"
                                        className="font-[PlusJakartaSans_500Medium]"
                                        style={{ fontSize: 16, color: '#09090B', padding: 0 }}
                                    />
                                </View>
                            </View>
                        )}

                        {/* ─── Why It Matters ─── */}
                        <View style={{ marginBottom: 16, marginTop: 16, paddingHorizontal: 24 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 14 }}>
                                <MaterialIcons name="favorite" size={16} color="#E11D48" />
                                <Text
                                    className="font-[PlusJakartaSans_700Bold]"
                                    style={{ fontSize: 12, letterSpacing: 1.2, color: '#71717A' }}
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
                                    backgroundColor: '#FFFFFF', borderRadius: 18, padding: 18,
                                    fontSize: 15, fontFamily: 'PlusJakartaSans_400Regular',
                                    color: '#09090B', minHeight: 100,
                                    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
                                    shadowOpacity: 0.03, shadowRadius: 8, elevation: 1,
                                    lineHeight: 22,
                                }}
                            />
                        </View>

                        {/* ─── Helper Text ─── */}
                        <View className="items-center" style={{ marginBottom: 24, paddingHorizontal: 24 }}>
                            <Text
                                className="font-[PlusJakartaSans_400Regular] text-center"
                                style={{ fontSize: 13, color: '#A1A1AA', lineHeight: 18 }}
                            >
                                Keep each other motivated on your way to the goal.
                            </Text>
                        </View>

                        {/* ─── Create Button ─── */}
                        <Animated.View style={[animatedButtonStyle, { paddingHorizontal: 24 }]}>
                            <TouchableOpacity
                                activeOpacity={1}
                                onPressIn={handlePressIn}
                                onPressOut={handlePressOut}
                                style={{
                                    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                                    backgroundColor: '#A31645',
                                    paddingVertical: 18, paddingHorizontal: 32,
                                    borderRadius: 30, gap: 10,
                                    shadowColor: '#A31645',
                                    shadowOffset: { width: 0, height: 6 },
                                    shadowOpacity: 0.3, shadowRadius: 12, elevation: 6,
                                    opacity: isSubmitting ? 0.7 : 1,
                                }}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <ActivityIndicator color="#FFFFFF" size="small" />
                                ) : (
                                    <>
                                        <Text
                                            className="font-[PlusJakartaSans_700Bold]"
                                            style={{ fontSize: 18, color: '#FFFFFF' }}
                                        >
                                            {isEditMode
                                                ? (goalType === 'Shared' ? 'Save Goal Together' : 'Save Goal')
                                                : (goalType === 'Shared' ? 'Create Goal Together' : 'Create Goal')
                                            }
                                        </Text>
                                        <MaterialIcons name="arrow-forward" size={20} color="#FFFFFF" />
                                    </>
                                )}
                            </TouchableOpacity>
                        </Animated.View>
                    </KeyboardAwareScrollView>

                    {/* ─── Currency Selector Modal ─── */}
                    <Modal visible={showCurrencySelector} transparent animationType="fade">
                        <TouchableOpacity
                            style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' }}
                            activeOpacity={1}
                            onPress={() => setShowCurrencySelector(false)}
                        >
                            <TouchableWithoutFeedback>
                                <View style={{ backgroundColor: '#FFF', borderRadius: 28, padding: 24, width: '85%', shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.15, shadowRadius: 20, elevation: 10 }}>
                                    <Text className="font-[PlusJakartaSans_700Bold]" style={{ fontSize: 20, color: '#09090B', marginBottom: 20, textAlign: 'center' }}>Select Currency</Text>
                                    {CURRENCIES.map((c) => {
                                        const isSelected = currency.code === c.code;
                                        return (
                                            <TouchableOpacity
                                                key={c.code}
                                                onPress={() => {
                                                    setCurrency(c);
                                                    setShowCurrencySelector(false);
                                                }}
                                                style={{
                                                    flexDirection: 'row', alignItems: 'center',
                                                    paddingVertical: 14, paddingHorizontal: 16,
                                                    borderRadius: 16,
                                                    backgroundColor: isSelected ? '#ECFDF5' : 'transparent',
                                                    marginBottom: 6,
                                                }}
                                            >
                                                <View style={{ width: 44, alignItems: 'center' }}>
                                                    <Text className="font-[PlusJakartaSans_700Bold]" style={{ fontSize: 22, color: isSelected ? '#16A34A' : '#71717A' }}>{c.symbol}</Text>
                                                </View>
                                                <Text className={isSelected ? "font-[PlusJakartaSans_700Bold]" : "font-[PlusJakartaSans_500Medium]"} style={{ flex: 1, fontSize: 16, color: isSelected ? '#16A34A' : '#3F3F46' }}>{c.name}</Text>
                                                {isSelected && <MaterialIcons name="check-circle" size={24} color="#16A34A" />}
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            </TouchableWithoutFeedback>
                        </TouchableOpacity>
                    </Modal>

                    {/* ─── Date Picker ─── */}
                    {showDatePicker && (
                        Platform.OS === 'ios' ? (
                            <Modal visible={true} transparent animationType="slide">
                                <TouchableOpacity
                                    style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' }}
                                    activeOpacity={1}
                                    onPress={() => setShowDatePicker(false)}
                                >
                                    <TouchableWithoutFeedback>
                                        <View style={{ backgroundColor: '#FFF', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, paddingBottom: 40 }}>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                                                <Text className="font-[PlusJakartaSans_700Bold]" style={{ fontSize: 20, color: '#09090B' }}>Select Date</Text>
                                                <TouchableOpacity onPress={() => setShowDatePicker(false)} style={{ backgroundColor: '#FFF0F3', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20 }}>
                                                    <Text className="font-[PlusJakartaSans_700Bold]" style={{ fontSize: 14, color: '#E11D48' }}>Done</Text>
                                                </TouchableOpacity>
                                            </View>
                                            <DateTimePicker
                                                value={date}
                                                mode="date"
                                                display="spinner"
                                                onChange={(event, selectedDate) => {
                                                    if (selectedDate) setDate(selectedDate);
                                                }}
                                                minimumDate={new Date()}
                                                textColor="#09090B"
                                            />
                                        </View>
                                    </TouchableWithoutFeedback>
                                </TouchableOpacity>
                            </Modal>
                        ) : (
                            <DateTimePicker
                                value={date}
                                mode="date"
                                display="default"
                                onChange={(event, selectedDate) => {
                                    setShowDatePicker(false);
                                    if (selectedDate) setDate(selectedDate);
                                }}
                                minimumDate={new Date()}
                            />
                        )
                    )}
                </View>
            </View>
        </View>
    );
}

export default withBottomSheet(AddGoalScreen, { minHeight: '90%', maxHeight: '95%' });
