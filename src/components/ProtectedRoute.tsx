import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useOnboarding } from "@/contexts/OnboardingContext";

interface Props {
  children: React.ReactNode;
  requiredRole?: "creator" | "brand" | "admin";
}

const ProtectedRoute = ({ children, requiredRole }: Props) => {
  const { user, role, loading: authLoading } = useAuth();
  const { onboardingComplete, loading: obLoading } = useOnboarding();

  if (authLoading || obLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-10 h-10 rounded-xl gradient-primary animate-pulse-glow" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;
  
  // For demo users, skip role check if they're demo accounts
  const isDemoUser = user.id?.startsWith("demo-");
  if (requiredRole && role !== requiredRole && !isDemoUser) return <Navigate to="/" replace />;

  // Skip onboarding for demo users
  if (!isDemoUser && onboardingComplete === false) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
