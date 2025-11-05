import { Separator } from "@/components/ui/separator";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";
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
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/20 transition-colors">
                <Facebook className="h-4 w-4 text-primary" />
              </div>
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/20 transition-colors">
                <Instagram className="h-4 w-4 text-primary" />
              </div>
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/20 transition-colors">
                <Twitter className="h-4 w-4 text-primary" />
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Empresa</h3>
            <div className="space-y-2 text-sm">
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">Sobre nós</a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">Como funciona</a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">Carreiras</a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">Imprensa</a>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Suporte</h3>
            <div className="space-y-2 text-sm">
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">Central de ajuda</a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">Termos de uso</a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">Política de privacidade</a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">Segurança</a>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Contato</h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>(65) 3333-4444</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>contato@fieldmachine.com.br</span>
              </div>
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