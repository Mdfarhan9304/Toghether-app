import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export interface QuizQuestion {
    id?: string;
    question_text: string;
    options: string[];
    correct_option_index: number;
    order_index: number;
}

export interface Quiz {
    id: string;
    creator_id: string;
    recipient_id: string;
    category: string;
    status: 'pending' | 'accepted' | 'completed';
    score: number | null;
    created_at: string;
    quiz_questions?: QuizQuestion[];
    creator?: { full_name: string };
    recipient?: { full_name: string };
}

export interface Notification {
    id: string;
    user_id: string;
    type: string;
    title: string;
    body: string;
    data: { quiz_id?: string };
    read: boolean;
    created_at: string;
}

interface QuizCreationState {
    category: string;
    questions: QuizQuestion[];
    currentStep: number;
}

interface QuizStoreState {
    // Creation state
    creation: QuizCreationState;
    setCategory: (category: string) => void;
    setQuestions: (questions: QuizQuestion[]) => void;
    addQuestion: (question: Omit<QuizQuestion, 'order_index'>) => void;
    updateQuestion: (index: number, question: Partial<QuizQuestion>) => void;
    removeQuestion: (index: number) => void;
    setCurrentStep: (step: number) => void;
    resetCreation: () => void;

    // Quiz lists
    receivedQuizzes: Quiz[];
    sentQuizzes: Quiz[];
    isLoading: boolean;
    fetchQuizzes: () => Promise<void>;

    // Notifications
    notifications: Notification[];
    unreadCount: number;
    fetchNotifications: () => Promise<void>;
    markNotificationRead: (id: string) => Promise<void>;

    // Actions
    submitQuiz: () => Promise<string | null>;
    acceptQuiz: (quizId: string) => Promise<void>;
    submitResponses: (
        quizId: string,
        responses: { question_id: string; selected_option_index: number; is_correct: boolean }[]
    ) => Promise<void>;
}

const initialCreation: QuizCreationState = {
    category: '',
    questions: [],
    currentStep: 0,
};

export const useQuizStore = create<QuizStoreState>()((set, get) => ({
    creation: { ...initialCreation },
    receivedQuizzes: [],
    sentQuizzes: [],
    isLoading: false,
    notifications: [],
    unreadCount: 0,

    setCategory: (category) =>
        set((state) => ({ creation: { ...state.creation, category } })),

    setQuestions: (questions) =>
        set((state) => ({ creation: { ...state.creation, questions } })),

    addQuestion: (question) =>
        set((state) => ({
            creation: {
                ...state.creation,
                questions: [
                    ...state.creation.questions,
                    { ...question, order_index: state.creation.questions.length },
                ],
            },
        })),

    updateQuestion: (index, question) =>
        set((state) => {
            const questions = [...state.creation.questions];
            questions[index] = { ...questions[index], ...question };
            return { creation: { ...state.creation, questions } };
        }),

    removeQuestion: (index) =>
        set((state) => {
            const questions = state.creation.questions.filter((_, i) => i !== index);
            return {
                creation: {
                    ...state.creation,
                    questions: questions.map((q, i) => ({ ...q, order_index: i })),
                },
            };
        }),

    setCurrentStep: (step) =>
        set((state) => ({ creation: { ...state.creation, currentStep: step } })),

    resetCreation: () => set({ creation: { ...initialCreation, questions: [] } }),

    fetchQuizzes: async () => {
        set({ isLoading: true });
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: received } = await supabase
                .from('quizzes')
                .select('*, quiz_questions(*), creator:profiles!quizzes_creator_id_fkey(full_name)')
                .eq('recipient_id', user.id)
                .order('created_at', { ascending: false });

            const { data: sent } = await supabase
                .from('quizzes')
                .select('*, quiz_questions(*), recipient:profiles!quizzes_recipient_id_fkey(full_name)')
                .eq('creator_id', user.id)
                .order('created_at', { ascending: false });

            set({
                receivedQuizzes: (received as Quiz[]) || [],
                sentQuizzes: (sent as Quiz[]) || [],
            });
        } finally {
            set({ isLoading: false });
        }
    },

    fetchNotifications: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(50);

        const notifications = (data as Notification[]) || [];
        set({
            notifications,
            unreadCount: notifications.filter((n) => !n.read).length,
        });
    },

    markNotificationRead: async (id) => {
        await supabase.from('notifications').update({ read: true }).eq('id', id);
        set((state) => ({
            notifications: state.notifications.map((n) =>
                n.id === id ? { ...n, read: true } : n
            ),
            unreadCount: Math.max(0, state.unreadCount - 1),
        }));
    },

    submitQuiz: async () => {
        const { creation } = get();
        if (!creation.category || creation.questions.length < 4) return null;

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return null;

            // Get partner ID
            const { data: profile } = await supabase
                .from('profiles')
                .select('partner_id')
                .eq('id', user.id)
                .single();

            if (!profile?.partner_id) return null;

            // Insert quiz
            const { data: quiz, error: quizError } = await supabase
                .from('quizzes')
                .insert({
                    creator_id: user.id,
                    recipient_id: profile.partner_id,
                    category: creation.category,
                    status: 'pending',
                })
                .select()
                .single();

            if (quizError || !quiz) return null;

            // Insert questions
            const questionsToInsert = creation.questions.map((q) => ({
                quiz_id: quiz.id,
                question_text: q.question_text,
                options: q.options,
                correct_option_index: q.correct_option_index,
                order_index: q.order_index,
            }));

            await supabase.from('quiz_questions').insert(questionsToInsert);

            // Get creator name for notification
            const { data: creatorProfile } = await supabase
                .from('profiles')
                .select('full_name')
                .eq('id', user.id)
                .single();

            // Send notification to partner
            await supabase.from('notifications').insert({
                user_id: profile.partner_id,
                type: 'quiz_received',
                title: '💝 New Quiz from your partner!',
                body: `${creatorProfile?.full_name || 'Your partner'} sent you a ${creation.category} quiz with ${creation.questions.length} questions!`,
                data: { quiz_id: quiz.id },
            });

            get().resetCreation();
            get().fetchQuizzes();
            return quiz.id;
        } catch {
            return null;
        }
    },

    acceptQuiz: async (quizId) => {
        await supabase
            .from('quizzes')
            .update({ status: 'accepted' })
            .eq('id', quizId);
        get().fetchQuizzes();
    },

    submitResponses: async (quizId, responses) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Insert all responses
        const responsesToInsert = responses.map((r) => ({
            quiz_id: quizId,
            question_id: r.question_id,
            user_id: user.id,
            selected_option_index: r.selected_option_index,
            is_correct: r.is_correct,
        }));

        await supabase.from('quiz_responses').insert(responsesToInsert);

        // Calculate score
        const score = responses.filter((r) => r.is_correct).length;

        // Update quiz status and score
        await supabase
            .from('quizzes')
            .update({ status: 'completed', score })
            .eq('id', quizId);

        // Get quiz details for notification
        const { data: quiz } = await supabase
            .from('quizzes')
            .select('creator_id, category')
            .eq('id', quizId)
            .single();

        if (quiz) {
            const { data: userProfile } = await supabase
                .from('profiles')
                .select('full_name')
                .eq('id', user.id)
                .single();

            await supabase.from('notifications').insert({
                user_id: quiz.creator_id,
                type: 'quiz_completed',
                title: '🎉 Quiz completed!',
                body: `${userProfile?.full_name || 'Your partner'} scored ${score}/${responses.length} on your ${quiz.category} quiz!`,
                data: { quiz_id: quizId },
            });
        }

        get().fetchQuizzes();
    },
}));
