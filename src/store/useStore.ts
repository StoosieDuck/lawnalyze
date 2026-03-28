import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  onboardingStep: 'splash' | 'address' | 'map' | 'dashboard';
  location: { address: string; city: string; state: string; coords?: [number, number] } | null;
  lawnAreaSqFt: number;
  setOnboardingStep: (step: 'splash' | 'address' | 'map' | 'dashboard') => void;
  setLocation: (address: string, city: string, state: string, coords?: [number, number]) => void;
  setLawnAreaSqFt: (area: number) => void;
  resetOnboarding: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      onboardingStep: 'splash',
      location: null,
      lawnAreaSqFt: 0,
      setOnboardingStep: (step) => set({ onboardingStep: step }),
      setLocation: (address, city, state, coords) => set({ location: { address, city, state, coords } }),
      setLawnAreaSqFt: (area) => set({ lawnAreaSqFt: area }),
      resetOnboarding: () => set({ onboardingStep: 'splash', location: null, lawnAreaSqFt: 0 }),
    }),
    {
      name: 'lawnalyze-storage',
    }
  )
);
