import { describe, it, expect } from "vitest";
import {
  validateCPF,
  validateCNPJ,
  validateCPFCNPJ,
  formatCPF,
  formatCNPJ,
  formatPhoneBR,
  formatCEP,
  validatePhoneBR,
  validateEmail,
  validatePasswordStrength,
  validateCEP,
  validatePrice,
  validateManufacturingYear,
  validateMinimumAge,
  containsSpam,
  formatCPFCNPJ,
} from "../validation";

// ============================================
// CPF
// ============================================
describe("validateCPF", () => {
  it("aceita CPF válido", () => {
    expect(validateCPF("529.982.247-25")).toBe(true);
    expect(validateCPF("52998224725")).toBe(true);
  });

  it("rejeita CPF inválido", () => {
    expect(validateCPF("111.111.111-11")).toBe(false);
    expect(validateCPF("123.456.789-00")).toBe(false);
    expect(validateCPF("123")).toBe(false);
    expect(validateCPF("")).toBe(false);
  });
});

describe("formatCPF", () => {
  it("formata CPF corretamente", () => {
    expect(formatCPF("52998224725")).toBe("529.982.247-25");
  });
});

// ============================================
// CNPJ
// ============================================
describe("validateCNPJ", () => {
  it("aceita CNPJ válido", () => {
    expect(validateCNPJ("11.222.333/0001-81")).toBe(true);
    expect(validateCNPJ("11222333000181")).toBe(true);
  });

  it("rejeita CNPJ inválido", () => {
    expect(validateCNPJ("11.111.111/1111-11")).toBe(false);
    expect(validateCNPJ("12.345.678/0001-00")).toBe(false);
    expect(validateCNPJ("123")).toBe(false);
  });
});

describe("formatCNPJ", () => {
  it("formata CNPJ corretamente", () => {
    expect(formatCNPJ("11222333000181")).toBe("11.222.333/0001-81");
  });
});

// ============================================
// CPF/CNPJ combinado
// ============================================
describe("validateCPFCNPJ", () => {
  it("valida CPF quando tem 11 dígitos", () => {
    expect(validateCPFCNPJ("52998224725")).toBe(true);
  });

  it("valida CNPJ quando tem 14 dígitos", () => {
    expect(validateCPFCNPJ("11222333000181")).toBe(true);
  });

  it("rejeita tamanho incorreto", () => {
    expect(validateCPFCNPJ("12345")).toBe(false);
  });
});

describe("formatCPFCNPJ", () => {
  it("formata CPF quando tem 11 dígitos", () => {
    expect(formatCPFCNPJ("52998224725")).toBe("529.982.247-25");
  });

  it("formata CNPJ quando tem 14 dígitos", () => {
    expect(formatCPFCNPJ("11222333000181")).toBe("11.222.333/0001-81");
  });

  it("retorna original se tamanho não bate", () => {
    expect(formatCPFCNPJ("12345")).toBe("12345");
  });
});

// ============================================
// Telefone
// ============================================
describe("validatePhoneBR", () => {
  it("aceita celular com 11 dígitos", () => {
    expect(validatePhoneBR("11999887766")).toBe(true);
  });

  it("aceita fixo com 10 dígitos", () => {
    expect(validatePhoneBR("1133445566")).toBe(true);
  });

  it("rejeita tamanho incorreto", () => {
    expect(validatePhoneBR("123")).toBe(false);
  });
});

describe("formatPhoneBR", () => {
  it("formata celular", () => {
    expect(formatPhoneBR("11999887766")).toBe("(11) 99988-7766");
  });

  it("formata fixo", () => {
    expect(formatPhoneBR("1133445566")).toBe("(11) 3344-5566");
  });

  it("retorna original se não bate", () => {
    expect(formatPhoneBR("123")).toBe("123");
  });
});

// ============================================
// Email
// ============================================
describe("validateEmail", () => {
  it("aceita emails válidos", () => {
    expect(validateEmail("user@example.com")).toBe(true);
    expect(validateEmail("test.user+tag@domain.co")).toBe(true);
  });

  it("rejeita emails inválidos", () => {
    expect(validateEmail("")).toBe(false);
    expect(validateEmail("noarroba")).toBe(false);
    expect(validateEmail("@domain.com")).toBe(false);
  });
});

// ============================================
// Senha
// ============================================
describe("validatePasswordStrength", () => {
  it("senha forte retorna score 5 e isValid true", () => {
    const result = validatePasswordStrength("Abc@1234");
    expect(result.isValid).toBe(true);
    expect(result.score).toBe(5);
    expect(result.feedback).toHaveLength(0);
  });

  it("senha fraca retorna feedback", () => {
    const result = validatePasswordStrength("abc");
    expect(result.isValid).toBe(false);
    expect(result.score).toBeLessThan(5);
    expect(result.feedback.length).toBeGreaterThan(0);
  });
});

// ============================================
// CEP
// ============================================
describe("validateCEP", () => {
  it("aceita CEP válido", () => {
    expect(validateCEP("01001-000")).toBe(true);
    expect(validateCEP("01001000")).toBe(true);
  });

  it("rejeita CEP inválido", () => {
    expect(validateCEP("123")).toBe(false);
  });
});

describe("formatCEP", () => {
  it("formata CEP corretamente", () => {
    expect(formatCEP("01001000")).toBe("01001-000");
  });
});

// ============================================
// Preço e Ano
// ============================================
describe("validatePrice", () => {
  it("aceita preço positivo", () => {
    expect(validatePrice(100)).toBe(true);
    expect(validatePrice(0.01)).toBe(true);
  });

  it("rejeita preço zero ou negativo", () => {
    expect(validatePrice(0)).toBe(false);
    expect(validatePrice(-10)).toBe(false);
    expect(validatePrice(Infinity)).toBe(false);
  });
});

describe("validateManufacturingYear", () => {
  it("aceita ano válido", () => {
    expect(validateManufacturingYear(2020)).toBe(true);
    expect(validateManufacturingYear(1900)).toBe(true);
  });

  it("rejeita ano inválido", () => {
    expect(validateManufacturingYear(1899)).toBe(false);
    expect(validateManufacturingYear(3000)).toBe(false);
  });
});

// ============================================
// Idade mínima
// ============================================
describe("validateMinimumAge", () => {
  it("aceita maior de 18", () => {
    const birthDate = new Date();
    birthDate.setFullYear(birthDate.getFullYear() - 20);
    expect(validateMinimumAge(birthDate)).toBe(true);
  });

  it("rejeita menor de 18", () => {
    const birthDate = new Date();
    birthDate.setFullYear(birthDate.getFullYear() - 16);
    expect(validateMinimumAge(birthDate)).toBe(false);
  });
});

// ============================================
// Spam
// ============================================
describe("containsSpam", () => {
  it("detecta palavras de spam", () => {
    expect(containsSpam("Ganhe Bitcoin grátis!")).toBe(true);
    expect(containsSpam("casino online")).toBe(true);
  });

  it("aceita texto normal", () => {
    expect(containsSpam("Preciso alugar um trator")).toBe(false);
  });
});
