import { useState, useEffect, lazy, Suspense } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { LocationSelector } from "@/components/ui/location-selector";
import { Loader2, User, Phone, Mail, MapPin, CreditCard, Upload, FileCheck } from "lucide-react";

// Lazy load Documents page
const DocumentsPage = lazy(() => import("@/pages/Documents"));

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "profile");

  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    email: "",
    cpf_cnpj: "",
    city: "",
    state: "",
    cep: "",
    profile_image: ""
  });
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      setUploading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      // 1. Upload to 'avatars' bucket
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // 3. Update local state
      setFormData(prev => ({ ...prev, profile_image: publicUrl }));

      toast({
        title: "Foto carregada!",
        description: "Lembre-se de salvar as alterações no final.",
      });

    } catch (error: any) {
      toast({
        title: "Erro no upload",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        navigate("/login");
        return;
      }

      const { data: profile, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("auth_user_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      if (profile) {
        const address = profile.address as any;
        setFormData({
          full_name: profile.full_name || "",
          phone: profile.phone || "",
          email: user.email || "",
          cpf_cnpj: profile.cpf_cnpj || "",
          city: address?.city || "",
          state: address?.state || "",
          cep: address?.cep || "",
          profile_image: profile.profile_image || ""
        });
      } else {
        setFormData(prev => ({ ...prev, email: user.email || "" }));
      }
    } catch (error: any) {
      toast({
        title: "Erro ao carregar perfil",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Usuário não autenticado");
      }

      const address = {
        city: formData.city,
        state: formData.state,
        cep: formData.cep
      };

      const { error } = await supabase
        .from("user_profiles")
        .upsert({
          auth_user_id: user.id,
          full_name: formData.full_name,
          phone: formData.phone,
          cpf_cnpj: formData.cpf_cnpj,
          address,
          profile_image: formData.profile_image
        }, { onConflict: 'auth_user_id' });

      if (error) throw error;

      toast({
        title: "Perfil atualizado!",
        description: "Suas informações foram salvas com sucesso."
      });
    } catch (error: any) {
      toast({
        title: "Erro ao salvar",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setSaving(false);
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
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <Tabs
            value={activeTab}
            onValueChange={(value) => {
              setActiveTab(value);
              setSearchParams({ tab: value });
            }}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Perfil
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex items-center gap-2">
                <FileCheck className="h-4 w-4" />
                Documentos
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Meu Perfil
                  </CardTitle>
                  <CardDescription>
                    Mantenha suas informações atualizadas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Profile Image */}
                    <div className="flex flex-col items-center space-y-4">
                      <div className="relative">
                        <div className="h-32 w-32 rounded-full overflow-hidden border-2 border-primary bg-muted flex items-center justify-center">
                          {formData.profile_image ? (
                            <img
                              src={formData.profile_image}
                              alt="Avatar"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <User className="h-16 w-16 text-muted-foreground" />
                          )}
                        </div>
                        <label
                          htmlFor="avatar-upload"
                          className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full cursor-pointer hover:bg-primary/90 transition-colors shadow-sm"
                        >
                          <Upload className="h-4 w-4" />
                        </label>
                        <input
                          id="avatar-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                          disabled={uploading}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {uploading ? "Enviando..." : "Clique na câmera para alterar sua foto"}
                      </p>
                    </div>

                    {/* Dados Pessoais */}
                    <div className="space-y-4">
                      <h3 className="font-semibold flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Dados Pessoais
                      </h3>

                      <div>
                        <Label htmlFor="full_name">Nome Completo *</Label>
                        <Input
                          id="full_name"
                          value={formData.full_name}
                          onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="cpf_cnpj">CPF/CNPJ *</Label>
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-muted-foreground" />
                          <Input
                            id="cpf_cnpj"
                            value={formData.cpf_cnpj}
                            onChange={(e) => setFormData(prev => ({ ...prev, cpf_cnpj: e.target.value }))}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Contato */}
                    <div className="space-y-4">
                      <h3 className="font-semibold flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Contato
                      </h3>

                      <div>
                        <Label htmlFor="email">Email</Label>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            disabled
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="phone">Telefone *</Label>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                            placeholder="(00) 00000-0000"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Localização */}
                    <div className="space-y-4">
                      <h3 className="font-semibold flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Localização
                      </h3>

                      <div>
                        <Label htmlFor="cep">CEP</Label>
                        <Input
                          id="cep"
                          value={formData.cep}
                          onChange={(e) => setFormData(prev => ({ ...prev, cep: e.target.value }))}
                          placeholder="00000-000"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Localização</Label>
                        <LocationSelector
                          onLocationChange={(loc) => {
                            setFormData(prev => ({
                              ...prev,
                              city: loc.city,
                              state: loc.state
                            }));
                          }}
                          initialData={{
                            country: 'BRASIL',
                            state: formData.state,
                            city: formData.city
                          }}
                        />
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button type="submit" disabled={saving}>
                        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Salvar Alterações
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate("/dashboard")}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents">
              <Suspense fallback={
                <Card>
                  <CardContent className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </CardContent>
                </Card>
              }>
                <DocumentsPage />
              </Suspense>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
