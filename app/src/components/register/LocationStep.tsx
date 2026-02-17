import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Navigation } from "lucide-react";
import { RegisterFormData } from "@/hooks/useRegisterForm";
import { LocationSelector } from "@/components/ui/location-selector";

interface LocationStepProps {
  formData: RegisterFormData;
  errors: Record<string, string>;
  onUpdate: (updates: Partial<RegisterFormData>) => void;
  onNext: () => void;
  onPrev: () => void;
  onSkip?: () => void;
}

export const LocationStep = ({ formData, errors, onUpdate, onNext, onPrev, onSkip }: LocationStepProps) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-card">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Localização</CardTitle>
          <p className="text-muted-foreground">
            Onde você está localizado?
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {/* Localização via Seletor */}
            <div className="space-y-2">
              <Label>Localização</Label>
              <LocationSelector
                onLocationChange={(loc) => {
                  onUpdate({
                    city: loc.city,
                    state: loc.state,
                    // country: loc.country // We might want to store country later
                  });
                }}
                initialData={{
                  country: 'BRASIL', // Default or derived
                  state: formData.state,
                  city: formData.city
                }}
              />
              {(errors.city || errors.state) && (
                <p className="text-sm text-destructive">
                  {errors.city || errors.state}
                </p>
              )}
            </div>

            {/* Ponto de referência */}
            <div className="space-y-2">
              <Label htmlFor="reference">
                Ponto de Referência
              </Label>
              <Input
                id="reference"
                value={formData.reference}
                onChange={(e) => onUpdate({ reference: e.target.value })}
                placeholder="Ex: Próximo ao posto Shell da BR-101"
              />
            </div>

            {/* Área de atuação */}
            <div className="space-y-4">
              <Label className="flex items-center gap-2">
                <Navigation className="w-4 h-4" />
                Área de Atuação: {formData.radius} km
              </Label>
              <div className="px-4">
                <Slider
                  value={[formData.radius]}
                  onValueChange={(value) => onUpdate({ radius: value[0] })}
                  max={500}
                  min={5}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground mt-2">
                  <span>5 km</span>
                  <span>500 km</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Distância máxima para {formData.userType === 'producer' ? 'buscar máquinas' : 'entregar máquinas'}
              </p>
            </div>
          </div>

          <div className="flex justify-between pt-6">
            <Button variant="outline" onClick={onPrev}>
              Voltar
            </Button>
            <div className="flex gap-2">
              {onSkip && (
                <Button variant="ghost" onClick={onSkip}>
                  Pular por Enquanto
                </Button>
              )}
              <Button onClick={onNext} className="bg-gradient-primary">
                Continuar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};