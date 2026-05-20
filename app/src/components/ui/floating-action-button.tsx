import { Plus, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FloatingActionButtonProps {
  className?: string;
}

export const FloatingActionButton = ({ className }: FloatingActionButtonProps) => {
  const { isAuthenticated, isOwner } = useAuth();

  // Se usuário não está logado ou não é owner, mostrar botão simples
  if (!isAuthenticated || !isOwner) {
    return (
      <Link to="/oferecer-servicos">
        <Button
          size="lg"
          className={cn(
            "fixed bottom-20 right-4 z-40 h-14 w-14 rounded-full shadow-lg md:hidden",
            "bg-primary hover:bg-primary/90 active:scale-95 transition-transform",
            className
          )}
        >
          <Plus className="h-6 w-6" />
        </Button>
      </Link>
    );
  }

  // Owner autenticado: mostrar menu com opções
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="lg"
          className={cn(
            "fixed bottom-20 right-4 z-40 h-14 w-14 rounded-full shadow-lg md:hidden",
            "bg-primary hover:bg-primary/90 active:scale-95 transition-transform",
            className
          )}
        >
          <Plus className="h-6 w-6" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 mb-2">
        <DropdownMenuItem asChild>
          <Link to="/oferecer-servicos" className="flex items-center gap-3 cursor-pointer">
            <Truck className="h-4 w-4" />
            <span>Anunciar Máquina</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
