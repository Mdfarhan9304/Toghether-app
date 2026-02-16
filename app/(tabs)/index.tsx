import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

/* ────────────────────────────────────────────
   Together Score circular gauge
   ──────────────────────────────────────────── */
function ScoreCircle({ score }: { score: number }) {
  const size = 72;
  const strokeWidth = 5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      {/* Background ring */}
      <View
        style={{
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: strokeWidth,
          borderColor: 'rgba(255,255,255,0.25)',
        }}
      />
      {/* Filled ring (approximate with a bordered circle + rotation trick) */}
      <View
        style={{
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: strokeWidth,
          borderColor: '#FFFFFF',
          borderTopColor: 'rgba(255,255,255,0.25)',
          transform: [{ rotate: '45deg' }],
        }}
      />
      {/* Inner white circle */}
      <View
        style={{
          width: size - strokeWidth * 4,
          height: size - strokeWidth * 4,
          borderRadius: (size - strokeWidth * 4) / 2,
          backgroundColor: '#FFFFFF',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text
          className="font-[PlusJakartaSans_800ExtraBold]"
          style={{ fontSize: 24, color: '#A31645', lineHeight: 28 }}
        >
          {score}
        </Text>
      </View>
    </View>
  );
}

/* ────────────────────────────────────────────
   Goal card component
   ──────────────────────────────────────────── */
interface GoalCardProps {
  image?: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
  iconBgColor?: string;
  iconColor?: string;
  title: string;
  subtitle: string;
  progress?: number; // 0–1
  progressColor?: string;
  leftLabel?: string;
  leftLabelColor?: string;
  rightLabel?: string;
  badge?: string;
  badgeColor?: string;
  liked?: boolean;
}

function GoalCard({
  image,
  icon,
  iconBgColor = '#F4F4F5',
  iconColor = '#71717A',
  title,
  subtitle,
  progress,
  progressColor = '#A31645',
  leftLabel,
  leftLabelColor = '#A31645',
  rightLabel,
  badge,
  badgeColor = '#16A34A',
  liked = false,
}: GoalCardProps) {
  return (
    <View
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 12,
        elevation: 2,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        {/* Thumbnail */}
        {image ? (
          <Image
            source={{ uri: image }}
            style={{ width: 52, height: 52, borderRadius: 14 }}
          />
        ) : icon ? (
          <View
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              backgroundColor: iconBgColor,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <MaterialIcons name={icon} size={24} color={iconColor} />
          </View>
        ) : null}

        {/* Content */}
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text
              className="font-[PlusJakartaSans_700Bold]"
              style={{ fontSize: 16, color: '#09090B' }}
            >
              {title}
            </Text>
            <MaterialIcons
              name={liked ? 'favorite' : 'favorite-border'}
              size={20}
              color={liked ? '#E11D48' : '#D4D4D8'}
            />
          </View>
          <Text
            className="font-[PlusJakartaSans_400Regular]"
            style={{ fontSize: 13, color: '#A1A1AA', marginTop: 2 }}
          >
            {subtitle}
          </Text>

          {/* Progress bar */}
          {progress !== undefined && (
            <View
              style={{
                height: 5,
                backgroundColor: '#F4F4F5',
                borderRadius: 3,
                marginTop: 10,
                overflow: 'hidden',
              }}
            >
              <View
                style={{
                  height: '100%',
                  width: `${Math.min(progress * 100, 100)}%`,
                  backgroundColor: progressColor,
                  borderRadius: 3,
                }}
              />
            </View>
          )}

          {/* Labels row */}
          {(leftLabel || rightLabel || badge) && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 6,
              }}
            >
              {leftLabel && (
                <Text
                  className="font-[PlusJakartaSans_500Medium]"
                  style={{ fontSize: 12, color: leftLabelColor }}
                >
                  {leftLabel}
                </Text>
              )}
              {badge && (
                <View
                  style={{
                    backgroundColor: badgeColor + '18',
                    paddingHorizontal: 10,
                    paddingVertical: 3,
                    borderRadius: 10,
                  }}
                >
                  <Text
                    className="font-[PlusJakartaSans_700Bold]"
                    style={{ fontSize: 11, color: badgeColor }}
                  >
                    {badge}
                  </Text>
                </View>
              )}
              {rightLabel && (
                <Text
                  className="font-[PlusJakartaSans_400Regular]"
                  style={{ fontSize: 12, color: '#A1A1AA' }}
                >
                  {rightLabel}
                </Text>
              )}
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

/* ────────────────────────────────────────────
   Home screen
   ──────────────────────────────────────────── */
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
          {/* ─── Header ─── */}
          <View
            style={{
              paddingHorizontal: 24,
              paddingTop: 12,
              paddingBottom: 20,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <View>
              <Text
                className="font-[PlusJakartaSans_700Bold]"
                style={{
                  fontSize: 11,
                  letterSpacing: 1.8,
                  color: '#E11D48',
                  marginBottom: 4,
                }}
              >
                WELCOME BACK
              </Text>
              <Text
                className="font-[PlusJakartaSans_800ExtraBold]"
                style={{ fontSize: 26, color: '#09090B', lineHeight: 32 }}
              >
                Hi, Sarah & Tom!
              </Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              {/* Couple avatars */}
              <View style={{ flexDirection: 'row' }}>
                <Image
                  source={{ uri: 'https://i.pravatar.cc/100?img=47' }}
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 19,
                    borderWidth: 2,
                    borderColor: '#FFFFFF',
                  }}
                />
                <Image
                  source={{ uri: 'https://i.pravatar.cc/100?img=12' }}
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 19,
                    borderWidth: 2,
                    borderColor: '#FFFFFF',
                    marginLeft: -12,
                  }}
                />
              </View>
              {/* Settings gear */}
              <TouchableOpacity>
                <MaterialIcons name="settings" size={24} color="#A1A1AA" />
              </TouchableOpacity>
            </View>
          </View>

          {/* ─── Together Score Card ─── */}
          <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
            <View
              style={{
                backgroundColor: '#C4175C',
                borderRadius: 24,
                padding: 24,
                overflow: 'hidden',
              }}
            >
              {/* Decorative circle accent (subtle) */}
              <View
                style={{
                  position: 'absolute',
                  top: -40,
                  right: -40,
                  width: 160,
                  height: 160,
                  borderRadius: 80,
                  backgroundColor: 'rgba(255,255,255,0.06)',
                }}
              />

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flex: 1, marginRight: 16 }}>
                  <Text
                    className="font-[PlusJakartaSans_700Bold]"
                    style={{ fontSize: 20, color: '#FFFFFF', marginBottom: 6 }}
                  >
                    Together Score
                  </Text>
                  <Text
                    className="font-[PlusJakartaSans_400Regular]"
                    style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', lineHeight: 20 }}
                  >
                    You're doing great,{'\n'}lovebirds! Keep it up.
                  </Text>
                </View>
                <ScoreCircle score={84} />
              </View>

              {/* Stats row */}
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 20,
                  gap: 10,
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    paddingHorizontal: 14,
                    paddingVertical: 8,
                    borderRadius: 20,
                    gap: 6,
                  }}
                >
                  <MaterialIcons name="trending-up" size={14} color="#FFFFFF" />
                  <Text
                    className="font-[PlusJakartaSans_500Medium]"
                    style={{ fontSize: 12, color: '#FFFFFF' }}
                  >
                    +2.4% this week
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    paddingHorizontal: 14,
                    paddingVertical: 8,
                    borderRadius: 20,
                    gap: 6,
                  }}
                >
                  <Text
                    className="font-[PlusJakartaSans_500Medium]"
                    style={{ fontSize: 12, color: '#FFFFFF' }}
                  >
                    Top 10% of couples
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* ─── Quick Stats Row ─── */}
          <View
            style={{
              flexDirection: 'row',
              paddingHorizontal: 20,
              gap: 12,
              marginBottom: 28,
            }}
          >
            {/* Love Streak */}
            <View
              style={{
                flex: 1,
                backgroundColor: '#FFFFFF',
                borderRadius: 20,
                padding: 18,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.04,
                shadowRadius: 12,
                elevation: 2,
              }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <Text
                  className="font-[PlusJakartaSans_500Medium]"
                  style={{ fontSize: 13, color: '#71717A' }}
                >
                  Love Streak
                </Text>
                <MaterialIcons name="favorite" size={18} color="#F43F5E" />
              </View>
              <Text
                className="font-[PlusJakartaSans_800ExtraBold]"
                style={{ fontSize: 28, color: '#09090B', lineHeight: 34 }}
              >
                12 Days
              </Text>
              <Text
                className="font-[PlusJakartaSans_400Regular]"
                style={{ fontSize: 12, color: '#A1A1AA', marginTop: 4 }}
              >
                Keep the flame alive!
              </Text>
            </View>

            {/* Total Saved */}
            <View
              style={{
                flex: 1,
                backgroundColor: '#FFFFFF',
                borderRadius: 20,
                padding: 18,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.04,
                shadowRadius: 12,
                elevation: 2,
              }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <Text
                  className="font-[PlusJakartaSans_500Medium]"
                  style={{ fontSize: 13, color: '#71717A' }}
                >
                  Total Saved
                </Text>
                <MaterialIcons name="diamond" size={18} color="#3B82F6" />
              </View>
              <Text
                className="font-[PlusJakartaSans_800ExtraBold]"
                style={{ fontSize: 28, color: '#09090B', lineHeight: 34 }}
              >
                $4,250
              </Text>
              <Text
                className="font-[PlusJakartaSans_400Regular]"
                style={{ fontSize: 12, color: '#A1A1AA', marginTop: 4 }}
              >
                across 3 goals
              </Text>
            </View>
          </View>

          {/* ─── Active Goals ─── */}
          <View style={{ paddingHorizontal: 20 }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 16,
              }}
            >
              <Text
                className="font-[PlusJakartaSans_800ExtraBold]"
                style={{ fontSize: 20, color: '#09090B' }}
              >
                Active Goals
              </Text>
              <TouchableOpacity>
                <Text
                  className="font-[PlusJakartaSans_700Bold]"
                  style={{ fontSize: 14, color: '#E11D48' }}
                >
                  View All
                </Text>
              </TouchableOpacity>
            </View>

            {/* Paris Trip */}
            <GoalCard
              image="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=120&h=120&fit=crop&crop=center"
              title="Paris Trip 2024"
              subtitle="Deadline: June 15"
              progress={0.6}
              progressColor="#E11D48"
              leftLabel="$1200 saved"
              leftLabelColor="#E11D48"
              rightLabel="$2000 goal"
              liked={true}
            />

            {/* Dream House */}
            <GoalCard
              icon="home"
              iconBgColor="#EFF6FF"
              iconColor="#3B82F6"
              title="Dream House"
              subtitle="Target: Late 2026"
              progress={0.15}
              progressColor="#3B82F6"
              leftLabel="15% Ready"
              leftLabelColor="#3B82F6"
              rightLabel="Long term"
              liked={false}
            />

            {/* Weekly Date Night */}
            <GoalCard
              icon="emoji-events"
              iconBgColor="#FFF1F2"
              iconColor="#E11D48"
              title="Weekly Date Night"
              subtitle="Every Friday"
              badge="Done this week!"
              badgeColor="#16A34A"
              liked={true}
            />
          </View>
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
          }}
        >
          <MaterialIcons name="add" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}
