import { useState } from "react";
import { Star, ClipboardCheck, User, Tractor, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface ReviewFormProps {
    bookingId: string;
    reviewedId: string;
    reviewType: "owner_reviews_client" | "client_reviews_owner";
    onSuccess?: () => void;
}

const InteractiveStars = ({
    value,
    onChange,
    size = "md"
}: {
    value: number;
    onChange: (v: number) => void;
    size?: "sm" | "md" | "lg";
}) => {
    const [hover, setHover] = useState(0);
    const sizeMap = { sm: "h-5 w-5", md: "h-7 w-7", lg: "h-9 w-9" };
    const sizeClass = sizeMap[size];

    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    className="transition-transform hover:scale-110 active:scale-95"
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                    onClick={() => onChange(star)}
                >
                    <Star
                        className={`${sizeClass} transition-colors ${
                            star <= (hover || value)
                                ? "fill-yellow-400 text-yellow-400"
                                : "fill-muted text-muted-foreground/30"
                        }`}
                    />
                </button>
            ))}
            {value > 0 && (
                <span className="ml-2 text-sm font-medium text-muted-foreground">
                    {value === 1 && "Ruim"}
                    {value === 2 && "Regular"}
                    {value === 3 && "Bom"}
                    {value === 4 && "Muito bom"}
                    {value === 5 && "Excelente"}
                </span>
            )}
        </div>
    );
};

const RatingCategory = ({
    icon: Icon,
    label,
    description,
    value,
    onChange
}: {
    icon: any;
    label: string;
    description: string;
    value: number;
    onChange: (v: number) => void;
}) => (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-3 md:p-4 rounded-xl bg-muted/20 border border-border/50">
        <div className="flex items-center gap-3 sm:min-w-[160px]">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Icon className="h-5 w-5 text-primary" />
            </div>
            <div>
                <p className="font-medium text-sm">{label}</p>
                <p className="text-xs text-muted-foreground">{description}</p>
            </div>
        </div>
        <div className="ml-auto sm:ml-0">
            <InteractiveStars value={value} onChange={onChange} size="sm" />
        </div>
    </div>
);

export const ReviewForm = ({ bookingId, reviewedId, reviewType, onSuccess }: ReviewFormProps) => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [rating, setRating] = useState(0);
    const [serviceRating, setServiceRating] = useState(0);
    const [operatorRating, setOperatorRating] = useState(0);
    const [machineRating, setMachineRating] = useState(0);
    const [clientRating, setClientRating] = useState(0);
    const [comment, setComment] = useState("");
    const [observations, setObservations] = useState("");

    const isOwnerReviewing = reviewType === "owner_reviews_client";

    const handleSubmit = async () => {
        if (rating === 0) {
            toast({
                title: "Avaliação obrigatória",
                description: "Selecione uma nota geral para continuar.",
                variant: "destructive"
            });
            return;
        }

        try {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                toast({
                    title: "Login necessário",
                    description: "Faça login para avaliar.",
                    variant: "destructive"
                });
                return;
            }

            const reviewData: any = {
                booking_id: bookingId,
                reviewer_id: user.id,
                reviewed_id: reviewedId,
                rating,
                comment: comment || null,
            };

            // Add specific ratings based on review type
            if (isOwnerReviewing) {
                // Owner reviews the client
                reviewData.client_rating = clientRating || null;
                reviewData.communication_rating = serviceRating || null;
            } else {
                // Client reviews the service/operator/machine
                reviewData.equipment_rating = machineRating || null;
                reviewData.punctuality_rating = operatorRating || null;
                reviewData.communication_rating = serviceRating || null;
            }

            const { error } = await supabase
                .from('reviews')
                .insert(reviewData);

            if (error) throw error;

            toast({
                title: "Avaliação enviada!",
                description: "Obrigado por avaliar. Sua opinião ajuda toda a comunidade.",
            });

            onSuccess?.();
        } catch (error: any) {
            toast({
                title: "Erro ao enviar avaliação",
                description: error.message,
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="overflow-hidden">
            <CardHeader className="pb-4">
                <CardTitle className="text-lg md:text-xl flex items-center gap-2">
                    <Star className="h-5 w-5 text-primary" />
                    {isOwnerReviewing ? "Avaliar o Cliente" : "Avaliar o Serviço"}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                    {isOwnerReviewing
                        ? "Como foi trabalhar com este cliente? Sua avaliação ajuda outros prestadores."
                        : "Como foi a experiência? Avalie cada aspecto do serviço para ajudar a comunidade."
                    }
                </p>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Overall Rating */}
                <div className="text-center py-4">
                    <p className="text-sm font-medium text-muted-foreground mb-3">Nota Geral</p>
                    <InteractiveStars value={rating} onChange={setRating} size="lg" />
                </div>

                {/* Category Ratings */}
                <div className="space-y-3">
                    <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                        Avaliações detalhadas
                    </p>

                    {!isOwnerReviewing ? (
                        <>
                            <RatingCategory
                                icon={ClipboardCheck}
                                label="Serviço"
                                description="Qualidade do trabalho realizado"
                                value={serviceRating}
                                onChange={setServiceRating}
                            />
                            <RatingCategory
                                icon={User}
                                label="Operador"
                                description="Profissionalismo e competência"
                                value={operatorRating}
                                onChange={setOperatorRating}
                            />
                            <RatingCategory
                                icon={Tractor}
                                label="Máquina"
                                description="Condição e desempenho do equipamento"
                                value={machineRating}
                                onChange={setMachineRating}
                            />
                        </>
                    ) : (
                        <>
                            <RatingCategory
                                icon={User}
                                label="Cliente"
                                description="Respeito e comunicação"
                                value={clientRating}
                                onChange={setClientRating}
                            />
                            <RatingCategory
                                icon={ClipboardCheck}
                                label="Organização"
                                description="Preparação e pontualidade"
                                value={serviceRating}
                                onChange={setServiceRating}
                            />
                        </>
                    )}
                </div>

                {/* Comment */}
                <div>
                    <label className="text-sm font-medium mb-2 block">
                        Comentário
                    </label>
                    <Textarea
                        placeholder={isOwnerReviewing
                            ? "Conte como foi a experiência com este cliente..."
                            : "Conte como foi a experiência com o serviço..."
                        }
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="min-h-[80px] resize-none"
                    />
                </div>

                {/* Observations (BlaBlaCar style tips) */}
                <div>
                    <label className="text-sm font-medium mb-2 block">
                        Observações para a comunidade
                        <span className="text-muted-foreground font-normal ml-1">(opcional)</span>
                    </label>
                    <Textarea
                        placeholder={isOwnerReviewing
                            ? "Ex: Cliente bem organizado, área de fácil acesso..."
                            : "Ex: Chega no horário, traz água para a equipe, estrada de acesso boa..."
                        }
                        value={observations}
                        onChange={(e) => setObservations(e.target.value)}
                        className="min-h-[60px] resize-none"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                        Dicas e observações que podem ajudar outros usuários na próxima contratação.
                    </p>
                </div>

                {/* Submit */}
                <Button
                    className="w-full h-12 text-base font-semibold bg-gradient-primary"
                    onClick={handleSubmit}
                    disabled={loading || rating === 0}
                >
                    {loading ? (
                        <Loader2 className="animate-spin mr-2 h-5 w-5" />
                    ) : (
                        <Send className="mr-2 h-5 w-5" />
                    )}
                    Enviar Avaliação
                </Button>
            </CardContent>
        </Card>
    );
};
