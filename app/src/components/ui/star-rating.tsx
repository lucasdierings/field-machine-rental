import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
    rating: number; // 0-5
    maxStars?: number;
    size?: "sm" | "md" | "lg";
    showNumber?: boolean;
    totalReviews?: number;
    className?: string;
}

export const StarRating = ({
    rating,
    maxStars = 5,
    size = "md",
    showNumber = true,
    totalReviews,
    className,
}: StarRatingProps) => {
    const sizeClasses = {
        sm: "w-3 h-3",
        md: "w-4 h-4",
        lg: "w-5 h-5",
    };

    const textSizeClasses = {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base",
    };

    const renderStars = () => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        // Estrelas cheias
        for (let i = 0; i < fullStars; i++) {
            stars.push(
                <Star
                    key={`full-${i}`}
                    className={cn(sizeClasses[size], "fill-yellow-400 text-yellow-400")}
                />
            );
        }

        // Meia estrela
        if (hasHalfStar && fullStars < maxStars) {
            stars.push(
                <div key="half" className="relative inline-block">
                    <Star className={cn(sizeClasses[size], "text-gray-300")} />
                    <div className="absolute top-0 left-0 overflow-hidden" style={{ width: "50%" }}>
                        <Star className={cn(sizeClasses[size], "fill-yellow-400 text-yellow-400")} />
                    </div>
                </div>
            );
        }

        // Estrelas vazias
        const emptyStars = maxStars - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars.push(
                <Star
                    key={`empty-${i}`}
                    className={cn(sizeClasses[size], "text-gray-300")}
                />
            );
        }

        return stars;
    };

    if (rating === 0 && totalReviews === 0) {
        return (
            <div className={cn("flex items-center gap-1 text-gray-400", className)}>
                <Star className={cn(sizeClasses[size])} />
                <span className={cn(textSizeClasses[size])}>Sem avaliações</span>
            </div>
        );
    }

    return (
        <div className={cn("flex items-center gap-1.5", className)}>
            <div className="flex items-center gap-0.5">{renderStars()}</div>
            {showNumber && (
                <span className={cn("font-medium text-gray-700", textSizeClasses[size])}>
                    {rating.toFixed(1)}
                    {totalReviews !== undefined && totalReviews > 0 && (
                        <span className="text-gray-400 font-normal ml-0.5">
                            ({totalReviews})
                        </span>
                    )}
                </span>
            )}
        </div>
    );
};
