import { Star, Wrench, User, Tractor, ClipboardCheck, MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ReviewProps {
    review: {
        id: string;
        rating: number;
        service_rating?: number | null;
        operator_rating?: number | null;
        machine_rating?: number | null;
        client_rating?: number | null;
        comment?: string | null;
        observations?: string | null;
        review_type?: string;
        created_at: string;
        reviewer?: {
            full_name: string;
        };
        // Fallback for old schema
        communication_rating?: number | null;
        equipment_rating?: number | null;
        punctuality_rating?: number | null;
    };
}

const StarRating = ({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) => {
    const sizeClass = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    className={`${sizeClass} ${
                        star <= rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "fill-muted text-muted"
                    }`}
                />
            ))}
        </div>
    );
};

const RatingRow = ({ icon: Icon, label, rating }: { icon: any; label: string; rating: number }) => (
    <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Icon className="h-4 w-4" />
            <span>{label}</span>
        </div>
        <div className="flex items-center gap-2">
            <StarRating rating={rating} />
            <span className="text-sm font-medium w-6 text-right">{rating.toFixed(1)}</span>
        </div>
    </div>
);

export const ReviewCard = ({ review }: ReviewProps) => {
    const timeAgo = formatDistanceToNow(new Date(review.created_at), {
        addSuffix: true,
        locale: ptBR
    });

    const reviewerName = review.reviewer?.full_name || "Usuário";
    const initials = reviewerName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

    // Map fields from both new and old schema
    const serviceRating = review.service_rating ?? review.communication_rating;
    const operatorRating = review.operator_rating ?? review.punctuality_rating;
    const machineRating = review.machine_rating ?? review.equipment_rating;
    const clientRating = review.client_rating;

    const hasDetailedRatings = serviceRating || operatorRating || machineRating || clientRating;

    return (
        <Card className="overflow-hidden">
            <CardContent className="p-4 md:p-5">
                {/* Header */}
                <div className="flex items-start gap-3 mb-3">
                    <Avatar className="h-10 w-10 shrink-0">
                        <AvatarFallback className="text-xs font-medium bg-primary/10 text-primary">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                            <p className="font-medium text-sm truncate">{reviewerName}</p>
                            <span className="text-xs text-muted-foreground shrink-0">{timeAgo}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                            <StarRating rating={review.rating || 0} size="md" />
                            <span className="text-sm font-semibold">{(review.rating || 0).toFixed(1)}</span>
                        </div>
                    </div>
                </div>

                {/* Detailed Ratings */}
                {hasDetailedRatings && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3 p-3 bg-muted/20 rounded-lg">
                        {serviceRating && (
                            <RatingRow icon={ClipboardCheck} label="Serviço" rating={serviceRating} />
                        )}
                        {operatorRating && (
                            <RatingRow icon={User} label="Operador" rating={operatorRating} />
                        )}
                        {machineRating && (
                            <RatingRow icon={Tractor} label="Máquina" rating={machineRating} />
                        )}
                        {clientRating && (
                            <RatingRow icon={User} label="Cliente" rating={clientRating} />
                        )}
                    </div>
                )}

                {/* Comment */}
                {review.comment && (
                    <p className="text-sm text-foreground leading-relaxed mb-2">
                        {review.comment}
                    </p>
                )}

                {/* Observations (BlaBlaCar style) */}
                {review.observations && (
                    <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg mt-2">
                        <MessageSquare className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                        <p className="text-sm text-blue-700 dark:text-blue-300 italic">
                            {review.observations}
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
