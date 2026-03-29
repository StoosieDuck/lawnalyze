import { create } from 'zustand';

interface AppState {
  onboardingStep: 'splash' | 'address' | 'map' | 'dashboard';
  location: { address: string; city: string; state: string; coords?: [number, number] } | null;
  lawnAreaSqFt: number;
  boundaryGeoJSON: any | null;
  setOnboardingStep: (step: 'splash' | 'address' | 'map' | 'dashboard') => void;
  setLocation: (address: string, city: string, state: string, coords?: [number, number]) => void;
  setLawnAreaSqFt: (area: number) => void;
  setBoundaryGeoJSON: (geojson: any) => void;
  resetOnboarding: () => void;
}

export const useStore = create<AppState>()((set) => ({
  onboardingStep: 'splash',
  location: null,
  lawnAreaSqFt: 0,
  boundaryGeoJSON: null,
  setOnboardingStep: (step) => set({ onboardingStep: step }),
  setLocation: (address, city, state, coords) => set({ location: { address, city, state, coords } }),
  setLawnAreaSqFt: (area) => set({ lawnAreaSqFt: area }),
  setBoundaryGeoJSON: (geojson) => set({ boundaryGeoJSON: geojson }),
  resetOnboarding: () => set({ onboardingStep: 'splash', location: null, lawnAreaSqFt: 0, boundaryGeoJSON: null }),
}));
