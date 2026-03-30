import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
export const Footer = () => {
  return <footer className="bg-muted/50 border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="font-bold text-2xl">
              Field<span className="text-primary">Machine</span>
            </div>
            <p className="text-muted-foreground text-sm">
              A plataforma que conecta proprietários de máquinas agrícolas com produtores rurais de forma rápida e segura.
            </p>
            <div className="flex space-x-3">
              <a href="https://wa.me/5545991447004" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors">
                <MessageCircle className="h-4 w-4 text-primary" />
              </a>
              <a href="mailto:contato@fieldmachine.com.br" className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors">
                <Mail className="h-4 w-4 text-primary" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Empresa</h3>
            <div className="space-y-2 text-sm">
              <Link to="/sobre" className="block text-muted-foreground hover:text-primary transition-colors">Sobre nós</Link>
              <Link to="/como-funciona" className="block text-muted-foreground hover:text-primary transition-colors">Como funciona</Link>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Suporte</h3>
            <div className="space-y-2 text-sm">
              <Link to="/ajuda" className="block text-muted-foreground hover:text-primary transition-colors">Central de ajuda</Link>
              <Link to="/termos" className="block text-muted-foreground hover:text-primary transition-colors">Termos de uso</Link>
              <Link to="/privacidade" className="block text-muted-foreground hover:text-primary transition-colors">Política de privacidade</Link>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Contato</h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <a href="tel:+5545991447004" className="flex items-center space-x-2 hover:text-primary transition-colors">
                <Phone className="h-4 w-4" />
                <span>(45) 99144-7004</span>
              </a>
              <a href="mailto:contato@fieldmachine.com.br" className="flex items-center space-x-2 hover:text-primary transition-colors">
                <Mail className="h-4 w-4" />
                <span>contato@fieldmachine.com.br</span>
              </a>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Curitiba, Paraná</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>&copy; 2024 FieldMachine. Todos os direitos reservados.</p>
          <p className="mt-2 md:mt-0">Desenvolvido para o agronegócio brasileiro</p>
        </div>
      </div>
    </footer>;
};
