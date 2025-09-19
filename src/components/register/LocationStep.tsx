import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { MapPin, Navigation } from "lucide-react";
import { RegisterFormData } from "@/hooks/useRegisterForm";
import { useState } from "react";

interface LocationStepProps {
  formData: RegisterFormData;
  errors: Record<string, string>;
  onUpdate: (updates: Partial<RegisterFormData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const LocationStep = ({ formData, errors, onUpdate, onNext, onPrev }: LocationStepProps) => {
  const [isLoadingCep, setIsLoadingCep] = useState(false);

  const formatCep = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 5) return numbers;
    return numbers.replace(/(\d{5})(\d{3})/, '$1-$2');
  };

  const handleCepChange = async (value: string) => {
    const numbers = value.replace(/\D/g, '');
    const formatted = formatCep(numbers);
    onUpdate({ cep: numbers }); // Store only numbers for validation

    if (numbers.length === 8) {
      setIsLoadingCep(true);
      try {
        const response = await fetch(`https://viacep.com.br/ws/${numbers}/json/`);
        const data = await response.json();
        
        if (!data.erro) {
          onUpdate({
            address: data.logradouro,
            city: data.localidade,
            state: data.uf,
          });
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
      } finally {
        setIsLoadingCep(false);
      }
    }
  };

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
            {/* CEP */}
            <div className="space-y-2">
              <Label htmlFor="cep" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                CEP *
              </Label>
              <div className="relative">
                <Input
                  id="cep"
                  value={formatCep(formData.cep)}
                  onChange={(e) => handleCepChange(e.target.value)}
                  placeholder="00000-000"
                  maxLength={9}
                  className={errors.cep ? 'border-destructive' : ''}
                />
                {isLoadingCep && (
                  <div className="absolute right-3 top-3">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  </div>
                )}
              </div>
              {errors.cep && (
                <p className="text-sm text-destructive">{errors.cep}</p>
              )}
            </div>

            {/* Endereço */}
            <div className="space-y-2">
              <Label htmlFor="address">
                Endereço Completo *
              </Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => onUpdate({ address: e.target.value })}
                placeholder="Rua, número, bairro"
                className={errors.address ? 'border-destructive' : ''}
              />
              {errors.address && (
                <p className="text-sm text-destructive">{errors.address}</p>
              )}
            </div>

            {/* Cidade e Estado */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="city">
                  Cidade *
                </Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => onUpdate({ city: e.target.value })}
                  placeholder="Sua cidade"
                  className={errors.city ? 'border-destructive' : ''}
                />
                {errors.city && (
                  <p className="text-sm text-destructive">{errors.city}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">
                  Estado *
                </Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => onUpdate({ state: e.target.value.toUpperCase() })}
                  placeholder="UF"
                  maxLength={2}
                  className={errors.state ? 'border-destructive' : ''}
                />
                {errors.state && (
                  <p className="text-sm text-destructive">{errors.state}</p>
                )}
              </div>
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
            <Button onClick={onNext} className="bg-gradient-primary">
              Continuar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};