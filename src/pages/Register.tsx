import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRegisterForm } from "@/hooks/useRegisterForm";
import { supabase } from "@/integrations/supabase/client";
import { UserTypeSelection } from "@/components/register/UserTypeSelection";
import { BasicDataStep } from "@/components/register/BasicDataStep";
import { LocationStep } from "@/components/register/LocationStep";
import { AboutYouStep } from "@/components/register/AboutYouStep";
import { VerificationStep } from "@/components/register/VerificationStep";
import { StepIndicator } from "@/components/register/StepIndicator";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { useToast } from "@/hooks/use-toast";

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    currentStep,
    formData,
    errors,
    updateFormData,
    nextStep,
    prevStep,
    goToStep,
  } = useRegisterForm();

  const stepTitles = [
    "Tipo",
    "Dados",
    "Local",
    "Perfil",
    "Verificar"
  ];

  const handleUserTypeSelect = (userType: 'producer' | 'owner') => {
    updateFormData({ userType });
  };

  // 1. Enviar Código de Email (Inicia o SignUp)
  const handleSendEmailVerification = async () => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            user_type: formData.userType,
            // Outros metadados úteis caso o usuário confirme via link depois
            phone: formData.phone,
            cpf_cnpj: formData.cpfCnpj
          }
        }
      });

      if (error) throw error;

      // Se retornou sessão, o email já foi verificado (ou confirmação está desligada)
      if (data.session) {
        updateFormData({ emailVerified: true });
        toast({
          title: "Email verificado!",
          description: "Seu email foi confirmado automaticamente.",
        });
        return { autoVerified: true };
      }

      toast({
        title: "Código enviado!",
        description: "Verifique seu email para pegar o código de confirmação.",
      });
      return { autoVerified: false };

    } catch (error: any) {
      console.error("Erro ao enviar email:", error);
      toast({
        title: "Erro ao enviar código",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  // 2. Verificar Código de Email
  const handleVerifyEmailCode = async (code: string) => {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: formData.email,
        token: code,
        type: 'signup'
      });

      if (error) throw error;

      if (data.session) {
        updateFormData({ emailVerified: true });
        toast({
          title: "Email verificado!",
          description: "Email confirmado com sucesso!",
        });
      }
    } catch (error: any) {
      console.error("Erro ao verificar email:", error);
      toast({
        title: "Código inválido",
        description: "Verifique o código e tente novamente.",
        variant: "destructive",
      });
      throw error;
    }
  };

  // 3. Enviar Código SMS (Requer sessão ativa - email verificado)
  const handleSendPhoneVerification = async () => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        throw new Error("Você precisa verificar o email primeiro.");
      }

      const { error } = await supabase.auth.updateUser({
        phone: formData.phone
      });

      if (error) throw error;

      toast({
        title: "SMS enviado!",
        description: "Verifique seu celular para pegar o código.",
      });

    } catch (error: any) {
      console.error("Erro ao enviar SMS:", error);
      toast({
        title: "Erro ao enviar SMS",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  // 4. Verificar Código SMS
  const handleVerifyPhoneCode = async (code: string) => {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone: formData.phone,
        token: code,
        type: 'phone_change'
      });

      if (error) throw error;

      if (data.session) {
        updateFormData({ phoneVerified: true });
        toast({
          title: "Celular verificado!",
          description: "Telefone confirmado com sucesso!",
        });
      }
    } catch (error: any) {
      console.error("Erro ao verificar SMS:", error);
      toast({
        title: "Código inválido",
        description: "Verifique o código e tente novamente.",
        variant: "destructive",
      });
      throw error;
    }
  };

  // 5. Finalizar Cadastro (Salvar Perfil)
  const handleFinalize = async () => {
    setIsSubmitting(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        throw new Error("Sessão não encontrada. Verifique seu email novamente.");
      }

      const userId = session.user.id;

      // Determine roles based on userType
      let roles: string[] = [];
      if (formData.userType === 'both') {
        roles = ['producer', 'owner'];
      } else if (formData.userType) {
        roles = [formData.userType];
      }

      // 1. Upsert em user_profiles
      const { error: profileError } = await supabase
        .from('user_profiles')
        .upsert({
          auth_user_id: userId,
          full_name: formData.fullName,
          phone: formData.phone,
          cpf_cnpj: formData.cpfCnpj,
          address: {
            address: formData.address,
            city: formData.city,
            state: formData.state,
            cep: formData.cep,
            reference: formData.reference
          },
          user_types: roles,
          verified: formData.documentsUploaded // Se fez upload, marca como pendente de verificação (lógica de backend pode ajustar)
        }, {
          onConflict: 'auth_user_id'
        });

      if (profileError) throw new Error("Erro ao salvar perfil: " + profileError.message);

      // 2. Inserir em user_roles
      // Verifica se já existe role para evitar erro de duplicidade se o usuário clicou várias vezes
      const { data: existingRoles } = await supabase.from('user_roles').select('*').eq('user_id', userId);

      if (!existingRoles?.length) {
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: userId,
            role: 'user'
          });
        if (roleError) throw new Error("Erro ao definir permissões: " + roleError.message);
      }

      // 3. Inserir em public.users
      // Verifica se já existe
      const { data: existingPublicUser } = await supabase.from('users').select('*').eq('id', userId);

      if (!existingPublicUser?.length) {
        const { error: usersError } = await supabase
          .from('users')
          .insert({
            id: userId, // Importante: ID deve ser igual ao auth_user_id
            auth_user_id: userId,
            email: formData.email,
            full_name: formData.fullName,
            user_type: formData.userType === 'both' ? 'producer' : formData.userType,
            phone: formData.phone,
            cpf_cnpj: formData.cpfCnpj,
            address: {
              address: formData.address,
              city: formData.city,
              state: formData.state,
              cep: formData.cep,
              reference: formData.reference
            }
          });

        if (usersError) {
          console.error("Public user creation error:", usersError);
          // Não lança erro fatal, pois o principal já foi feito
        }
      }

      toast({
        title: "Cadastro concluído!",
        description: "Bem-vindo ao FieldMachine.",
      });

      // Redirection Logic
      if (formData.userType === 'producer') {
        navigate("/search");
      } else {
        // Owner or Both
        navigate("/add-machine");
      }

    } catch (error: any) {
      console.error("Erro na finalização:", error);
      toast({
        title: "Erro ao finalizar",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBasicDataNext = async () => {
    // Dispara o envio do email automaticamente ao avançar da etapa de dados básicos
    try {
      await handleSendEmailVerification();
      nextStep();
    } catch (error) {
      // Se der erro (ex: email já existe), não avança
      // O erro já é tratado com toast no handleSendEmailVerification
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <UserTypeSelection
            selectedType={formData.userType}
            onSelect={handleUserTypeSelect}
            onNext={nextStep}
          />
        );
      case 2:
        return (
          <BasicDataStep
            formData={formData}
            errors={errors}
            onUpdate={updateFormData}
            onNext={handleBasicDataNext}
            onPrev={prevStep}
          />
        );
      case 3:
        return (
          <LocationStep
            formData={formData}
            errors={errors}
            onUpdate={updateFormData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 4:
        return (
          <AboutYouStep
            formData={formData}
            errors={errors}
            onUpdate={updateFormData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 5:
        return (
          <VerificationStep
            formData={formData}
            errors={errors}
            onUpdate={updateFormData}
            onVerifyEmail={handleVerifyEmailCode}
            onVerifyPhone={handleVerifyPhoneCode}
            onFinalize={handleFinalize}
            onPrev={prevStep}
            isSubmitting={isSubmitting}
          />
        );
      default:
        return null;
    }
  };

  // Step 1 não mostra header/footer nem indicador
  if (currentStep === 1) {
    return renderCurrentStep();
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16 pb-8">
        <div className="container mx-auto px-4">
          <StepIndicator
            currentStep={currentStep}
            totalSteps={5}
            stepTitles={stepTitles}
          />
          {renderCurrentStep()}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Register;