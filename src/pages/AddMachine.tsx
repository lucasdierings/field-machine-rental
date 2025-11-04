import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const categories = [
  "Tratores",
  "Colheitadeiras", 
  "Pulverizadores",
  "Plantadeiras",
  "Implementos",
  "Caminhões"
];

const brands = [
  "John Deere",
  "New Holland", 
  "Case IH",
  "Massey Ferguson",
  "Valtra",
  "Jacto",
  "Montana",
  "Scania",
  "Mercedes-Benz"
];

export default function AddMachine() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    price_hour: "",
    price_day: "",
    price_hectare: "",
    location: {
      city: "",
      state: "",
      address: ""
    },
    radius_km: 50,
    specifications: {}
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação de campos obrigatórios
    if (!formData.name || !formData.category || !formData.brand) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos marcados com *",
        variant: "destructive"
      });
      return;
    }

    if (!formData.location.city || !formData.location.state) {
      toast({
        title: "Localização obrigatória",
        description: "Informe a cidade e estado da máquina",
        variant: "destructive"
      });
      return;
    }

    // Validação de pelo menos um preço
    if (!formData.price_hour && !formData.price_day && !formData.price_hectare) {
      toast({
        title: "Preço obrigatório",
        description: "Informe pelo menos um tipo de preço (hora, dia ou hectare)",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Erro de autenticação",
          description: "Você precisa estar logado para cadastrar uma máquina",
          variant: "destructive"
        });
        navigate("/login");
        return;
      }

      // Verificar se o usuário tem perfil verificado
      const { data: profile, error: profileError } = await supabase
        .from("user_profiles")
        .select("verified, full_name, phone")
        .eq("auth_user_id", user.id)
        .single();

      if (profileError || !profile) {
        toast({
          title: "Perfil incompleto",
          description: "Complete seu cadastro antes de cadastrar máquinas.",
          variant: "destructive",
          action: (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate("/dashboard/perfil")}
            >
              Completar Cadastro
            </Button>
          )
        });
        return;
      }

      if (!profile.verified) {
        toast({
          title: "Verificação pendente",
          description: "Envie seus documentos para verificação antes de cadastrar máquinas.",
          variant: "destructive",
          action: (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate("/dashboard/documentos")}
            >
              Enviar Documentos
            </Button>
          )
        });
        return;
      }

      const machineData = {
        name: formData.name,
        category: formData.category,
        brand: formData.brand,
        model: formData.model || null,
        year: formData.year,
        location: formData.location,
        radius_km: formData.radius_km,
        specifications: formData.specifications,
        owner_id: user.id,
        price_hour: formData.price_hour ? parseFloat(formData.price_hour) : null,
        price_day: formData.price_day ? parseFloat(formData.price_day) : null,
        price_hectare: formData.price_hectare ? parseFloat(formData.price_hectare) : null,
        status: "available"
      };

      const { data, error } = await supabase
        .from("machines")
        .insert([machineData])
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast({
        title: "Máquina cadastrada!",
        description: "Sua máquina está disponível para locação",
      });

      navigate("/dashboard");
    } catch (error: any) {
      let errorMessage = "Erro ao cadastrar máquina. Tente novamente.";
      
      if (error.message?.includes("verificados") || error.message?.includes("verified")) {
        errorMessage = "Apenas usuários verificados podem cadastrar máquinas.";
      } else if (error.code === "23505") {
        errorMessage = "Já existe uma máquina cadastrada com esses dados.";
      }
      
      toast({
        title: "Erro no cadastro",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as object),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16 pb-8">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Alerta informativo sobre requisitos */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">📋 Requisitos para Cadastrar Máquinas</h3>
            <p className="text-sm text-blue-800">
              Para cadastrar uma máquina, você precisa ter:
            </p>
            <ul className="mt-2 text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Perfil completo (nome, telefone, CPF/CNPJ)</li>
              <li>Documentos enviados e verificados pela equipe</li>
            </ul>
            <p className="mt-2 text-xs text-blue-700">
              O sistema validará automaticamente antes de permitir o cadastro.
            </p>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">
              Cadastrar Nova Máquina
            </h1>
            <p className="text-muted-foreground">
              Adicione uma máquina ao seu portfólio de equipamentos
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Informações da Máquina</CardTitle>
              <CardDescription>
                Preencha todos os campos para cadastrar sua máquina
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome/Modelo da Máquina *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      placeholder="Ex: Trator John Deere 6155R"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Categoria *</Label>
                    <Select onValueChange={(value) => handleChange('category', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="brand">Marca *</Label>
                    <Select onValueChange={(value) => handleChange('brand', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a marca" />
                      </SelectTrigger>
                      <SelectContent>
                        {brands.map((brand) => (
                          <SelectItem key={brand} value={brand}>
                            {brand}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="model">Modelo</Label>
                    <Input
                      id="model"
                      value={formData.model}
                      onChange={(e) => handleChange('model', e.target.value)}
                      placeholder="Ex: 6155R"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="year">Ano</Label>
                    <Input
                      id="year"
                      type="number"
                      min="1990"
                      max={new Date().getFullYear() + 1}
                      value={formData.year}
                      onChange={(e) => handleChange('year', parseInt(e.target.value))}
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Preços do Serviço</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price_hour">Preço por Hora (R$)</Label>
                      <Input
                        id="price_hour"
                        type="number"
                        step="0.01"
                        value={formData.price_hour}
                        onChange={(e) => handleChange('price_hour', e.target.value)}
                        placeholder="0.00"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="price_day">Preço por Dia (R$)</Label>
                      <Input
                        id="price_day"
                        type="number"
                        step="0.01"
                        value={formData.price_day}
                        onChange={(e) => handleChange('price_day', e.target.value)}
                        placeholder="0.00"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="price_hectare">Preço por Hectare (R$)</Label>
                      <Input
                        id="price_hectare"
                        type="number"
                        step="0.01"
                        value={formData.price_hectare}
                        onChange={(e) => handleChange('price_hectare', e.target.value)}
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Localização</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">Cidade *</Label>
                      <Input
                        id="city"
                        value={formData.location.city}
                        onChange={(e) => handleChange('location.city', e.target.value)}
                        placeholder="Ex: Sorriso"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="state">Estado *</Label>
                      <Input
                        id="state"
                        value={formData.location.state}
                        onChange={(e) => handleChange('location.state', e.target.value)}
                        placeholder="Ex: MT"
                        required
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address">Endereço Completo</Label>
                      <Textarea
                        id="address"
                        value={formData.location.address}
                        onChange={(e) => handleChange('location.address', e.target.value)}
                        placeholder="Endereço completo para localização"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="radius">Raio de Atendimento (km)</Label>
                      <Input
                        id="radius"
                        type="number"
                        min="1"
                        max="500"
                        value={formData.radius_km}
                        onChange={(e) => handleChange('radius_km', parseInt(e.target.value))}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/dashboard")}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Cadastrando...
                      </>
                    ) : (
                      'Cadastrar Máquina'
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}