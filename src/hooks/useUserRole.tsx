import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type UserRole = Database['public']['Enums']['app_role'] | null;

export const useUserRole = () => {
  const [role, setRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    fetchUserRole();

    // Listen to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUserId(session.user.id);
        fetchUserRole();
      } else {
        setRole(null);
        setUserId(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserRole = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        setRole(null);
        setUserId(null);
        setLoading(false);
        return;
      }

      setUserId(session.user.id);

      // Fetch user role from user_roles table
      const { data: userRoles, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id);

      if (error) {
        console.error('Error fetching user role:', error);
        setRole(null);
        return;
      }

      // Check for admin role first, then others
      // SECURITY: No role in database = no access (fail closed)
      if (userRoles && userRoles.length > 0) {
        const adminRole = userRoles.find(r => r.role === 'admin');
        if (adminRole) {
          setRole('admin');
        } else {
          setRole(userRoles[0].role);
        }
      } else {
        // Don't assign default role - users without roles have no permissions
        setRole(null);
      }
    } catch (err) {
      console.error('Failed to fetch user role:', err);
      setRole(null);
    } finally {
      setLoading(false);
    }
  };

  const hasRole = (requiredRole: UserRole | UserRole[]) => {
    if (!role) return false;
    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(role);
    }
    return role === requiredRole;
  };

  const isAdmin = () => role === 'admin';
  const isOwner = () => role === 'owner' || role === 'admin';
  const isRenter = () => role === 'renter' || role === 'admin';

  return {
    role,
    loading,
    userId,
    hasRole,
    isAdmin,
    isOwner,
    isRenter,
    refetch: fetchUserRole
  };
};
