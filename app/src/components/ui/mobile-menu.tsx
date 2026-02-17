import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Home, Search, Grid3X3, HelpCircle, Truck, Heart, Bell, LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

const menuItems = [
  { icon: Home, label: "Início", path: "/" },
  { icon: Search, label: "Buscar Máquinas", path: "/servicos-agricolas" },
  { icon: Grid3X3, label: "Categorias", path: "/servicos" },
  { icon: HelpCircle, label: "Como Funciona", path: "/como-funciona" },
  { icon: Truck, label: "Prestar Serviços", path: "/oferecer-servicos" },
];

const userItems = [
  { icon: Heart, label: "Favoritos", path: "/favoritos" },
  { icon: Bell, label: "Alertas", path: "/alertas" },
];

export const MobileMenu = () => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 p-0">
        <SheetHeader className="p-6 pb-4">
          <SheetTitle className="text-left">
            <Link to="/" onClick={() => setOpen(false)} className="font-bold text-2xl">
              Field<span className="text-primary">Machine</span>
            </Link>
          </SheetTitle>
        </SheetHeader>

        <div className="px-4 pb-6 space-y-6">
          {/* Main Navigation */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 rounded-lg text-foreground hover:bg-accent transition-colors"
                >
                  <Icon className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <Separator />

          {/* User Actions */}
          <nav className="space-y-1">
            {userItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 rounded-lg text-foreground hover:bg-accent transition-colors"
                >
                  <Icon className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <Separator />

          {/* Auth Buttons */}
          <div className="space-y-3">
            <Button asChild variant="outline" className="w-full justify-start gap-3" onClick={() => setOpen(false)}>
              <Link to="/login">
                <LogIn className="h-5 w-5" />
                Entrar
              </Link>
            </Button>
            <Button asChild className="w-full justify-start gap-3 bg-primary hover:bg-primary/90" onClick={() => setOpen(false)}>
              <Link to="/cadastro">
                <UserPlus className="h-5 w-5" />
                Criar Conta
              </Link>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
