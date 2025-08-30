import { Button } from "@/components/ui/button";
import { Menu, User, Heart, Bell } from "lucide-react";

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className="font-bold text-2xl">
              Field<span className="text-primary">Machine</span>
            </div>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-foreground hover:text-primary transition-colors">
              Buscar
            </a>
            <a href="#" className="text-foreground hover:text-primary transition-colors">
              Categorias
            </a>
            <a href="#" className="text-foreground hover:text-primary transition-colors">
              Como Funciona
            </a>
            <a href="#" className="text-foreground hover:text-primary transition-colors">
              Alugar Minha Máquina
            </a>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" className="hidden md:flex">
              <Heart className="h-4 w-4 mr-2" />
              Favoritos
            </Button>
            
            <Button variant="ghost" size="sm" className="hidden md:flex">
              <Bell className="h-4 w-4 mr-2" />
              Alertas
            </Button>

            <Button variant="outline" size="sm">
              <User className="h-4 w-4 mr-2" />
              Entrar
            </Button>

            <Button size="sm" className="bg-gradient-primary">
              Cadastrar
            </Button>

            {/* Mobile Menu */}
            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};