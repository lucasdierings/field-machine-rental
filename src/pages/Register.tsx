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

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // 1. Criar conta no Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            user_type: formData.userType,
            phone: formData.phone
          }
        }
      });

      if (error) {
        throw error;
      }

      if (!data.user) {
        throw new Error("Falha ao criar usuário");
      }

      const userId = data.user.id;

      // 2. Upsert em user_profiles (pode já existir via trigger)
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
          user_types: [formData.userType]
        }, {
          onConflict: 'auth_user_id'
        });

      if (profileError) {
        console.error("Profile creation error:", profileError);
        throw new Error("Erro ao criar perfil: " + profileError.message);
      }

      // 3. Inserir em user_roles
      const roleToAssign = formData.userType === 'producer' || formData.userType === 'owner' ? 'user' : 'user';
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role: roleToAssign
        });

      if (roleError) {
        console.error("Role creation error:", roleError);
        throw new Error("Erro ao definir permissões: " + roleError.message);
      }

      toast({
        title: "Conta criada com sucesso!",
        description: "Bem-vindo ao FieldMachine. Você será redirecionado para seu dashboard.",
      });
      
      // Redirecionar para dashboard principal
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        title: "Erro ao criar conta",
        description: error.message || "Tente novamente em alguns minutos.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
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
            onNext={nextStep}
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
            onSubmit={handleSubmit}
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