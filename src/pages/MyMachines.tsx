import { useState, useEffect } from "react";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Plus, Edit, Trash2, Power, MapPin, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Machine {
    id: string;
    name: string;
    category: string;
    status: string;
    price_day: number | null;
    price_hour: number | null;
    price_hectare: number | null;
    location: any;
    images: string[];
}

const MyMachines = () => {
    const [machines, setMachines] = useState<Machine[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        loadMyMachines();
    }, []);

    const loadMyMachines = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('machines')
                .select('*')
                .eq('owner_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;

            setMachines(data || []);
        } catch (error: any) {
            toast({
                title: "Erro ao carregar máquinas",
                description: error.message,
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (machine: Machine) => {
        try {
            const newStatus = machine.status === 'available' ? 'unavailable' : 'available';

            const { error } = await supabase
                .from('machines')
                .update({ status: newStatus })
                .eq('id', machine.id);

            if (error) throw error;

            setMachines(machines.map(m =>
                m.id === machine.id ? { ...m, status: newStatus } : m
            ));

            toast({
                title: "Status atualizado",
                description: `Máquina agora está ${newStatus === 'available' ? 'disponível' : 'indisponível'}`
            });
        } catch (error: any) {
            toast({
                title: "Erro ao atualizar status",
                description: error.message,
                variant: "destructive"
            });
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const { error } = await supabase
                .from('machines')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setMachines(machines.filter(m => m.id !== id));

            toast({
                title: "Máquina excluída",
                description: "A máquina foi removida com sucesso."
            });
        } catch (error: any) {
            toast({
                title: "Erro ao excluir",
                description: error.message,
                variant: "destructive"
            });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="container mx-auto px-4 pt-24 pb-16">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Minhas Máquinas</h1>
                        <p className="text-muted-foreground">Gerencie seus equipamentos cadastrados</p>
                    </div>
                    <Button onClick={() => navigate('/add-machine')}>
                        <Plus className="h-4 w-4 mr-2" />
                        Nova Máquina
                    </Button>
                </div>

                {machines.length === 0 ? (
                    <Card className="text-center py-12">
                        <CardContent>
                            <div className="mb-4 bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                                <Plus className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Nenhuma máquina cadastrada</h3>
                            <p className="text-muted-foreground mb-6">Comece a ganhar dinheiro alugando seus equipamentos.</p>
                            <Button onClick={() => navigate('/add-machine')}>
                                Cadastrar Primeira Máquina
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {machines.map((machine) => (
                            <Card key={machine.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                                <div className="aspect-video relative bg-muted">
                                    {machine.images && machine.images[0] ? (
                                        <img
                                            src={machine.images[0]}
                                            alt={machine.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                            Sem imagem
                                        </div>
                                    )}
                                    <Badge
                                        className={`absolute top-2 right-2 ${machine.status === 'available' ? 'bg-green-500' : 'bg-gray-500'
                                            }`}
                                    >
                                        {machine.status === 'available' ? 'Disponível' : 'Indisponível'}
                                    </Badge>
                                </div>

                                <CardHeader>
                                    <CardTitle className="flex justify-between items-start">
                                        <span className="truncate">{machine.name}</span>
                                    </CardTitle>
                                    <div className="flex items-center text-sm text-muted-foreground gap-2">
                                        <Badge variant="outline">{machine.category}</Badge>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <MapPin className="h-4 w-4" />
                                        {typeof machine.location === 'object' && machine.location?.city
                                            ? `${machine.location.city}, ${machine.location.state}`
                                            : 'Localização não definida'}
                                    </div>

                                    <div className="font-semibold text-primary">
                                        {machine.price_hour && `R$ ${machine.price_hour}/h`}
                                        {machine.price_day && ` • R$ ${machine.price_day}/dia`}
                                        {machine.price_hectare && ` • R$ ${machine.price_hectare}/ha`}
                                    </div>
                                </CardContent>

                                <CardFooter className="grid grid-cols-3 gap-2 border-t pt-4">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleToggleStatus(machine)}
                                        title={machine.status === 'available' ? "Pausar anúncio" : "Ativar anúncio"}
                                    >
                                        <Power className={`h-4 w-4 ${machine.status === 'available' ? 'text-green-500' : 'text-gray-400'}`} />
                                    </Button>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => navigate(`/edit-machine/${machine.id}`)}
                                    >
                                        <Edit className="h-4 w-4 mr-2" />
                                        Editar
                                    </Button>

                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="destructive" size="sm">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Excluir máquina?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Esta ação não pode ser desfeita. Isso excluirá permanentemente o anúncio da sua máquina.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDelete(machine.id)}>
                                                    Excluir
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default MyMachines;
