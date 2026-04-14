import { MaterialIcons } from '@expo/vector-icons';
import { AudioModule, RecordingPresets, useAudioRecorder } from 'expo-audio';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Animated,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export type ExtractedGoal = {
    name: string;
    category: string;
    goal_type: 'Shared' | 'Individual';
    tracking_type: 'boolean' | 'number' | 'amount' | 'progress';
    target_value: number | null;
    target_date: string | null;
    unit: string | null;
    currency: string | null;
    reason: string;
    transcript: string;
};

type Props = {
    onGoalExtracted: (goal: ExtractedGoal) => void;
    onError?: (message: string) => void;
};

type RecordingState = 'idle' | 'recording' | 'processing';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export function VoiceRecorder({ onGoalExtracted, onError }: Props) {
    const [state, setState] = useState<RecordingState>('idle');
    const [recordingSeconds, setRecordingSeconds] = useState(0);
    const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);

    // Animated bar heights for sound wave visualizer
    const bars = useRef(Array.from({ length: 5 }, () => new Animated.Value(4))).current;
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const waveAnimRef = useRef<Animated.CompositeAnimation | null>(null);

    const startWaveAnimation = () => {
        const animations = bars.map((bar, i) => {
            const minH = 4;
            const maxH = 20 + Math.random() * 14;
            return Animated.loop(
                Animated.sequence([
                    Animated.timing(bar, {
                        toValue: maxH,
                        duration: 280 + i * 60,
                        useNativeDriver: false,
                    }),
                    Animated.timing(bar, {
                        toValue: minH,
                        duration: 280 + i * 60,
                        useNativeDriver: false,
                    }),
                ])
            );
        });
        waveAnimRef.current = Animated.parallel(animations);
        waveAnimRef.current.start();
    };

    const stopWaveAnimation = () => {
        waveAnimRef.current?.stop();
        bars.forEach(b => b.setValue(4));
    };

    const startRecording = async () => {
        try {
            const { status } = await AudioModule.requestRecordingPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert(
                    'Microphone Permission Required',
                    'Please allow microphone access in Settings to use Voice Goals.',
                    [{ text: 'OK' }]
                );
                return;
            }

            await AudioModule.setAudioModeAsync({
                allowsRecording: true,
                playsInSilentMode: true,
            });

            await recorder.prepareToRecordAsync();
            recorder.record();
            setState('recording');
            setRecordingSeconds(0);
            startWaveAnimation();

            timerRef.current = setInterval(() => {
                setRecordingSeconds(s => {
                    if (s >= 59) {
                        stopRecordingAndProcess();
                        return s;
                    }
                    return s + 1;
                });
            }, 1000);
        } catch (err) {
            console.error('Failed to start recording:', err);
            onError?.('Could not start recording. Please try again.');
        }
    };

    const stopRecordingAndProcess = async () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
        stopWaveAnimation();
        setState('processing');

        try {
            await recorder.stop();
            await AudioModule.setAudioModeAsync({ allowsRecording: false });

            const uri = recorder.uri;
            if (!uri) {
                onError?.('Recording failed. Please try again.');
                setState('idle');
                return;
            }

            // Use SUPABASE_ANON_KEY directly to avoid Invalid JWT errors caused by stale device sessions.
            const token = SUPABASE_ANON_KEY;

            const formData = new FormData();
            formData.append('file', {
                uri,
                name: 'audio.m4a',
                type: 'audio/m4a',
            } as any);

            console.log('Token:', token);
            console.log('Supabase URL:', SUPABASE_URL);

            // Call Supabase Edge Function
            const response = await fetch(
                `${SUPABASE_URL}/functions/v1/process-voice-goal`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'apikey': SUPABASE_ANON_KEY,
                    },
                    body: formData,
                }
            );

            console.log('Response status:', response.status);
            const text = await response.text();
            console.log('Raw response:', text);

            let result;
            try {
                result = JSON.parse(text);
            } catch (e) {
                throw new Error('Invalid JSON response from server.');
            }

            if (!response.ok || result.error) {
                throw new Error(result.error || 'Failed to process voice.');
            }

            if (result.goal) {
                onGoalExtracted(result.goal as ExtractedGoal);
            }
        } catch (err: any) {
            console.error('Voice processing error:', err);
            onError?.(err.message || 'Something went wrong. Please try again.');
            setState('idle');
        }
    };

    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            stopWaveAnimation();
        };
    }, []);

    const formatTime = (s: number) => {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${m}:${sec.toString().padStart(2, '0')}`;
    };

    if (state === 'processing') {
        return (
            <View style={{
                flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                backgroundColor: '#FFF0F3', borderRadius: 20,
                paddingVertical: 16, paddingHorizontal: 20, gap: 12,
                marginHorizontal: 24, marginBottom: 20,
                borderWidth: 1, borderColor: '#FCCDD9',
            }}>
                <ActivityIndicator size="small" color="#A31645" />
                <View>
                    <Text style={{ fontFamily: 'PlusJakartaSans_700Bold', fontSize: 14, color: '#A31645' }}>
                        Understanding your goal...
                    </Text>
                    <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 12, color: '#E11D48', marginTop: 2 }}>
                        AI is structuring your voice note
                    </Text>
                </View>
            </View>
        );
    }

    if (state === 'recording') {
        return (
            <View style={{
                marginHorizontal: 24, marginBottom: 20,
                backgroundColor: '#A31645', borderRadius: 20,
                paddingVertical: 16, paddingHorizontal: 20,
                flexDirection: 'row', alignItems: 'center', gap: 12,
            }}>
                {/* Waveform */}
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3, flex: 1 }}>
                    <View style={{
                        width: 10, height: 10, borderRadius: 5,
                        backgroundColor: '#FFFFFF',
                    }} />
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3, marginLeft: 8, flex: 1 }}>
                        {bars.map((bar, i) => (
                            <Animated.View
                                key={i}
                                style={{
                                    width: 4, height: bar, borderRadius: 2,
                                    backgroundColor: 'rgba(255,255,255,0.9)',
                                }}
                            />
                        ))}
                    </View>
                    <Text style={{
                        fontFamily: 'PlusJakartaSans_700Bold', fontSize: 14,
                        color: '#FFFFFF', marginLeft: 8,
                    }}>
                        {formatTime(recordingSeconds)}
                    </Text>
                </View>

                {/* Stop Button */}
                <TouchableOpacity
                    onPress={() => stopRecordingAndProcess()}
                    style={{
                        width: 44, height: 44, borderRadius: 22,
                        backgroundColor: '#FFFFFF',
                        alignItems: 'center', justifyContent: 'center',
                    }}
                >
                    <View style={{
                        width: 16, height: 16, borderRadius: 3,
                        backgroundColor: '#A31645',
                    }} />
                </TouchableOpacity>
            </View>
        );
    }

    // Idle state
    return (
        <TouchableOpacity
            onPress={startRecording}
            activeOpacity={0.85}
            style={{
                flexDirection: 'row', alignItems: 'center',
                backgroundColor: '#FFF0F3',
                borderRadius: 20, borderWidth: 1.5,
                borderColor: '#FCCDD9', borderStyle: 'dashed',
                paddingVertical: 14, paddingHorizontal: 20,
                marginHorizontal: 24, marginBottom: 20, gap: 12,
            }}
        >
            <View style={{
                width: 44, height: 44, borderRadius: 22,
                backgroundColor: '#A31645',
                alignItems: 'center', justifyContent: 'center',
                shadowColor: '#A31645', shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
            }}>
                <MaterialIcons name="mic" size={22} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: 'PlusJakartaSans_700Bold', fontSize: 14, color: '#09090B' }}>
                    Speak Your Goal ✨
                </Text>
                <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 12, color: '#71717A', marginTop: 2 }}>
                    Say it out loud — AI will fill the form for you
                </Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color="#D4D4D8" />
        </TouchableOpacity>
    );
}
