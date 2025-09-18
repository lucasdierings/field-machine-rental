import { useState } from 'react';
import { z } from 'zod';

export type UserType = 'producer' | 'owner';

export interface RegisterFormData {
  // Step 1: Tipo de usuário
  userType: UserType | null;
  
  // Step 2: Dados básicos
  fullName: string;
  cpfCnpj: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  hasWhatsapp: boolean;
  
  // Step 3: Localização
  cep: string;
  address: string;
  city: string;
  state: string;
  reference: string;
  radius: number;
  
  // Step 4: Sobre você (Produtor)
  propertySize?: number;
  mainCrops?: string[];
  rentalFrequency?: string;
  howFoundUs?: string;
  
  // Step 4: Sobre você (Proprietário)
  machinesCount?: number;
  rentalExperience?: string;
  deliveryAvailable?: boolean;
  bankAccount?: string;
  
  // Step 5: Verificação
  emailVerified: boolean;
  phoneVerified: boolean;
  documentsUploaded: boolean;
  termsAccepted: boolean;
}

const basicDataSchema = z.object({
  fullName: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  cpfCnpj: z.string().min(11, 'CPF/CNPJ inválido'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Telefone inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Senhas não coincidem",
  path: ["confirmPassword"],
});

const locationSchema = z.object({
  cep: z.string().length(8, 'CEP deve ter 8 dígitos'),
  address: z.string().min(5, 'Endereço muito curto'),
  city: z.string().min(2, 'Cidade inválida'),
  state: z.string().length(2, 'Estado inválido'),
  radius: z.number().min(1).max(500),
});

export const useRegisterForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<RegisterFormData>({
    userType: null,
    fullName: '',
    cpfCnpj: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    hasWhatsapp: false,
    cep: '',
    address: '',
    city: '',
    state: '',
    reference: '',
    radius: 50,
    emailVerified: false,
    phoneVerified: false,
    documentsUploaded: false,
    termsAccepted: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateFormData = (updates: Partial<RegisterFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    try {
      switch (step) {
        case 1:
          if (!formData.userType) {
            newErrors.userType = 'Selecione o tipo de usuário';
          }
          break;
        case 2:
          basicDataSchema.parse(formData);
          break;
        case 3:
          locationSchema.parse(formData);
          break;
        case 4:
          if (formData.userType === 'producer') {
            if (!formData.propertySize || formData.propertySize < 1) {
              newErrors.propertySize = 'Tamanho da propriedade é obrigatório';
            }
            if (!formData.mainCrops || formData.mainCrops.length === 0) {
              newErrors.mainCrops = 'Selecione pelo menos uma cultura';
            }
          } else if (formData.userType === 'owner') {
            if (!formData.machinesCount || formData.machinesCount < 1) {
              newErrors.machinesCount = 'Número de máquinas é obrigatório';
            }
          }
          break;
        case 5:
          if (!formData.termsAccepted) {
            newErrors.termsAccepted = 'Aceite os termos para continuar';
          }
          break;
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          newErrors[err.path[0] as string] = err.message;
        });
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
      return true;
    }
    return false;
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  return {
    currentStep,
    formData,
    errors,
    updateFormData,
    validateStep,
    nextStep,
    prevStep,
    goToStep,
    setErrors,
  };
};