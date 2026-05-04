import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PageLoader } from "@/components/ui/page-loader";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export const ProtectedRoute = ({ children, redirectTo = "/login" }: ProtectedRouteProps) => {
  const { user, loading, profile, profileLoading } = useAuth();
  const location = useLocation();

  if (loading || profileLoading) {
    return <PageLoader />;
  }

  if (!user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Redirect to onboarding only if no profile exists yet (new user)
  // Existing users (profile exists) are never redirected, even if profile_completed is null
  const isOnboardingRoute = location.pathname.startsWith("/onboarding");
  if (!isOnboardingRoute && !profile) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
};
