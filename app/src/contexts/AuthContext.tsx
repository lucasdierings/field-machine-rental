import { createContext, useContext, useEffect, useState, useCallback, useMemo, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

// ─── Types ───────────────────────────────────────────────────────────────────

interface UserProfile {
    id: string;
    auth_user_id: string;
    full_name: string | null;
    phone: string | null;
    cpf_cnpj: string | null;
    email: string | null;
    user_types: string[] | null;
    verified: boolean | null;
    created_at: string;
    updated_at: string;
}

type AppRole = 'admin' | 'owner' | 'renter' | null;

interface AuthContextType {
    // Auth state
    user: User | null;
    session: Session | null;
    loading: boolean;

    // Profile state
    profile: UserProfile | null;
    profileLoading: boolean;

    // Role state
    role: AppRole;
    roleLoading: boolean;

    // Derived helpers
    isAuthenticated: boolean;
    isAdmin: boolean;
    isOwner: boolean;
    isRenter: boolean;
    isVerified: boolean;
    userId: string | null;

    // Actions
    signOut: () => Promise<void>;
    refreshProfile: () => Promise<void>;
    refreshRole: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Provider ────────────────────────────────────────────────────────────────

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [profileLoading, setProfileLoading] = useState(true);

    const [role, setRole] = useState<AppRole>(null);
    const [roleLoading, setRoleLoading] = useState(true);

    // ─── Fetch profile ──────────────────────────────────────────────────────

    const fetchProfile = useCallback(async (authUserId: string) => {
        try {
            setProfileLoading(true);
            const { data, error } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('auth_user_id', authUserId)
                .maybeSingle();

            if (error) {
                if (import.meta.env.DEV) console.error('Error fetching profile:', error);
                setProfile(null);
                return;
            }

            setProfile(data as UserProfile | null);
        } catch (err) {
            if (import.meta.env.DEV) console.error('Failed to fetch profile:', err);
            setProfile(null);
        } finally {
            setProfileLoading(false);
        }
    }, []);

    // ─── Fetch role ─────────────────────────────────────────────────────────

    const fetchRole = useCallback(async (authUserId: string) => {
        try {
            setRoleLoading(true);
            const { data: userRoles, error } = await supabase
                .from('user_roles')
                .select('role')
                .eq('user_id', authUserId);

            if (error) {
                if (import.meta.env.DEV) console.error('Error fetching role:', error);
                setRole(null);
                return;
            }

            if (userRoles && userRoles.length > 0) {
                const adminRole = userRoles.find(r => r.role === 'admin');
                setRole(adminRole ? 'admin' : (userRoles[0].role as AppRole));
            } else {
                setRole(null);
            }
        } catch (err) {
            if (import.meta.env.DEV) console.error('Failed to fetch role:', err);
            setRole(null);
        } finally {
            setRoleLoading(false);
        }
    }, []);

    // ─── Initialize auth ───────────────────────────────────────────────────

    useEffect(() => {
        let mounted = true;

        // Get initial session
        supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
            if (!mounted) return;

            setSession(currentSession);
            setUser(currentSession?.user ?? null);
            setLoading(false);

            if (currentSession?.user) {
                fetchProfile(currentSession.user.id);
                fetchRole(currentSession.user.id);
            } else {
                setProfile(null);
                setProfileLoading(false);
                setRole(null);
                setRoleLoading(false);
            }
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, newSession) => {
                if (!mounted) return;

                setSession(newSession);
                setUser(newSession?.user ?? null);
                setLoading(false);

                if (newSession?.user) {
                    // Refresh profile and role on auth change
                    fetchProfile(newSession.user.id);
                    fetchRole(newSession.user.id);
                } else {
                    setProfile(null);
                    setProfileLoading(false);
                    setRole(null);
                    setRoleLoading(false);
                }
            }
        );

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, [fetchProfile, fetchRole]);

    // ─── Actions ────────────────────────────────────────────────────────────

    const signOut = useCallback(async () => {
        await supabase.auth.signOut();
        setUser(null);
        setSession(null);
        setProfile(null);
        setRole(null);
    }, []);

    const refreshProfile = useCallback(async () => {
        if (user) await fetchProfile(user.id);
    }, [user, fetchProfile]);

    const refreshRole = useCallback(async () => {
        if (user) await fetchRole(user.id);
    }, [user, fetchRole]);

    // ─── Derived values ─────────────────────────────────────────────────────

    const value = useMemo<AuthContextType>(() => ({
        user,
        session,
        loading,
        profile,
        profileLoading,
        role,
        roleLoading,

        // Derived
        isAuthenticated: !!user,
        isAdmin: role === 'admin',
        isOwner: role === 'owner' || role === 'admin',
        isRenter: role === 'renter' || role === 'admin',
        isVerified: profile?.verified === true,
        userId: user?.id ?? null,

        // Actions
        signOut,
        refreshProfile,
        refreshRole,
    }), [user, session, loading, profile, profileLoading, role, roleLoading, signOut, refreshProfile, refreshRole]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

// Optional: hook that returns just the user (for components that only need that)
export function useCurrentUser() {
    const { user, loading } = useAuth();
    return { user, loading };
}

// Optional: hook that returns just the profile
export function useProfile() {
    const { profile, profileLoading, refreshProfile, isVerified } = useAuth();
    return { profile, loading: profileLoading, refreshProfile, isVerified };
}
