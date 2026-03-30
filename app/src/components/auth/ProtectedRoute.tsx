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

  // Redirect to onboarding if profile is not completed
  // Allow access to onboarding itself to avoid redirect loop
  const isOnboardingRoute = location.pathname.startsWith("/onboarding");
  if (!isOnboardingRoute && profile && !profile.profile_completed) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
};
