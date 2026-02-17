import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Fetches all available machines (public listing).
 * Includes review/rating aggregation.
 */
export function useAllMachines() {
  return useQuery({
    queryKey: ['machines-list'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('machines')
        .select('*')
        .eq('status', 'available')
        .limit(50);

      if (error) throw error;
      if (!data || data.length === 0) return [];

      const machineIds = data.map((m: any) => m.id);
      const { data: bookingsWithReviews } = await supabase
        .from('bookings')
        .select('machine_id, reviews(id, rating, review_type)')
        .in('machine_id', machineIds);

      const ratingMap: Record<string, { sum: number; count: number }> = {};
      (bookingsWithReviews || []).forEach((b: any) => {
        const clientReviews = (b.reviews || []).filter(
          (r: any) => r.review_type === 'client_reviews_owner'
        );
        clientReviews.forEach((r: any) => {
          if (!ratingMap[b.machine_id]) ratingMap[b.machine_id] = { sum: 0, count: 0 };
          ratingMap[b.machine_id].sum += r.rating;
          ratingMap[b.machine_id].count += 1;
        });
      });

      return data.map((m: any) => ({
        ...m,
        rating: ratingMap[m.id]?.count > 0
          ? ratingMap[m.id].sum / ratingMap[m.id].count
          : 0,
        reviewCount: ratingMap[m.id]?.count || 0,
      }));
    },
  });
}

/**
 * Fetches a single machine by ID, including owner profile and images.
 */
export function useMachine(id: string | undefined) {
  return useQuery({
    queryKey: ['machine-details', id],
    queryFn: async () => {
      if (!id) return null;

      const { data: machineData, error } = await supabase
        .from('machines')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      let ownerData = null;
      if (machineData.owner_id) {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('full_name, verified')
          .eq('auth_user_id', machineData.owner_id)
          .maybeSingle();

        if (profile) {
          ownerData = {
            full_name: profile.full_name,
            avatar_url: '',
            isVerified: profile.verified === true,
          };
        }
      }

      const { data: machineImages } = await supabase
        .from('machine_images')
        .select('image_url')
        .eq('machine_id', id)
        .order('order_index');

      const images = machineImages?.map((img: any) => img.image_url) || [];

      return {
        ...machineData,
        images,
        owner: ownerData,
      };
    },
    enabled: !!id,
  });
}

/**
 * Fetches the current user's own machines (owner view).
 */
export function useUserMachines() {
  const { userId } = useAuth();

  return useQuery({
    queryKey: ['my-machines', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('machines')
        .select('*, machine_images(image_url, is_primary, order_index)')
        .eq('owner_id', userId!)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map((machine: any) => {
        const sortedImages = machine.machine_images?.sort((a: any, b: any) => {
          if (a.is_primary === true && b.is_primary !== true) return -1;
          if (b.is_primary === true && a.is_primary !== true) return 1;
          return (a.order_index || 0) - (b.order_index || 0);
        });
        return {
          ...machine,
          images: sortedImages?.map((img: any) => img.image_url) || [],
        };
      });
    },
    enabled: !!userId,
  });
}
