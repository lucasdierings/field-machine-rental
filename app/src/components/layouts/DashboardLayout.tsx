import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    LayoutDashboard,
    Settings,
    LogOut,
    Menu,
    X,
    Tractor,
    FileText,
    User,
    Search as SearchIcon,
    ShieldCheck
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useUserRole } from "@/hooks/useUserRole";

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { toast } = useToast();
    const { role, isAdmin, isOwner } = useUserRole();

    const handleLogout = async () => {
        try {
            await supabase.auth.signOut();
            navigate("/login");
            toast({
                title: "Saiu com sucesso",
                description: "Até logo!",
            });
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const NavItem = ({ to, icon: Icon, label }: { to: string; icon: any; label: string }) => (
        <Link
            to={to}
            className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium",
                location.pathname === to
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
        >
            <Icon className="h-4 w-4" />
            {label}
        </Link>
    );

    return (
        <div className="min-h-screen bg-background flex">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-200 ease-in-out lg:transform-none",
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="h-full flex flex-col">
                    {/* Header */}
                    <div className="h-16 flex items-center px-6 border-b border-border">
                        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
                            <span className="text-primary">Field</span>Machine
                        </Link>
                        <button
                            className="ml-auto lg:hidden"
                            onClick={() => setIsSidebarOpen(false)}
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                        <div className="mb-4 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Principal
                        </div>

                        {isAdmin() ? (
                            <>
                                <NavItem to="/admin" icon={LayoutDashboard} label="Visão Geral" />
                                <NavItem to="/admin/users" icon={User} label="Usuários" />
                                <NavItem to="/admin/machines" icon={Tractor} label="Máquinas" />
                                <NavItem to="/admin/documents" icon={FileText} label="Documentos" />
                            </>
                        ) : (
                            <>
                                <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
                                <NavItem to="/servicos-agricolas" icon={SearchIcon} label="Buscar Máquinas" />
                                {(isOwner() || isAdmin()) && (
                                    <NavItem to="/minhas-maquinas" icon={Tractor} label="Minhas Máquinas" />
                                )}
                                <NavItem to="/dashboard/documentos" icon={FileText} label="Meus Documentos" />
                            </>
                        )}

                        <div className="mt-8 mb-4 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Conta
                        </div>
                        <NavItem to="/dashboard/perfil" icon={User} label="Meu Perfil" />
                        {isAdmin() && (
                            <NavItem to="/admin/settings" icon={Settings} label="Configurações" />
                        )}
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t border-border">
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            onClick={handleLogout}
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Sair
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Mobile Header */}
                <header className="h-16 lg:hidden flex items-center px-4 border-b border-border bg-card">
                    <Button variant="ghost" size="icon" onClick={toggleSidebar}>
                        <Menu className="h-5 w-5" />
                    </Button>
                    <span className="ml-4 font-semibold">Menu</span>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 lg:p-8 overflow-auto">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};
