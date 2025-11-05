import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";
const cidadesPrincipais = ["Curitiba", "Londrina", "Maringá", "Cascavel", "Ponta Grossa", "Foz do Iguaçu", "Guarapuava", "Toledo", "Apucarana", "Campo Largo"];
const categoriasBlog = ["Tecnologia Agrícola", "Dicas de Plantio", "Manutenção de Máquinas", "Mercado Agrícola", "Sustentabilidade"];
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
            
            {/* Social Media */}
            <div className="flex space-x-3">
              <a href="#" className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors">
                <Facebook className="h-5 w-5 text-primary" />
              </a>
              <a href="#" className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors">
                <Instagram className="h-5 w-5 text-primary" />
              </a>
              <a href="#" className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors">
                <Twitter className="h-5 w-5 text-primary" />
              </a>
              <a href="#" className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors">
                <Youtube className="h-5 w-5 text-primary" />
              </a>
            </div>
          </div>

          {/* Cities */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Cidades Atendidas</h4>
            <div className="space-y-2">
              {cidadesPrincipais.map(cidade => <Link key={cidade} to={`/buscar?cidade=${cidade}`} className="block text-muted-foreground hover:text-primary transition-colors text-sm">
                  Serviço de Trator em {cidade}
                </Link>)}
            </div>
          </div>

          {/* Blog Categories */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Blog</h4>
            <div className="space-y-2">
              {categoriasBlog.map(categoria => <Link key={categoria} to={`/blog/${categoria.toLowerCase().replace(/\s+/g, '-')}`} className="block text-muted-foreground hover:text-primary transition-colors text-sm">
                  {categoria}
                </Link>)}
            </div>
          </div>

          {/* Contact & Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Contato</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>fieldmachinebrasil@gmail.com
              </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>(45)99144-7004</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Curitiba, Paraná</span>
              </div>
            </div>
            
            <div className="space-y-2 pt-4">
              <Link to="/sobre" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
                Sobre
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
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 FieldMachine. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>CNPJ: 00.000.000/0001-00</span>
              <span>|</span>
              <span>Registro ANVISA: 12345678</span>
            </div>
          </div>
        </div>
      </div>
    </footer>;
};