import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Fetches bookings for the current user filtered by role (renter or owner).
 * Also fetches and merges user profile data for both parties.
 */
export function useUserBookings(role: 'renter' | 'owner') {
  const { userId } = useAuth();

  return useQuery({
    queryKey: ['bookings', userId, role],
    queryFn: async () => {
      const column = role === 'renter' ? 'renter_id' : 'owner_id';

      const { data: rawBookings, error } = await supabase
        .from('bookings')
        .select('*, machines(name, category, brand)')
        .eq(column, userId!)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const bookingsList = rawBookings || [];

      // Fetch profiles for all unique user IDs
      const userIds = [...new Set([
        ...bookingsList.map((b: any) => b.renter_id),
        ...bookingsList.map((b: any) => b.owner_id),
      ].filter(Boolean))];

      let profileMap: Record<string, { full_name: string; phone?: string; profile_image?: string | null; verified?: boolean }> = {};
      if (userIds.length > 0) {
        // RLS "Booking partners can view profile" autoriza phone para
        // contrapartes de uma booking; "Users can view own profile" para o
        // próprio user. avatar_url não existe em user_profiles — coluna
        // correta é profile_image.
        const { data: profiles } = await supabase
          .from('user_profiles')
          .select('auth_user_id, full_name, phone, profile_image, verified')
          .in('auth_user_id', userIds);
        profileMap = Object.fromEntries((profiles || []).map((p: any) => [p.auth_user_id, p]));
      }

      return bookingsList.map((b: any) => ({
        ...b,
        renter: profileMap[b.renter_id] || null,
        owner: profileMap[b.owner_id] || null,
      }));
    },
    enabled: !!userId,
  });
}

/**
 * Fetches ALL bookings where the current user is either renter or owner.
 */
export function useAllUserBookings() {
  const { userId } = useAuth();

  return useQuery({
    queryKey: ['bookings', userId, 'all'],
    queryFn: async () => {
      const { data: rawBookings, error } = await supabase
        .from('bookings')
        .select('*, machines(name, category, brand)')
        .or(`renter_id.eq.${userId},owner_id.eq.${userId}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const bookingsList = rawBookings || [];

      const userIds = [...new Set([
        ...bookingsList.map((b: any) => b.renter_id),
        ...bookingsList.map((b: any) => b.owner_id),
      ].filter(Boolean))];

      let profileMap: Record<string, { full_name: string; phone?: string; profile_image?: string | null; verified?: boolean }> = {};
      if (userIds.length > 0) {
        // RLS "Booking partners can view profile" autoriza phone para
        // contrapartes de uma booking; "Users can view own profile" para o
        // próprio user. avatar_url não existe em user_profiles — coluna
        // correta é profile_image.
        const { data: profiles } = await supabase
          .from('user_profiles')
          .select('auth_user_id, full_name, phone, profile_image, verified')
          .in('auth_user_id', userIds);
        profileMap = Object.fromEntries((profiles || []).map((p: any) => [p.auth_user_id, p]));
      }

      return bookingsList.map((b: any) => ({
        ...b,
        renter: profileMap[b.renter_id] || null,
        owner: profileMap[b.owner_id] || null,
      }));
    },
    enabled: !!userId,
  });
}
