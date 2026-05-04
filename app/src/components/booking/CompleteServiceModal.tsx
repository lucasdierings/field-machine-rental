import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2, CheckCircle2, DollarSign, Ruler, Clock } from "lucide-react";

interface CompleteServiceModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: (data: {
        negotiatedPrice: number;
        billingType: string;
        billingQuantity: number;
    }) => void;
    bookingId: string;
    machineName: string;
    estimatedAmount: number;
    loading?: boolean;
}

const BILLING_TYPES = [
    { value: "hora", label: "Horas", icon: Clock, unit: "h" },
    { value: "hectare", label: "Hectares", icon: Ruler, unit: "ha" },
    { value: "dia", label: "Diárias", icon: Clock, unit: "dias" },
    { value: "unidade", label: "Unidades", icon: Ruler, unit: "un" },
    { value: "tonelada", label: "Toneladas", icon: Ruler, unit: "t" },
    { value: "km", label: "Quilômetros", icon: Ruler, unit: "km" },
];

export const CompleteServiceModal = ({
    open,
    onOpenChange,
    onConfirm,
    machineName,
    estimatedAmount,
    loading = false,
}: CompleteServiceModalProps) => {
    const [negotiatedPrice, setNegotiatedPrice] = useState<string>(
        estimatedAmount > 0 ? estimatedAmount.toString() : ""
    );
    const [billingType, setBillingType] = useState<string>("");
    const [billingQuantity, setBillingQuantity] = useState<string>("1");
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!negotiatedPrice || Number(negotiatedPrice) <= 0) {
            newErrors.price = "Informe o valor negociado";
        }
        if (!billingType) {
            newErrors.type = "Selecione o tipo de cobrança";
        }
        if (!billingQuantity || Number(billingQuantity) <= 0) {
            newErrors.quantity = "Informe a quantidade";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleConfirm = () => {
        if (!validate()) return;

        onConfirm({
            negotiatedPrice: Number(negotiatedPrice),
            billingType,
            billingQuantity: Number(billingQuantity),
        });
    };

    const selectedType = BILLING_TYPES.find((t) => t.value === billingType);
    const unitPrice =
        Number(negotiatedPrice) > 0 && Number(billingQuantity) > 0
            ? Number(negotiatedPrice) / Number(billingQuantity)
            : 0;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        Concluir Serviço
                    </DialogTitle>
                    <DialogDescription>
                        Registre os detalhes financeiros do serviço realizado com a máquina{" "}
                        <strong>{machineName}</strong>.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    {/* Negotiated Price */}
                    <div className="space-y-2">
                        <Label htmlFor="negotiated-price" className="flex items-center gap-1.5">
                            <DollarSign className="h-4 w-4 text-green-600" />
                            Valor Total Negociado (R$)
                        </Label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                                R$
                            </span>
                            <Input
                                id="negotiated-price"
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="0,00"
                                className={`pl-10 ${errors.price ? "border-red-500" : ""}`}
                                value={negotiatedPrice}
                                onChange={(e) => {
                                    setNegotiatedPrice(e.target.value);
                                    if (errors.price) setErrors((prev) => ({ ...prev, price: "" }));
                                }}
                            />
                        </div>
                        {errors.price && (
                            <p className="text-xs text-red-500">{errors.price}</p>
                        )}
                        {estimatedAmount > 0 && (
                            <p className="text-xs text-muted-foreground">
                                Valor de referência: R${" "}
                                {estimatedAmount.toLocaleString("pt-BR", {
                                    minimumFractionDigits: 2,
                                })}
                            </p>
                        )}
                    </div>

                    {/* Billing Type */}
                    <div className="space-y-2">
                        <Label htmlFor="billing-type" className="flex items-center gap-1.5">
                            <Ruler className="h-4 w-4 text-blue-600" />
                            Tipo de Cobrança
                        </Label>
                        <Select
                            value={billingType}
                            onValueChange={(v) => {
                                setBillingType(v);
                                if (errors.type) setErrors((prev) => ({ ...prev, type: "" }));
                            }}
                        >
                            <SelectTrigger
                                className={errors.type ? "border-red-500" : ""}
                                id="billing-type"
                            >
                                <SelectValue placeholder="Selecione..." />
                            </SelectTrigger>
                            <SelectContent>
                                {BILLING_TYPES.map((bt) => (
                                    <SelectItem key={bt.value} value={bt.value}>
                                        {bt.label} ({bt.unit})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.type && (
                            <p className="text-xs text-red-500">{errors.type}</p>
                        )}
                    </div>

                    {/* Billing Quantity */}
                    <div className="space-y-2">
                        <Label htmlFor="billing-qty" className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4 text-purple-600" />
                            Quantidade ({selectedType?.label || "unidades"})
                        </Label>
                        <Input
                            id="billing-qty"
                            type="number"
                            step="0.1"
                            min="0.1"
                            placeholder="Ex: 5"
                            className={errors.quantity ? "border-red-500" : ""}
                            value={billingQuantity}
                            onChange={(e) => {
                                setBillingQuantity(e.target.value);
                                if (errors.quantity)
                                    setErrors((prev) => ({ ...prev, quantity: "" }));
                            }}
                        />
                        {errors.quantity && (
                            <p className="text-xs text-red-500">{errors.quantity}</p>
                        )}
                    </div>

                    {/* Summary */}
                    {Number(negotiatedPrice) > 0 && billingType && Number(billingQuantity) > 0 && (
                        <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-4 space-y-1.5">
                            <p className="text-sm font-semibold text-green-800 dark:text-green-300">
                                Resumo do Serviço
                            </p>
                            <div className="flex justify-between text-sm">
                                <span className="text-green-700 dark:text-green-400">
                                    {Number(billingQuantity)} {selectedType?.unit} × R${" "}
                                    {unitPrice.toLocaleString("pt-BR", {
                                        minimumFractionDigits: 2,
                                    })}
                                    /{selectedType?.unit}
                                </span>
                            </div>
                            <div className="flex justify-between text-base font-bold border-t border-green-200 dark:border-green-800 pt-2 mt-2">
                                <span className="text-green-800 dark:text-green-300">Total</span>
                                <span className="text-green-700 dark:text-green-300">
                                    R${" "}
                                    {Number(negotiatedPrice).toLocaleString("pt-BR", {
                                        minimumFractionDigits: 2,
                                    })}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="flex gap-2 sm:gap-0">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={loading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        disabled={loading}
                        className="bg-green-600 hover:bg-green-700 text-white"
                    >
                        {loading ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                        )}
                        Confirmar Conclusão
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
