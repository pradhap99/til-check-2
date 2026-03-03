import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface OnboardingContextType {
  onboardingComplete: boolean | null;
  loading: boolean;
  refresh: () => void;
}

const OnboardingContext = createContext<OnboardingContextType>({ onboardingComplete: null, loading: true, refresh: () => {} });

export const OnboardingProvider = ({ children }: { children: ReactNode }) => {
  const { user, role } = useAuth();
  const [onboardingComplete, setOnboardingComplete] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  const checkOnboarding = async () => {
    if (!user || !role) {
      setOnboardingComplete(null);
      setLoading(false);
      return;
    }
    const table = role === "creator" ? "creator_profiles" : "brand_profiles";
    const { data } = await supabase.from(table).select("onboarding_completed").eq("user_id", user.id).maybeSingle();
    setOnboardingComplete(data?.onboarding_completed ?? false);
    setLoading(false);
  };

  useEffect(() => {
    checkOnboarding();
  }, [user, role]);

  return (
    <OnboardingContext.Provider value={{ onboardingComplete, loading, refresh: checkOnboarding }}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => useContext(OnboardingContext);
