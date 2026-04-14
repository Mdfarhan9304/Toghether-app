import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
    FadeInDown,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

import { supabase } from '../../../lib/supabase';

interface QuizResultData {
    id: string;
    category: string;
    score: number | null;
    creator: { full_name: string } | null;
    recipient: { full_name: string } | null;
    quiz_questions: {
        id: string;
        question_text: string;
        options: string[];
        correct_option_index: number;
        order_index: number;
    }[];
    quiz_responses: {
        question_id: string;
        selected_option_index: number;
        is_correct: boolean;
    }[];
}

export default function QuizResultScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const [quiz, setQuiz] = useState<QuizResultData | null>(null);
    const [loading, setLoading] = useState(true);

    const scoreScale = useSharedValue(0);
    const scoreOpacity = useSharedValue(0);

    const scoreAnimStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scoreScale.value }],
        opacity: scoreOpacity.value,
    }));

    useEffect(() => {
        loadResult();
    }, []);

    useEffect(() => {
        if (quiz) {
            scoreScale.value = withDelay(
                300,
                withSpring(1, { damping: 12, stiffness: 150 })
            );
            scoreOpacity.value = withDelay(300, withTiming(1, { duration: 400 }));
        }
    }, [quiz]);

    const loadResult = async () => {
        try {
            const { data } = await supabase
                .from('quizzes')
                .select(
                    `*, 
                    quiz_questions(*), 
                    quiz_responses(*),
                    creator:profiles!quizzes_creator_id_fkey(full_name),
                    recipient:profiles!quizzes_recipient_id_fkey(full_name)`
                )
                .eq('id', id)
                .single();

            if (data) {
                data.quiz_questions.sort(
                    (a: any, b: any) => a.order_index - b.order_index
                );
                setQuiz(data as any);
            }
        } finally {
            setLoading(false);
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
                    <Text style={styles.errorText}>Result not found</Text>
                </View>
            </SafeAreaView>
        );
    }

    const totalQuestions = quiz.quiz_questions.length;
    const gradedQuestions = quiz.quiz_questions.filter((q) => q.correct_option_index !== -1).length;
    const isPurePoll = gradedQuestions === 0;

    const correctCount = quiz.score ?? quiz.quiz_responses.filter((r) => {
        const q = quiz.quiz_questions.find((q) => q.id === r.question_id);
        if (q?.correct_option_index === -1) return false;
        return r.is_correct;
    }).length;

    const percentage = gradedQuestions > 0 ? Math.round((correctCount / gradedQuestions) * 100) : 100;

    const getMessage = () => {
        if (isPurePoll) return { title: 'Answers Saved! 💝', subtitle: "You've shared something new!" };
        if (percentage === 100) return { title: 'Perfect Match! 💝', subtitle: 'Your hearts are beating in sync.' };
        if (percentage >= 75) return { title: 'Amazing! 🌟', subtitle: "You know each other so well!" };
        if (percentage >= 50) return { title: 'Close Call! 😊', subtitle: 'Pretty good, keep learning!' };
        return { title: 'Keep Trying! 💪', subtitle: "There's always more to discover!" };
    };

    const message = getMessage();

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
                    <MaterialIcons name="close" size={24} color="#6B7280" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Results</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Score Card */}
                <Animated.View style={[styles.scoreCard, scoreAnimStyle]}>
                    <Text style={styles.scoreTitle}>{message.title}</Text>
                    <Text style={styles.scoreSubtitle}>{message.subtitle}</Text>

                    {!isPurePoll && (
                        <View style={styles.circleContainer}>
                            <AnimatedCircularProgress
                                size={160}
                                width={12}
                                fill={percentage}
                                tintColor="#A31645"
                                backgroundColor="#FDE2E8"
                                rotation={0}
                                lineCap="round"
                                duration={1500}
                                delay={500}
                            >
                                {() => (
                                    <View style={styles.circleInner}>
                                        <Text style={styles.scoreNumber}>
                                            {correctCount}/{gradedQuestions}
                                        </Text>
                                        <Text style={styles.scoreLabel}>correct</Text>
                                    </View>
                                )}
                            </AnimatedCircularProgress>
                        </View>
                    )}
                </Animated.View>

                {/* Question Breakdown */}
                <Text style={styles.breakdownTitle}>Question Breakdown</Text>

                {quiz.quiz_questions.map((question, qIndex) => {
                    const response = quiz.quiz_responses.find(
                        (r) => r.question_id === question.id
                    );
                    const isOptional = question.correct_option_index === -1;
                    const isCorrect = response?.is_correct ?? false;

                    return (
                        <Animated.View
                            key={question.id}
                            entering={FadeInDown.delay(qIndex * 100)
                                .springify()
                                .damping(18)}
                            style={[
                                styles.breakdownCard,
                                {
                                    borderLeftColor: isOptional
                                        ? '#A855F7'
                                        : isCorrect
                                        ? '#16A34A'
                                        : '#EF4444',
                                },
                            ]}
                        >
                            <View style={styles.breakdownHeader}>
                                <View
                                    style={[
                                        styles.breakdownIcon,
                                        {
                                            backgroundColor: isOptional
                                                ? '#F3E8FF'
                                                : isCorrect
                                                ? '#DCFCE7'
                                                : '#FEE2E2',
                                        },
                                    ]}
                                >
                                    <MaterialIcons
                                        name={isOptional ? 'favorite' : isCorrect ? 'check' : 'close'}
                                        size={16}
                                        color={isOptional ? '#A855F7' : isCorrect ? '#16A34A' : '#EF4444'}
                                    />
                                </View>
                                <Text style={styles.breakdownQText} numberOfLines={2}>
                                    {question.question_text}
                                </Text>
                            </View>

                            <View style={styles.answersRow}>
                                {/* Their answer */}
                                <View style={styles.answerBlock}>
                                    <Text style={styles.answerLabel}>
                                        {isOptional ? 'THEIR ANSWER' : isCorrect ? 'YOU GUESSED RIGHT' : 'YOUR ANSWER'}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.answerText,
                                            { color: isOptional ? '#A855F7' : isCorrect ? '#16A34A' : '#EF4444' },
                                        ]}
                                    >
                                        {response
                                            ? question.options[response.selected_option_index]
                                            : 'No answer'}
                                    </Text>
                                </View>

                                {/* Correct answer (only if wrong and not optional) */}
                                {!isCorrect && !isOptional && (
                                    <View style={styles.answerBlock}>
                                        <Text style={styles.answerLabel}>CORRECT ANSWER</Text>
                                        <Text
                                            style={[styles.answerText, { color: '#16A34A' }]}
                                        >
                                            {question.options[question.correct_option_index]}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </Animated.View>
                    );
                })}
            </ScrollView>

            {/* Bottom Action */}
            <View style={styles.bottomBar}>
                <TouchableOpacity
                    onPress={() => router.replace('/(tabs)/quiz')}
                    style={styles.doneBtn}
                >
                    <Text style={styles.doneBtnText}>Back to Quizzes</Text>
                </TouchableOpacity>
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
    },
    errorText: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 18,
        color: '#374151',
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
    headerTitle: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 18,
        color: '#111827',
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingBottom: 120,
    },
    scoreCard: {
        backgroundColor: 'rgba(255,255,255,0.65)',
        borderRadius: 32,
        padding: 32,
        alignItems: 'center',
        marginBottom: 32,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.8)',
        boxShadow: '0px 1px 4px 1px rgba(0,0,0,0.15),inset 0px 4px 4px 0px rgba(255,255,255,0.50),inset 0px -4px 4px 0px rgba(0,0,0,0.06)',
    },
    scoreTitle: {
        fontFamily: 'PlusJakartaSans_800ExtraBold',
        fontSize: 30,
        color: '#111827',
        textAlign: 'center',
        marginBottom: 6,
    },
    scoreSubtitle: {
        fontFamily: 'PlusJakartaSans_500Medium',
        fontSize: 15,
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 28,
    },
    circleContainer: {
        alignItems: 'center',
    },
    circleInner: {
        alignItems: 'center',
    },
    scoreNumber: {
        fontFamily: 'PlusJakartaSans_800ExtraBold',
        fontSize: 36,
        color: '#A31645',
    },
    scoreLabel: {
        fontFamily: 'PlusJakartaSans_500Medium',
        fontSize: 14,
        color: '#9CA3AF',
        marginTop: 2,
    },
    breakdownTitle: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 18,
        color: '#111827',
        marginBottom: 16,
    },
    breakdownCard: {
        backgroundColor: 'rgba(255,255,255,0.65)',
        borderRadius: 32,
        padding: 24,
        marginBottom: 12,
        borderLeftWidth: 6,
        borderRightWidth: 1,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: 'rgba(255,255,255,0.8)',
        boxShadow: '0px 1px 4px 1px rgba(0,0,0,0.15),inset 0px 4px 4px 0px rgba(255,255,255,0.50),inset 0px -4px 4px 0px rgba(0,0,0,0.06)',
    },
    breakdownHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 12,
    },
    breakdownIcon: {
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    breakdownQText: {
        flex: 1,
        fontFamily: 'PlusJakartaSans_600SemiBold',
        fontSize: 14,
        color: '#374151',
        lineHeight: 20,
    },
    answersRow: {
        gap: 10,
    },
    answerBlock: {
        backgroundColor: '#FAFAFA',
        borderRadius: 12,
        padding: 12,
    },
    answerLabel: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 10,
        color: '#9CA3AF',
        letterSpacing: 1,
        marginBottom: 4,
    },
    answerText: {
        fontFamily: 'PlusJakartaSans_600SemiBold',
        fontSize: 14,
    },
    bottomBar: {
        paddingHorizontal: 24,
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    doneBtn: {
        backgroundColor: '#A31645',
        borderRadius: 20,
        paddingVertical: 18,
        alignItems: 'center',
    },
    doneBtnText: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 16,
        color: '#FFF',
    },
});
