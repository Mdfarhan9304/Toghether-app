import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useCallback } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { DailyCheckIn } from '../components/goals/DailyCheckIn';
import { CoupleStatusBanner } from '../components/goals/CoupleStatusBanner';
import { ProgressSection } from '../components/goals/ProgressSection';
import { WeeklyCalendar } from '../components/goals/WeeklyCalendar';
import { useGoalStore, type GoalWithEntries, type DailyEntry } from '../store/goalStore';

const CATEGORY_CONFIG: Record<string, { icon: keyof typeof MaterialIcons.glyphMap; color: string; bg: string }> = {
    Finance: { icon: 'diamond', color: '#16A34A', bg: '#ECFDF5' },
    Travel: { icon: 'flight-takeoff', color: '#3B82F6', bg: '#EFF6FF' },
    Health: { icon: 'favorite', color: '#E11D48', bg: '#FFF1F2' },
    Fitness: { icon: 'fitness-center', color: '#F59E0B', bg: '#FFFBEB' },
    Home: { icon: 'home', color: '#8B5CF6', bg: '#F5F3FF' },
    Knowledge: { icon: 'menu-book', color: '#06B6D4', bg: '#ECFEFF' },
    Milestone: { icon: 'emoji-events', color: '#EC4899', bg: '#FDF2F8' },
};

// Brand colors
const BRAND_GRADIENT: [string, string, string] = ['#A31645', '#C4175C', '#F9FAFB'];

function getTodayStr(): string {
    return new Date().toISOString().split('T')[0];
}

function getDaysBetween(start: string, end: string): number {
    const s = new Date(start);
    const e = new Date(end);
    return Math.max(Math.floor((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1, 1);
}

export default function GoalDetailScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();

    const {
        goals, userId, partnerId,
        userProfile, partnerProfile,
        fetchGoals, fetchEntriesForGoal, submitDailyEntry,
        allEntries, deleteGoal,
        getStreak, getCoupleStreak, getCompletionRate, getCoupleCompletionRate,
    } = useGoalStore();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const goal = goals.find(g => g.id === id);
    const entries = allEntries[id || ''] || [];

    useFocusEffect(
        useCallback(() => {
            const load = async () => {
                setIsLoading(true);
                await fetchGoals();
                if (id) await fetchEntriesForGoal(id);
                setIsLoading(false);
            };
            load();
        }, [id])
    );

    if (isLoading || !goal) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9FAFB' }}>
                <ActivityIndicator size="large" color="#A31645" />
            </View>
        );
    }

    const catConfig = CATEGORY_CONFIG[goal.category] || CATEGORY_CONFIG.Milestone;
    const userName = userProfile?.full_name?.split(' ')[0] || 'You';
    const partnerName = partnerProfile?.full_name?.split(' ')[0] || 'Partner';

    // Today's entries
    const today = getTodayStr();
    const myEntry = goal.todayMyEntry || entries.find(e => e.user_id === userId && e.entry_date === today);
    const partnerEntry = goal.todayPartnerEntry || entries.find(e => e.user_id === partnerId && e.entry_date === today);

    // Couple status
    const myDone = myEntry?.completed || false;
    const partnerDone = partnerEntry?.completed || false;
    const coupleStatus = myDone && partnerDone ? 'both'
        : myDone ? 'user_only'
        : partnerDone ? 'partner_only'
        : 'none';

    // Stats
    const totalDays = getDaysBetween(goal.created_at.split('T')[0], today);
    const myCompletionRate = getCompletionRate(goal.id);
    const partnerCompletionRate = getCompletionRate(goal.id, partnerId || undefined);
    const myStrk = getStreak(goal.id);
    const coupleStrk = getCoupleStreak(goal.id);

    // Both completed days
    const bothCompletedDays = (() => {
        if (!userId || !partnerId) return 0;
        const dates = new Set(entries.filter(e => e.user_id === userId && e.completed).map(e => e.entry_date));
        return entries.filter(e => e.user_id === partnerId && e.completed && dates.has(e.entry_date)).length;
    })();

    const handleSubmitEntry = async (data: { completed?: boolean; value?: number }) => {
        if (!id) return;
        setIsSubmitting(true);
        try {
            await submitDailyEntry(id, today, data);
        } catch (e) {
            Alert.alert('Error', 'Could not save your entry.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = () => {
        Alert.alert(
            'Delete Goal',
            'Are you sure? This will delete the goal and all daily entries.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        await deleteGoal(goal.id);
                        router.back();
                    },
                },
            ]
        );
    };

    const handleEdit = () => {
        router.push({
            pathname: '/add-goal',
            params: { goalStr: JSON.stringify(goal) },
        });
    };

    const trackingLabel = (() => {
        switch (goal.tracking_type) {
            case 'boolean': return '✅ Yes/No';
            case 'number': return `🔢 ${goal.unit || 'Number'}`;
            case 'amount': return `💰 ${goal.currency || '$'}`;
            case 'progress': return '📊 Progress';
            default: return '💰 Amount';
        }
    })();

    return (
        <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
            <StatusBar style="light" />

            {/* Header Gradient */}
            <LinearGradient
                colors={BRAND_GRADIENT}
                locations={[0, 0.4, 1]}
                style={{ position: 'absolute', width: '100%', height: 300 }}
            />

            <SafeAreaView edges={['top']} style={{ flex: 1 }}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 40 }}
                >
                    {/* ─── Top Bar ─── */}
                    <View style={{
                        flexDirection: 'row', alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingHorizontal: 20, paddingVertical: 12,
                    }}>
                        <TouchableOpacity
                            onPress={() => router.back()}
                            style={{
                                width: 40, height: 40, borderRadius: 14,
                                backgroundColor: 'rgba(255,255,255,0.2)',
                                alignItems: 'center', justifyContent: 'center',
                            }}
                        >
                            <MaterialIcons name="arrow-back" size={22} color="#FFFFFF" />
                        </TouchableOpacity>

                        <View style={{ flexDirection: 'row', gap: 8 }}>
                            <TouchableOpacity
                                onPress={handleEdit}
                                style={{
                                    width: 40, height: 40, borderRadius: 14,
                                    backgroundColor: 'rgba(255,255,255,0.2)',
                                    alignItems: 'center', justifyContent: 'center',
                                }}
                            >
                                <MaterialIcons name="edit" size={20} color="#FFFFFF" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleDelete}
                                style={{
                                    width: 40, height: 40, borderRadius: 14,
                                    backgroundColor: 'rgba(255,255,255,0.2)',
                                    alignItems: 'center', justifyContent: 'center',
                                }}
                            >
                                <MaterialIcons name="delete-outline" size={20} color="#FFFFFF" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* ─── Goal Header Card ─── */}
                    <Animated.View
                        entering={FadeInDown.duration(400)}
                        style={{ paddingHorizontal: 20, marginBottom: 20 }}
                    >
                        <View style={{
                            backgroundColor: 'rgba(255,255,255,0.18)',
                            borderRadius: 24, padding: 24,
                            borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)',
                        }}>
                            {/* Icon + Category + Type badges */}
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                                <View style={{
                                    width: 44, height: 44, borderRadius: 14,
                                    backgroundColor: catConfig.bg,
                                    alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <MaterialIcons name={catConfig.icon} size={22} color={catConfig.color} />
                                </View>
                                <View style={{
                                    backgroundColor: 'rgba(255,255,255,0.25)',
                                    paddingHorizontal: 12, paddingVertical: 5,
                                    borderRadius: 12,
                                }}>
                                    <Text style={{ fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 12, color: '#FFFFFF' }}>
                                        {goal.category}
                                    </Text>
                                </View>
                                <View style={{
                                    backgroundColor: 'rgba(255,255,255,0.25)',
                                    paddingHorizontal: 12, paddingVertical: 5,
                                    borderRadius: 12,
                                }}>
                                    <Text style={{ fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 12, color: '#FFFFFF' }}>
                                        {trackingLabel}
                                    </Text>
                                </View>
                            </View>

                            {/* Goal name */}
                            <Text style={{
                                fontFamily: 'PlusJakartaSans_800ExtraBold',
                                fontSize: 24, color: '#FFFFFF',
                                marginBottom: 6,
                            }}>
                                {goal.name}
                            </Text>

                            {/* Target info */}
                            {goal.target_value && (
                                <Text style={{
                                    fontFamily: 'PlusJakartaSans_500Medium',
                                    fontSize: 14, color: 'rgba(255,255,255,0.8)',
                                }}>
                                    Target: {goal.tracking_type === 'amount' ? `${goal.currency || '$'}${goal.target_value}` : goal.tracking_type === 'progress' ? '100%' : `${goal.target_value} ${goal.unit || ''}`}
                                    {goal.target_date ? ` by ${new Date(goal.target_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}` : ''}
                                </Text>
                            )}

                            {/* Streak badge */}
                            {coupleStrk > 0 && (
                                <View style={{
                                    flexDirection: 'row', alignItems: 'center',
                                    backgroundColor: 'rgba(255,255,255,0.2)',
                                    paddingHorizontal: 12, paddingVertical: 6,
                                    borderRadius: 14, gap: 6,
                                    alignSelf: 'flex-start', marginTop: 12,
                                }}>
                                    <Text style={{ fontSize: 16 }}>🔥</Text>
                                    <Text style={{
                                        fontFamily: 'PlusJakartaSans_700Bold',
                                        fontSize: 13, color: '#FFFFFF',
                                    }}>
                                        {coupleStrk} day couple streak
                                    </Text>
                                </View>
                            )}
                        </View>
                    </Animated.View>

                    {/* ─── Content Area ─── */}
                    <View style={{ paddingHorizontal: 20 }}>
                        {/* Couple Status Banner */}
                        {goal.goal_type === 'Shared' && (
                            <CoupleStatusBanner
                                status={coupleStatus}
                                userName={userName}
                                partnerName={partnerName}
                            />
                        )}

                        {/* Daily Check-In */}
                        <DailyCheckIn
                            goal={goal}
                            myEntry={myEntry}
                            partnerEntry={partnerEntry}
                            userName={userName}
                            partnerName={goal.goal_type === 'Shared' ? partnerName : ''}
                            onSubmit={handleSubmitEntry}
                            isSubmitting={isSubmitting}
                            isShared={goal.goal_type === 'Shared'}
                        />

                        {/* Progress Section */}
                        <ProgressSection
                            myCompletionRate={myCompletionRate}
                            partnerCompletionRate={goal.goal_type === 'Shared' ? partnerCompletionRate : 0}
                            coupleStreak={coupleStrk}
                            myStreak={myStrk}
                            totalDays={totalDays}
                            bothCompletedDays={bothCompletedDays}
                            userName={userName}
                            partnerName={goal.goal_type === 'Shared' ? partnerName : '—'}
                            isShared={goal.goal_type === 'Shared'}
                        />

                        {/* Weekly Calendar */}
                        <WeeklyCalendar
                            entries={entries}
                            userId={userId || ''}
                            partnerId={goal.goal_type === 'Shared' ? partnerId : null}
                        />

                        {/* Why It Matters */}
                        {goal.reason && (
                            <Animated.View
                                entering={FadeInDown.delay(500).duration(400)}
                                style={{ marginTop: 20 }}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                                    <MaterialIcons name="favorite" size={16} color="#E11D48" />
                                    <Text style={{
                                        fontFamily: 'PlusJakartaSans_700Bold',
                                        fontSize: 16, color: '#09090B',
                                    }}>
                                        Why This Matters
                                    </Text>
                                </View>
                                <View style={{
                                    backgroundColor: '#FFFFFF', borderRadius: 18,
                                    padding: 18,
                                    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.04, shadowRadius: 12, elevation: 2,
                                }}>
                                    <Text style={{
                                        fontFamily: 'PlusJakartaSans_400Regular',
                                        fontSize: 15, color: '#3F3F46',
                                        lineHeight: 24,
                                    }}>
                                        {goal.reason}
                                    </Text>
                                </View>
                            </Animated.View>
                        )}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
