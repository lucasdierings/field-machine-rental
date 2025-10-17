/**
 * Funções de validação robustas para Field Machine
 */

// ============================================
// VALIDAÇÃO DE CPF
// ============================================
export const validateCPF = (cpf: string): boolean => {
  // Remove caracteres não numéricos
  const numbers = cpf.replace(/\D/g, '');
  
  // Verifica se tem 11 dígitos
  if (numbers.length !== 11) return false;
  
  // Rejeita CPFs com todos dígitos iguais
  if (/^(\d)\1{10}$/.test(numbers)) return false;
  
  // Calcula primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(numbers.charAt(i)) * (10 - i);
  }
  let digit1 = 11 - (sum % 11);
  if (digit1 >= 10) digit1 = 0;
  
  // Calcula segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(numbers.charAt(i)) * (11 - i);
  }
  let digit2 = 11 - (sum % 11);
  if (digit2 >= 10) digit2 = 0;
  
  // Verifica se os dígitos calculados conferem
  return (
    parseInt(numbers.charAt(9)) === digit1 &&
    parseInt(numbers.charAt(10)) === digit2
  );
};

// ============================================
// VALIDAÇÃO DE CNPJ
// ============================================
export const validateCNPJ = (cnpj: string): boolean => {
  // Remove caracteres não numéricos
  const numbers = cnpj.replace(/\D/g, '');
  
  // Verifica se tem 14 dígitos
  if (numbers.length !== 14) return false;
  
  // Rejeita CNPJs com todos dígitos iguais
  if (/^(\d)\1{13}$/.test(numbers)) return false;
  
  // Calcula primeiro dígito verificador
  let sum = 0;
  let weight = 5;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(numbers.charAt(i)) * weight;
    weight = weight === 2 ? 9 : weight - 1;
  }
  let digit1 = 11 - (sum % 11);
  if (digit1 >= 10) digit1 = 0;
  
  // Calcula segundo dígito verificador
  sum = 0;
  weight = 6;
  for (let i = 0; i < 13; i++) {
    sum += parseInt(numbers.charAt(i)) * weight;
    weight = weight === 2 ? 9 : weight - 1;
  }
  let digit2 = 11 - (sum % 11);
  if (digit2 >= 10) digit2 = 0;
  
  // Verifica se os dígitos calculados conferem
  return (
    parseInt(numbers.charAt(12)) === digit1 &&
    parseInt(numbers.charAt(13)) === digit2
  );
};

// ============================================
// VALIDAÇÃO COMBINADA CPF/CNPJ
// ============================================
export const validateCPFCNPJ = (doc: string): boolean => {
  const numbers = doc.replace(/\D/g, '');
  
  if (numbers.length === 11) {
    return validateCPF(doc);
  } else if (numbers.length === 14) {
    return validateCNPJ(doc);
  }
  
  return false;
};

// ============================================
// FORMATAÇÃO DE CPF
// ============================================
export const formatCPF = (cpf: string): string => {
  const numbers = cpf.replace(/\D/g, '');
  return numbers
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    .substring(0, 14);
};

// ============================================
// FORMATAÇÃO DE CNPJ
// ============================================
export const formatCNPJ = (cnpj: string): string => {
  const numbers = cnpj.replace(/\D/g, '');
  return numbers
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})$/, '$1-$2')
    .substring(0, 18);
};

// ============================================
// FORMATAÇÃO DE TELEFONE BR
// ============================================
export const formatPhoneBR = (phone: string): string => {
  const numbers = phone.replace(/\D/g, '');
  
  if (numbers.length === 11) {
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (numbers.length === 10) {
    return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  
  return phone;
};

// ============================================
// VALIDAÇÃO DE TELEFONE BR
// ============================================
export const validatePhoneBR = (phone: string): boolean => {
  const numbers = phone.replace(/\D/g, '');
  return numbers.length === 10 || numbers.length === 11;
};

// ============================================
// VALIDAÇÃO DE EMAIL
// ============================================
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  return emailRegex.test(email);
};

// ============================================
// VALIDAÇÃO DE SENHA FORTE
// ============================================
export interface PasswordStrength {
  isValid: boolean;
  score: number; // 0-5
  feedback: string[];
}

export const validatePasswordStrength = (password: string): PasswordStrength => {
  const feedback: string[] = [];
  let score = 0;
  
  // Comprimento mínimo
  if (password.length < 8) {
    feedback.push('Mínimo de 8 caracteres');
  } else {
    score++;
  }
  
  // Letra maiúscula
  if (!/[A-Z]/.test(password)) {
    feedback.push('Adicione letra maiúscula');
  } else {
    score++;
  }
  
  // Letra minúscula
  if (!/[a-z]/.test(password)) {
    feedback.push('Adicione letra minúscula');
  } else {
    score++;
  }
  
  // Número
  if (!/\d/.test(password)) {
    feedback.push('Adicione número');
  } else {
    score++;
  }
  
  // Caractere especial
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    feedback.push('Adicione caractere especial');
  } else {
    score++;
  }
  
  return {
    isValid: score >= 5,
    score,
    feedback
  };
};

// ============================================
// VALIDAÇÃO DE CEP
// ============================================
export const validateCEP = (cep: string): boolean => {
  const numbers = cep.replace(/\D/g, '');
  return numbers.length === 8;
};

// ============================================
// FORMATAÇÃO DE CEP
// ============================================
export const formatCEP = (cep: string): string => {
  const numbers = cep.replace(/\D/g, '');
  return numbers.replace(/(\d{5})(\d{3})/, '$1-$2').substring(0, 9);
};

// ============================================
// VALIDAÇÃO DE DATAS DE RESERVA
// ============================================
export interface DateValidation {
  isValid: boolean;
  error?: string;
}

export const validateReservationDates = (
  startDate: Date,
  endDate: Date
): DateValidation => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Data de início não pode ser no passado
  if (startDate < today) {
    return {
      isValid: false,
      error: 'Data de início não pode ser no passado'
    };
  }
  
  // Data de fim não pode ser antes da data de início
  if (endDate < startDate) {
    return {
      isValid: false,
      error: 'Data de término deve ser posterior à data de início'
    };
  }
  
  // Intervalo mínimo de 1 dia
  const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  if (daysDiff < 1) {
    return {
      isValid: false,
      error: 'Intervalo mínimo de 1 dia'
    };
  }
  
  // Intervalo máximo de 90 dias
  if (daysDiff > 90) {
    return {
      isValid: false,
      error: 'Intervalo máximo de 90 dias'
    };
  }
  
  return { isValid: true };
};

// ============================================
// VALIDAÇÃO DE PREÇO
// ============================================
export const validatePrice = (price: number): boolean => {
  return price > 0 && Number.isFinite(price);
};

// ============================================
// VALIDAÇÃO DE ANO DE FABRICAÇÃO
// ============================================
export const validateManufacturingYear = (year: number): boolean => {
  const currentYear = new Date().getFullYear();
  return year >= 1900 && year <= currentYear;
};

// ============================================
// VALIDAÇÃO DE TAMANHO DE ARQUIVO
// ============================================
export const validateFileSize = (file: File, maxSizeMB: number = 10): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

// ============================================
// VALIDAÇÃO DE TIPO DE ARQUIVO (IMAGEM)
// ============================================
export const validateImageType = (file: File): boolean => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  return validTypes.includes(file.type);
};

// ============================================
// VALIDAÇÃO DE IDADE MÍNIMA (18 ANOS)
// ============================================
export const validateMinimumAge = (birthDate: Date): boolean => {
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    return age - 1 >= 18;
  }
  
  return age >= 18;
};

// ============================================
// DETECÇÃO DE PALAVRAS SPAM
// ============================================
const SPAM_KEYWORDS = [
  'viagra', 'cialis', 'crypto', 'bitcoin', 'casino',
  'lottery', 'winner', 'click here', 'free money'
];

export const containsSpam = (text: string): boolean => {
  const lowerText = text.toLowerCase();
  return SPAM_KEYWORDS.some(keyword => lowerText.includes(keyword));
};
