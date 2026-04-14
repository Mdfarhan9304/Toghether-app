import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInRight, FadeOutLeft, FadeInLeft } from 'react-native-reanimated';

import SelectionCard from '../../components/SelectionCard';
import QuestionBuilder from '../../components/quiz/QuestionBuilder';
import { useQuizStore, QuizQuestion } from '../../store/quizStore';
import { QUIZ_TEMPLATES } from '../../lib/quizTemplates';

const CATEGORIES = [
    {
        id: 'romance',
        title: 'Romance',
        description: 'Deepen your spark with questions about love and passion.',
        icon: 'favorite' as const,
        gradient: ['#A31645', '#E11D48'] as const,
    },
    {
        id: 'future',
        title: 'Future',
        description: 'Align your dreams and talk about the life you\'re building.',
        icon: 'explore' as const,
        gradient: ['#7C3AED', '#A855F7'] as const,
    },
    {
        id: 'fun',
        title: 'Fun',
        description: 'Lighthearted ice-breakers and playful hypotheticals.',
        icon: 'celebration' as const,
        gradient: ['#F59E0B', '#FBBF24'] as const,
    },
    {
        id: 'custom',
        title: 'Custom',
        description: 'Create your own specific question set for your partner.',
        icon: 'edit' as const,
        gradient: ['#3B82F6', '#60A5FA'] as const,
    },
];

export default function CreateQuizScreen() {
    const router = useRouter();
    const {
        creation,
        setCategory,
        addQuestion,
        removeQuestion,
        setCurrentStep,
        resetCreation,
        submitQuiz,
        setQuestions,
    } = useQuizStore();

    const [showBuilder, setShowBuilder] = useState(false);
    const [isSending, setIsSending] = useState(false);

    const step = creation.currentStep;

    const handleCategorySelect = (categoryId: string) => {
        setCategory(categoryId);
    };

    const handleNextStep = () => {
        if (step === 0 && !creation.category) {
            Alert.alert('Select Category', 'Please pick a category first.');
            return;
        }

        if (step === 0 && creation.category !== 'custom') {
            const templates = QUIZ_TEMPLATES[creation.category];
            if (templates && templates.length > 0) {
                // Shuffle array randomly and pick 5 questions to keep it fresh!
                const shuffled = [...templates].sort(() => 0.5 - Math.random());
                const selectedTemplates = shuffled.slice(0, 5);

                setQuestions(
                    selectedTemplates.map((t, index) => ({
                        question_text: t.question_text,
                        options: t.options,
                        correct_option_index: -1,
                        order_index: index,
                    }))
                );
                setCurrentStep(2); // Skip Step 1 entirely
                return;
            }
        }

        setCurrentStep(step + 1);
    };

    const handleBack = () => {
        if (step === 2 && creation.category !== 'custom') {
            setQuestions([]);
            setCurrentStep(0);
        } else if (step > 0) {
            setCurrentStep(step - 1);
        } else {
            resetCreation();
            router.back();
        }
    };

    const handleSaveQuestion = (data: {
        question_text: string;
        options: string[];
        correct_option_index: number;
    }) => {
        addQuestion(data);
        setShowBuilder(false);
    };

    const handleSendQuiz = async () => {
        if (creation.questions.length < 4) {
            Alert.alert(
                'Need More Questions',
                `Please add at least 4 questions. You have ${creation.questions.length} so far.`
            );
            return;
        }
        setIsSending(true);
        const quizId = await submitQuiz();
        setIsSending(false);
        if (quizId) {
            Alert.alert('Quiz Sent! 🎉', 'Your partner will be notified!', [
                { text: 'OK', onPress: () => router.back() },
            ]);
        } else {
            Alert.alert('Error', 'Failed to send quiz. Make sure you have a partner linked.');
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.flex}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
                        <MaterialIcons name="arrow-back" size={24} color="#111827" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Create Quiz</Text>
                    <View style={{ width: 40 }} />
                </View>

                {/* Progress */}
                <View style={styles.progress}>
                    <View style={styles.progressBar}>
                        <View
                            style={[
                                styles.progressFill,
                                { width: `${((step + 1) / 3) * 100}%` },
                            ]}
                        />
                    </View>
                    <Text style={styles.stepLabel}>
                        STEP {step + 1} OF 3
                    </Text>
                </View>

                <ScrollView
                    style={styles.flex}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* ─── Step 0: Category Selection ─── */}
                    {step === 0 && (
                        <Animated.View
                            entering={FadeInRight.springify().damping(18)}
                            exiting={FadeOutLeft.duration(200)}
                        >
                            <Text style={styles.stepTitle}>Choose a Category</Text>
                            <Text style={styles.stepSubtitle}>
                                Select a theme for your quiz questions.
                            </Text>
                            <View style={[styles.categoriesContainer, { marginHorizontal: -12, paddingHorizontal: 12, paddingBottom: 16 }]}>
                                {CATEGORIES.map((cat, index) => (
                                    <Animated.View
                                        key={cat.id}
                                        entering={FadeInLeft.delay(index * 80).duration(400).springify().damping(15).stiffness(150)}
                                        exiting={FadeInRight.duration(400).springify().damping(15).stiffness(150)}
                                    >
                                        <SelectionCard
                                            icon={cat.icon}
                                            title={cat.title}
                                            description={cat.description}
                                            isSelected={creation.category === cat.id}
                                            onPress={() => handleCategorySelect(cat.id)}
                                        />
                                    </Animated.View>
                                ))}
                            </View>
                        </Animated.View>
                    )}

                    {/* ─── Step 1: Build Questions ─── */}
                    {step === 1 && (
                        <Animated.View
                            entering={FadeInRight.springify().damping(18)}
                            exiting={FadeOutLeft.duration(200)}
                        >
                            <Text style={styles.stepTitle}>Add Questions</Text>
                            <Text style={styles.stepSubtitle}>
                                Add 4–5 questions with 4 options each. Mark the correct answer!
                            </Text>

                            {/* Existing questions summary */}
                            {creation.questions.map((q, i) => (
                                <View key={i} style={styles.questionSummary}>
                                    <View style={styles.qNumBadge}>
                                        <Text style={styles.qNumText}>{i + 1}</Text>
                                    </View>
                                    <Text style={styles.qSummaryText} numberOfLines={1}>
                                        {q.question_text}
                                    </Text>
                                    <TouchableOpacity
                                        onPress={() => removeQuestion(i)}
                                        style={styles.deleteBtn}
                                    >
                                        <MaterialIcons name="close" size={18} color="#EF4444" />
                                    </TouchableOpacity>
                                </View>
                            ))}

                            {/* Question builder */}
                            {showBuilder ? (
                                <QuestionBuilder
                                    questionNumber={creation.questions.length + 1}
                                    onSave={handleSaveQuestion}
                                    onCancel={() => setShowBuilder(false)}
                                />
                            ) : (
                                creation.questions.length < 5 && (
                                    <TouchableOpacity
                                        onPress={() => setShowBuilder(true)}
                                        style={styles.addQuestionBtn}
                                    >
                                        <MaterialIcons name="add-circle" size={24} color="#A31645" />
                                        <Text style={styles.addQuestionText}>
                                            Add Question ({creation.questions.length}/5)
                                        </Text>
                                    </TouchableOpacity>
                                )
                            )}
                        </Animated.View>
                    )}

                    {/* ─── Step 2: Review & Send ─── */}
                    {step === 2 && (
                        <Animated.View
                            entering={FadeInRight.springify().damping(18)}
                            exiting={FadeOutLeft.duration(200)}
                        >
                            <Text style={styles.stepTitle}>Review & Send</Text>
                            <Text style={styles.stepSubtitle}>
                                Review your quiz before sending it to your partner.
                            </Text>

                            {/* Category badge */}
                            <View style={styles.reviewCategory}>
                                <MaterialIcons name="category" size={18} color="#A31645" />
                                <Text style={styles.reviewCategoryText}>
                                    {creation.category.charAt(0).toUpperCase() +
                                        creation.category.slice(1)}
                                </Text>
                            </View>

                            {/* Questions review */}
                            {creation.questions.map((q, i) => (
                                <View key={i} style={styles.reviewQuestion}>
                                    <Text style={styles.reviewQNum}>Q{i + 1}</Text>
                                    <Text style={styles.reviewQText}>{q.question_text}</Text>
                                    {q.options.map((opt, oi) => (
                                        <View key={oi} style={styles.reviewOptionRow}>
                                            <View
                                                style={[
                                                    styles.reviewDot,
                                                    oi === q.correct_option_index &&
                                                        styles.reviewDotCorrect,
                                                ]}
                                            />
                                            <Text
                                                style={[
                                                    styles.reviewOptionText,
                                                    oi === q.correct_option_index &&
                                                        styles.reviewOptionCorrect,
                                                ]}
                                            >
                                                {opt}
                                            </Text>
                                            {oi === q.correct_option_index && (
                                                <MaterialIcons
                                                    name="check"
                                                    size={16}
                                                    color="#16A34A"
                                                />
                                            )}
                                        </View>
                                    ))}
                                </View>
                            ))}
                        </Animated.View>
                    )}
                </ScrollView>

                {/* Bottom Action Bar */}
                <View style={styles.bottomBar}>
                    {step < 2 ? (
                        <TouchableOpacity
                            onPress={handleNextStep}
                            style={[
                                styles.nextBtn,
                                step === 1 && creation.questions.length < 4 && styles.nextBtnDisabled,
                            ]}
                            disabled={step === 1 && creation.questions.length < 4}
                        >
                            <Text style={styles.nextBtnText}>
                                {step === 0 ? 'Next: Add Questions' : 'Review Quiz'}
                            </Text>
                            <MaterialIcons name="arrow-forward" size={20} color="#FFF" />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            onPress={handleSendQuiz}
                            style={styles.sendBtn}
                            disabled={isSending}
                        >
                            {isSending ? (
                                <ActivityIndicator color="#FFF" />
                            ) : (
                                <>
                                    <Text style={styles.sendBtnText}>SEND TO PARTNER</Text>
                                    <MaterialIcons name="send" size={20} color="#FFF" />
                                </>
                            )}
                        </TouchableOpacity>
                    )}
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F8F6F7',
    },
    flex: { flex: 1 },
    header: {
        paddingHorizontal: 24,
        paddingTop: 8,
        paddingBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: 'PlusJakartaSans_700Bold',
        color: '#111827',
    },
    progress: {
        paddingHorizontal: 24,
        marginBottom: 16,
    },
    progressBar: {
        height: 4,
        backgroundColor: '#F3E8FF',
        borderRadius: 2,
        overflow: 'hidden',
        marginBottom: 8,
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#A31645',
        borderRadius: 2,
    },
    stepLabel: {
        fontSize: 11,
        fontFamily: 'PlusJakartaSans_700Bold',
        color: '#A31645',
        letterSpacing: 1.2,
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingBottom: 120,
    },
    stepTitle: {
        fontSize: 28,
        fontFamily: 'PlusJakartaSans_800ExtraBold',
        color: '#111827',
        marginBottom: 8,
    },
    stepSubtitle: {
        fontSize: 15,
        fontFamily: 'PlusJakartaSans_500Medium',
        color: '#6B7280',
        marginBottom: 24,
        lineHeight: 22,
    },
    categoriesContainer: {
        gap: 14,
    },
    questionSummary: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.65)',
        borderRadius: 32,
        padding: 20,
        marginBottom: 12,
        gap: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.8)',
        boxShadow: '0px 1px 4px 1px rgba(0,0,0,0.15),inset 0px 4px 4px 0px rgba(255,255,255,0.50),inset 0px -4px 4px 0px rgba(0,0,0,0.06)',
    },
    qNumBadge: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#FFF1F2',
        alignItems: 'center',
        justifyContent: 'center',
    },
    qNumText: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 14,
        color: '#A31645',
    },
    qSummaryText: {
        flex: 1,
        fontFamily: 'PlusJakartaSans_600SemiBold',
        fontSize: 14,
        color: '#374151',
    },
    deleteBtn: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#FEE2E2',
        alignItems: 'center',
        justifyContent: 'center',
    },
    addQuestionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 18,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#A31645',
        borderStyle: 'dashed',
        marginTop: 8,
    },
    addQuestionText: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 15,
        color: '#A31645',
    },
    reviewCategory: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#FFF1F2',
        alignSelf: 'flex-start',
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 8,
        marginBottom: 20,
    },
    reviewCategoryText: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 14,
        color: '#A31645',
    },
    reviewQuestion: {
        backgroundColor: 'rgba(255,255,255,0.65)',
        borderRadius: 32,
        padding: 24,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.8)',
        boxShadow: '0px 1px 4px 1px rgba(0,0,0,0.15),inset 0px 4px 4px 0px rgba(255,255,255,0.50),inset 0px -4px 4px 0px rgba(0,0,0,0.06)',
    },
    reviewQNum: {
        fontFamily: 'PlusJakartaSans_800ExtraBold',
        fontSize: 12,
        color: '#A31645',
        letterSpacing: 1,
        marginBottom: 8,
    },
    reviewQText: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 16,
        color: '#111827',
        marginBottom: 14,
        lineHeight: 24,
    },
    reviewOptionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingVertical: 6,
    },
    reviewDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#D1D5DB',
    },
    reviewDotCorrect: {
        backgroundColor: '#16A34A',
    },
    reviewOptionText: {
        flex: 1,
        fontFamily: 'PlusJakartaSans_500Medium',
        fontSize: 14,
        color: '#6B7280',
    },
    reviewOptionCorrect: {
        fontFamily: 'PlusJakartaSans_700Bold',
        color: '#16A34A',
    },
    bottomBar: {
        paddingHorizontal: 24,
        paddingVertical: 16,
        backgroundColor: '#F8F6F7',
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    nextBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#A31645',
        borderRadius: 20,
        paddingVertical: 18,
    },
    nextBtnDisabled: {
        opacity: 0.4,
    },
    nextBtnText: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 16,
        color: '#FFF',
    },
    sendBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        backgroundColor: '#A31645',
        borderRadius: 20,
        paddingVertical: 18,
        shadowColor: '#A31645',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
    },
    sendBtnText: {
        fontFamily: 'PlusJakartaSans_800ExtraBold',
        fontSize: 16,
        color: '#FFF',
        letterSpacing: 1.5,
    },
});
