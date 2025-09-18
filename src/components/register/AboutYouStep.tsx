import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { RegisterFormData } from "@/hooks/useRegisterForm";
import { useState } from "react";

interface AboutYouStepProps {
  formData: RegisterFormData;
  errors: Record<string, string>;
  onUpdate: (updates: Partial<RegisterFormData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const CROPS_OPTIONS = [
  'Soja', 'Milho', 'Algodão', 'Cana-de-açúcar', 'Café', 'Arroz', 'Feijão', 
  'Trigo', 'Pastagem', 'Eucalipto', 'Amendoim', 'Sorgo', 'Girassol'
];

const FREQUENCY_OPTIONS = [
  { value: 'seasonal', label: 'Sazonal (época de plantio/colheita)' },
  { value: 'monthly', label: 'Mensal' },
  { value: 'quarterly', label: 'Trimestral' },
  { value: 'yearly', label: 'Anual' },
  { value: 'sporadic', label: 'Esporádica' }
];

const HOW_FOUND_OPTIONS = [
  { value: 'google', label: 'Google' },
  { value: 'social', label: 'Redes Sociais' },
  { value: 'indication', label: 'Indicação' },
  { value: 'event', label: 'Evento/Feira' },
  { value: 'magazine', label: 'Revista/Jornal' },
  { value: 'other', label: 'Outros' }
];

const EXPERIENCE_OPTIONS = [
  { value: 'none', label: 'Nunca aluguei' },
  { value: 'beginner', label: '1-2 anos' },
  { value: 'intermediate', label: '3-5 anos' },
  { value: 'experienced', label: 'Mais de 5 anos' }
];

export const AboutYouStep = ({ formData, errors, onUpdate, onNext, onPrev }: AboutYouStepProps) => {
  const [newCrop, setNewCrop] = useState('');

  const addCrop = (crop: string) => {
    if (crop && !formData.mainCrops?.includes(crop)) {
      onUpdate({ 
        mainCrops: [...(formData.mainCrops || []), crop] 
      });
    }
    setNewCrop('');
  };

  const removeCrop = (cropToRemove: string) => {
    onUpdate({ 
      mainCrops: formData.mainCrops?.filter(crop => crop !== cropToRemove) || []
    });
  };

  if (formData.userType === 'producer') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl shadow-card">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">Sobre Sua Produção</CardTitle>
            <p className="text-muted-foreground">
              Conte-nos mais sobre sua propriedade
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              {/* Tamanho da propriedade */}
              <div className="space-y-2">
                <Label htmlFor="propertySize">
                  Tamanho da Propriedade (hectares) *
                </Label>
                <Input
                  id="propertySize"
                  type="number"
                  value={formData.propertySize || ''}
                  onChange={(e) => onUpdate({ propertySize: Number(e.target.value) })}
                  placeholder="Ex: 150"
                  className={errors.propertySize ? 'border-destructive' : ''}
                />
                {errors.propertySize && (
                  <p className="text-sm text-destructive">{errors.propertySize}</p>
                )}
              </div>

              {/* Principais culturas */}
              <div className="space-y-2">
                <Label>
                  Principais Culturas *
                </Label>
                <Select onValueChange={addCrop}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione as culturas..." />
                  </SelectTrigger>
                  <SelectContent>
                    {CROPS_OPTIONS.map((crop) => (
                      <SelectItem key={crop} value={crop}>
                        {crop}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {formData.mainCrops && formData.mainCrops.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.mainCrops.map((crop) => (
                      <Badge key={crop} variant="secondary" className="flex items-center gap-1">
                        {crop}
                        <X 
                          className="w-3 h-3 cursor-pointer" 
                          onClick={() => removeCrop(crop)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
                {errors.mainCrops && (
                  <p className="text-sm text-destructive">{errors.mainCrops}</p>
                )}
              </div>

              {/* Frequência de aluguel */}
              <div className="space-y-2">
                <Label>
                  Frequência de Aluguel Esperada
                </Label>
                <Select 
                  value={formData.rentalFrequency} 
                  onValueChange={(value) => onUpdate({ rentalFrequency: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {FREQUENCY_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Como conheceu */}
              <div className="space-y-2">
                <Label>
                  Como conheceu a FieldMachine?
                </Label>
                <Select 
                  value={formData.howFoundUs} 
                  onValueChange={(value) => onUpdate({ howFoundUs: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {HOW_FOUND_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
  }

  // Proprietário
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-card">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Sobre Suas Máquinas</CardTitle>
          <p className="text-muted-foreground">
            Conte-nos sobre seu negócio
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {/* Número de máquinas */}
            <div className="space-y-2">
              <Label htmlFor="machinesCount">
                Quantas máquinas você possui? *
              </Label>
              <Input
                id="machinesCount"
                type="number"
                value={formData.machinesCount || ''}
                onChange={(e) => onUpdate({ machinesCount: Number(e.target.value) })}
                placeholder="Ex: 5"
                className={errors.machinesCount ? 'border-destructive' : ''}
              />
              {errors.machinesCount && (
                <p className="text-sm text-destructive">{errors.machinesCount}</p>
              )}
            </div>

            {/* Experiência */}
            <div className="space-y-2">
              <Label>
                Experiência com Locação
              </Label>
              <Select 
                value={formData.rentalExperience} 
                onValueChange={(value) => onUpdate({ rentalExperience: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {EXPERIENCE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Disponibilidade para entrega */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="deliveryAvailable"
                checked={formData.deliveryAvailable}
                onCheckedChange={(checked) => onUpdate({ deliveryAvailable: !!checked })}
              />
              <Label htmlFor="deliveryAvailable">
                Disponibilidade para entrega nas propriedades
              </Label>
            </div>

            {/* Conta bancária */}
            <div className="space-y-2">
              <Label htmlFor="bankAccount">
                Conta Bancária para Recebimentos
              </Label>
              <Input
                id="bankAccount"
                value={formData.bankAccount || ''}
                onChange={(e) => onUpdate({ bankAccount: e.target.value })}
                placeholder="Banco, agência e conta (será validado posteriormente)"
              />
              <p className="text-xs text-muted-foreground">
                Essas informações serão verificadas em nosso processo de validação
              </p>
            </div>

            {/* Como conheceu */}
            <div className="space-y-2">
              <Label>
                Como conheceu a FieldMachine?
              </Label>
              <Select 
                value={formData.howFoundUs} 
                onValueChange={(value) => onUpdate({ howFoundUs: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {HOW_FOUND_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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