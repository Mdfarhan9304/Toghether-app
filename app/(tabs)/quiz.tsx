import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import QuizCard from '../../components/quiz/QuizCard';
import { useQuizStore } from '../../store/quizStore';

export default function QuizScreen() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'inbox' | 'sent'>('inbox');
    const {
        receivedQuizzes,
        sentQuizzes,
        isLoading,
        fetchQuizzes,
        notifications,
        unreadCount,
        fetchNotifications,
    } = useQuizStore();

    useEffect(() => {
        fetchQuizzes();
        fetchNotifications();
    }, []);

    const onRefresh = useCallback(() => {
        fetchQuizzes();
        fetchNotifications();
    }, []);

    const handleQuizPress = (quizId: string, status: string, type: 'received' | 'sent') => {
        if (type === 'received' && status === 'pending') {
            router.push(`/quiz/play/${quizId}`);
        } else if (status === 'completed') {
            router.push(`/quiz/result/${quizId}`);
        }
    };

    const quizzes = activeTab === 'inbox' ? receivedQuizzes : sentQuizzes;

    return (
        <View style={styles.root}>
            {/* Header gradient */}


            <SafeAreaView edges={['top']} style={styles.flex}>
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.headerLabel}>QUIZ GAME</Text>
                        <Text style={styles.headerTitle}>Love Quiz 💝</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.notifBtn}
                        onPress={() => fetchNotifications()}
                    >
                        <MaterialIcons name="notifications-none" size={26} color="#FFF" />
                        {unreadCount > 0 && (
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Tab switcher */}
                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'inbox' && styles.tabActive]}
                        onPress={() => setActiveTab('inbox')}
                    >
                        <MaterialIcons
                            name="inbox"
                            size={18}
                            color={activeTab === 'inbox' ? '#A31645' : '#9CA3AF'}
                        />
                        <Text
                            style={[
                                styles.tabText,
                                activeTab === 'inbox' && styles.tabTextActive,
                            ]}
                        >
                            Inbox
                        </Text>
                        {receivedQuizzes.filter((q) => q.status === 'pending').length > 0 && (
                            <View style={styles.tabBadge}>
                                <Text style={styles.tabBadgeText}>
                                    {receivedQuizzes.filter((q) => q.status === 'pending').length}
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'sent' && styles.tabActive]}
                        onPress={() => setActiveTab('sent')}
                    >
                        <MaterialIcons
                            name="send"
                            size={18}
                            color={activeTab === 'sent' ? '#A31645' : '#9CA3AF'}
                        />
                        <Text
                            style={[
                                styles.tabText,
                                activeTab === 'sent' && styles.tabTextActive,
                            ]}
                        >
                            Sent
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Quiz List */}
                <ScrollView
                    style={styles.list}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
                    }
                    showsVerticalScrollIndicator={false}
                >
                    {quizzes.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <View style={styles.emptyIcon}>
                                <MaterialIcons
                                    name={activeTab === 'inbox' ? 'quiz' : 'send'}
                                    size={48}
                                    color="#D1D5DB"
                                />
                            </View>
                            <Text style={styles.emptyTitle}>
                                {activeTab === 'inbox'
                                    ? 'No quizzes yet'
                                    : "You haven't sent any quizzes"}
                            </Text>
                            <Text style={styles.emptySubtitle}>
                                {activeTab === 'inbox'
                                    ? 'Wait for your partner to send you a quiz!'
                                    : 'Create your first quiz and send it to your partner!'}
                            </Text>
                        </View>
                    ) : (
                        quizzes.map((quiz) => (
                            <QuizCard
                                key={quiz.id}
                                quiz={quiz}
                                type={activeTab === 'inbox' ? 'received' : 'sent'}
                                onPress={() =>
                                    handleQuizPress(quiz.id, quiz.status, activeTab === 'inbox' ? 'received' : 'sent')
                                }
                            />
                        ))
                    )}
                </ScrollView>

                {/* Create Quiz FAB */}
                <TouchableOpacity
                    onPress={() => router.push('/quiz/create')}
                    style={styles.fab}
                    activeOpacity={0.85}
                >
                    <LinearGradient
                        colors={['#A31645', '#E11D48']}
                        style={styles.fabGradient}
                    >
                        <MaterialIcons name="add" size={28} color="#FFF" />
                    </LinearGradient>
                </TouchableOpacity>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1 },
    flex: { flex: 1 },
    header: {
        paddingHorizontal: 24,
        paddingTop: 12,
        paddingBottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerLabel: {
        fontSize: 11,
        letterSpacing: 1.8,
        color: '#A31645',
        fontFamily: 'PlusJakartaSans_700Bold',
        marginBottom: 4,
    },
    headerTitle: {
        fontSize: 28,
        // brancd color red
        color: '#A31645',
        fontFamily: 'PlusJakartaSans_800ExtraBold',
    },
    notifBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    badge: {
        position: 'absolute',
        top: 4,
        right: 4,
        minWidth: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: '#EF4444',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 4,
        borderWidth: 2,
        borderColor: '#A31645',
    },
    badgeText: {
        color: '#FFF',
        fontSize: 10,
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    tabContainer: {
        flexDirection: 'row',
        marginHorizontal: 24,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 12,
        borderRadius: 12,
    },
    tabActive: {
        backgroundColor: '#FFF1F2',
    },
    tabText: {
        fontSize: 14,
        fontFamily: 'PlusJakartaSans_600SemiBold',
        color: '#9CA3AF',
    },
    tabTextActive: {
        color: '#A31645',
    },
    tabBadge: {
        minWidth: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#A31645',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 6,
    },
    tabBadgeText: {
        color: '#FFF',
        fontSize: 10,
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    list: { flex: 1 },
    listContent: {
        padding: 24,
        paddingBottom: 100,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 60,
    },
    emptyIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 18,
        fontFamily: 'PlusJakartaSans_700Bold',
        color: '#374151',
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 14,
        fontFamily: 'PlusJakartaSans_500Medium',
        color: '#9CA3AF',
        textAlign: 'center',
        paddingHorizontal: 40,
    },
    fab: {
        position: 'absolute',
        bottom: 24,
        right: 24,
    },
    fabGradient: {
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#A31645',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
        elevation: 8,
    },
});
