import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface OnboardingState {
    hasCompletedOnboarding: boolean;
    fullName: string;
    gender: string;
    dob: string | null;
    relationshipStatus: string;
    selectedGoals: string[];
    
    setFullName: (name: string) => void;
    setGender: (gender: string) => void;
    setDob: (dateString: string) => void;
    setRelationshipStatus: (status: string) => void;
    setSelectedGoals: (goals: string[]) => void;
    
    completeOnboarding: () => void;
    resetOnboarding: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
    persist(
        (set) => ({
            hasCompletedOnboarding: false,
            fullName: '',
            gender: '',
            dob: null,
            relationshipStatus: '',
            selectedGoals: [],
            
            setFullName: (name) => set({ fullName: name }),
            setGender: (gender) => set({ gender: gender }),
            setDob: (dateString) => set({ dob: dateString }),
            setRelationshipStatus: (status) => set({ relationshipStatus: status }),
            setSelectedGoals: (goals) => set({ selectedGoals: goals }),

            completeOnboarding: () => set({ hasCompletedOnboarding: true }),
            resetOnboarding: () => set({ 
                hasCompletedOnboarding: false,
                fullName: '',
                gender: '',
                dob: null,
                relationshipStatus: '',
                selectedGoals: []
            }),
        }),
        {
            name: 'onboarding-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
