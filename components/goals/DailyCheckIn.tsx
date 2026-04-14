import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import type { DailyEntry, GoalWithEntries, TrackingType } from '../../store/goalStore';

interface DailyCheckInProps {
    goal: GoalWithEntries;
    myEntry?: DailyEntry;
    partnerEntry?: DailyEntry;
    userName: string;
    partnerName: string;
    onSubmit: (data: { completed?: boolean; value?: number }) => void;
    isSubmitting?: boolean;
    isShared?: boolean;
}

function getTrackingLabel(type: TrackingType, unit?: string | null): string {
    switch (type) {
        case 'boolean': return 'Mark Complete';
        case 'number': return unit || 'Value';
        case 'amount': return 'Amount';
        case 'progress': return 'Progress %';
        default: return 'Value';
    }
}

function EntryCard({
    label,
    entry,
    goal,
    isMe,
    onToggle,
    onValueChange,
    editValue,
    color,
}: {
    label: string;
    entry?: DailyEntry;
    goal: GoalWithEntries;
    isMe: boolean;
    onToggle?: () => void;
    onValueChange?: (val: string) => void;
    editValue?: string;
    color: string;
}) {
    const tracking = goal.tracking_type || 'amount';
    const isDone = entry?.completed || false;
    const entryVal = entry?.value;

    const getDisplayValue = () => {
        if (tracking === 'boolean') return isDone ? 'Done ✅' : 'Not yet';
        if (entryVal !== null && entryVal !== undefined) {
            if (tracking === 'amount') return `${goal.currency || '$'}${entryVal}`;
            if (tracking === 'progress') return `${entryVal}%`;
            return `${entryVal} ${goal.unit || ''}`.trim();
        }
        return '—';
    };

    return (
        <Animated.View
            entering={FadeInDown.delay(isMe ? 0 : 100).duration(400)}
            style={{
                flex: 1,
                backgroundColor: isDone ? `${color}08` : '#FFFFFF',
                borderRadius: 18,
                padding: 16,
                borderWidth: 1.5,
                borderColor: isDone ? color : '#E4E4E7',
            }}
        >
            {/* Avatar + Name */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <View style={{
                    width: 28, height: 28, borderRadius: 14,
                    backgroundColor: isMe ? '#FFF0F3' : '#EFF6FF',
                    alignItems: 'center', justifyContent: 'center',
                }}>
                    <MaterialIcons
                        name={isMe ? 'person' : 'favorite'}
                        size={14}
                        color={isMe ? '#E11D48' : '#3B82F6'}
                    />
                </View>
                <Text style={{
                    fontFamily: 'PlusJakartaSans_700Bold',
                    fontSize: 13, color: '#09090B',
                }}>
                    {label}
                </Text>
                {isDone && (
                    <View style={{
                        marginLeft: 'auto',
                        width: 20, height: 20, borderRadius: 10,
                        backgroundColor: color,
                        alignItems: 'center', justifyContent: 'center',
                    }}>
                        <MaterialIcons name="check" size={14} color="#FFF" />
                    </View>
                )}
            </View>

            {/* Input / Display */}
            {isMe ? (
                tracking === 'boolean' ? (
                    <TouchableOpacity
                        onPress={onToggle}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingVertical: 14,
                            borderRadius: 14,
                            backgroundColor: isDone ? color : '#F4F4F5',
                            gap: 8,
                        }}
                    >
                        <MaterialIcons
                            name={isDone ? 'check-circle' : 'radio-button-unchecked'}
                            size={22}
                            color={isDone ? '#FFFFFF' : '#A1A1AA'}
                        />
                        <Text style={{
                            fontFamily: 'PlusJakartaSans_700Bold',
                            fontSize: 15,
                            color: isDone ? '#FFFFFF' : '#71717A',
                        }}>
                            {isDone ? 'Completed!' : 'Mark as Done'}
                        </Text>
                    </TouchableOpacity>
                ) : (
                    <View>
                        <Text style={{
                            fontFamily: 'PlusJakartaSans_500Medium',
                            fontSize: 11, color: '#A1A1AA',
                            marginBottom: 6, letterSpacing: 0.5,
                        }}>
                            {getTrackingLabel(tracking, goal.unit).toUpperCase()}
                        </Text>
                        <TextInput
                            value={editValue || ''}
                            onChangeText={onValueChange}
                            keyboardType="numeric"
                            placeholder="Enter value"
                            placeholderTextColor="#D4D4D8"
                            style={{
                                fontFamily: 'PlusJakartaSans_700Bold',
                                fontSize: 22,
                                color: '#09090B',
                                backgroundColor: '#F4F4F5',
                                borderRadius: 12,
                                paddingHorizontal: 14,
                                paddingVertical: 12,
                            }}
                        />
                    </View>
                )
            ) : (
                <View style={{
                    paddingVertical: 14,
                    borderRadius: 14,
                    backgroundColor: '#F4F4F5',
                    alignItems: 'center',
                }}>
                    <Text style={{
                        fontFamily: 'PlusJakartaSans_700Bold',
                        fontSize: 18,
                        color: isDone ? '#09090B' : '#D4D4D8',
                    }}>
                        {getDisplayValue()}
                    </Text>
                </View>
            )}
        </Animated.View>
    );
}

export function DailyCheckIn({
    goal,
    myEntry,
    partnerEntry,
    userName,
    partnerName,
    onSubmit,
    isSubmitting,
    isShared,
}: DailyCheckInProps) {
    const tracking = goal.tracking_type || 'amount';
    const [editValue, setEditValue] = useState(
        myEntry?.value?.toString() || ''
    );

    const handleToggle = () => {
        const newState = !(myEntry?.completed);
        onSubmit({ completed: newState, value: myEntry?.value ?? undefined });
    };

    const handleSaveValue = () => {
        const num = parseFloat(editValue);
        if (isNaN(num)) return;
        const isComplete = goal.target_value ? num >= goal.target_value : num > 0;
        onSubmit({ completed: isComplete, value: num });
    };

    const color = '#A31645';

    return (
        <View style={{ marginBottom: 20 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <MaterialIcons name="today" size={18} color="#E11D48" />
                <Text style={{
                    fontFamily: 'PlusJakartaSans_700Bold',
                    fontSize: 16, color: '#09090B',
                }}>
                    Today's Check-In
                </Text>
            </View>

            <View style={{ flexDirection: 'row', gap: 10 }}>
                <EntryCard
                    label={userName}
                    entry={myEntry}
                    goal={goal}
                    isMe={true}
                    onToggle={handleToggle}
                    onValueChange={setEditValue}
                    editValue={editValue}
                    color={color}
                />
                {isShared && (
                    <EntryCard
                        label={partnerName}
                        entry={partnerEntry}
                        goal={goal}
                        isMe={false}
                        color="#E11D48"
                    />
                )}
            </View>

            {/* Save button for non-boolean goals */}
            {tracking !== 'boolean' && (
                <TouchableOpacity
                    onPress={handleSaveValue}
                    disabled={isSubmitting}
                    style={{
                        marginTop: 12,
                        backgroundColor: '#A31645',
                        borderRadius: 16,
                        paddingVertical: 14,
                        alignItems: 'center',
                        opacity: isSubmitting ? 0.7 : 1,
                    }}
                >
                    <Text style={{
                        fontFamily: 'PlusJakartaSans_700Bold',
                        fontSize: 15, color: '#FFFFFF',
                    }}>
                        {isSubmitting ? 'Saving...' : 'Save Today\'s Entry'}
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
}
