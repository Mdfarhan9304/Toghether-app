import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import type { TrackingType } from '../../store/goalStore';

const TRACKING_TYPES: {
    type: TrackingType;
    label: string;
    icon: keyof typeof MaterialIcons.glyphMap;
    desc: string;
    color: string;
    bg: string;
}[] = [
    { type: 'boolean', label: 'Yes / No', icon: 'check-circle', desc: 'Done or not done', color: '#16A34A', bg: '#ECFDF5' },
    { type: 'number', label: 'Number', icon: 'tag', desc: 'Steps, pages, hours...', color: '#3B82F6', bg: '#EFF6FF' },
    { type: 'amount', label: 'Amount', icon: 'attach-money', desc: 'Track money saved', color: '#F59E0B', bg: '#FFFBEB' },
    { type: 'progress', label: 'Progress', icon: 'show-chart', desc: 'Percentage milestone', color: '#8B5CF6', bg: '#F5F3FF' },
];

interface TrackingTypePickerProps {
    selected: TrackingType;
    onSelect: (type: TrackingType) => void;
}

export function TrackingTypePicker({ selected, onSelect }: TrackingTypePickerProps) {
    return (
        <View style={{ marginBottom: 24, paddingHorizontal: 24 }}>
            <Text
                style={{
                    fontFamily: 'PlusJakartaSans_700Bold',
                    fontSize: 12,
                    letterSpacing: 1.4,
                    color: '#71717A',
                    marginBottom: 12,
                }}
            >
                TRACKING TYPE
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                {TRACKING_TYPES.map(t => {
                    const isSelected = selected === t.type;
                    return (
                        <TouchableOpacity
                            key={t.type}
                            onPress={() => onSelect(t.type)}
                            activeOpacity={0.7}
                            style={{
                                width: '47%',
                                backgroundColor: isSelected ? '#A31645' : '#FFFFFF',
                                borderRadius: 16,
                                padding: 14,
                                borderWidth: isSelected ? 0 : 1,
                                borderColor: '#E4E4E7',
                                shadowColor: isSelected ? '#A31645' : '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: isSelected ? 0.25 : 0.04,
                                shadowRadius: 8,
                                elevation: isSelected ? 4 : 1,
                            }}
                        >
                            <View style={{
                                width: 36,
                                height: 36,
                                borderRadius: 10,
                                backgroundColor: isSelected ? 'rgba(255,255,255,0.25)' : t.bg,
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: 8,
                            }}>
                                <MaterialIcons
                                    name={t.icon}
                                    size={18}
                                    color={isSelected ? '#FFFFFF' : t.color}
                                />
                            </View>
                            <Text style={{
                                fontFamily: 'PlusJakartaSans_700Bold',
                                fontSize: 14,
                                color: isSelected ? '#FFFFFF' : '#09090B',
                                marginBottom: 2,
                            }}>
                                {t.label}
                            </Text>
                            <Text style={{
                                fontFamily: 'PlusJakartaSans_400Regular',
                                fontSize: 11,
                                color: isSelected ? 'rgba(255,255,255,0.8)' : '#A1A1AA',
                            }}>
                                {t.desc}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}
