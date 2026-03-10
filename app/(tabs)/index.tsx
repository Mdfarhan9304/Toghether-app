import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ActiveGoalsSection } from '../../components/home/ActiveGoalsSection';
import { HomeHeader } from '../../components/home/HomeHeader';
import { QuickStatsRow } from '../../components/home/QuickStatsRow';
import { ScoreCard } from '../../components/home/ScoreCard';

const ACTIVE_GOALS = [
  {
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=120&h=120&fit=crop&crop=center',
    title: 'Paris Trip 2024',
    subtitle: 'Deadline: June 15',
    progress: 0.6,
    progressColor: '#E11D48',
    leftLabel: '$1200 saved',
    leftLabelColor: '#E11D48',
    rightLabel: '$2000 goal',
    liked: true,
  },
  {
    icon: 'home' as const,
    iconBgColor: '#EFF6FF',
    iconColor: '#3B82F6',
    title: 'Dream House',
    subtitle: 'Target: Late 2026',
    progress: 0.15,
    progressColor: '#3B82F6',
    leftLabel: '15% Ready',
    leftLabelColor: '#3B82F6',
    rightLabel: 'Long term',
    liked: false,
  },
  {
    icon: 'emoji-events' as const,
    iconBgColor: '#FFF1F2',
    iconColor: '#E11D48',
    title: 'Weekly Date Night',
    subtitle: 'Every Friday',
    badge: 'Done this week!',
    badgeColor: '#16A34A',
    liked: true,
  },
];

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View className="flex-1" style={{ backgroundColor: '#F9FAFB' }}>
      <StatusBar style="dark" />

      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <HomeHeader />
          <ScoreCard />
          <QuickStatsRow />
          <ActiveGoalsSection goals={ACTIVE_GOALS} />
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
