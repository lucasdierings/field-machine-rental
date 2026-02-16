import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { Loader2, Upload, X, Image as ImageIcon } from "lucide-react";
import { LocationSelector } from "@/components/ui/location-selector";
import { MultiCitySelector } from "@/components/ui/multi-city-selector";
const categories = [
  "Tratores",
  "Colheitadeiras",
  "Pulverizadores",
  "Plantadeiras",
  "Implementos",
  "Transporte de Cargas"
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
  const [uploadingImages, setUploadingImages] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { id } = useParams();
  const isEditing = !!id;

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
    operator_type: "owner", // owner (próprio) or hired (contratado)
    specifications: {},
    service_cities: [] as string[]
  });

  useEffect(() => {
    if (isEditing) {
      loadMachineData();
    }
  }, [id]);

  const loadMachineData = async () => {
    try {
      setLoading(true);
      const { data: machine, error } = await supabase
        .from('machines')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (machine) {
        // Parse location if it's a string, or use as object
        let locationData = machine.location;
        if (typeof locationData === 'string') {
          try {
            locationData = JSON.parse(locationData);
          } catch (e) {
            locationData = { city: "", state: "", address: "" };
          }
        }

        setFormData({
          name: machine.name,
          category: machine.category,
          brand: machine.brand || "",
          model: machine.model || "",
          year: machine.year || new Date().getFullYear(),
          price_hour: machine.price_hour?.toString() || "",
          price_day: machine.price_day?.toString() || "",
          price_hectare: machine.price_hectare?.toString() || "",
          location: (locationData as { city: string; state: string; address: string }) || { city: "", state: "", address: "" },
          radius_km: machine.radius_km || 50,
          operator_type: (machine as any).operator_type || "owner",
          specifications: machine.specifications || {},
          service_cities: (machine as any).service_cities || []
        });

        // Load images from machine_images table
        const { data: machineImages } = await supabase
          .from('machine_images')
          .select('image_url')
          .eq('machine_id', id)
          .order('order_index');

        if (machineImages && machineImages.length > 0) {
          setImagePreviewUrls(machineImages.map(img => img.image_url));
        }
      }
    } catch (error: any) {
      toast({
        title: "Erro ao carregar máquina",
        description: error.message,
        variant: "destructive"
      });
      navigate('/minhas-maquinas');
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (selectedImages.length + files.length > 3) {
      toast({
        title: "Limite de imagens",
        description: "Você pode enviar no máximo 3 fotos",
        variant: "destructive"
      });
      return;
    }

    // Validar cada arquivo
    const validFiles = files.filter(file => {
      const isImage = file.type.startsWith('image/');
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB

      if (!isImage) {
        toast({
          title: "Arquivo inválido",
          description: `${file.name} não é uma imagem`,
          variant: "destructive"
        });
      }
      if (!isValidSize) {
        toast({
          title: "Arquivo muito grande",
          description: `${file.name} excede 5MB`,
          variant: "destructive"
        });
      }

      return isImage && isValidSize;
    });

    if (validFiles.length > 0) {
      setSelectedImages(prev => [...prev, ...validFiles]);

      // Criar previews
      validFiles.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviewUrls(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

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

      // Verificar se o usuário tem perfil com dados básicos
      const { data: profile, error: profileError } = await supabase
        .from("user_profiles")
        .select("full_name, phone")
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

      const ownerId = user.id;

      const machineData = {
        name: formData.name,
        category: formData.category,
        brand: formData.brand,
        model: formData.model || null,
        year: formData.year,
        location: formData.location,
        radius_km: formData.radius_km,
        specifications: formData.specifications,
        owner_id: ownerId,
        price_hour: formData.price_hour ? parseFloat(formData.price_hour) : null,
        price_day: formData.price_day ? parseFloat(formData.price_day) : null,
        price_hectare: formData.price_hectare ? parseFloat(formData.price_hectare) : null,
        operator_type: formData.operator_type,
        status: "available",
        service_cities: formData.service_cities
      };

      let machineId;

      if (isEditing) {
        const { error } = await supabase
          .from("machines")
          .update(machineData)
          .eq('id', id);

        if (error) throw error;
        machineId = id;
      } else {
        const { data, error } = await supabase
          .from("machines")
          .insert([machineData])
          .select()
          .single();

        if (error) throw error;
        machineId = data.id;
      }

      // Upload das imagens se houver
      if (selectedImages.length > 0) {
        setUploadingImages(true);

        for (let i = 0; i < selectedImages.length; i++) {
          const file = selectedImages[i];
          const fileName = `${machineId}/${Date.now()}_${i}.${file.name.split('.').pop()}`;

          const { error: uploadError } = await supabase.storage
            .from('machine-images')
            .upload(fileName, file);

          if (uploadError) {
            if (import.meta.env.DEV) {
              console.error('Erro no upload:', uploadError);
            }
            continue;
          }

          // Inserir registro na tabela machine_images
          const { data: { publicUrl } } = supabase.storage
            .from('machine-images')
            .getPublicUrl(fileName);

          await supabase
            .from('machine_images')
            .insert({
              machine_id: machineId,
              image_url: publicUrl,
              is_primary: i === 0,
              order_index: i
            });
        }

        setUploadingImages(false);

        // Atualizar o array de imagens na tabela machines
        const imageUrls = [];
        const { data: imagesData } = await supabase
          .from('machine_images')
          .select('image_url')
          .eq('machine_id', machineId)
          .order('order_index');

        if (imagesData) {
          // Images are stored in machine_images table, not in machines.images
          // Just log success - the images are already associated via machine_id
          console.log(`${imagesData.length} images associated with machine ${machineId}`);
        }
      }

      toast({
        title: isEditing ? "Máquina atualizada!" : "Máquina cadastrada!",
        description: isEditing ? "As informações foram salvas com sucesso." : "Sua máquina está disponível para locação",
      });

      navigate("/minhas-maquinas");
    } catch (error: any) {
      let errorMessage = "Erro ao cadastrar máquina. Tente novamente.";

      if (error.code === "23505") {
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
              {isEditing ? "Editar Máquina" : "Cadastrar Nova Máquina"}
            </h1>
            <p className="text-muted-foreground">
              {isEditing ? "Atualize as informações do seu equipamento" : "Adicione uma máquina ao seu portfólio de equipamentos"}
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

                  <div className="space-y-2">
                    <Label htmlFor="operator_type">Tipo de Operador *</Label>
                    <Select
                      value={formData.operator_type}
                      onValueChange={(value) => handleChange('operator_type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione quem opera" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="owner">O Próprio Dono</SelectItem>
                        <SelectItem value="employee">Funcionário</SelectItem>
                      </SelectContent>
                    </Select>
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
                    <div className="md:col-span-2 space-y-2">
                      <Label>Base da Máquina (Onde ela fica)</Label>
                      <LocationSelector
                        onLocationChange={(loc) => {
                          handleChange('location.city', loc.city);
                          handleChange('location.state', loc.state);
                        }}
                        initialData={{
                          country: 'BRASIL',
                          state: formData.location.state,
                          city: formData.location.city
                        }}
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address">Endereço / Ponto de Referência</Label>
                      <Textarea
                        id="address"
                        value={formData.location.address}
                        onChange={(e) => handleChange('location.address', e.target.value)}
                        placeholder="Endereço onde a máquina está estacionada"
                        rows={2}
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="radius">Raio de Atendimento (km do ponto base)</Label>
                      <Input
                        id="radius"
                        type="number"
                        min="1"
                        max="1000"
                        value={formData.radius_km}
                        onChange={(e) => handleChange('radius_km', parseInt(e.target.value))}
                        className="max-w-[200px]"
                      />
                    </div>

                    <div className="md:col-span-2 space-y-2 border-t pt-4 mt-2">
                      <Label>Cidades de Atuação Específicas (Opcional)</Label>
                      <p className="text-sm text-muted-foreground mb-2">
                        Além do raio, você pode listar cidades específicas onde aceita trabalhar.
                      </p>
                      <MultiCitySelector
                        onCitiesChange={(cities) => handleChange('service_cities', cities)}
                        initialCities={formData.service_cities}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Fotos da Máquina</h3>
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-border rounded-lg p-6">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageSelect}
                        className="hidden"
                        id="machine-images"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={selectedImages.length >= 3}
                        className="w-full"
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Selecionar Fotos ({selectedImages.length}/3)
                      </Button>
                      <p className="text-xs text-muted-foreground mt-2 text-center">
                        Envie até 3 fotos da máquina (máx. 5MB cada)
                      </p>
                    </div>

                    {imagePreviewUrls.length > 0 && (
                      <div className="grid grid-cols-3 gap-4">
                        {imagePreviewUrls.map((url, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={url}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <Button
                              type="button"
                              size="sm"
                              variant="destructive"
                              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeImage(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                            {index === 0 && (
                              <div className="absolute bottom-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs">
                                Principal
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
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
                    disabled={loading || uploadingImages}
                    className="flex-1"
                  >
                    {loading || uploadingImages ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {uploadingImages ? 'Enviando fotos...' : 'Cadastrando...'}
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