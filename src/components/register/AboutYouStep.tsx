import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { X, Tractor, Briefcase, UserCheck, ArrowRight, ArrowLeft } from "lucide-react";
import { RegisterFormData } from "@/hooks/useRegisterForm";
import { useState } from "react";

interface AboutYouStepProps {
  formData: RegisterFormData;
  errors: Record<string, string>;
  onUpdate: (updates: Partial<RegisterFormData>) => void;
  onNext: () => void;
  onPrev: () => void;
  onSkip?: () => void;
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

export const AboutYouStep = ({ formData, errors, onUpdate, onNext, onPrev, onSkip }: AboutYouStepProps) => {
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

  // Render common fields which are shown at the end
  const renderCommonFields = () => (
    <div className="space-y-2 pt-4 border-t animate-in fade-in duration-700">
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
  );

  const renderProducerFields = () => (
    <div className="space-y-4 animate-in slide-in-from-right duration-500">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-8 w-1 bg-primary rounded-full"></div>
        <h3 className="text-xl font-semibold">Dados da Produção</h3>
      </div>

      {/* Tamanho da propriedade */}
      <div className="space-y-2">
        <Label htmlFor="propertySize">
          Tamanho da Propriedade (hectares) *
        </Label>
        <Input
          id="propertySize"
          type="number"
          value={formData.propertySize || ''}
          onChange={(e) => onUpdate({ propertySize: e.target.value })}
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

      {/* Frequência de contratação */}
      <div className="space-y-2">
        <Label>
          Frequência de Contratação Esperada
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
    </div>
  );

  const renderOwnerFields = () => (
    <div className="space-y-4 animate-in slide-in-from-right duration-500">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-8 w-1 bg-accent rounded-full"></div>
        <h3 className="text-xl font-semibold">Dados do Prestador</h3>
      </div>

      {/* Número de máquinas */}
      <div className="space-y-2">
        <Label htmlFor="machinesCount">
          Quantas máquinas você possui? *
        </Label>
        <Input
          id="machinesCount"
          type="number"
          value={formData.machinesCount || ''}
          onChange={(e) => onUpdate({ machinesCount: e.target.value })}
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
          Experiência com Prestação de Serviços
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
    </div>
  );

  // Selection of intention
  const renderIntentionSelection = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Option 1: Producer */}
        <div
          className="cursor-pointer group relative overflow-hidden rounded-xl border p-6 hover:border-primary hover:shadow-md transition-all duration-300"
          onClick={() => onUpdate({ userType: 'producer' })}
        >
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-3 bg-green-100 text-green-700 rounded-full group-hover:scale-110 transition-transform duration-300">
              <Tractor className="w-8 h-8" />
            </div>
            <h3 className="font-semibold text-lg">Sou Produtor</h3>
            <p className="text-sm text-muted-foreground">
              Tenho uma propriedade e busco máquinas para serviços.
            </p>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
        </div>

        {/* Option 2: Provider (Owner) */}
        <div
          className="cursor-pointer group relative overflow-hidden rounded-xl border p-6 hover:border-primary hover:shadow-md transition-all duration-300"
          onClick={() => onUpdate({ userType: 'owner' })}
        >
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-3 bg-blue-100 text-blue-700 rounded-full group-hover:scale-110 transition-transform duration-300">
              <Briefcase className="w-8 h-8" />
            </div>
            <h3 className="font-semibold text-lg">Sou Prestador</h3>
            <p className="text-sm text-muted-foreground">
              Tenho máquinas e quero prestar serviços para terceiros.
            </p>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-cyan-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
        </div>

        {/* Option 3: Both */}
        <div
          className="cursor-pointer group relative overflow-hidden rounded-xl border p-6 hover:border-primary hover:shadow-md transition-all duration-300"
          onClick={() => onUpdate({ userType: 'both' })}
        >
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-3 bg-purple-100 text-purple-700 rounded-full group-hover:scale-110 transition-transform duration-300">
              <UserCheck className="w-8 h-8" />
            </div>
            <h3 className="font-semibold text-lg">Ambos</h3>
            <p className="text-sm text-muted-foreground">
              Quero tanto contratar serviços quanto oferecer minhas máquinas.
            </p>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
        </div>
      </div>

      <div className="text-center text-sm text-muted-foreground pt-4">
        * Você pode alterar essa configuração a qualquer momento no seu perfil.
      </div>
    </div>
  );

  // If no user type is selected yet, show selection screen
  if (!formData.userType) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-4xl shadow-card my-8">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              Qual seu objetivo?
            </CardTitle>
            <p className="text-muted-foreground text-lg">
              Isso nos ajuda a personalizar sua experiência. Não se preocupe, você poderá mudar depois.
            </p>
          </CardHeader>
          <CardContent className="pt-6 pb-8">
            {renderIntentionSelection()}

            <div className="flex justify-start pt-8">
              <Button variant="ghost" onClick={onPrev} className="gap-2 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-4 h-4" /> Voltar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-card my-8">
        <CardHeader className="text-center relative">
          <Button
            variant="ghost"
            size="sm"
            className="absolute left-0 top-0 text-xs text-muted-foreground hover:text-foreground m-4 gap-1"
            onClick={() => onUpdate({ userType: undefined })}
          >
            <ArrowLeft className="w-3 h-3" /> Alterar Objetivo
          </Button>

          <CardTitle className="text-3xl pt-2">Sobre Você</CardTitle>
          <p className="text-muted-foreground">
            {formData.userType === 'both'
              ? 'Conte-nos sobre sua produção e seus serviços'
              : formData.userType === 'producer'
                ? 'Conte-nos mais sobre sua propriedade'
                : 'Conte-nos sobre seu negócio'
            }
          </p>
        </CardHeader>
        <CardContent className="space-y-8">
          {(formData.userType === 'producer' || formData.userType === 'both') && renderProducerFields()}

          {formData.userType === 'both' && <div className="border-t border-dashed my-6"></div>}

          {(formData.userType === 'owner' || formData.userType === 'both') && renderOwnerFields()}

          {renderCommonFields()}

          <div className="flex justify-between pt-6">
            <Button variant="outline" onClick={() => onUpdate({ userType: undefined })}>
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