import { Header } from "@/components/ui/header";
import { EnhancedFooter } from "@/components/ui/enhanced-footer";
import { SEO } from "@/components/SEO";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Mail, Phone, Clock, MessageCircle } from "lucide-react";

const faqItems = [
  {
    question: "Como faço para alugar uma máquina?",
    answer:
      "É simples! Crie sua conta na plataforma, busque a máquina ou serviço desejado usando os filtros de localização e categoria, escolha o prestador que melhor atende sua necessidade, selecione as datas e envie uma solicitação de reserva. O proprietário receberá sua solicitação e poderá aceitar ou propor ajustes. Após a confirmação, você receberá todos os detalhes para retirada ou entrega da máquina.",
  },
  {
    question: "Como cadastro minha máquina para aluguel?",
    answer:
      'Após criar sua conta, acesse a opção "Oferecer Serviços" no menu. Preencha as informações da máquina (modelo, ano, capacidade, fotos, localização e preço por diária). Quanto mais detalhado o anúncio, maiores as chances de atrair locatários. Após a aprovação, sua máquina ficará visível para todos os produtores da região.',
  },
  {
    question: "Quais formas de pagamento são aceitas?",
    answer:
      "Aceitamos pagamentos via PIX, cartão de crédito (parcelamento em até 12x) e boleto bancário. Todos os pagamentos são processados de forma segura através da nossa plataforma. O valor é liberado ao proprietário após a confirmação de entrega da máquina.",
  },
  {
    question: "Como funciona o seguro das máquinas?",
    answer:
      "Recomendamos que proprietários mantenham seguro próprio para suas máquinas. A FieldMachine atua como intermediária e não oferece cobertura de seguro diretamente. Durante o processo de reserva, proprietário e locatário podem acordar sobre responsabilidades em caso de danos. Sugerimos sempre formalizar as condições antes do início da locação.",
  },
  {
    question: "Posso cancelar uma reserva?",
    answer:
      "Sim. A política de cancelamento varia conforme o prazo: cancelamentos feitos até 48 horas antes do início recebem reembolso de 100% (exceto taxa de serviço); entre 24h e 48h antes, reembolso de 50%; com menos de 24h, não há reembolso. Proprietários podem cancelar sem penalidade apenas em casos de força maior (quebra mecânica, por exemplo).",
  },
  {
    question: "Como entro em contato com o proprietário?",
    answer:
      "Após enviar uma solicitação de reserva, você terá acesso ao sistema de mensagens da plataforma para se comunicar diretamente com o proprietário. Todas as mensagens ficam registradas para segurança de ambas as partes. Recomendamos que toda a comunicação seja feita dentro da plataforma.",
  },
  {
    question: "Qual a área de cobertura do FieldMachine?",
    answer:
      "Atualmente atendemos todo o estado do Paraná, com foco nas principais regiões agrícolas: Oeste (Cascavel, Toledo, Foz do Iguaçu), Norte (Londrina, Maringá, Apucarana), Centro (Guarapuava, Ponta Grossa) e Região Metropolitana de Curitiba. Estamos em expansão para outros estados do Sul do Brasil.",
  },
  {
    question: "Como verifico minha conta?",
    answer:
      'Para verificar sua conta, acesse "Meus Documentos" no painel do usuário e envie os documentos solicitados (RG ou CNH e comprovante de endereço). Nossa equipe analisa os documentos em até 48 horas úteis. Contas verificadas têm mais visibilidade na plataforma e transmitem mais confiança para outros usuários.',
  },
];

const Help = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Central de Ajuda"
        description="Tire suas dúvidas sobre a plataforma FieldMachine. Perguntas frequentes sobre aluguel de máquinas agrícolas."
        canonical="/ajuda"
      />
      <Header />
      <main className="container mx-auto px-4 py-8 pt-24 max-w-4xl">
        <h1 className="text-4xl font-bold mb-2">Central de Ajuda</h1>
        <p className="text-muted-foreground mb-8">
          Encontre respostas para as perguntas mais frequentes sobre a plataforma.
        </p>

        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Perguntas Frequentes</h2>
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Ainda precisa de ajuda?</h2>
            <p className="text-muted-foreground mb-6">
              Nossa equipe está pronta para atender você. Entre em contato por um dos canais abaixo:
            </p>
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">E-mail</p>
                  <a
                    href="mailto:contato@fieldmachine.com.br"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    contato@fieldmachine.com.br
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                  <MessageCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">WhatsApp</p>
                  <a
                    href="https://wa.me/5545991447004"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    (45) 99144-7004
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Horário</p>
                  <p className="text-sm text-muted-foreground">
                    Segunda a Sexta<br />8h às 18h
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      <EnhancedFooter />
    </div>
  );
};

export default Help;
