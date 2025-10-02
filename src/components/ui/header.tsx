import { Button } from "@/components/ui/button";
import { Menu, User, Heart, Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { AuthButton } from "../auth/AuthButton";

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="font-bold text-2xl">
              Field<span className="text-primary">Machine</span>
            </Link>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/buscar" className="text-foreground hover:text-primary transition-colors">
              Buscar
            </Link>
            <Link to="/categorias" className="text-foreground hover:text-primary transition-colors">
              Categorias
            </Link>
            <Link to="/como-funciona" className="text-foreground hover:text-primary transition-colors">
              Como Funciona
            </Link>
            <Link to="/alugar-minha-maquina" className="text-foreground hover:text-primary transition-colors">
              Prestar Serviços
            </Link>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" className="hidden md:flex" asChild>
              <Link to="/favoritos">
                <Heart className="h-4 w-4 mr-2" />
                Favoritos
              </Link>
            </Button>
            
            <Button variant="ghost" size="sm" className="hidden md:flex" asChild>
              <Link to="/alertas">
                <Bell className="h-4 w-4 mr-2" />
                Alertas
              </Link>
            </Button>

            <AuthButton />

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