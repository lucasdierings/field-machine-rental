<<<<<<< HEAD
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

interface MachineImageState {
  id?: string;
  url: string;
  file?: File;
  isNew: boolean;
}
=======
import { useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ShieldCheck, ShieldAlert } from "lucide-react";
import { getDocumentVerificationStatus } from "@/lib/userVerification";
import { MachineFormFields } from "@/components/machines/MachineFormFields";
import { MachineImageUploader, type MachineImageState } from "@/components/machines/MachineImageUploader";
import { validateMachineForm } from "@/lib/schemas/machineSchema";

const normalizeOperatorType = (operatorType?: string | null) =>
  operatorType === "hired" || operatorType === "employee" ? "hired" : "owner";
>>>>>>> origin/main

export default function AddMachine() {
  const navigate = useNavigate();
  const { toast } = useToast();
<<<<<<< HEAD
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);

  // New Image State Management
  const [machineImages, setMachineImages] = useState<MachineImageState[]>([]);
  const [deletedImageIds, setDeletedImageIds] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { id } = useParams();
  const isEditing = !!id;

=======
  const { userId } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);

  // Image State Management
  const [machineImages, setMachineImages] = useState<MachineImageState[]>([]);
  const [deletedImageIds, setDeletedImageIds] = useState<string[]>([]);
  const { id } = useParams();
  const isEditing = !!id;

  // Verificação de documentos do usuário
  const { data: verificationStatus } = useQuery({
    queryKey: ['doc-verification', userId],
    queryFn: () => getDocumentVerificationStatus(userId!),
    enabled: !!userId,
  });

>>>>>>> origin/main
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    brand: "",
    model: "",
<<<<<<< HEAD
=======
    description: "",
>>>>>>> origin/main
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

<<<<<<< HEAD
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
=======
  // Load existing machine data when editing
  const { isLoading: loadingMachine } = useQuery({
    queryKey: ['edit-machine', id],
    queryFn: async () => {
      const { data: machine, error } = await supabase
        .from('machines')
        .select('*')
        .eq('id', id!)
>>>>>>> origin/main
        .single();

      if (error) throw error;

      if (machine) {
<<<<<<< HEAD
        // Parse location if it's a string, or use as object
=======
>>>>>>> origin/main
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
<<<<<<< HEAD
=======
          description: machine.description || "",
>>>>>>> origin/main
          year: machine.year || new Date().getFullYear(),
          price_hour: machine.price_hour?.toString() || "",
          price_day: machine.price_day?.toString() || "",
          price_hectare: machine.price_hectare?.toString() || "",
          location: (locationData as { city: string; state: string; address: string }) || { city: "", state: "", address: "" },
          radius_km: machine.radius_km || 50,
<<<<<<< HEAD
          operator_type: (machine as any).operator_type || "owner",
=======
          operator_type: normalizeOperatorType((machine as any).operator_type),
>>>>>>> origin/main
          specifications: machine.specifications || {},
          service_cities: (machine as any).service_cities || []
        });

<<<<<<< HEAD
        // Load images using new structure
        const { data: dbImages } = await supabase
          .from('machine_images')
          .select('id, image_url')
          .eq('machine_id', id)
=======
        const { data: dbImages } = await supabase
          .from('machine_images')
          .select('id, image_url')
          .eq('machine_id', id!)
>>>>>>> origin/main
          .order('order_index');

        if (dbImages) {
          setMachineImages(dbImages.map(img => ({
            id: img.id,
            url: img.image_url,
            isNew: false
          })));
        }
      }
<<<<<<< HEAD
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

    if (machineImages.length + files.length > 3) {
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
      const newImages = validFiles.map(file => ({
        url: URL.createObjectURL(file), // Create local preview
        file,
        isNew: true
      }));

      setMachineImages(prev => [...prev, ...newImages]);
    }

    // Clear input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (index: number) => {
    const imageToRemove = machineImages[index];

    // If it's an existing image (from DB), track its ID for deletion
    if (!imageToRemove.isNew && imageToRemove.id) {
      setDeletedImageIds(prev => [...prev, imageToRemove.id!]);
    }

    setMachineImages(prev => prev.filter((_, i) => i !== index));
  };
=======

      return machine;
    },
    enabled: isEditing,
  });

  const handleAddImages = useCallback((newImages: MachineImageState[]) => {
    setMachineImages(prev => [...prev, ...newImages]);
  }, []);

  const handleRemoveImage = useCallback((index: number) => {
    const imageToRemove = machineImages[index];
    if (!imageToRemove.isNew && imageToRemove.id) {
      setDeletedImageIds(prev => [...prev, imageToRemove.id!]);
    }
    setMachineImages(prev => prev.filter((_, i) => i !== index));
  }, [machineImages]);
>>>>>>> origin/main

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

<<<<<<< HEAD
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
=======
    // Validação centralizada via Zod — vê src/lib/schemas/machineSchema.ts
    const validationError = validateMachineForm(formData);
    if (validationError) {
      toast({
        title: validationError.title,
        description: validationError.description,
        variant: "destructive",
>>>>>>> origin/main
      });
      return;
    }

    setLoading(true);

    try {
<<<<<<< HEAD
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
=======
      if (!userId) {
>>>>>>> origin/main
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
<<<<<<< HEAD
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
=======
        .select("full_name, phone, cpf_cnpj")
        .eq("auth_user_id", userId)
        .single();

      if (profileError && import.meta.env.DEV) {
        console.error("[AddMachine] Erro ao buscar perfil:", profileError);
      }

      if (!profile) {
        toast({
          title: "Perfil não encontrado",
          description: "Complete seu cadastro antes de cadastrar máquinas.",
          variant: "destructive",
        });
        navigate("/dashboard/perfil");
        return;
      }

      // Verificar campos obrigatórios do perfil com mensagem clara
      const missingFields: string[] = [];
      if (!profile.full_name) missingFields.push("Nome completo");
      if (!profile.phone) missingFields.push("Telefone");
      if (!profile.cpf_cnpj) missingFields.push("CPF/CNPJ");

      if (missingFields.length > 0) {
        toast({
          title: "Perfil incompleto",
          description: `Preencha: ${missingFields.join(", ")}`,
          variant: "destructive",
        });
        navigate("/dashboard/perfil");
        return;
      }

      const ownerId = userId;

      // Confirmar que temos uma sessão válida
      const { data: sessionData } = await supabase.auth.getSession();
      if (import.meta.env.DEV) {
        console.log("[AddMachine] Session check:", {
          hasSession: !!sessionData.session,
          match: sessionData.session?.user?.id === userId,
        });
      }

      if (!sessionData.session) {
        toast({
          title: "Sessão expirada",
          description: "Sua sessão expirou. Faça login novamente.",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }
>>>>>>> origin/main

      const machineData = {
        name: formData.name,
        category: formData.category,
        brand: formData.brand,
        model: formData.model || null,
<<<<<<< HEAD
=======
        description: formData.description.trim() || null,
>>>>>>> origin/main
        year: formData.year,
        location: formData.location,
        radius_km: formData.radius_km,
        specifications: formData.specifications,
        owner_id: ownerId,
        price_hour: formData.price_hour ? parseFloat(formData.price_hour) : null,
        price_day: formData.price_day ? parseFloat(formData.price_day) : null,
        price_hectare: formData.price_hectare ? parseFloat(formData.price_hectare) : null,
<<<<<<< HEAD
        operator_type: formData.operator_type,
=======
        operator_type: normalizeOperatorType(formData.operator_type),
>>>>>>> origin/main
        status: "available",
        service_cities: formData.service_cities
      };

<<<<<<< HEAD
=======
      if (import.meta.env.DEV) {
        console.log("[AddMachine] Inserindo machineData:", machineData);
      }

>>>>>>> origin/main
      let machineId: string | undefined;

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

      if (!machineId) throw new Error("ID da máquina não encontrado");

      // Handle Image Updates
      setUploadingImages(true);

      // 1. Delete removed images from DB
      if (deletedImageIds.length > 0) {
        await supabase
          .from('machine_images')
          .delete()
          .in('id', deletedImageIds);
        // Note: We are not deleting from storage here to keep it simple, but we could if we tracked file paths.
      }

      // 2. Process all current images (Upload new ones, update order for all)
      for (let i = 0; i < machineImages.length; i++) {
        const img = machineImages[i];

        if (img.isNew && img.file) {
          // Upload new image
          const fileName = `${machineId}/${Date.now()}_${i}.${img.file.name.split('.').pop()}`;

          const { error: uploadError } = await supabase.storage
            .from('machine-images')
            .upload(fileName, img.file);

          if (uploadError) {
<<<<<<< HEAD
            console.error('Error uploading:', uploadError);
=======
            if (import.meta.env.DEV) {
              console.error('Error uploading:', uploadError);
            }
>>>>>>> origin/main
            continue;
          }

          const { data: { publicUrl } } = supabase.storage
            .from('machine-images')
            .getPublicUrl(fileName);

          // Insert new image record
          await supabase
            .from('machine_images')
            .insert({
              machine_id: machineId,
              image_url: publicUrl,
              is_primary: i === 0,
              order_index: i
            });

        } else if (!img.isNew && img.id) {
          // Update existing image order/primary status if needed
          // We always update to ensure order is correct
          await supabase
            .from('machine_images')
            .update({
              is_primary: i === 0,
              order_index: i
            })
            .eq('id', img.id);
        }
      }

      setUploadingImages(false);

      toast({
        title: isEditing ? "Máquina atualizada!" : "Máquina cadastrada!",
        description: isEditing ? "As informações foram salvas com sucesso." : "Sua máquina está disponível para locação",
      });

      navigate("/minhas-maquinas");
    } catch (error: any) {
<<<<<<< HEAD
      let errorMessage = "Erro ao cadastrar máquina. Tente novamente.";

      if (error.code === "23505") {
        errorMessage = "Já existe uma máquina cadastrada com esses dados.";
=======
      if (import.meta.env.DEV) {
        console.error("[AddMachine] Erro ao salvar:", {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
          status: error.status,
        });
      }

      let errorMessage = error.message || "Erro ao cadastrar máquina. Tente novamente.";
      if (error.code === "23505") {
        errorMessage = "Já existe uma máquina cadastrada com esses dados.";
      } else if (error.code === "42501") {
        errorMessage = "Sem permissão (RLS). Verifique se está logado corretamente.";
>>>>>>> origin/main
      }

      toast({
        title: "Erro no cadastro",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setUploadingImages(false);
    }
  };

<<<<<<< HEAD
  const handleChange = (field: string, value: any) => {
=======
  const handleChange = useCallback((field: string, value: any) => {
>>>>>>> origin/main
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
<<<<<<< HEAD
  };
=======
  }, []);
>>>>>>> origin/main

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-16 pb-8">
        <div className="container mx-auto px-4 max-w-2xl">
<<<<<<< HEAD
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
=======
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-foreground">
                {isEditing ? "Editar Máquina" : "Cadastrar Nova Máquina"}
              </h1>
              {verificationStatus?.hasApproved ? (
                <Badge className="gap-1 bg-green-600 hover:bg-green-700 text-xs">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Verificado
                </Badge>
              ) : (
                <Badge variant="outline" className="gap-1 text-xs border-amber-300 text-amber-700 bg-amber-50">
                  <ShieldAlert className="h-3.5 w-3.5" />
                  Não Verificado
                </Badge>
              )}
            </div>
>>>>>>> origin/main
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
<<<<<<< HEAD
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
                    <Select onValueChange={(value) => handleChange('category', value)} value={formData.category}>
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
                    <Select onValueChange={(value) => handleChange('brand', value)} value={formData.brand}>
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
                        disabled={machineImages.length >= 3}
                        className="w-full"
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Selecionar Fotos ({machineImages.length}/3)
                      </Button>
                      <p className="text-xs text-muted-foreground mt-2 text-center">
                        Envie até 3 fotos da máquina (máx. 5MB cada)
                      </p>
                    </div>

                    {machineImages.length > 0 && (
                      <div className="grid grid-cols-3 gap-4">
                        {machineImages.map((img, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={img.url}
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
=======
                <MachineFormFields formData={formData} onChange={handleChange} />

                <MachineImageUploader
                  images={machineImages}
                  onAdd={handleAddImages}
                  onRemove={handleRemoveImage}
                />
>>>>>>> origin/main

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
                      'Salvar'
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
<<<<<<< HEAD
}
=======
}
>>>>>>> origin/main
