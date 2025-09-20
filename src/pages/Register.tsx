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
      // Criar conta no Supabase
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