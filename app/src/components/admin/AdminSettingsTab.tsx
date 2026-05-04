import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Settings, DollarSign, Loader2, Save, Shield, Clock } from "lucide-react";

interface AppSetting {
    key: string;
    value: string;
    description: string | null;
}

const AdminSettingsTab = () => {
    const { toast } = useToast();
    const [settings, setSettings] = useState<Record<string, string>>({});
    const [descriptions, setDescriptions] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [originalSettings, setOriginalSettings] = useState<Record<string, string>>({});

    const loadSettings = useCallback(async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from("app_settings")
                .select("*");

            if (error) throw error;

            const settingsMap: Record<string, string> = {};
            const descMap: Record<string, string> = {};
            (data || []).forEach((s: AppSetting) => {
                settingsMap[s.key] = s.value;
                if (s.description) descMap[s.key] = s.description;
            });

            setSettings(settingsMap);
            setOriginalSettings(settingsMap);
            setDescriptions(descMap);
        } catch (error: any) {
            toast({ title: "Erro ao carregar configurações", description: error.message, variant: "destructive" });
        } finally {
            setLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        loadSettings();
    }, [loadSettings]);

    const updateSetting = (key: string, value: string) => {
        setSettings(prev => ({ ...prev, [key]: value }));
        setHasChanges(true);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // Only save changed settings
            const changedKeys = Object.keys(settings).filter(
                key => settings[key] !== originalSettings[key]
            );

            for (const key of changedKeys) {
                const { error } = await supabase
                    .from("app_settings")
                    .update({ value: settings[key] })
                    .eq("key", key);

                if (error) throw error;
            }

            setOriginalSettings({ ...settings });
            setHasChanges(false);
            toast({ title: "Configurações salvas!" });
        } catch (error: any) {
            toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
        } finally {
            setSaving(false);
        }
    };

    const handleDiscard = () => {
        setSettings({ ...originalSettings });
        setHasChanges(false);
    };

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin" />
            </div>
        );
    }

    const feeEnabled = settings.platform_fee_enabled === "true";
    const feePercentage = settings.platform_fee_percentage || "5";
    const feeMin = settings.platform_fee_min || "0";
    const feeMax = settings.platform_fee_max || "0";
    const feePayer = settings.platform_fee_payer || "owner";
    const maintenanceMode = settings.maintenance_mode === "true";
    const supportEmail = settings.support_email || "";
    const minBookingAdvance = settings.min_booking_advance_hours || "24";

    return (
        <div className="space-y-6">
            {/* Save Bar */}
            {hasChanges && (
                <div className="sticky top-0 z-10 bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-center justify-between">
                    <p className="text-sm text-yellow-800 font-medium">Você tem alterações não salvas.</p>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={handleDiscard}>Descartar</Button>
                        <Button size="sm" onClick={handleSave} disabled={saving}>
                            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Save className="h-4 w-4 mr-1" />}
                            Salvar Tudo
                        </Button>
                    </div>
                </div>
            )}

            {/* Platform Fee Configuration */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-green-600" />
                        Taxa da Plataforma
                        {feeEnabled ? (
                            <Badge className="bg-green-100 text-green-800 ml-2">Ativa</Badge>
                        ) : (
                            <Badge variant="outline" className="ml-2">Desativada</Badge>
                        )}
                    </CardTitle>
                    <CardDescription>
                        Configure a taxa cobrada por negociação concluída na plataforma.
                        Quando ativada, a taxa será aplicada automaticamente ao concluir um serviço.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Toggle */}
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <div>
                            <p className="font-medium">Cobrar taxa por negociação</p>
                            <p className="text-sm text-muted-foreground">
                                {feeEnabled
                                    ? `Taxa de ${feePercentage}% cobrada do ${feePayer === "owner" ? "prestador" : feePayer === "renter" ? "produtor" : "ambos (dividido)"}`
                                    : "Nenhuma taxa sendo cobrada no momento"}
                            </p>
                        </div>
                        <Switch
                            checked={feeEnabled}
                            onCheckedChange={(checked) => updateSetting("platform_fee_enabled", checked ? "true" : "false")}
                        />
                    </div>

                    {/* Fee details — always visible for configuration */}
                    <div className={`space-y-4 ${!feeEnabled ? "opacity-60" : ""}`}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label>Percentual da taxa (%)</Label>
                                <Input
                                    type="number"
                                    min="0"
                                    max="30"
                                    step="0.5"
                                    value={feePercentage}
                                    onChange={(e) => updateSetting("platform_fee_percentage", e.target.value)}
                                />
                                <p className="text-xs text-muted-foreground">Ex: 5 = cobra 5% do valor da negociação</p>
                            </div>

                            <div className="space-y-2">
                                <Label>Valor mínimo (R$)</Label>
                                <Input
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={feeMin}
                                    onChange={(e) => updateSetting("platform_fee_min", e.target.value)}
                                />
                                <p className="text-xs text-muted-foreground">0 = sem mínimo</p>
                            </div>

                            <div className="space-y-2">
                                <Label>Valor máximo (R$)</Label>
                                <Input
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={feeMax}
                                    onChange={(e) => updateSetting("platform_fee_max", e.target.value)}
                                />
                                <p className="text-xs text-muted-foreground">0 = sem limite máximo</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Quem paga a taxa?</Label>
                            <Select value={feePayer} onValueChange={(v) => updateSetting("platform_fee_payer", v)}>
                                <SelectTrigger className="w-full md:w-[300px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="owner">Prestador de serviço (owner)</SelectItem>
                                    <SelectItem value="renter">Produtor rural (renter)</SelectItem>
                                    <SelectItem value="split">Dividido entre ambos</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Preview */}
                        {feeEnabled && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <p className="text-sm font-medium text-green-800 mb-2">Exemplo de cobrança:</p>
                                <p className="text-sm text-green-700">
                                    Negociação de <strong>R$ 5.000,00</strong> →
                                    Taxa de <strong>R$ {(5000 * Number(feePercentage) / 100).toFixed(2)}</strong>
                                    {Number(feeMin) > 0 && Number(5000 * Number(feePercentage) / 100) < Number(feeMin) && (
                                        <span> (mínimo R$ {Number(feeMin).toFixed(2)})</span>
                                    )}
                                    {Number(feeMax) > 0 && Number(5000 * Number(feePercentage) / 100) > Number(feeMax) && (
                                        <span> (máximo R$ {Number(feeMax).toFixed(2)})</span>
                                    )}
                                    {" — pago pelo "}
                                    <strong>{feePayer === "owner" ? "prestador" : feePayer === "renter" ? "produtor" : "ambos"}</strong>
                                </p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* General Settings */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        Configurações Gerais
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Support Email */}
                    <div className="space-y-2">
                        <Label>Email de Suporte</Label>
                        <Input
                            type="email"
                            value={supportEmail}
                            onChange={(e) => updateSetting("support_email", e.target.value)}
                            placeholder="suporte@fieldmachine.com.br"
                        />
                    </div>

                    {/* Min Booking Advance */}
                    <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Antecedência mínima para reservas (horas)
                        </Label>
                        <Input
                            type="number"
                            min="0"
                            step="1"
                            value={minBookingAdvance}
                            onChange={(e) => updateSetting("min_booking_advance_hours", e.target.value)}
                            className="w-full md:w-[200px]"
                        />
                        <p className="text-xs text-muted-foreground">
                            Tempo mínimo entre a criação da reserva e a data do serviço
                        </p>
                    </div>

                    <Separator />

                    {/* Maintenance Mode */}
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <div>
                            <p className="font-medium flex items-center gap-2">
                                <Shield className="h-4 w-4 text-red-500" />
                                Modo Manutenção
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Quando ativo, exibe uma página de manutenção para os visitantes
                            </p>
                        </div>
                        <Switch
                            checked={maintenanceMode}
                            onCheckedChange={(checked) => updateSetting("maintenance_mode", checked ? "true" : "false")}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminSettingsTab;
