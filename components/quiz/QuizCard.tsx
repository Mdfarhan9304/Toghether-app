import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { Quiz } from '../../store/quizStore';

const CATEGORY_CONFIG: Record<
    string,
    { icon: keyof typeof MaterialIcons.glyphMap; color: string; bg: string }
> = {
    romance: { icon: 'favorite', color: '#E11D48', bg: '#FFF1F2' },
    future: { icon: 'explore', color: '#7C3AED', bg: '#F3E8FF' },
    fun: { icon: 'celebration', color: '#F59E0B', bg: '#FEF3C7' },
    custom: { icon: 'edit', color: '#3B82F6', bg: '#EFF6FF' },
};

const STATUS_CONFIG: Record<
    string,
    { label: string; color: string; bg: string }
> = {
    pending: { label: 'Pending', color: '#F59E0B', bg: '#FEF3C7' },
    accepted: { label: 'In Progress', color: '#3B82F6', bg: '#EFF6FF' },
    completed: { label: 'Completed', color: '#16A34A', bg: '#DCFCE7' },
};

interface QuizCardProps {
    quiz: Quiz;
    type: 'received' | 'sent';
    onPress: () => void;
}

export default function QuizCard({ quiz, type, onPress }: QuizCardProps) {
    const cat = CATEGORY_CONFIG[quiz.category.toLowerCase()] || CATEGORY_CONFIG.custom;
    const status = STATUS_CONFIG[quiz.status] || STATUS_CONFIG.pending;
    const questionCount = quiz.quiz_questions?.length || 0;
    const partnerName =
        type === 'received'
            ? (quiz.creator as any)?.full_name || 'Partner'
            : (quiz.recipient as any)?.full_name || 'Partner';

    return (
        <TouchableOpacity
            activeOpacity={0.85}
            onPress={onPress}
            style={styles.card}
        >
            {/* Category Icon */}
            <View style={[styles.iconCircle, { backgroundColor: cat.bg }]}>
                <MaterialIcons name={cat.icon} size={22} color={cat.color} />
            </View>

            {/* Content */}
            <View style={styles.content}>
                <View style={styles.topRow}>
                    <Text style={styles.category}>
                        {quiz.category.charAt(0).toUpperCase() + quiz.category.slice(1)}
                    </Text>
                    <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
                        <Text style={[styles.statusText, { color: status.color }]}>
                            {status.label}
                        </Text>
                    </View>
                </View>

                <Text style={styles.subtitle}>
                    {type === 'received' ? `From ${partnerName}` : `Sent to ${partnerName}`}
                    {' · '}
                    {questionCount} question{questionCount !== 1 ? 's' : ''}
                </Text>

                {quiz.status === 'completed' && quiz.score !== null && (
                    <Text style={styles.scoreText}>
                        Score: {quiz.score}/{questionCount} 🎯
                    </Text>
                )}
            </View>

            {/* Chevron */}
            <MaterialIcons name="chevron-right" size={24} color="#D1D5DB" />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        marginBottom: 12,
    },
    iconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        flex: 1,
    },
    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    category: {
        fontSize: 16,
        fontFamily: 'PlusJakartaSans_700Bold',
        color: '#111827',
    },
    statusBadge: {
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 3,
    },
    statusText: {
        fontSize: 11,
        fontFamily: 'PlusJakartaSans_700Bold',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    subtitle: {
        fontSize: 13,
        fontFamily: 'PlusJakartaSans_500Medium',
        color: '#6B7280',
    },
    scoreText: {
        fontSize: 13,
        fontFamily: 'PlusJakartaSans_700Bold',
        color: '#A31645',
        marginTop: 4,
    },
});
