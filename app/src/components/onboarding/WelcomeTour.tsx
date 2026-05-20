import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tractor, Search, CalendarCheck, UserCircle, LifeBuoy, Package, ClipboardList } from "lucide-react";

const TOUR_KEY = "fieldmachine_tour_completed";

interface TourStep {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const PRODUCER_STEPS: TourStep[] = [
  {
    icon: <Tractor className="h-12 w-12 text-primary" />,
    title: "Bem-vindo ao FieldMachine!",
    description:
      "Aqui voce encontra maquinas e servicos agricolas perto de voce. Conectamos produtores a proprietarios de equipamentos de forma simples e segura.",
  },
  {
    icon: <Search className="h-12 w-12 text-blue-500" />,
    title: "Buscar Maquinas",
    description:
      "Use a busca para encontrar maquinas por regiao, categoria e tipo de servico. Filtre por preco, disponibilidade e avaliacao dos proprietarios.",
  },
  {
    icon: <CalendarCheck className="h-12 w-12 text-green-500" />,
    title: "Fazer Reservas",
    description:
      "Encontrou a maquina ideal? Selecione as datas, envie sua solicitacao e aguarde a confirmacao do proprietario. Tudo pelo app!",
  },
  {
    icon: <UserCircle className="h-12 w-12 text-orange-500" />,
    title: "Seu Perfil",
    description:
      "Complete seu perfil com foto e documentos para aumentar a confianca dos proprietarios. Perfis completos tem mais chances de aprovacao.",
  },
  {
    icon: <LifeBuoy className="h-12 w-12 text-purple-500" />,
    title: "Precisa de ajuda?",
    description:
      "Estamos aqui para ajudar! Acesse o Suporte no menu para enviar um chamado, ou entre em contato pelo email contato@fieldmachine.com.br.",
  },
];

const OWNER_STEPS: TourStep[] = [
  {
    icon: <Tractor className="h-12 w-12 text-primary" />,
    title: "Bem-vindo ao FieldMachine!",
    description:
      "Aqui voce pode oferecer suas maquinas e servicos agricolas para produtores da regiao. Transforme seus equipamentos em renda extra!",
  },
  {
    icon: <Package className="h-12 w-12 text-blue-500" />,
    title: "Cadastrar Maquinas",
    description:
      "Adicione suas maquinas com fotos, descricao detalhada e preco por hora, hectare ou diaria. Quanto mais completo, mais solicitacoes voce recebe.",
  },
  {
    icon: <ClipboardList className="h-12 w-12 text-green-500" />,
    title: "Gerenciar Reservas",
    description:
      "Quando um produtor solicitar sua maquina, voce recebe uma notificacao. Aceite ou recuse pedidos direto pelo painel, com todas as informacoes.",
  },
  {
    icon: <UserCircle className="h-12 w-12 text-orange-500" />,
    title: "Seu Perfil",
    description:
      "Complete seu perfil com foto e documentos para transmitir confianca. Proprietarios verificados aparecem em destaque nas buscas.",
  },
  {
    icon: <LifeBuoy className="h-12 w-12 text-purple-500" />,
    title: "Precisa de ajuda?",
    description:
      "Estamos aqui para ajudar! Acesse o Suporte no menu para enviar um chamado, ou entre em contato pelo email contato@fieldmachine.com.br.",
  },
];

interface WelcomeTourProps {
  userType?: string | null;
}

export function WelcomeTour({ userType }: WelcomeTourProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = userType === "owner" ? OWNER_STEPS : PRODUCER_STEPS;

  useEffect(() => {
    const completed = localStorage.getItem(TOUR_KEY);
    if (!completed) {
      // Small delay so the dashboard renders first
      const timer = setTimeout(() => setIsOpen(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleClose();
    }
  };

  const handleClose = () => {
    localStorage.setItem(TOUR_KEY, "true");
    setIsOpen(false);
  };

  const step = steps[currentStep];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) handleClose(); }}>
      <DialogContent className="sm:max-w-md">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <DialogHeader className="items-center text-center space-y-4 pt-4">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                {step.icon}
              </div>
              <DialogTitle className="text-xl">{step.title}</DialogTitle>
              <DialogDescription className="text-sm leading-relaxed">
                {step.description}
              </DialogDescription>
            </DialogHeader>
          </motion.div>
        </AnimatePresence>

        {/* Step dots */}
        <div className="flex justify-center gap-1.5 py-2">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all ${
                i === currentStep ? "w-6 bg-primary" : "w-2 bg-muted-foreground/20"
              }`}
            />
          ))}
        </div>

        <DialogFooter className="flex-row gap-2 sm:justify-between">
          <Button variant="ghost" size="sm" onClick={handleClose} className="text-muted-foreground">
            Pular
          </Button>
          <Button onClick={handleNext} className="bg-primary hover:bg-primary/90">
            {currentStep < steps.length - 1 ? "Proximo" : "Comecar!"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
