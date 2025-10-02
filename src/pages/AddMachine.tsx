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

      const machineData = {
        name: formData.name,
        category: formData.category,
        brand: formData.brand,
        model: formData.model,
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

      const { error } = await supabase
        .from("machines")
        .insert([machineData]);

      if (error) {
        throw error;
      }

      toast({
        title: "Máquina cadastrada com sucesso!",
        description: "Seu serviço já está disponível para contratação",
      });

      navigate("/dashboard");
    } catch (error: any) {
      console.error("Error adding machine:", error);
      toast({
        title: "Erro ao cadastrar máquina",
        description: error.message || "Tente novamente em alguns instantes",
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