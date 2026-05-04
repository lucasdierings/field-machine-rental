import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { PageLoader } from "@/components/ui/page-loader";
import { Database } from "@/integrations/supabase/types";

type UserRole = Database['public']['Enums']['app_role'];

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  redirectTo?: string;
}

export const RoleProtectedRoute = ({
  children,
  allowedRoles,
  redirectTo = "/dashboard"
}: RoleProtectedRouteProps) => {
  const { user, role, loading, roleLoading } = useAuth();
  const location = useLocation();
  const { toast } = useToast();
  const [hasShownToast, setHasShownToast] = useState(false);

  const isAllowed = role ? allowedRoles.includes(role as UserRole) : false;

  useEffect(() => {
    if (!loading && !roleLoading && role && !isAllowed && !hasShownToast) {
      toast({
        title: "Acesso negado",
        description: "Você não tem permissão para acessar esta página",
        variant: "destructive"
      });
      setHasShownToast(true);
    }
  }, [loading, roleLoading, role, isAllowed, hasShownToast, toast]);

  if (loading || roleLoading) {
    return <PageLoader />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAllowed) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};
