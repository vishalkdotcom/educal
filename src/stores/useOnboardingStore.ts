import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type {
  Child,
  CostSource,
  CountryCode,
  Location,
  SavingsEntry,
  SavingsResult,
  SchoolResult,
  SchoolTierId,
} from '@/types';

interface OnboardingState {
  countryCode: CountryCode;
  children: Child[];
  monthlyIncome: number;
  currentSavings: number;
  location: Location | null;
  selectedTier: SchoolTierId | null;
  customAnnualCost: number | null;
  costSource: CostSource | null;
  schoolResults: SchoolResult[];
  savingsResult: SavingsResult | null;
  savingsLog: SavingsEntry[];
  currentStep: number;
  onboardingComplete: boolean;
}

interface OnboardingActions {
  setCountryCode: (code: CountryCode) => void;
  addChild: (child: Child) => void;
  removeChild: (id: string) => void;
  updateChild: (id: string, updates: Partial<Child>) => void;
  setMonthlyIncome: (amount: number) => void;
  setCurrentSavings: (amount: number) => void;
  setLocation: (location: Location | null) => void;
  setSelectedTier: (tier: SchoolTierId) => void;
  setCustomAnnualCost: (amount: number | null, source: CostSource) => void;
  setSchoolResults: (results: SchoolResult[]) => void;
  setSavingsResult: (result: SavingsResult | null) => void;
  setCurrentStep: (step: number) => void;
  addSavingsEntry: (entry: SavingsEntry) => void;
  removeSavingsEntry: (id: string) => void;
  completeOnboarding: () => void;
  reset: () => void;
}

const initialState: OnboardingState = {
  countryCode: 'US',
  children: [],
  monthlyIncome: 0,
  currentSavings: 0,
  location: null,
  selectedTier: null,
  customAnnualCost: null,
  costSource: null,
  schoolResults: [],
  savingsResult: null,
  savingsLog: [],
  currentStep: 1,
  onboardingComplete: false,
};

export const useOnboardingStore = create<OnboardingState & OnboardingActions>()(
  persist(
    (set) => ({
      ...initialState,

      setCountryCode: (code) => set({ countryCode: code }),

      addChild: (child) =>
        set((state) => ({ children: [...state.children, child] })),

      removeChild: (id) =>
        set((state) => ({
          children: state.children.filter((c) => c.id !== id),
        })),

      updateChild: (id, updates) =>
        set((state) => ({
          children: state.children.map((c) =>
            c.id === id ? { ...c, ...updates } : c,
          ),
        })),

      setMonthlyIncome: (amount) => set({ monthlyIncome: amount }),
      setCurrentSavings: (amount) => set({ currentSavings: amount }),
      setLocation: (location) => set({ location }),
      setSelectedTier: (tier) => set({ selectedTier: tier }),
      setCustomAnnualCost: (amount, source) =>
        set({ customAnnualCost: amount, costSource: source }),
      setSchoolResults: (results) => set({ schoolResults: results }),
      setSavingsResult: (result) => set({ savingsResult: result }),
      setCurrentStep: (step) => set({ currentStep: step }),

      addSavingsEntry: (entry) =>
        set((state) => ({ savingsLog: [entry, ...state.savingsLog] })),

      removeSavingsEntry: (id) =>
        set((state) => ({
          savingsLog: state.savingsLog.filter((e) => e.id !== id),
        })),

      completeOnboarding: () =>
        set({ onboardingComplete: true, currentStep: 5 }),

      reset: () => set(initialState),
    }),
    {
      name: 'educal-onboarding',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
