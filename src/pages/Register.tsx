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

  // Criar conta com Supabase Auth
  const handleSignUp = async () => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            user_type: formData.userType,
            phone: formData.phone,
            cpf_cnpj: formData.cpfCnpj
          },
          emailRedirectTo: `${window.location.origin}/register`
        }
      });

      if (error) throw error;

      // Supabase envia email automaticamente
      toast({
        title: "Conta criada!",
        description: "Verifique seu email para confirmar sua conta.",
      });

      return { success: true };

    } catch (error: any) {
      console.error("Erro ao criar conta (FULL):", error);
      toast({
        title: "Erro ao criar conta",
        description: `${error.message} (Code: ${error.code || 'N/A'})`,
        variant: "destructive",
      });
      throw error;
    }
  };

  // Verificar código OTP de email
  const handleVerifyEmailCode = async (code: string) => {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: formData.email,
        token: code,
        type: 'signup' // Tipo correto para verificação de cadastro
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
      toast({
        title: "Código inválido",
        description: "Verifique o código e tente novamente.",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Reenviar email de verificação
  const handleResendVerification = async () => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: formData.email
      });

      if (error) throw error;

      toast({
        title: "Email reenviado!",
        description: "Verifique sua caixa de entrada.",
      });

    } catch (error: any) {
      console.error("Erro ao reenviar email:", error);
      toast({
        title: "Erro ao reenviar email",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  // Finalizar cadastro (salvar perfil)
  const handleFinalize = async () => {
    setIsSubmitting(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        throw new Error("Sessão não encontrada. Verifique seu email novamente.");
      }

      if (!session.user.email_confirmed_at) {
        throw new Error("Por favor, verifique seu email antes de continuar.");
      }

      const userId = session.user.id;

      // Determina tipos de usuário
      let userTypes: string[] = [];
      if (formData.userType === 'both') {
        userTypes = ['producer', 'owner'];
      } else if (formData.userType) {
        userTypes = [formData.userType];
      }

      // Prepara dados do endereço (apenas se foram preenchidos)
      const addressData = formData.address ? {
        address: formData.address,
        city: formData.city,
        state: formData.state,
        cep: formData.cep,
        reference: formData.reference
      } : null;

      // Atualiza perfil com dados completos
      const { error: profileError } = await supabase
        .from('user_profiles')
        .upsert({
          auth_user_id: userId,
          full_name: formData.fullName,
          phone: formData.phone,
          cpf_cnpj: formData.cpfCnpj,
          address: addressData,
          user_types: userTypes,
          user_type: formData.userType === 'both' ? 'producer' : formData.userType,
          profile_completed: true,
          profile_completion_step: 5,
          verified: formData.documentsUploaded
        }, {
          onConflict: 'auth_user_id'
        });

      if (profileError) throw new Error("Erro ao salvar perfil: " + profileError.message);

      toast({
        title: "Cadastro concluído!",
        description: "Bem-vindo ao FieldMachine.",
      });

      // Redireciona baseado no tipo de usuário
      if (formData.userType === 'producer') {
        navigate("/search");
      } else {
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
    // Cria conta com Supabase Auth ao avançar da etapa de dados básicos
    try {
      await handleSignUp();
      nextStep();
    } catch (error) {
      // Se der erro (ex: email já existe), não avança
      // O erro já é tratado com toast no handleSignUp
    }
  };

  // Pular etapa (para localização e sobre você)
  const handleSkipStep = () => {
    updateFormData({ profile_completion_step: currentStep });
    nextStep();
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
            onSkip={handleSkipStep}
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
            onSkip={handleSkipStep}
          />
        );
      case 5:
        return (
          <VerificationStep
            formData={formData}
            errors={errors}
            onUpdate={updateFormData}
            onVerifyEmail={handleVerifyEmailCode}
            onResendEmail={handleResendVerification}
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