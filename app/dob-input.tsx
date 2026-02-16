import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInUp, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import PremiumButton from '../components/PremiumButton';
import ProgressDots from '../components/ProgressDots';

export default function DOBInputScreen() {
    const router = useRouter();
    // Default to a reasonable date (e.g. 25 years ago)
    const [date, setDate] = useState(new Date(2000, 0, 1));
    const [hasChanged, setHasChanged] = useState(false);

    // Android specific state
    const [day, setDay] = useState('01');
    const [month, setMonth] = useState('01');
    const [year, setYear] = useState('2000');

    // Refs for auto-focus
    const dayRef = useRef<TextInput>(null);
    const monthRef = useRef<TextInput>(null);
    const yearRef = useRef<TextInput>(null);

    const buttonOpacity = useSharedValue(0.5);

    useEffect(() => {
        // Enable button immediately for flow, but visually indicate it's ready
        updateButtonState();
    }, [date, day, month, year]);

    const updateButtonState = () => {
        let enable = true;
        if (Platform.OS === 'android') {
            // Basic validation for button state
            const d = parseInt(day);
            const m = parseInt(month);
            const y = parseInt(year);
            if (isNaN(d) || isNaN(m) || isNaN(y) ||
                d < 1 || d > 31 || m < 1 || m > 12 || y < 1900 || y > new Date().getFullYear()) {
                enable = false;
            }
        }
        buttonOpacity.value = withSpring(enable ? 1 : 0.5, { damping: 12, stiffness: 200 });
    };

    const buttonStyle = useAnimatedStyle(() => ({
        opacity: buttonOpacity.value,
    }));

    const handleContinue = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        let finalDate = date;
        if (Platform.OS === 'android') {
            const d = parseInt(day);
            const m = parseInt(month) - 1; // Month is 0-indexed
            const y = parseInt(year);

            // Validate date
            const newDate = new Date(y, m, d);
            if (newDate.getDate() !== d || newDate.getMonth() !== m || newDate.getFullYear() !== y) {
                // Invalid date (e.g. Feb 31)
                // You could add an alert here
                return;
            }
            finalDate = newDate;
        }

        // TODO: Save DOB to store
        console.log(`DOB: ${finalDate.toISOString()}`);
        router.push('/invite-partner');
    };

    const onChange = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || date;
        if (currentDate.getTime() !== date.getTime()) {
            setDate(currentDate);
            setHasChanged(true);
            // Haptic feedback on scroll
            if (Platform.OS === 'ios') {
                Haptics.selectionAsync();
            }
        }
    };

    const handleDayChange = (text: string) => {
        // Only allow numbers
        const cleaned = text.replace(/[^0-9]/g, '');
        setDay(cleaned);

        // Auto-focus next field
        if (cleaned.length === 2) {
            monthRef.current?.focus();
        }
        updateDateFromInputs(cleaned, month, year);
    };

    const handleMonthChange = (text: string) => {
        const cleaned = text.replace(/[^0-9]/g, '');
        setMonth(cleaned);

        if (cleaned.length === 2) {
            yearRef.current?.focus();
        }
        // Handle backspace to move back
        if (text === '' && month === '') {
            dayRef.current?.focus();
        }

        updateDateFromInputs(day, cleaned, year);
    };

    const handleYearChange = (text: string) => {
        const cleaned = text.replace(/[^0-9]/g, '');
        setYear(cleaned);

        // Handle backspace
        if (text === '' && year === '') {
            monthRef.current?.focus();
        }

        updateDateFromInputs(day, month, cleaned);
    };

    const updateDateFromInputs = (dStr: string, mStr: string, yStr: string) => {
        const d = parseInt(dStr);
        const m = parseInt(mStr) - 1;
        const y = parseInt(yStr);

        if (!isNaN(d) && !isNaN(m) && !isNaN(y) && d > 0 && m >= 0 && y > 1900) {
            const newDate = new Date(y, m, d);
            // Verify it's a valid date (handles Feb 30 etc)
            if (newDate.getDate() === d && newDate.getMonth() === m) {
                setDate(newDate);
            }
        }
    };

    // calculate age
    const age = new Date().getFullYear() - date.getFullYear();
    const isBirthdayPassed = new Date().getMonth() > date.getMonth() ||
        (new Date().getMonth() === date.getMonth() && new Date().getDate() >= date.getDate());
    const finalAge = isBirthdayPassed ? age : age - 1;

    // formatted date
    const formattedDate = date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });

    return (
        <View className="flex-1 bg-[#F8F6F7] relative">
            <StatusBar style="dark" />

            {/* Floating Blur Circles */}
            <View
                className="absolute rounded-full bg-primary/5"
                style={{
                    width: 256,
                    height: 256,
                    top: -80,
                    right: -32,
                }}
            />
            <View
                className="absolute rounded-full bg-primary/5"
                style={{
                    width: 320,
                    height: 320,
                    bottom: -100,
                    left: -80,
                }}
            />

            <SafeAreaView style={{ flex: 1 }}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                >
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View className="flex-1 h-full">
                            {/* Header - Back Button + Progress */}
                            <View className="flex-row items-center px-4 py-4 relative min-h-[56px]">
                                <TouchableOpacity
                                    onPress={() => router.back()}
                                    className="w-10 h-10 rounded-full items-center justify-center absolute left-4 z-10"
                                >
                                    <MaterialIcons name="arrow-back" size={24} color="#4B5563" />
                                </TouchableOpacity>

                                <Animated.View
                                    entering={FadeIn.duration(400)}
                                    className="flex-1 flex-row items-center justify-center"
                                >
                                    <ProgressDots steps={6} currentStep={5} />
                                </Animated.View>
                            </View>

                            <View className="flex-1 px-6 pt-4">
                                {/* Title Section */}
                                <Animated.View entering={FadeInDown.delay(200).duration(500)} style={{ marginBottom: 24 }}>
                                    <Text
                                        className="text-[#111827] font-[PlusJakartaSans_800ExtraBold] text-center mb-3"
                                        style={{ fontSize: 30, lineHeight: 36, letterSpacing: -0.75 }}
                                    >
                                        When is your birthday?
                                    </Text>
                                    <Text
                                        className="text-[#6B7280] font-[PlusJakartaSans_500Medium] text-center"
                                        style={{ fontSize: 16, lineHeight: 24 }}
                                    >
                                        We use this to calculate your age and customized compatibility.
                                    </Text>
                                </Animated.View>

                                {/* Dynamic Date Display Card (Visible on both, but reflects input) */}
                                <Animated.View
                                    entering={FadeInDown.delay(300).duration(500)}
                                    className="items-center mb-8"
                                >
                                    <View className="items-center">
                                        <Animated.Text
                                            key={formattedDate}
                                            className="text-primary font-[PlusJakartaSans_700Bold]"
                                            style={{ fontSize: 32, marginBottom: 4 }}
                                        >
                                            {formattedDate}
                                        </Animated.Text>
                                        <View className="bg-primary/10 px-3 py-1 rounded-full">
                                            <Text className="text-primary font-[PlusJakartaSans_600SemiBold]" style={{ fontSize: 14 }}>
                                                {finalAge} years old
                                            </Text>
                                        </View>
                                    </View>
                                </Animated.View>

                                {/* Input Section */}
                                <Animated.View
                                    entering={FadeInDown.delay(400).duration(500)}
                                    className="items-center justify-center"
                                >
                                    {Platform.OS === 'ios' ? (
                                        <View
                                            className="overflow-hidden"
                                            style={{
                                                backgroundColor: 'white',
                                                borderRadius: 32,
                                                padding: 16,
                                                shadowColor: '#E05C8F',
                                                shadowOffset: { width: 0, height: 8 },
                                                shadowOpacity: 0.15,
                                                shadowRadius: 24,
                                                elevation: 8,
                                                borderWidth: 1,
                                                borderColor: 'rgba(255,255,255,0.6)',
                                            }}
                                        >
                                            <DateTimePicker
                                                value={date}
                                                mode="date"
                                                display="spinner"
                                                onChange={onChange}
                                                textColor="#111827"
                                                style={{ width: 320, height: 216 }}
                                                maximumDate={new Date()}
                                            />
                                        </View>
                                    ) : (
                                        <View className="flex-row justify-center items-center space-x-3 w-full">
                                            {/* Day Input */}
                                            <View style={{ width: 80 }}>
                                                <Text className="text-[#6B7280] text-xs font-[PlusJakartaSans_600SemiBold] mb-1.5 text-center uppercase tracking-wider">Day</Text>
                                                <TextInput
                                                    ref={dayRef}
                                                    value={day}
                                                    onChangeText={handleDayChange}
                                                    keyboardType="number-pad"
                                                    maxLength={2}
                                                    placeholder="DD"
                                                    placeholderTextColor="#9CA3AF"
                                                    className="bg-white text-center text-[#111827] font-[PlusJakartaSans_700Bold] text-xl py-4 mx-2 rounded-2xl border-2 border-[#E05C8F]/20 focus:border-[#E05C8F]"
                                                    selectTextOnFocus
                                                />
                                            </View>

                                            {/* Month Input */}
                                            <View style={{ width: 80 }}>
                                                <Text className="text-[#6B7280] text-xs font-[PlusJakartaSans_600SemiBold] mb-1.5 text-center uppercase tracking-wider">Month</Text>
                                                <TextInput
                                                    ref={monthRef}
                                                    value={month}
                                                    onChangeText={handleMonthChange}
                                                    keyboardType="number-pad"
                                                    maxLength={2}
                                                    placeholder="MM"
                                                    placeholderTextColor="#9CA3AF"
                                                    className="bg-white text-center text-[#111827] font-[PlusJakartaSans_700Bold] text-xl py-4 rounded-2xl border-2 mx-2 border-[#E05C8F]/20 focus:border-[#E05C8F]"
                                                    selectTextOnFocus
                                                    onKeyPress={({ nativeEvent }) => {
                                                        if (nativeEvent.key === 'Backspace' && month === '') {
                                                            dayRef.current?.focus();
                                                        }
                                                    }}
                                                />
                                            </View>

                                            {/* Year Input */}
                                            <View style={{ width: 100 }}>
                                                <Text className="text-[#6B7280] text-xs font-[PlusJakartaSans_600SemiBold] mb-1.5 text-center uppercase tracking-wider">Year</Text>
                                                <TextInput
                                                    ref={yearRef}
                                                    value={year}
                                                    onChangeText={handleYearChange}
                                                    keyboardType="number-pad"
                                                    maxLength={4}
                                                    placeholder="YYYY"
                                                    placeholderTextColor="#9CA3AF"
                                                    className="bg-white text-center text-[#111827] font-[PlusJakartaSans_700Bold] text-xl py-4 mx-2 rounded-2xl border-2 border-[#E05C8F]/20 focus:border-[#E05C8F]"
                                                    selectTextOnFocus
                                                    onKeyPress={({ nativeEvent }) => {
                                                        if (nativeEvent.key === 'Backspace' && year === '') {
                                                            monthRef.current?.focus();
                                                        }
                                                    }}
                                                />
                                            </View>
                                        </View>
                                    )}
                                </Animated.View>
                            </View>

                            {/* Fixed Continue Button */}
                            <Animated.View
                                entering={FadeInUp.delay(800).duration(500)}
                                className="absolute bottom-0 left-0 right-0"
                                style={{
                                    paddingHorizontal: 24,
                                    paddingVertical: 24,
                                    paddingBottom: 24,
                                    // Gradient fade (approximated with shadow on iOS, can use elevation or just padding on Android)
                                }}
                            >
                                <Animated.View style={buttonStyle}>
                                    <PremiumButton
                                        title="Continue"
                                        onPress={handleContinue}
                                        disabled={false}
                                    />
                                </Animated.View>
                            </Animated.View>
                        </View>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}
