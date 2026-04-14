import { create } from 'zustand';
import { supabase } from '../lib/supabase';

// ─── Types ───────────────────────────────────────────────────────────

export type TrackingType = 'boolean' | 'number' | 'amount' | 'progress';
export type GoalType = 'Shared' | 'Individual';
export type Category = 'Finance' | 'Travel' | 'Health' | 'Fitness' | 'Home' | 'Knowledge' | 'Milestone';

export interface Goal {
    id: string;
    user_id: string;
    goal_type: GoalType;
    category: Category;
    name: string;
    tracking_type: TrackingType;
    target_date: string;
    target_value: number | null;
    target_amount: number | null;
    current_amount: number | null;
    unit: string | null;
    currency: string | null;
    reason: string | null;
    image_url: string | null;
    is_favorite: boolean;
    is_completed: boolean;
    created_at: string;
}

export interface DailyEntry {
    id: string;
    goal_id: string;
    user_id: string;
    entry_date: string;
    completed: boolean;
    value: number | null;
    created_at: string;
}

export interface GoalWithEntries extends Goal {
    todayMyEntry?: DailyEntry;
    todayPartnerEntry?: DailyEntry;
}

// ─── Helpers ─────────────────────────────────────────────────────────

function getTodayStr(): string {
    return new Date().toISOString().split('T')[0];
}

function getDaysBetween(start: string, end: string): number {
    const s = new Date(start);
    const e = new Date(end);
    return Math.floor((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1;
}

// ─── Store ───────────────────────────────────────────────────────────

interface GoalStoreState {
    goals: GoalWithEntries[];
    allEntries: Record<string, DailyEntry[]>; // keyed by goal_id
    isLoading: boolean;
    userId: string | null;
    partnerId: string | null;
    userProfile: any;
    partnerProfile: any;
    globalStreak: number;

    // Actions
    fetchGoals: () => Promise<void>;
    fetchEntriesForGoal: (goalId: string) => Promise<DailyEntry[]>;
    submitDailyEntry: (goalId: string, date: string, data: { completed?: boolean; value?: number }) => Promise<void>;
    createGoal: (payload: Partial<Goal>) => Promise<string | null>;
    updateGoal: (goalId: string, payload: Partial<Goal>) => Promise<void>;
    deleteGoal: (goalId: string) => Promise<void>;
    toggleFavorite: (goalId: string, currentlyLiked: boolean) => Promise<void>;

    // Computed
    getStreak: (goalId: string, forUserId?: string) => number;
    getCoupleStreak: (goalId: string) => number;
    getCompletionRate: (goalId: string, forUserId?: string) => number;
    getCoupleCompletionRate: (goalId: string) => number;
}

export const useGoalStore = create<GoalStoreState>()((set, get) => ({
    goals: [],
    allEntries: {},
    isLoading: false,
    userId: null,
    partnerId: null,
    userProfile: null,
    partnerProfile: null,
    globalStreak: 0,

    fetchGoals: async () => {
        set({ isLoading: true });
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Get profile + partner
            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            let partnerProfile = null;
            if (profile?.partner_id) {
                const { data: pp } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', profile.partner_id)
                    .single();
                partnerProfile = pp;
            }

            // Fetch all goals (own + partner shared via RLS)
            const { data: goalsData, error } = await supabase
                .from('goals')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            const goals = (goalsData || []) as Goal[];
            const today = getTodayStr();

            // Fetch today's entries for all goals
            const goalIds = goals.map(g => g.id);
            let todayEntries: DailyEntry[] = [];
            if (goalIds.length > 0) {
                const { data: entries } = await supabase
                    .from('goal_daily_entries')
                    .select('*')
                    .in('goal_id', goalIds)
                    .eq('entry_date', today);
                todayEntries = (entries || []) as DailyEntry[];
            }

            // Map goals with today's entries
            const goalsWithEntries: GoalWithEntries[] = goals.map(g => {
                const myEntry = todayEntries.find(e => e.goal_id === g.id && e.user_id === user.id);
                const partnerEntry = todayEntries.find(e => e.goal_id === g.id && e.user_id !== user.id);
                return {
                    ...g,
                    todayMyEntry: myEntry,
                    todayPartnerEntry: partnerEntry,
                };
            });

            // Calculate global streak
            const { data: allDatesData } = await supabase
                .from('goal_daily_entries')
                .select('entry_date')
                .eq('user_id', user.id)
                .eq('completed', true);

            let globalStreak = 0;
            if (allDatesData) {
                const uniqueDates = new Set(allDatesData.map(d => d.entry_date));
                const yesterday = new Date(today);
                yesterday.setDate(yesterday.getDate() - 1);
                const yesterdayStr = yesterday.toISOString().split('T')[0];

                let checkDateStr = today;
                if (!uniqueDates.has(today) && uniqueDates.has(yesterdayStr)) {
                    checkDateStr = yesterdayStr;
                }

                while (uniqueDates.has(checkDateStr)) {
                    globalStreak++;
                    const d = new Date(checkDateStr);
                    d.setDate(d.getDate() - 1);
                    checkDateStr = d.toISOString().split('T')[0];
                }
            }

            set({
                goals: goalsWithEntries,
                userId: user.id,
                partnerId: profile?.partner_id || null,
                userProfile: profile,
                partnerProfile,
                globalStreak,
            });
        } catch (e) {
            console.error('fetchGoals error:', e);
        } finally {
            set({ isLoading: false });
        }
    },

    fetchEntriesForGoal: async (goalId: string) => {
        const { data, error } = await supabase
            .from('goal_daily_entries')
            .select('*')
            .eq('goal_id', goalId)
            .order('entry_date', { ascending: false });

        const entries = (data || []) as DailyEntry[];

        set(state => ({
            allEntries: { ...state.allEntries, [goalId]: entries },
        }));

        return entries;
    },

    submitDailyEntry: async (goalId, date, data) => {
        const { userId } = get();
        if (!userId) return;

        const { data: existing } = await supabase
            .from('goal_daily_entries')
            .select('id')
            .eq('goal_id', goalId)
            .eq('user_id', userId)
            .eq('entry_date', date)
            .maybeSingle();

        if (existing) {
            // Update
            await supabase
                .from('goal_daily_entries')
                .update({
                    completed: data.completed ?? false,
                    value: data.value ?? null,
                })
                .eq('id', existing.id);
        } else {
            // Insert
            await supabase
                .from('goal_daily_entries')
                .insert({
                    goal_id: goalId,
                    user_id: userId,
                    entry_date: date,
                    completed: data.completed ?? false,
                    value: data.value ?? null,
                });
        }

        // Update current_amount on the goal if it's a progress/amount goal
        const goal = get().goals.find(g => g.id === goalId);
        if (goal && data.value !== undefined && data.value !== null) {
            // Find max value so far or just use this one
            // We'll use the max to ensure progress doesn't go backwards unless intended maybe?
            // Actually, for "number" or "amount" we might want to just set it to the latest.
            // Since this is today's check-in, setting current_amount to data.value makes sense
            // if we assume data.value is cumulative progress.
            await supabase
                .from('goals')
                .update({ current_amount: data.value })
                .eq('id', goalId);
        }

        // Refresh goals to update today's entries
        await get().fetchGoals();
        await get().fetchEntriesForGoal(goalId);
    },

    createGoal: async (payload) => {
        const { userId } = get();
        if (!userId) {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return null;
            set({ userId: user.id });
        }

        const { data, error } = await supabase
            .from('goals')
            .insert({
                ...payload,
                user_id: get().userId,
                is_completed: false,
                is_favorite: false,
            })
            .select()
            .single();

        if (error) {
            console.error('createGoal error:', error);
            return null;
        }

        await get().fetchGoals();
        return data?.id || null;
    },

    updateGoal: async (goalId, payload) => {
        const { error } = await supabase
            .from('goals')
            .update(payload)
            .eq('id', goalId);

        if (error) console.error('updateGoal error:', error);
        await get().fetchGoals();
    },

    deleteGoal: async (goalId) => {
        // Optimistic
        set(state => ({
            goals: state.goals.filter(g => g.id !== goalId),
        }));

        const { error } = await supabase
            .from('goals')
            .delete()
            .eq('id', goalId);

        if (error) {
            console.error('deleteGoal error:', error);
            await get().fetchGoals();
        }
    },

    toggleFavorite: async (goalId, currentlyLiked) => {
        const newState = !currentlyLiked;
        // Optimistic
        set(state => ({
            goals: state.goals.map(g =>
                g.id === goalId ? { ...g, is_favorite: newState } : g
            ),
        }));

        const { error } = await supabase
            .from('goals')
            .update({ is_favorite: newState })
            .eq('id', goalId);

        if (error) {
            console.error('toggleFavorite error:', error);
            set(state => ({
                goals: state.goals.map(g =>
                    g.id === goalId ? { ...g, is_favorite: currentlyLiked } : g
                ),
            }));
        }
    },

    getStreak: (goalId, forUserId) => {
        const { allEntries, userId } = get();
        const uid = forUserId || userId;
        if (!uid) return 0;

        const entries = (allEntries[goalId] || [])
            .filter(e => e.user_id === uid && e.completed)
            .map(e => e.entry_date)
            .sort()
            .reverse();

        if (entries.length === 0) return 0;

        let streak = 0;
        const today = getTodayStr();
        let checkDate = new Date(today);

        for (let i = 0; i < entries.length; i++) {
            const dateStr = checkDate.toISOString().split('T')[0];
            if (entries.includes(dateStr)) {
                streak++;
                checkDate.setDate(checkDate.getDate() - 1);
            } else {
                break;
            }
        }
        return streak;
    },

    getCoupleStreak: (goalId) => {
        const { allEntries, userId, partnerId } = get();
        if (!userId || !partnerId) return 0;

        const entries = allEntries[goalId] || [];
        const today = getTodayStr();
        let streak = 0;
        let checkDate = new Date(today);

        for (let i = 0; i < 365; i++) {
            const dateStr = checkDate.toISOString().split('T')[0];
            const myEntry = entries.find(e => e.user_id === userId && e.entry_date === dateStr && e.completed);
            const partnerEntry = entries.find(e => e.user_id === partnerId && e.entry_date === dateStr && e.completed);

            if (myEntry && partnerEntry) {
                streak++;
                checkDate.setDate(checkDate.getDate() - 1);
            } else {
                break;
            }
        }
        return streak;
    },

    getCompletionRate: (goalId, forUserId) => {
        const { allEntries, userId, goals } = get();
        const uid = forUserId || userId;
        if (!uid) return 0;

        const goal = goals.find(g => g.id === goalId);
        if (!goal) return 0;

        if (goal.tracking_type !== 'boolean' && (goal.target_value || goal.target_amount)) {
            const target = goal.target_value || goal.target_amount || 1;
            // Get all entries for this user
            const userEntries = (allEntries[goalId] || []).filter(e => e.user_id === uid);
            if (userEntries.length === 0) return 0;
            // Find the maximum value achieved
            const maxValue = Math.max(...userEntries.map(e => e.value || 0), 0);
            return Math.min(Math.round((maxValue / target) * 100), 100);
        }

        const totalDays = getDaysBetween(goal.created_at.split('T')[0], getTodayStr());
        if (totalDays <= 0) return 0;

        const completedDays = (allEntries[goalId] || [])
            .filter(e => e.user_id === uid && e.completed)
            .length;

        return Math.round((completedDays / totalDays) * 100);
    },

    getCoupleCompletionRate: (goalId) => {
        const { allEntries, userId, partnerId, goals } = get();
        if (!userId || !partnerId) return 0;

        const goal = goals.find(g => g.id === goalId);
        if (!goal) return 0;

        const totalDays = getDaysBetween(goal.created_at.split('T')[0], getTodayStr());
        if (totalDays <= 0) return 0;

        const entries = allEntries[goalId] || [];
        let bothDays = 0;

        for (let i = 0; i < totalDays; i++) {
            const d = new Date(goal.created_at);
            d.setDate(d.getDate() + i);
            const dateStr = d.toISOString().split('T')[0];

            const myDone = entries.some(e => e.user_id === userId && e.entry_date === dateStr && e.completed);
            const partnerDone = entries.some(e => e.user_id === partnerId && e.entry_date === dateStr && e.completed);

            if (myDone && partnerDone) bothDays++;
        }

        return Math.round((bothDays / totalDays) * 100);
    },
}));
