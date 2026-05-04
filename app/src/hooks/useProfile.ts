import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ProfileUpdate {
  full_name: string;
  phone: string;
  cpf_cnpj?: string;
  address?: Record<string, string>;
  profile_image?: string;
}

/**
 * Mutation hook for updating the current user's profile.
 */
export function useUpdateProfile() {
  const { userId } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: ProfileUpdate) => {
      if (!userId) throw new Error('Usuário não autenticado');

      const { error } = await supabase
        .from('user_profiles')
        .upsert(
          {
            auth_user_id: userId,
            ...values,
          },
          { onConflict: 'auth_user_id' }
        );

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', userId] });
    },
  });
}
