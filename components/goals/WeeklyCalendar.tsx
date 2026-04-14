import React from 'react';
import { Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import type { DailyEntry } from '../../store/goalStore';

interface WeeklyCalendarProps {
    entries: DailyEntry[];
    userId: string;
    partnerId: string | null;
}

function getDayLabel(dateStr: string): string {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { weekday: 'narrow' });
}

function getDayNumber(dateStr: string): string {
    return new Date(dateStr + 'T00:00:00').getDate().toString();
}

function getLast7Days(): string[] {
    const days: string[] = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        days.push(d.toISOString().split('T')[0]);
    }
    return days;
}

type DayStatus = 'both' | 'user' | 'partner' | 'none';

function getDayStatus(
    dateStr: string,
    entries: DailyEntry[],
    userId: string,
    partnerId: string | null
): DayStatus {
    const dayEntries = entries.filter(e => e.entry_date === dateStr);
    const userDone = dayEntries.some(e => e.user_id === userId && e.completed);
    const partnerDone = partnerId
        ? dayEntries.some(e => e.user_id === partnerId && e.completed)
        : false;

    if (userDone && partnerDone) return 'both';
    if (userDone) return 'user';
    if (partnerDone) return 'partner';
    return 'none';
}

const STATUS_COLORS: Record<DayStatus, { bg: string; text: string; border: string }> = {
    both: { bg: '#A31645', text: '#FFFFFF', border: '#A31645' },
    user: { bg: '#FFF0F3', text: '#A31645', border: '#F472B6' },
    partner: { bg: '#FCE4EC', text: '#E11D48', border: '#F472B6' },
    none: { bg: '#F4F4F5', text: '#A1A1AA', border: '#E4E4E7' },
};

export function WeeklyCalendar({ entries, userId, partnerId }: WeeklyCalendarProps) {
    const days = getLast7Days();
    const todayStr = new Date().toISOString().split('T')[0];

    return (
        <Animated.View entering={FadeInDown.delay(400).duration(400)}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <Text style={{ fontSize: 16 }}>📅</Text>
                <Text style={{
                    fontFamily: 'PlusJakartaSans_700Bold',
                    fontSize: 16, color: '#09090B',
                }}>
                    This Week
                </Text>
            </View>

            <View style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 20,
                padding: 16,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.04,
                shadowRadius: 12,
                elevation: 2,
            }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    {days.map(dateStr => {
                        const status = getDayStatus(dateStr, entries, userId, partnerId);
                        const colors = STATUS_COLORS[status];
                        const isToday = dateStr === todayStr;

                        return (
                            <View key={dateStr} style={{ alignItems: 'center', gap: 6 }}>
                                <Text style={{
                                    fontFamily: 'PlusJakartaSans_500Medium',
                                    fontSize: 11,
                                    color: isToday ? '#E11D48' : '#A1A1AA',
                                }}>
                                    {getDayLabel(dateStr)}
                                </Text>
                                <View style={{
                                    width: 38, height: 38,
                                    borderRadius: 12,
                                    backgroundColor: colors.bg,
                                    borderWidth: isToday ? 2 : 1,
                                    borderColor: isToday ? '#E11D48' : colors.border,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    <Text style={{
                                        fontFamily: 'PlusJakartaSans_700Bold',
                                        fontSize: 14,
                                        color: colors.text,
                                    }}>
                                        {getDayNumber(dateStr)}
                                    </Text>
                                </View>
                                {/* Status dot */}
                                <View style={{
                                    width: 6, height: 6, borderRadius: 3,
                                    backgroundColor: status === 'both' ? '#A31645'
                                        : status === 'user' || status === 'partner' ? '#F472B6'
                                        : '#E4E4E7',
                                }} />
                            </View>
                        );
                    })}
                </View>

                {/* Legend */}
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    gap: 16,
                    marginTop: 14,
                    paddingTop: 12,
                    borderTopWidth: 1,
                    borderTopColor: '#F4F4F5',
                }}>
                    {[
                        { color: '#A31645', label: 'Both' },
                        { color: '#F472B6', label: 'One' },
                        { color: '#E4E4E7', label: 'None' },
                    ].map(item => (
                        <View key={item.label} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                            <View style={{
                                width: 8, height: 8, borderRadius: 4,
                                backgroundColor: item.color,
                            }} />
                            <Text style={{
                                fontFamily: 'PlusJakartaSans_400Regular',
                                fontSize: 11, color: '#A1A1AA',
                            }}>
                                {item.label}
                            </Text>
                        </View>
                    ))}
                </View>
            </View>
        </Animated.View>
    );
}
