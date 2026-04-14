import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useCallback } from 'react';
import { ScrollView, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import { ActiveGoalsSection } from '../../components/home/ActiveGoalsSection';
import { HomeHeader } from '../../components/home/HomeHeader';
import { QuickStatsRow } from '../../components/home/QuickStatsRow';
import { ScoreCard } from '../../components/home/ScoreCard';
import { useGoalStore } from '../../store/goalStore';

export default function HomeScreen() {
  const router = useRouter();
  const {
    goals, isLoading, fetchGoals,
    toggleFavorite, deleteGoal,
    userProfile, partnerProfile, globalStreak,
  } = useGoalStore();

  useFocusEffect(
    useCallback(() => {
      fetchGoals();
    }, [])
  );

  const handleToggleFavorite = async (goalId: string, currentlyLiked: boolean) => {
    await toggleFavorite(goalId, currentlyLiked);
  };

  const handleDeleteGoal = async (goalId: string) => {
    await deleteGoal(goalId);
  };

  const handleCompleteGoal = async (goalId: string) => {
    // For the new system, completing is done via daily entries on the goal detail screen
    // Navigate there instead
    router.push({ pathname: '/goal-detail', params: { id: goalId } });
  };

  const mappedGoals = goals.map(g => {
    let iconName: any = 'emoji-events';
    let iconBgColor = '#F4F4F5';
    let iconColor = '#71717A';

    switch (g.category) {
      case 'Finance': iconName = 'diamond'; iconColor = '#16A34A'; iconBgColor = '#ECFDF5'; break;
      case 'Travel': iconName = 'flight-takeoff'; iconColor = '#3B82F6'; iconBgColor = '#EFF6FF'; break;
      case 'Health': iconName = 'favorite'; iconColor = '#E11D48'; iconBgColor = '#FFF1F2'; break;
      case 'Fitness': iconName = 'fitness-center'; iconColor = '#F59E0B'; iconBgColor = '#FFFBEB'; break;
      case 'Home': iconName = 'home'; iconColor = '#8B5CF6'; iconBgColor = '#F5F3FF'; break;
      case 'Knowledge': iconName = 'menu-book'; iconColor = '#06B6D4'; iconBgColor = '#ECFEFF'; break;
      case 'Milestone': iconName = 'emoji-events'; iconColor = '#EC4899'; iconBgColor = '#FDF2F8'; break;
    }

    // Today's entries for couple status
    const myDone = g.todayMyEntry?.completed || false;
    const partnerDone = g.todayPartnerEntry?.completed || false;

    // Build subtitle
    const trackingEmoji = g.tracking_type === 'boolean' ? '✅'
      : g.tracking_type === 'number' ? '🔢'
      : g.tracking_type === 'amount' ? '💰'
      : '📊';

    let subtitle = `${g.category} • ${trackingEmoji} ${g.tracking_type || 'amount'}`;
    if (g.target_date) {
      subtitle += ` • ${new Date(g.target_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    }

    // Progress for amount/number goals with target
    const target = g.target_value || g.target_amount;
    const current = g.current_amount || 0;
    const progressVal = target ? Math.min(current / target, 1) : undefined;

    // Left label based on today's status
    let leftLabel = '';
    let leftLabelColor = iconColor;
    if (g.goal_type === 'Individual') {
      if (myDone) {
        leftLabel = '✅ Completed today';
        leftLabelColor = '#A31645';
      } else {
        leftLabel = '⏳ Not completed yet';
        leftLabelColor = '#A1A1AA';
      }
    } else if (myDone && partnerDone) {
      leftLabel = '🎉 Both done today';
      leftLabelColor = '#A31645';
    } else if (myDone) {
      leftLabel = '✅ You\'re done, waiting...';
      leftLabelColor = '#C4175C';
    } else if (partnerDone) {
      leftLabel = '👤 Partner done, your turn!';
      leftLabelColor = '#E11D48';
    } else {
      leftLabel = '⏳ Neither completed today';
      leftLabelColor = '#A1A1AA';
    }

    // Badge for shared/individual
    const badge = g.goal_type === 'Shared' ? '💕 Shared' : undefined;

    return {
      id: g.id,
      title: g.name,
      subtitle,
      icon: iconName,
      iconColor,
      iconBgColor,
      liked: g.is_favorite || false,
      image: g.image_url || undefined,
      progress: progressVal,
      progressColor: iconColor,
      onToggleFavorite: handleToggleFavorite,
      onComplete: handleCompleteGoal,
      onDelete: handleDeleteGoal,
      onPress: () => {
        router.push({ pathname: '/goal-detail', params: { id: g.id } });
      },
      isCompleted: g.is_completed || false,
      leftLabel,
      leftLabelColor,
      badge,
      badgeColor: '#EC4899',
    };
  });

  const getHeaderNames = () => {
    if (userProfile && partnerProfile) {
      const myName = userProfile.full_name?.split(' ')[0] || 'User';
      const partnerName = partnerProfile.full_name?.split(' ')[0] || 'Partner';
      return `Hi, ${myName} & ${partnerName}!`;
    }
    if (userProfile) {
      const myName = userProfile.full_name?.split(' ')[0] || 'User';
      return `Hi, ${myName}!`;
    }
    return undefined;
  };

  // Compute real stats from goals
  const activeGoals = goals.filter(g => !g.is_completed).length;
  const totalSaved = goals
    .filter(g => g.tracking_type === 'amount' || g.category === 'Finance')
    .reduce((sum, g) => sum + (g.current_amount || 0), 0);
  const currencySymbol = goals.find(g => g.currency)?.currency === 'INR' ? '₹'
    : goals.find(g => g.currency)?.currency === 'EUR' ? '€'
    : goals.find(g => g.currency)?.currency === 'GBP' ? '£'
    : '$';

  // Count streak - days where both partners have at least one completed goal
  const todayBothDone = goals.some(g => g.todayMyEntry?.completed && g.todayPartnerEntry?.completed);

  return (
    <View className="flex-1 relative">
      <StatusBar style="light" />

      {/* Gradient Background */}
      <LinearGradient
        colors={['#A31645', '#C4175C', '#F9FAFB']}
        locations={[0, 0.3, 0.6]}
        style={{ position: 'absolute', width: '100%', height: '100%' }}
      />

      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <HomeHeader names={getHeaderNames()} />
          <ScoreCard />
          <QuickStatsRow
            streakDays={globalStreak}
            numGoals={activeGoals}
            totalSaved={`${currencySymbol}${totalSaved.toLocaleString()}`}
          />
          {isLoading ? (
             <ActivityIndicator size="large" color="#A31645" style={{ marginTop: 20 }} />
          ) : (
             <ActiveGoalsSection goals={mappedGoals} />
          )}
        </ScrollView>

        {/* ─── Floating Action Button ─── */}
        <TouchableOpacity
          onPress={() => router.push('/add-goal')}
          style={{
            position: 'absolute',
            bottom: 24,
            right: 24,
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: '#A31645',
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#A31645',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.35,
            shadowRadius: 12,
            elevation: 8,
            boxShadow: '0px 2px 4px 0px rgba(0,0,0,0.15),inset 0px 4px 4px 0px rgba(255,255,255,0.50),inset 0px -4px 4px 0px rgba(0,0,0,0.15)',
          } as any}
        >
          <MaterialIcons name="add" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}
