import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
const cidadesPrincipais = ["Curitiba", "Londrina", "Maringá", "Cascavel", "Ponta Grossa", "Foz do Iguaçu", "Guarapuava", "Toledo", "Apucarana", "Campo Largo"];
export const EnhancedFooter = () => {
  return <footer className="bg-card border-t border-border">
    <div className="container mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <h3 className="font-bold text-2xl">
              Field<span className="text-primary">Machine</span>
            </h3>
          </div>
          <p className="text-muted-foreground">
            A maior plataforma de serviços agrícolas do Paraná.
            Conectamos produtores e prestadores de serviço de forma segura e confiável.
          </p>

          {/* Contact Icons */}
          <div className="flex space-x-3">
            <a href="https://wa.me/5545991447004" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors">
              <MessageCircle className="h-5 w-5 text-primary" />
            </a>
            <a href="mailto:contato@fieldmachine.com.br" className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors">
              <Mail className="h-5 w-5 text-primary" />
            </a>
          </div>
        </div>

        {/* Cities */}
        <div className="space-y-4">
          <h4 className="font-semibold text-lg">Cidades Atendidas</h4>
          <div className="space-y-2">
            {cidadesPrincipais.map(cidade => <Link key={cidade} to={`/servicos/${cidade.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-")}`} className="block text-muted-foreground hover:text-primary transition-colors text-sm">
              Serviço de Trator em {cidade}
            </Link>)}
          </div>
        </div>

        {/* Institutional Links */}
        <div className="space-y-4">
          <h4 className="font-semibold text-lg">Institucional</h4>
          <div className="space-y-2">
            <Link to="/sobre" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
              Sobre nós
            </Link>
            <Link to="/como-funciona" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
              Como funciona
            </Link>
            <Link to="/ajuda" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
              Central de ajuda
            </Link>
            <Link to="/contato" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
              Contato
            </Link>
            <Link to="/termos" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
              Termos de Uso
            </Link>
            <Link to="/privacidade" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
              Política de Privacidade
            </Link>
          </div>
        </div>

        {/* Contact */}
        <div className="space-y-4">
          <h4 className="font-semibold text-lg">Contato</h4>
          <div className="space-y-3">
            <a href="mailto:contato@fieldmachine.com.br" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
              <Mail className="h-4 w-4" />
              <span>contato@fieldmachine.com.br</span>
            </a>
            <a href="tel:+5545991447004" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
              <Phone className="h-4 w-4" />
              <span>(45) 99144-7004</span>
            </a>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>Curitiba, Paraná</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border pt-8 mt-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 FieldMachine. Todos os direitos reservados.
          </p>
          <p className="text-sm text-muted-foreground">
            Desenvolvido para o agronegócio brasileiro
          </p>
        </div>
      </div>
    </div>
  </footer>;
};
