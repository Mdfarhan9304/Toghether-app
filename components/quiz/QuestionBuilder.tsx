import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, {
    FadeInDown,
    FadeOutUp,
} from 'react-native-reanimated';

interface QuestionBuilderProps {
    questionNumber: number;
    initialQuestion?: string;
    initialOptions?: string[];
    initialCorrectIndex?: number;
    onSave: (data: {
        question_text: string;
        options: string[];
        correct_option_index: number;
    }) => void;
    onCancel?: () => void;
}

export default function QuestionBuilder({
    questionNumber,
    initialQuestion = '',
    initialOptions = ['', '', '', ''],
    initialCorrectIndex = -1,
    onSave,
    onCancel,
}: QuestionBuilderProps) {
    const [question, setQuestion] = useState(initialQuestion);
    const [options, setOptions] = useState<string[]>(
        initialOptions.length === 4 ? initialOptions : ['', '', '', '']
    );
    const [correctIndex, setCorrectIndex] = useState(initialCorrectIndex);

    const updateOption = (index: number, text: string) => {
        const newOptions = [...options];
        newOptions[index] = text;
        setOptions(newOptions);
    };

    const handleSave = () => {
        if (!question.trim()) {
            Alert.alert('Missing Question', 'Please enter a question.');
            return;
        }
        const filledOptions = options.filter((o) => o.trim());
        if (filledOptions.length < 4) {
            Alert.alert('Missing Options', 'Please fill in all 4 options.');
            return;
        }
        // Removed compulsory correct answer check so correctIndex remains -1 if none is chosen.
        onSave({
            question_text: question.trim(),
            options: options.map((o) => o.trim()),
            correct_option_index: correctIndex,
        });
    };

    return (
        <Animated.View
            entering={FadeInDown.springify().damping(18)}
            exiting={FadeOutUp.duration(200)}
            style={styles.container}
        >
            {/* Question number badge */}
            <View style={styles.numberBadge}>
                <Text style={styles.numberText}>
                    {String(questionNumber).padStart(2, '0')}
                </Text>
            </View>

            {/* Question input */}
            <Text style={styles.label}>QUESTION</Text>
            <TextInput
                style={styles.questionInput}
                placeholder="What is your dream vacation?"
                placeholderTextColor="#9CA3AF"
                value={question}
                onChangeText={setQuestion}
                multiline
            />

            {/* Divider */}
            <View style={styles.divider} />

            {/* Options header */}
            <View style={styles.optionsHeader}>
                <Text style={styles.label}>OPTIONS</Text>
                <Text style={styles.hintText}>Mark the correct one (optional)</Text>
            </View>

            {/* Option inputs */}
            {options.map((option, index) => (
                <View key={index} style={styles.optionRow}>
                    <TextInput
                        style={[
                            styles.optionInput,
                            correctIndex === index && styles.optionInputCorrect,
                        ]}
                        placeholder={`Option ${index + 1}`}
                        placeholderTextColor="#9CA3AF"
                        value={option}
                        onChangeText={(text) => updateOption(index, text)}
                    />
                    <TouchableOpacity
                        onPress={() => setCorrectIndex(correctIndex === index ? -1 : index)}
                        style={[
                            styles.radioOuter,
                            correctIndex === index && styles.radioOuterSelected,
                        ]}
                    >
                        {correctIndex === index && (
                            <View style={styles.radioInner} />
                        )}
                    </TouchableOpacity>
                </View>
            ))}

            {/* Action buttons */}
            <View style={styles.actions}>
                {onCancel && (
                    <TouchableOpacity onPress={onCancel} style={styles.cancelBtn}>
                        <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                )}
                <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
                    <MaterialIcons name="check" size={20} color="#FFF" />
                    <Text style={styles.saveText}>Save Question</Text>
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 24,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 3,
    },
    numberBadge: {
        position: 'absolute',
        top: -10,
        left: 24,
        backgroundColor: '#A31645',
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 4,
    },
    numberText: {
        color: '#FFF',
        fontFamily: 'PlusJakartaSans_800ExtraBold',
        fontSize: 14,
    },
    label: {
        color: '#A31645',
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 11,
        letterSpacing: 1.5,
        marginBottom: 10,
        marginTop: 8,
    },
    questionInput: {
        backgroundColor: '#FFF1F2',
        borderRadius: 16,
        padding: 16,
        fontSize: 18,
        fontFamily: 'PlusJakartaSans_700Bold',
        color: '#111827',
        minHeight: 60,
    },
    divider: {
        height: 1,
        backgroundColor: '#FDE2E8',
        marginVertical: 16,
    },
    optionsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    hintText: {
        color: '#9CA3AF',
        fontFamily: 'PlusJakartaSans_500Medium',
        fontSize: 12,
        fontStyle: 'italic',
    },
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        gap: 12,
    },
    optionInput: {
        flex: 1,
        backgroundColor: '#FAFAFA',
        borderRadius: 14,
        paddingVertical: 14,
        paddingHorizontal: 16,
        fontSize: 15,
        fontFamily: 'PlusJakartaSans_600SemiBold',
        color: '#111827',
        borderWidth: 1.5,
        borderColor: '#F3F4F6',
    },
    optionInputCorrect: {
        borderColor: '#A31645',
        backgroundColor: '#FFF1F2',
    },
    radioOuter: {
        width: 28,
        height: 28,
        borderRadius: 14,
        borderWidth: 2.5,
        borderColor: '#D1D5DB',
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioOuterSelected: {
        borderColor: '#A31645',
    },
    radioInner: {
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: '#A31645',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
        marginTop: 16,
    },
    cancelBtn: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 16,
        backgroundColor: '#F3F4F6',
    },
    cancelText: {
        color: '#6B7280',
        fontFamily: 'PlusJakartaSans_600SemiBold',
        fontSize: 14,
    },
    saveBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 16,
        backgroundColor: '#A31645',
    },
    saveText: {
        color: '#FFF',
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 14,
    },
});
