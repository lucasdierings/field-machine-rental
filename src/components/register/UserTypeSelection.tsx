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
    setTimeout(() => {
      onNext();
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary-foreground mb-4">
            Bem-vindo ao FieldMachine
          </h1>
          <p className="text-xl text-primary-foreground/90">
            Escolha como você quer usar nossa plataforma
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Produtor Rural */}
          <Card 
            className={`p-8 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
              selectedType === 'producer' 
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
                <h2 className="text-3xl font-bold text-foreground mb-2">
                  Sou Produtor Rural
                </h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Preciso contratar serviços para minha produção
                </p>
              </div>

              <div className="space-y-3 text-left">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span className="text-foreground">Acesso a 500+ máquinas verificadas</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span className="text-foreground">Proprietários verificados</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span className="text-foreground">Pagamento seguro com garantia</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span className="text-foreground">Suporte técnico especializado</span>
                </div>
              </div>

              <Button 
                className="w-full bg-gradient-primary text-lg py-6"
                size="lg"
              >
                Cadastrar como Produtor
              </Button>
            </div>
          </Card>

          {/* Proprietário */}
          <Card 
            className={`p-8 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
              selectedType === 'owner' 
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
                <h2 className="text-3xl font-bold text-foreground mb-2">
                  Sou Prestador de Serviço
                </h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Quero oferecer serviços com minhas máquinas
                </p>
              </div>

              <div className="space-y-3 text-left">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-accent" />
                  <span className="text-foreground">Anúncio gratuito para suas máquinas</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-accent" />
                  <span className="text-foreground">Seguro completo incluído</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-accent" />
                  <span className="text-foreground">Pagamento garantido</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-accent" />
                  <span className="text-foreground">Gestão completa de contratações</span>
                </div>
              </div>

              <Button 
                className="w-full bg-accent text-accent-foreground text-lg py-6"
                size="lg"
              >
                Cadastrar como Prestador
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};