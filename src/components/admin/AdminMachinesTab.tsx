import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Filter, Eye, Trash2, Tractor } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
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
    brand: string;
    model: string;
    year: number;
    status: string;
    created_at: string;
    owner_id: string;
    owner?: {
        full_name: string;
        email: string;
    };
}

const AdminMachinesTab = () => {
    const [machines, setMachines] = useState<Machine[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalMachines, setTotalMachines] = useState(0);
    const { toast } = useToast();

    const itemsPerPage = 10;

    useEffect(() => {
        loadMachines();
    }, [currentPage, searchTerm, filterStatus]);

    const loadMachines = async () => {
        try {
            setLoading(true);

            let query = supabase
                .from('machines')
                .select(`
          *,
          owner:users(full_name, email)
        `, { count: 'exact' });

            // Apply filters
            if (searchTerm) {
                query = query.or(`name.ilike.%${searchTerm}%,brand.ilike.%${searchTerm}%,model.ilike.%${searchTerm}%`);
            }

            if (filterStatus !== 'all') {
                query = query.eq('status', filterStatus);
            }

            // Pagination
            const from = (currentPage - 1) * itemsPerPage;
            const to = from + itemsPerPage - 1;

            query = query
                .range(from, to)
                .order('created_at', { ascending: false });

            const { data, error, count } = await query;

            if (error) throw error;

            // Transform data to match interface (handling potential join issues)
            const formattedMachines = data?.map((machine: any) => ({
                ...machine,
                owner: machine.owner // Supabase returns joined data here
            })) || [];

            setMachines(formattedMachines);
            setTotalMachines(count || 0);
        } catch (error) {
            console.error('Failed to load machines:', error);
            toast({
                title: "Erro",
                description: "Falha ao carregar máquinas.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const { error } = await supabase
                .from('machines')
                .delete()
                .eq('id', id);

            if (error) throw error;

            toast({
                title: "Máquina excluída",
                description: "A máquina foi removida com sucesso.",
            });

            loadMachines();
        } catch (error: any) {
            toast({
                title: "Erro ao excluir",
                description: error.message,
                variant: "destructive"
            });
        }
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('pt-BR');
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'available':
                return <Badge className="bg-green-500">Disponível</Badge>;
            case 'rented':
                return <Badge className="bg-blue-500">Alugada</Badge>;
            case 'maintenance':
                return <Badge className="bg-yellow-500">Manutenção</Badge>;
            case 'unavailable':
                return <Badge variant="destructive">Indisponível</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const totalPages = Math.ceil(totalMachines / itemsPerPage);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Tractor className="h-5 w-5" />
                    Gestão de Máquinas
                </CardTitle>
                <CardDescription>
                    Gerencie todas as máquinas cadastradas na plataforma
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Filters */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Buscar por nome, marca ou modelo..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 w-[300px]"
                        />
                    </div>

                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="w-[150px]">
                            <Filter className="h-4 w-4" />
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos status</SelectItem>
                            <SelectItem value="available">Disponível</SelectItem>
                            <SelectItem value="rented">Alugada</SelectItem>
                            <SelectItem value="maintenance">Manutenção</SelectItem>
                            <SelectItem value="unavailable">Indisponível</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Machines Table */}
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nome</TableHead>
                                <TableHead>Marca/Modelo</TableHead>
                                <TableHead>Ano</TableHead>
                                <TableHead>Proprietário</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Cadastro</TableHead>
                                <TableHead>Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                Array.from({ length: 5 }).map((_, index) => (
                                    <TableRow key={index}>
                                        <TableCell colSpan={7} className="text-center py-8">
                                            <div className="animate-pulse flex space-x-4">
                                                <div className="rounded bg-muted h-4 w-full"></div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : machines.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                        Nenhuma máquina encontrada
                                    </TableCell>
                                </TableRow>
                            ) : (
                                machines.map((machine) => (
                                    <TableRow key={machine.id}>
                                        <TableCell className="font-medium">{machine.name}</TableCell>
                                        <TableCell>{machine.brand} {machine.model}</TableCell>
                                        <TableCell>{machine.year}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{machine.owner?.full_name || 'Desconhecido'}</span>
                                                <span className="text-xs text-muted-foreground">{machine.owner?.email}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{getStatusBadge(machine.status)}</TableCell>
                                        <TableCell>{formatDate(machine.created_at)}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Button variant="ghost" size="sm" asChild>
                                                    <Link to={`/prestador/${machine.id}`}>
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                </Button>

                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="ghost" size="sm">
                                                            <Trash2 className="h-4 w-4 text-red-500" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Excluir máquina?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Esta ação não pode ser desfeita. Isso excluirá permanentemente a máquina do sistema.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() => handleDelete(machine.id)}
                                                                className="bg-red-600 hover:bg-red-700"
                                                            >
                                                                Excluir
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, totalMachines)} de {totalMachines} máquinas
                    </p>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            Anterior
                        </Button>
                        <span className="text-sm text-muted-foreground">
                            Página {currentPage} de {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            Próxima
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default AdminMachinesTab;
