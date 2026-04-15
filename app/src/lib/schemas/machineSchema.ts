import { z } from "zod";
import { validateManufacturingYear } from "@/lib/validation";

/**
 * Schema de validação centralizado para cadastro/edição de máquinas.
 *
 * Regras:
 * - nome, categoria e marca são obrigatórios
 * - cidade e estado obrigatórios
 * - ano de fabricação entre 1900 e o próximo ano
 * - pelo menos UM dos preços (hora, dia, hectare) deve estar preenchido e > 0
 */

const priceStringSchema = z
  .string()
  .trim()
  .optional()
  .refine(
    (value) => {
      if (!value) return true;
      const num = parseFloat(value.replace(",", "."));
      return !Number.isNaN(num) && num >= 0;
    },
    { message: "Preço inválido" }
  );

export const machineFormSchema = z
  .object({
    name: z.string().trim().min(2, "Nome obrigatório"),
    category: z.string().trim().min(1, "Categoria obrigatória"),
    brand: z.string().trim().min(1, "Marca obrigatória"),
    model: z.string().trim().optional(),
    year: z
      .number()
      .refine((value) => validateManufacturingYear(value), {
        message: "Ano de fabricação inválido",
      }),
    price_hour: priceStringSchema,
    price_day: priceStringSchema,
    price_hectare: priceStringSchema,
    location: z.object({
      city: z.string().trim().min(2, "Cidade obrigatória"),
      state: z.string().trim().min(2, "Estado obrigatório"),
      address: z.string().trim().optional(),
    }),
  })
  .refine(
    (data) => {
      const prices = [data.price_hour, data.price_day, data.price_hectare];
      return prices.some((price) => {
        if (!price) return false;
        const num = parseFloat(price.replace(",", "."));
        return !Number.isNaN(num) && num > 0;
      });
    },
    {
      message: "Informe pelo menos um tipo de preço válido (hora, dia ou hectare)",
      path: ["price_hour"],
    }
  );

export type MachineFormInput = z.infer<typeof machineFormSchema>;

/**
 * Valida os dados do formulário e retorna mensagens de erro amigáveis.
 * Retorna `null` se válido, ou um objeto `{ title, description }` pronto
 * para ser passado a um toast.
 */
export const validateMachineForm = (
  data: unknown
): { title: string; description: string } | null => {
  const result = machineFormSchema.safeParse(data);
  if (result.success) return null;

  const first = result.error.errors[0];
  const path = first.path.join(".");

  // Mensagens mais amigáveis por campo
  const fieldLabels: Record<string, string> = {
    name: "Nome",
    category: "Categoria",
    brand: "Marca",
    year: "Ano",
    "location.city": "Cidade",
    "location.state": "Estado",
    price_hour: "Preços",
  };

  const label = fieldLabels[path] ?? path;
  return {
    title: `${label}: ${first.message}`,
    description: "Revise os campos destacados e tente novamente.",
  };
};
