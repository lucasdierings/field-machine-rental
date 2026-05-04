import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ReviewCard } from "@/components/ui/review-card";

interface Review {
    id: string;
    rating: number;
    service_rating: number | null;
    operator_rating: number | null;
    machine_rating: number | null;
    client_rating: number | null;
    comment: string | null;
    observations: string | null;
    review_type: string;
    created_at: string;
    reviewer?: {
        full_name: string;
    };
}

interface MachineReviewsSectionProps {
    reviews: Review[];
    avgRating: number;
}

export function MachineReviewsSection({ reviews, avgRating }: MachineReviewsSectionProps) {
    return (
        <div className="pb-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg md:text-xl font-semibold flex items-center gap-2">
                    <Star className="h-5 w-5 text-primary" />
                    Avaliações
                    {reviews.length > 0 && (
                        <Badge variant="secondary" className="ml-2">
                            {avgRating.toFixed(1)} ({reviews.length})
                        </Badge>
                    )}
                </h2>
            </div>

            {reviews.length > 0 ? (
                <div className="space-y-4">
                    {reviews.map((review) => (
                        <ReviewCard key={review.id} review={review} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 bg-muted/20 rounded-xl">
                    <Star className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                    <p className="text-muted-foreground font-medium">Ainda sem avaliações</p>
                    <p className="text-sm text-muted-foreground mt-1">
                        As avaliações aparecerão após os primeiros serviços realizados.
                    </p>
                </div>
            )}
        </div>
    );
}
