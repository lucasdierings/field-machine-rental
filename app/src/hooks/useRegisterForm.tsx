<<<<<<< HEAD
import { useState } from "react";
import { z } from "zod";
=======
import { useState, useEffect, useCallback } from "react";
import { z } from "zod";
import {
  validateCPFCNPJ,
  validateEmail,
  validatePhoneBR,
  validatePasswordStrength,
} from "@/lib/validation";
>>>>>>> origin/main

export type UserType = "producer" | "owner" | "both";

export interface RegisterFormData {
  userType?: UserType; // Intention for the platform
  fullName: string;
  cpfCnpj: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  hasWhatsapp: boolean;

  // Location
  cep: string;
  address: string;
  city: string;
  state: string;
  reference: string;

  // Optional profile fields (unified)
  propertySize?: string; // Changed to string for input flexibility
  mainCrops?: string[];
  machinesCount?: string;
  bankAccount?: string; // Removed from UI, but keeping in type just in case
  rentalFrequency?: string;
  rentalExperience?: string;
  deliveryAvailable?: boolean;
  howFoundUs?: string;

  // Verification
  emailVerified: boolean;
  emailCode: string; // Only email code needed now
  documentsUploaded: boolean;
  termsAccepted: boolean;

  profile_completion_step?: number;
}

<<<<<<< HEAD
// Schemas
const basicDataSchema = z.object({
  fullName: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  cpfCnpj: z.string().min(11, "CPF/CNPJ inválido"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(10, "Telefone inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Senhas não coincidem",
  path: ["confirmPassword"],
});

const locationSchema = z.object({
  city: z.string().min(2, "Cidade obrigatória"),
  state: z.string().min(2, "Estado obrigatório"),
});

export const useRegisterForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<RegisterFormData>({
    userType: undefined,
    fullName: "",
    cpfCnpj: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    hasWhatsapp: true,
    cep: "",
    address: "",
    city: "",
    state: "",
    reference: "",
    propertySize: "",
    machinesCount: "",
    emailVerified: false,
    emailCode: "",
    documentsUploaded: false,
    termsAccepted: false,
=======
// Schemas — reusam validações centralizadas em lib/validation.ts
const basicDataSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(3, "Nome deve ter pelo menos 3 caracteres")
      .refine((value) => value.includes(" "), {
        message: "Informe o nome completo (nome e sobrenome)",
      }),
    cpfCnpj: z
      .string()
      .refine((value) => validateCPFCNPJ(value), {
        message: "CPF/CNPJ inválido",
      }),
    email: z
      .string()
      .refine((value) => validateEmail(value), { message: "Email inválido" }),
    phone: z
      .string()
      .refine((value) => validatePhoneBR(value), {
        message: "Telefone inválido (10 ou 11 dígitos)",
      }),
    password: z
      .string()
      .refine((value) => validatePasswordStrength(value).isValid, {
        message:
          "Senha fraca. Use no mínimo 8 caracteres com maiúscula, minúscula, número e caractere especial.",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Senhas não coincidem",
    path: ["confirmPassword"],
  });

const locationSchema = z.object({
  city: z.string().trim().min(2, "Cidade obrigatória"),
  state: z.string().trim().min(2, "Estado obrigatório"),
});

const DRAFT_STORAGE_KEY = "fm:register-draft";

const defaultFormData: RegisterFormData = {
  userType: undefined,
  fullName: "",
  cpfCnpj: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  hasWhatsapp: true,
  cep: "",
  address: "",
  city: "",
  state: "",
  reference: "",
  propertySize: "",
  machinesCount: "",
  emailVerified: false,
  emailCode: "",
  documentsUploaded: false,
  termsAccepted: false,
};

// Campos que nunca devem ser persistidos no localStorage (segurança)
const SENSITIVE_KEYS: Array<keyof RegisterFormData> = [
  "password",
  "confirmPassword",
  "emailCode",
];

const loadDraft = (): Partial<RegisterFormData> | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(DRAFT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<RegisterFormData>;
    // Sanitiza: nunca restaura senhas/código mesmo que alguém tenha mexido no storage
    SENSITIVE_KEYS.forEach((key) => {
      delete parsed[key];
    });
    return parsed;
  } catch {
    return null;
  }
};

const saveDraft = (data: RegisterFormData) => {
  if (typeof window === "undefined") return;
  try {
    const sanitized: Partial<RegisterFormData> = { ...data };
    SENSITIVE_KEYS.forEach((key) => {
      delete sanitized[key];
    });
    window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(sanitized));
  } catch {
    // ignora quota exceeded etc.
  }
};

export const clearRegisterDraft = () => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(DRAFT_STORAGE_KEY);
  } catch {
    // noop
  }
};

export const useRegisterForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<RegisterFormData>(() => {
    const draft = loadDraft();
    return draft ? { ...defaultFormData, ...draft } : defaultFormData;
>>>>>>> origin/main
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

<<<<<<< HEAD
  const updateFormData = (updates: Partial<RegisterFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
    // Clear errors for updated fields
    const newErrors = { ...errors };
    Object.keys(updates).forEach((key) => delete newErrors[key]);
    setErrors(newErrors);
  };
=======
  // Persiste rascunho automaticamente (exceto campos sensíveis)
  useEffect(() => {
    saveDraft(formData);
  }, [formData]);

  const updateFormData = useCallback((updates: Partial<RegisterFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
    setErrors((prev) => {
      const newErrors = { ...prev };
      Object.keys(updates).forEach((key) => delete newErrors[key]);
      return newErrors;
    });
  }, []);
>>>>>>> origin/main

  const validateStep = (step: number = currentStep): boolean => {
    try {
      if (step === 1) {
        basicDataSchema.parse(formData);
      } else if (step === 2) {
        locationSchema.parse(formData);
      } else if (step === 3) {
        // About You - Optional fields, no strict validation blocks
      } else if (step === 4) {
        if (!formData.emailVerified) {
          // Verification happens via button interaction, not next step
          // But if they try to finish...
        }
      }

      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          newErrors[err.path[0] as string] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const nextStep = () => {
    if (validateStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const goToStep = (step: number) => {
    if (step < currentStep || validateStep(currentStep)) {
      setCurrentStep(step);
    }
  };

<<<<<<< HEAD
=======
  const resetForm = useCallback(() => {
    setFormData(defaultFormData);
    setCurrentStep(1);
    setErrors({});
    clearRegisterDraft();
  }, []);

>>>>>>> origin/main
  return {
    currentStep,
    formData,
    errors,
    updateFormData,
    nextStep,
    prevStep,
    goToStep,
<<<<<<< HEAD
  };
};
=======
    resetForm,
  };
};
>>>>>>> origin/main
