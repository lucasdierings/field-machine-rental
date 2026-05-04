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

// Safe file extension mapping based on MIME type
const MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

const getImageExtension = (file: File): string => {
  const ext = MIME_TO_EXT[file.type.toLowerCase()];
  if (ext) return ext;
  // Fallback to jpg if type is unknown
  return 'jpg';
};

export default function AddMachine() {
  const navigate = useNavigate();
  const { toast } = useToast();
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

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    brand: "",
    model: "",
    description: "",
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
    operator_type: "owner", // owner | employee
    specifications: {},
    service_cities: [] as string[]
  });

  // Load existing machine data when editing
  const { isLoading: loadingMachine } = useQuery({
    queryKey: ['edit-machine', id],
    queryFn: async () => {
      const { data: machine, error } = await supabase
        .from('machines')
        .select('*')
        .eq('id', id!)
        .single();

      if (error) throw error;

      if (machine) {
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
          description: machine.description || "",
          year: machine.year || new Date().getFullYear(),
          price_hour: machine.price_hour?.toString() || "",
          price_day: machine.price_day?.toString() || "",
          price_hectare: machine.price_hectare?.toString() || "",
          location: (locationData as { city: string; state: string; address: string }) || { city: "", state: "", address: "" },
          radius_km: machine.radius_km || 50,
          operator_type: normalizeOperatorType((machine as any).operator_type),
          specifications: machine.specifications || {},
          service_cities: (machine as any).service_cities || []
        });

        const { data: dbImages } = await supabase
          .from('machine_images')
          .select('id, image_url')
          .eq('machine_id', id!)
          .order('order_index');

        if (dbImages) {
          setMachineImages(dbImages.map(img => ({
            id: img.id,
            url: img.image_url,
            isNew: false
          })));
        }
      }

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação centralizada via Zod — vê src/lib/schemas/machineSchema.ts
    const validationError = validateMachineForm(formData);
    if (validationError) {
      toast({
        title: validationError.title,
        description: validationError.description,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      if (!userId) {
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

      const machineData = {
        name: formData.name,
        category: formData.category,
        brand: formData.brand,
        model: formData.model || null,
        description: formData.description.trim() || null,
        year: formData.year,
        description: formData.description?.trim() || null,
        location: formData.location,
        radius_km: formData.radius_km,
        specifications: formData.specifications,
        owner_id: ownerId,
        price_hour: formData.price_hour ? parseFloat(formData.price_hour) : null,
        price_day: formData.price_day ? parseFloat(formData.price_day) : null,
        price_hectare: formData.price_hectare ? parseFloat(formData.price_hectare) : null,
        operator_type: normalizeOperatorType(formData.operator_type),
        status: "available",
        service_cities: formData.service_cities
      };

      if (import.meta.env.DEV) {
        console.log("[AddMachine] Inserindo machineData:", machineData);
      }

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
      }

      // 2. Process all current images (Upload new ones, update order for all)
      const uploadErrors: string[] = [];

      for (let i = 0; i < machineImages.length; i++) {
        const img = machineImages[i];

        try {
          if (img.isNew && img.file) {
            // Upload new image (using safe MIME-based extension)
            const ext = getImageExtension(img.file);
            const fileName = `${machineId}/${Date.now()}_${i}.${ext}`;

            const { error: uploadError } = await supabase.storage
              .from('machine-images')
              .upload(fileName, img.file);

            if (uploadError) {
              uploadErrors.push(`Imagem ${i + 1}: ${uploadError.message}`);
              continue;
            }

            const { data: { publicUrl } } = supabase.storage
              .from('machine-images')
              .getPublicUrl(fileName);

            // Insert new image record
            const { error: insertError } = await supabase
              .from('machine_images')
              .insert({
                machine_id: machineId,
                image_url: publicUrl,
                is_primary: i === 0,
                order_index: i
              });

            if (insertError) {
              uploadErrors.push(`Imagem ${i + 1} (BD): ${insertError.message}`);
            }

          } else if (!img.isNew && img.id) {
            // Update existing image order/primary status if needed
            const { error: updateError } = await supabase
              .from('machine_images')
              .update({
                is_primary: i === 0,
                order_index: i
              })
              .eq('id', img.id);

            if (updateError) {
              uploadErrors.push(`Atualizar imagem ${i + 1}: ${updateError.message}`);
            }
          }
        } catch (error) {
          uploadErrors.push(`Imagem ${i + 1}: Erro inesperado`);
        }
      }

      // Notify user if there were any errors
      if (uploadErrors.length > 0) {
        toast({
          title: "Aviso: Alguns problemas com imagens",
          description: uploadErrors.join('\n'),
          variant: "destructive",
        });
      }

      setUploadingImages(false);

      toast({
        title: isEditing ? "Máquina atualizada!" : "Máquina cadastrada!",
        description: isEditing ? "As informações foram salvas com sucesso." : "Sua máquina está disponível para locação",
      });

      navigate("/minhas-maquinas");
    } catch (error: any) {
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

  const handleChange = useCallback((field: string, value: any) => {
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
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-16 pb-8">
        <div className="container mx-auto px-4 max-w-2xl">
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
                <MachineFormFields formData={formData} onChange={handleChange} />

                <MachineImageUploader
                  images={machineImages}
                  onAdd={handleAddImages}
                  onRemove={handleRemoveImage}
                />

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
}
