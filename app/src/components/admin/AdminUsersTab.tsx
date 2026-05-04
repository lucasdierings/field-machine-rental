import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Search, Filter, Download, Eye, CheckCircle, XCircle, Phone, Mail, IdCard, MapPin, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  auth_user_id: string;
  full_name: string;
  email: string | null; // Now available in user_profiles
  cpf_cnpj: string | null;
  phone: string | null;
  address: { city?: string; state?: string; address?: string; cep?: string } | string | null;
  user_types: string[] | null;
  verified: boolean | null;
  created_at: string;
  total_transactions?: number | null;
  total_rentals?: number | null;
  total_services?: number | null;
}

const AdminUsersTab = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterVerified, setFilterVerified] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { toast } = useToast();

  const usersPerPage = 10;

  useEffect(() => {
    loadUsers();
  }, [currentPage, searchTerm, filterType, filterVerified]);

  const loadUsers = async () => {
    try {
      setLoading(true);

      let query = supabase
        .from('user_profiles')
        .select('*', { count: 'exact' });

      // Apply filters
      if (searchTerm) {
        query = query.or(`full_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,cpf_cnpj.ilike.%${searchTerm}%`);
      }

      if (filterType !== 'all') {
        query = query.contains('user_types', [filterType]);
      }

      if (filterVerified !== 'all') {
        query = query.eq('verified', filterVerified === 'verified');
      }

      // Pagination
      const from = (currentPage - 1) * usersPerPage;
      const to = from + usersPerPage - 1;

      query = query
        .range(from, to)
        .order('created_at', { ascending: false });

      const { data, error, count } = await query;

      if (error) throw error;

      setUsers((data as unknown as User[]) || []);
      setTotalUsers(count || 0);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Failed to load users:', error);
      }
      toast({
        title: "Erro",
        description: "Falha ao carregar usuários.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleUserVerification = async (userId: string, currentStatus: boolean | null) => {
    const newStatus = !currentStatus;

    // Optimistic update — reflect change immediately in the UI
    setUsers(prev =>
      prev.map(u => u.id === userId ? { ...u, verified: newStatus } : u)
    );

    try {
      // Try using the admin RPC function (bypasses RLS)
      const { error: rpcError } = await supabase.rpc('admin_set_user_verified', {
        target_user_id: userId,
        is_verified: newStatus,
      });

      if (rpcError) {
        // Fallback: try direct update (works if admin RLS policy exists)
        const { error: updateError } = await supabase
          .from('user_profiles')
          .update({ verified: newStatus })
          .eq('id', userId);

        if (updateError) throw updateError;
      }

      toast({
        title: "Sucesso",
        description: `Usuário ${newStatus ? 'verificado' : 'não verificado'} com sucesso.`,
      });
    } catch (error) {
      // Revert optimistic update on error
      setUsers(prev =>
        prev.map(u => u.id === userId ? { ...u, verified: currentStatus } : u)
      );

      if (import.meta.env.DEV) {
        console.error('Failed to update user:', error);
      }
      toast({
        title: "Erro",
        description: "Falha ao atualizar verificação do usuário. Verifique suas permissões de admin.",
        variant: "destructive",
      });
    }
  };

  const exportUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .csv();

      if (error) throw error;

      const blob = new Blob([data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'usuarios.csv';
      a.click();
      window.URL.revokeObjectURL(url);

      toast({
        title: "Sucesso",
        description: "Usuários exportados com sucesso.",
      });
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Failed to export users:', error);
      }
      toast({
        title: "Erro",
        description: "Falha ao exportar usuários.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const getUserTypeBadge = (types: string[] | null) => {
    if (!types || types.length === 0) return <Badge variant="outline">-</Badge>;

    return (
      <div className="flex gap-1 flex-wrap">
        {types.map(type => {
          switch (type) {
            case 'admin':
              return <Badge key={type} variant="destructive">Admin</Badge>;
            case 'owner':
              return <Badge key={type} variant="default">Proprietário</Badge>;
            case 'producer':
              return <Badge key={type} variant="secondary">Produtor</Badge>;
            default:
              return <Badge key={type} variant="outline">{type}</Badge>;
          }
        })}
      </div>
    );
  };

  const totalPages = Math.ceil(totalUsers / usersPerPage);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Gestão de Usuários
        </CardTitle>
        <CardDescription>
          Gerencie todos os usuários da plataforma
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Filters */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex w-full flex-col gap-4 md:w-auto md:flex-row md:items-center">
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, email ou CPF/CNPJ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 md:w-[300px]"
              />
            </div>

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full md:w-[150px]">
                <Filter className="h-4 w-4" />
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos tipos</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="owner">Proprietário</SelectItem>
                <SelectItem value="renter">Locatário</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterVerified} onValueChange={setFilterVerified}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="Verificação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="verified">Verificados</SelectItem>
                <SelectItem value="unverified">Não verificados</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={exportUsers} variant="outline" className="w-full gap-2 md:w-auto">
            <Download className="h-4 w-4" />
            Exportar CSV
          </Button>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>CPF/CNPJ</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Verificado</TableHead>
                <TableHead>Transações</TableHead>
                <TableHead>Cadastro</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="animate-pulse flex space-x-4">
                        <div className="rounded-full bg-muted h-10 w-10"></div>
                        <div className="flex-1 space-y-2 py-1">
                          <div className="h-4 bg-muted rounded w-3/4"></div>
                          <div className="h-4 bg-muted rounded w-1/2"></div>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    Nenhum usuário encontrado
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="min-w-[180px] font-medium">{user.full_name}</TableCell>
                    <TableCell className="min-w-[220px] break-all">{user.email}</TableCell>
                    <TableCell className="min-w-[140px]">{user.cpf_cnpj || '-'}</TableCell>
                    <TableCell>{getUserTypeBadge(user.user_types)}</TableCell>
                    <TableCell>
                      {user.verified ? (
                        <Badge variant="default" className="gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Sim
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="gap-1">
                          <XCircle className="h-3 w-3" />
                          Não
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-center">{user.total_transactions || 0}</TableCell>
                    <TableCell className="whitespace-nowrap">{formatDate(user.created_at)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          aria-label={`Ver detalhes de ${user.full_name}`}
                          onClick={() => setSelectedUser(user)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          aria-label={user.verified ? `Remover verificação de ${user.full_name}` : `Verificar ${user.full_name}`}
                          onClick={() => toggleUserVerification(user.id, user.verified)}
                        >
                          {user.verified ? (
                            <XCircle className="h-4 w-4 text-red-500" />
                          ) : (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Mostrando {((currentPage - 1) * usersPerPage) + 1} a {Math.min(currentPage * usersPerPage, totalUsers)} de {totalUsers} usuários
          </p>
          <div className="flex items-center justify-between gap-2 sm:justify-end">
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

      {/* User Details Dialog */}
      <Dialog
        open={selectedUser !== null}
        onOpenChange={(open) => !open && setSelectedUser(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedUser?.full_name || "Usuário"}</DialogTitle>
            <DialogDescription>
              Detalhes do usuário cadastrado na plataforma.
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Tipos</p>
                  {getUserTypeBadge(selectedUser.user_types)}
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Status</p>
                  {selectedUser.verified ? (
                    <Badge variant="default" className="gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Verificado
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="gap-1">
                      <XCircle className="h-3 w-3" />
                      Não verificado
                    </Badge>
                  )}
                </div>
              </div>

              <div className="space-y-3 border-t pt-4">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="break-all">{selectedUser.email || "Sem email"}</span>
                </div>
                {selectedUser.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span>{selectedUser.phone}</span>
                  </div>
                )}
                {selectedUser.cpf_cnpj && (
                  <div className="flex items-center gap-2 text-sm">
                    <IdCard className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span>{selectedUser.cpf_cnpj}</span>
                  </div>
                )}
                {(() => {
                  const addr = typeof selectedUser.address === "string"
                    ? (() => {
                        try {
                          return JSON.parse(selectedUser.address as string);
                        } catch {
                          return null;
                        }
                      })()
                    : selectedUser.address;
                  if (!addr || !addr.city) return null;
                  return (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span>
                        {[addr.address, addr.city, addr.state].filter(Boolean).join(", ")}
                        {addr.cep ? ` — ${addr.cep}` : ""}
                      </span>
                    </div>
                  );
                })()}
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span>Cadastrado em {formatDate(selectedUser.created_at)}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 border-t pt-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">{selectedUser.total_transactions ?? 0}</p>
                  <p className="text-xs text-muted-foreground">Transações</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{selectedUser.total_rentals ?? 0}</p>
                  <p className="text-xs text-muted-foreground">Aluguéis</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{selectedUser.total_services ?? 0}</p>
                  <p className="text-xs text-muted-foreground">Serviços</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default AdminUsersTab;
