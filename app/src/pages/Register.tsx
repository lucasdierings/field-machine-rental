import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRegisterForm } from "@/hooks/useRegisterForm";
import { supabase } from "@/integrations/supabase/client";
// import { UserTypeSelection } from "@/components/register/UserTypeSelection"; // Removed
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
    "Dados",
    "Local",
    "Perfil",
    "Verificar"
  ];

  // Criar conta com Supabase Auth
  const handleSignUp = async () => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            user_type: 'both', // Always both
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

      // Check email confirmation if enforced by Supabase config
      // if (!session.user.email_confirmed_at) ...

      const userId = session.user.id;

      // Determine user types based on selection
      let userTypes: string[] = [];
      if (formData.userType === 'both') {
        userTypes = ['producer', 'owner'];
      } else if (formData.userType) {
        userTypes = [formData.userType];
      } else {
        // Fallback default
        userTypes = ['producer', 'owner'];
      }

      // Legacy single type field - prioritize producer if both
      const primaryUserType = formData.userType === 'both' ? 'producer' : (formData.userType || 'producer');

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
          user_type: primaryUserType,
          profile_completed: true,
          profile_completion_step: 4, // Final Step
          verified: formData.documentsUploaded
        }, {
          onConflict: 'auth_user_id'
        });

      if (profileError) throw new Error("Erro ao salvar perfil: " + profileError.message);

      toast({
        title: "Cadastro concluído!",
        description: "Bem-vindo ao FieldMachine.",
      });

      // Redirect to main dashboard (as everyone can do everything)
      navigate("/dashboard");

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
          <BasicDataStep
            formData={formData}
            errors={errors}
            onUpdate={updateFormData}
            onNext={handleBasicDataNext}
            onPrev={prevStep}
          />
        );
      case 2:
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
      case 3:
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
      case 4:
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16 pb-8">
        <div className="container mx-auto px-4">
          <StepIndicator
            currentStep={currentStep}
            totalSteps={4}
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