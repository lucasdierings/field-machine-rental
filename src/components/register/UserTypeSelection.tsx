import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, Tractor, Wheat } from "lucide-react";
import { UserType } from "@/hooks/useRegisterForm";

interface UserTypeSelectionProps {
  selectedType: UserType | null;
  onSelect: (type: UserType) => void;
  onNext: () => void;
}

export const UserTypeSelection = ({ selectedType, onSelect, onNext }: UserTypeSelectionProps) => {
  const handleTypeSelect = (type: UserType) => {
    onSelect(type);
    // Single click advance
    setTimeout(() => {
      onNext();
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary-foreground mb-4">
            Bem-vindo ao FieldMachine
          </h1>
          <p className="text-xl text-primary-foreground/90">
            Escolha como você quer usar nossa plataforma
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Produtor Rural */}
          <Card
            className={`p-6 cursor-pointer transition-all duration-300 transform hover:scale-105 ${selectedType === 'producer'
                ? 'ring-4 ring-primary bg-primary/10 shadow-hero'
                : 'bg-card/95 backdrop-blur-sm hover:shadow-card'
              }`}
            onClick={() => handleTypeSelect('producer')}
          >
            <div className="text-center space-y-6">
              <div className="relative">
                <Wheat className="w-16 h-16 mx-auto text-primary" />
                {selectedType === 'producer' && (
                  <CheckCircle className="w-8 h-8 text-primary absolute -top-2 -right-2 bg-background rounded-full" />
                )}
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Sou Produtor Rural
                </h2>
                <p className="text-base text-muted-foreground mb-6">
                  Preciso contratar serviços para minha produção
                </p>
              </div>

              <div className="space-y-3 text-left text-sm">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  <span className="text-foreground">Acesso a máquinas verificadas</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  <span className="text-foreground">Pagamento seguro</span>
                </div>
              </div>

              <Button
                className="w-full bg-gradient-primary text-lg py-6 mt-4"
                size="lg"
              >
                Sou Produtor
              </Button>
            </div>
          </Card>

          {/* Ambos */}
          <Card
            className={`p-6 cursor-pointer transition-all duration-300 transform hover:scale-105 ${selectedType === 'both'
                ? 'ring-4 ring-purple-500 bg-purple-500/10 shadow-hero'
                : 'bg-card/95 backdrop-blur-sm hover:shadow-card'
              }`}
            onClick={() => handleTypeSelect('both')}
          >
            <div className="text-center space-y-6">
              <div className="relative">
                <div className="flex justify-center -space-x-4">
                  <Wheat className="w-16 h-16 text-primary z-10" />
                  <Tractor className="w-16 h-16 text-accent z-0" />
                </div>
                {selectedType === 'both' && (
                  <CheckCircle className="w-8 h-8 text-purple-500 absolute -top-2 -right-2 bg-background rounded-full" />
                )}
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Quero Ambos
                </h2>
                <p className="text-base text-muted-foreground mb-6">
                  Produzo e também presto serviços com minhas máquinas
                </p>
              </div>

              <div className="space-y-3 text-left text-sm">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-purple-500" />
                  <span className="text-foreground">Contrate e anuncie</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-purple-500" />
                  <span className="text-foreground">Gestão completa</span>
                </div>
              </div>

              <Button
                className="w-full bg-purple-600 hover:bg-purple-700 text-white text-lg py-6 mt-4"
                size="lg"
              >
                Quero Ambos
              </Button>
            </div>
          </Card>

          {/* Proprietário */}
          <Card
            className={`p-6 cursor-pointer transition-all duration-300 transform hover:scale-105 ${selectedType === 'owner'
                ? 'ring-4 ring-accent bg-accent/10 shadow-hero'
                : 'bg-card/95 backdrop-blur-sm hover:shadow-card'
              }`}
            onClick={() => handleTypeSelect('owner')}
          >
            <div className="text-center space-y-6">
              <div className="relative">
                <Tractor className="w-16 h-16 mx-auto text-accent" />
                {selectedType === 'owner' && (
                  <CheckCircle className="w-8 h-8 text-accent absolute -top-2 -right-2 bg-background rounded-full" />
                )}
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Sou Prestador
                </h2>
                <p className="text-base text-muted-foreground mb-6">
                  Quero oferecer serviços com minhas máquinas
                </p>
              </div>

              <div className="space-y-3 text-left text-sm">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  <span className="text-foreground">Anúncio gratuito</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  <span className="text-foreground">Pagamento garantido</span>
                </div>
              </div>

              <Button
                className="w-full bg-accent text-accent-foreground text-lg py-6 mt-4"
                size="lg"
              >
                Sou Prestador
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};