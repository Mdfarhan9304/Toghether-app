import { MaterialIcons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import { Image, Modal, Text, TouchableOpacity, View } from 'react-native';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Animated, { SlideInDown } from 'react-native-reanimated';

export interface GoalCardProps {
    id?: string;
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
    onToggleFavorite?: (id: string, currentlyLiked: boolean) => void;
    onDelete?: (id: string) => void;
    onComplete?: (id: string) => void;
    isCompleted?: boolean;
    onPress?: (id: string) => void;
}

export function GoalCard({
    id,
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
    onToggleFavorite,
    onDelete,
    onComplete,
    isCompleted = false,
    onPress,
}: GoalCardProps) {
    const swipeableRef = useRef<any>(null);
    const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);

    const openDeleteModal = () => {
        setDeleteModalVisible(true);
    };

    const closeDeleteModal = () => {
        setDeleteModalVisible(false);
        swipeableRef.current?.close();
    };

    const handleDelete = () => {
        if (id && onDelete) {
            onDelete(id);
        }
        closeDeleteModal();
    };

    const handleComplete = () => {
        if (id && onComplete) {
            onComplete(id);
        }
        swipeableRef.current?.close();
    };

    const renderRightActions = () => {
        const actionWidth = isCompleted ? 70 : 140;
        return (
            <View style={{ width: actionWidth, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                {!isCompleted && (
                    <TouchableOpacity
                        onPress={handleComplete}
                        style={{
                            width: 50,
                            height: 50,
                            borderRadius: 25,
                            backgroundColor: 'white',
                            boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.1),inset 0px 4px 4px 0px rgba(255,255,255,0.05),inset 0px -2px 4px 0px rgba(0,0,0,0.1)' as any,
                            alignItems: 'center',
                            shadowOpacity: 0.2,
                            justifyContent: 'center',
                        }}
                    // activeOpacity={0.7}
                    >
                        <MaterialIcons name="check" size={26} color="#16A34A" />
                    </TouchableOpacity>
                )}
                <TouchableOpacity
                    onPress={openDeleteModal}
                    style={{
                        width: 50,
                        height: 50,
                        borderRadius: 25,
                        backgroundColor: 'white',
                        boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.1),inset 0px 4px 4px 0px rgba(255,255,255,0.05),inset 0px -2px 4px 0px rgba(0,0,0,0.1)' as any,
                        alignItems: 'center',
                        shadowOpacity: 0.2,
                        justifyContent: 'center',
                    }}
                    activeOpacity={0.7}
                >
                    <MaterialIcons name="delete-outline" size={26} color="#E11D48" />
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={{ marginTop: -8, marginBottom: 4, marginHorizontal: -8 }}>
            <ReanimatedSwipeable
                ref={swipeableRef}
                renderRightActions={renderRightActions}
                rightThreshold={40}
                friction={2}
                containerStyle={{ overflow: 'visible' }}
                childrenContainerStyle={{ overflow: 'visible' }}
            >
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => id && onPress?.(id)}
                    style={{
                        margin: 8,
                        backgroundColor: isCompleted ? '#F4F4F5' : '#FFFFFF',
                        borderRadius: 20,
                        padding: 16,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.05,
                        shadowRadius: 12,
                        elevation: 3,
                        opacity: isCompleted ? 0.8 : 1,
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
                                <TouchableOpacity
                                    onPress={() => id && onToggleFavorite?.(id, liked)}
                                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                >
                                    <MaterialIcons
                                        name={liked ? 'favorite' : 'favorite-border'}
                                        size={20}
                                        color={liked ? '#E11D48' : '#D4D4D8'}
                                    />
                                </TouchableOpacity>
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


                    {/* </View> */}
                </TouchableOpacity>

            </ReanimatedSwipeable>

            {/* Animated Floating Bottom Sheet Modal */}
            <Modal visible={isDeleteModalVisible} transparent={true} animationType="fade" onRequestClose={closeDeleteModal}>
                <TouchableOpacity
                    style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end', padding: 20 }}
                    activeOpacity={1}
                    onPress={closeDeleteModal}
                >
                    <Animated.View
                        entering={SlideInDown.springify().damping(24).stiffness(100)}
                        style={{
                            backgroundColor: 'white',
                            padding: 24,
                            borderRadius: 28,
                            width: '100%',
                            alignItems: 'center',
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 10 },
                            shadowOpacity: 0.1,
                            shadowRadius: 20,
                            elevation: 10,
                            marginBottom: 8, // Padding to float above bottom screen edge
                        }}
                    >
                        <View
                            style={{
                                width: 64,
                                height: 64,
                                borderRadius: 32,
                                backgroundColor: '#FFE4E6',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: 16,
                            }}
                        >
                            <MaterialIcons name="delete-forever" size={32} color="#E11D48" />
                        </View>
                        <Text className="font-[PlusJakartaSans_700Bold]" style={{ fontSize: 22, color: '#09090B', marginBottom: 8, textAlign: 'center' }}>
                            Delete Goal?
                        </Text>
                        <Text className="font-[PlusJakartaSans_500Medium]" style={{ fontSize: 15, color: '#71717A', textAlign: 'center', marginBottom: 28, lineHeight: 22 }}>
                            Are you sure you want to delete this goal? This action cannot be undone.
                        </Text>

                        <View style={{ flexDirection: 'row', gap: 12, width: '100%' }}>
                            <TouchableOpacity
                                onPress={closeDeleteModal}
                                style={{ flex: 1, paddingVertical: 16, borderRadius: 16, backgroundColor: '#F4F4F5', alignItems: 'center' }}
                                activeOpacity={0.8}
                            >
                                <Text className="font-[PlusJakartaSans_700Bold]" style={{ fontSize: 16, color: '#3F3F46' }}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleDelete}
                                style={{ flex: 1, paddingVertical: 16, borderRadius: 16, backgroundColor: '#E11D48', alignItems: 'center' }}
                                activeOpacity={0.8}
                            >
                                <Text className="font-[PlusJakartaSans_700Bold]" style={{ fontSize: 16, color: '#FFFFFF' }}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}
