import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { HouseholdDashboard } from "./pages/HouseholdDashboard";
import { WaterUsage } from "./pages/WaterUsage";
import { PropertySetup } from "./pages/PropertySetup";
import { Schedule } from "./pages/Schedule";
import { TurfInsights } from "./pages/TurfInsights";
import { SavingTips } from "./pages/SavingTips";
import { Splash } from "./pages/onboarding/Splash";
import { AddressInput } from "./pages/onboarding/AddressInput";
import { MapSelection } from "./pages/onboarding/MapSelection";
import { useStore } from "./store/useStore";

function App() {
  const onboardingStep = useStore((state) => state.onboardingStep);

  // Global State Routing
  if (onboardingStep === 'splash') return <Splash />;
  if (onboardingStep === 'address') return <AddressInput />;
  if (onboardingStep === 'map') return <MapSelection />;

  // Main App (onboardingStep === 'dashboard')
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HouseholdDashboard />} />
          <Route path="/water" element={<WaterUsage />} />
          <Route path="/setup" element={<PropertySetup />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/turf" element={<TurfInsights />} />
          <Route path="/tips" element={<SavingTips />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
