import { supabase } from "@/integrations/supabase/client";

/**
 * Verifica se o usuário tem documentos aprovados
 */
export const hasApprovedDocuments = async (userId: string): Promise<boolean> => {
    try {
        const { data, error } = await supabase
            .from('user_documents')
            .select('id')
            .eq('user_id', userId)
            .eq('verified', true)
            .limit(1);

        if (error) throw error;
        return (data?.length || 0) > 0;
    } catch (error) {
        console.error("Erro ao verificar documentos:", error);
        return false;
    }
};

/**
 * Retorna o status de verificação de documentos do usuário
 */
export const getDocumentVerificationStatus = async (userId: string): Promise<{
    hasDocuments: boolean;
    hasPending: boolean;
    hasApproved: boolean;
    hasRejected: boolean;
    totalDocuments: number;
}> => {
    try {
        const { data, error } = await supabase
            .from('user_documents')
            .select('verified')
            .eq('user_id', userId);

        if (error) throw error;

        const docs = data || [];
        const hasApproved = docs.some(d => d.verified === true);
        const hasPending = docs.some(d => d.verified === null);
        const hasRejected = docs.some(d => d.verified === false);

        return {
            hasDocuments: docs.length > 0,
            hasPending,
            hasApproved,
            hasRejected,
            totalDocuments: docs.length,
        };
    } catch (error) {
        console.error("Erro ao verificar status de documentos:", error);
        return {
            hasDocuments: false,
            hasPending: false,
            hasApproved: false,
            hasRejected: false,
            totalDocuments: 0,
        };
    }
};

/**
 * Calcula a média de avaliações de um usuário (como prestador/proprietário)
 */
export const getUserRating = async (userId: string): Promise<{
    averageRating: number;
    totalReviews: number;
}> => {
    try {
        // Busca reviews onde o usuário é o "reviewed" (o avaliado)
        const { data, error } = await supabase
            .from('reviews')
            .select('rating, service_rating, operator_rating, machine_rating')
            .eq('reviewed_id', userId);

        if (error) throw error;

        const reviews = data || [];
        if (reviews.length === 0) {
            return { averageRating: 0, totalReviews: 0 };
        }

        // Calcula média ponderada: rating geral tem mais peso
        let totalScore = 0;
        let totalCount = 0;

        reviews.forEach((review: any) => {
            if (review.rating) {
                totalScore += review.rating * 2; // Peso 2x para rating geral
                totalCount += 2;
            }
            if (review.service_rating) {
                totalScore += review.service_rating;
                totalCount++;
            }
            if (review.operator_rating) {
                totalScore += review.operator_rating;
                totalCount++;
            }
            if (review.machine_rating) {
                totalScore += review.machine_rating;
                totalCount++;
            }
        });

        const averageRating = totalCount > 0 ? totalScore / totalCount : 0;

        return {
            averageRating: Math.round(averageRating * 10) / 10, // Arredonda para 1 casa decimal
            totalReviews: reviews.length,
        };
    } catch (error) {
        console.error("Erro ao calcular rating:", error);
        return { averageRating: 0, totalReviews: 0 };
    }
};

/**
 * Calcula a média de avaliações como cliente (quem aluga)
 */
export const getUserClientRating = async (userId: string): Promise<{
    averageRating: number;
    totalReviews: number;
}> => {
    try {
        const { data, error } = await supabase
            .from('reviews')
            .select('client_rating, communication_rating, punctuality_rating')
            .eq('reviewed_id', userId);

        if (error) throw error;

        const reviews = data || [];
        if (reviews.length === 0) {
            return { averageRating: 0, totalReviews: 0 };
        }

        let totalScore = 0;
        let totalCount = 0;

        reviews.forEach((review: any) => {
            if (review.client_rating) {
                totalScore += review.client_rating * 2; // Peso maior para avaliação do cliente
                totalCount += 2;
            }
            if (review.communication_rating) {
                totalScore += review.communication_rating;
                totalCount++;
            }
            if (review.punctuality_rating) {
                totalScore += review.punctuality_rating;
                totalCount++;
            }
        });

        const averageRating = totalCount > 0 ? totalScore / totalCount : 0;

        return {
            averageRating: Math.round(averageRating * 10) / 10,
            totalReviews: reviews.length,
        };
    } catch (error) {
        console.error("Erro ao calcular rating do cliente:", error);
        return { averageRating: 0, totalReviews: 0 };
    }
};
