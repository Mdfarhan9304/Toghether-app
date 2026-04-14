import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
    FadeInRight,
    FadeOutLeft,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import QuizOption from '../../../components/quiz/QuizOption';
import { useQuizStore, QuizQuestion } from '../../../store/quizStore';
import { supabase } from '../../../lib/supabase';

interface QuizData {
    id: string;
    category: string;
    creator: { full_name: string } | null;
    quiz_questions: QuizQuestion[];
}

export default function PlayQuizScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { acceptQuiz, submitResponses } = useQuizStore();

    const [quiz, setQuiz] = useState<QuizData | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [responses, setResponses] = useState<
        { question_id: string; selected_option_index: number; is_correct: boolean }[]
    >([]);

    const progressWidth = useSharedValue(0);

    const progressStyle = useAnimatedStyle(() => ({
        width: `${progressWidth.value}%`,
    }));

    useEffect(() => {
        loadQuiz();
    }, []);

    useEffect(() => {
        if (quiz) {
            progressWidth.value = withSpring(
                ((currentIndex + 1) / quiz.quiz_questions.length) * 100,
                { damping: 15, stiffness: 120 }
            );
        }
    }, [currentIndex, quiz]);

    const loadQuiz = async () => {
        try {
            const { data } = await supabase
                .from('quizzes')
                .select(
                    '*, quiz_questions(*), creator:profiles!quizzes_creator_id_fkey(full_name)'
                )
                .eq('id', id)
                .single();

            if (data) {
                // Sort questions by order_index
                data.quiz_questions.sort(
                    (a: any, b: any) => a.order_index - b.order_index
                );
                setQuiz(data as any);
                // Accept the quiz
                await acceptQuiz(id!);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSelectOption = (index: number) => {
        if (showResult) return;
        setSelectedOption(index);
    };

    const handleConfirm = () => {
        if (selectedOption === null || !quiz) return;

        const currentQuestion = quiz.quiz_questions[currentIndex];
        const isCorrect =
            selectedOption === currentQuestion.correct_option_index;

        Haptics.impactAsync(
            isCorrect
                ? Haptics.ImpactFeedbackStyle.Light
                : Haptics.ImpactFeedbackStyle.Heavy
        ).catch(() => {});

        setShowResult(true);
        setResponses((prev) => [
            ...prev,
            {
                question_id: currentQuestion.id!,
                selected_option_index: selectedOption,
                is_correct: isCorrect,
            },
        ]);
    };

    const handleNext = async () => {
        if (!quiz) return;

        if (currentIndex < quiz.quiz_questions.length - 1) {
            setCurrentIndex((prev) => prev + 1);
            setSelectedOption(null);
            setShowResult(false);
        } else {
            // Submit all responses
            const allResponses = [
                ...responses,
            ];
            await submitResponses(id!, allResponses);
            router.replace(`/quiz/result/${id}`);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#A31645" />
            </View>
        );
    }

    if (!quiz) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>Quiz not found</Text>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Text style={styles.backLink}>Go Back</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    const currentQuestion = quiz.quiz_questions[currentIndex];
    const totalQuestions = quiz.quiz_questions.length;
    const isOptional = currentQuestion.correct_option_index === -1;

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.closeBtn}
                >
                    <MaterialIcons name="close" size={24} color="#6B7280" />
                </TouchableOpacity>

                <View style={styles.headerCenter}>
                    <MaterialIcons name="favorite" size={16} color="#A31645" />
                    <Text style={styles.headerTitle}>
                        QUESTION {String(currentIndex + 1).padStart(2, '0')}/{String(totalQuestions).padStart(2, '0')}
                    </Text>
                </View>

                <View style={{ width: 40 }} />
            </View>

            {/* Progress Bar */}
            <View style={styles.progressBarOuter}>
                <Animated.View style={[styles.progressBarInner, progressStyle]} />
            </View>

            {/* Question Content */}
            <Animated.View
                key={`q-${currentIndex}`}
                entering={FadeInRight.springify().damping(18)}
                exiting={FadeOutLeft.duration(150)}
                style={styles.questionContainer}
            >
                <Text style={styles.categoryLabel}>
                    {quiz.category.toUpperCase()}
                </Text>
                <Text style={styles.questionText}>
                    {currentQuestion.question_text}
                </Text>

                {/* Options */}
                <View style={styles.optionsContainer}>
                    {currentQuestion.options.map((option, index) => (
                        <QuizOption
                            key={`${currentIndex}-${index}`}
                            text={option}
                            index={index}
                            isSelected={selectedOption === index}
                            isCorrect={
                                index === currentQuestion.correct_option_index
                            }
                            showResult={showResult}
                            isOptional={isOptional}
                            onPress={() => handleSelectOption(index)}
                            disabled={showResult}
                        />
                    ))}
                </View>

                {/* Result feedback */}
                {showResult && (
                    <Animated.View
                        entering={FadeInRight.springify().damping(18)}
                        style={[
                            styles.feedbackBanner,
                            {
                                backgroundColor: isOptional
                                    ? '#F3E8FF'
                                    : selectedOption === currentQuestion.correct_option_index
                                        ? '#DCFCE7'
                                        : '#FEE2E2',
                            },
                        ]}
                    >
                        <Text
                            style={[
                                styles.feedbackText,
                                {
                                    color: isOptional
                                        ? '#7C3AED'
                                        : selectedOption === currentQuestion.correct_option_index
                                            ? '#16A34A'
                                            : '#EF4444',
                                },
                            ]}
                        >
                            {isOptional
                                ? '✨ Saved!'
                                : selectedOption === currentQuestion.correct_option_index
                                    ? '🎉 Perfect Match!'
                                    : '😅 Not quite right!'}
                        </Text>
                    </Animated.View>
                )}
            </Animated.View>

            {/* Bottom Action */}
            <View style={styles.bottomBar}>
                {!showResult ? (
                    <TouchableOpacity
                        onPress={handleConfirm}
                        style={[
                            styles.confirmBtn,
                            selectedOption === null && styles.confirmBtnDisabled,
                        ]}
                        disabled={selectedOption === null}
                    >
                        <Text style={styles.confirmBtnText}>Confirm Answer</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity onPress={handleNext} style={styles.nextBtn}>
                        <Text style={styles.nextBtnText}>
                            {currentIndex < totalQuestions - 1
                                ? 'Next Question'
                                : 'See Results'}
                        </Text>
                        <MaterialIcons name="arrow-forward" size={20} color="#FFF" />
                    </TouchableOpacity>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F8F6F7',
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F8F6F7',
    },
    errorContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
    },
    errorText: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 18,
        color: '#374151',
    },
    backLink: {
        fontFamily: 'PlusJakartaSans_600SemiBold',
        fontSize: 14,
        color: '#A31645',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
    closeBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerCenter: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#FFF1F2',
        borderRadius: 20,
        paddingHorizontal: 14,
        paddingVertical: 8,
    },
    headerTitle: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 12,
        color: '#A31645',
        letterSpacing: 1,
    },
    progressBarOuter: {
        height: 4,
        backgroundColor: '#F3E8FF',
        marginHorizontal: 20,
        borderRadius: 2,
        overflow: 'hidden',
        marginBottom: 8,
    },
    progressBarInner: {
        height: '100%',
        backgroundColor: '#A31645',
        borderRadius: 2,
    },
    questionContainer: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 24,
    },
    categoryLabel: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 11,
        color: '#A31645',
        letterSpacing: 1.5,
        marginBottom: 12,
    },
    questionText: {
        fontFamily: 'PlusJakartaSans_800ExtraBold',
        fontSize: 26,
        color: '#111827',
        lineHeight: 36,
        marginBottom: 32,
    },
    optionsContainer: {
        gap: 2,
    },
    feedbackBanner: {
        borderRadius: 16,
        padding: 16,
        marginTop: 16,
        alignItems: 'center',
    },
    feedbackText: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 16,
    },
    bottomBar: {
        paddingHorizontal: 24,
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    confirmBtn: {
        backgroundColor: '#A31645',
        borderRadius: 20,
        paddingVertical: 18,
        alignItems: 'center',
    },
    confirmBtnDisabled: {
        opacity: 0.4,
    },
    confirmBtnText: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 16,
        color: '#FFF',
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
    nextBtnText: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 16,
        color: '#FFF',
    },
});
