import * as React from "react"

import { cn } from "@/lib/utils"

interface InputProps extends React.ComponentProps<"input"> {
  /**
   * Acessibilidade: Descreve o propósito do input para leitores de tela
   * Use quando não houver uma label visual associada
   */
  ariaLabel?: string;
  /**
   * Acessibilidade: ID do elemento que descreve o input (ex: mensagem de erro)
   */
  ariaDescribedBy?: string;
  /**
   * Acessibilidade: Indica que o campo é obrigatório
   */
  ariaRequired?: boolean;
  /**
   * Acessibilidade: Indica que o campo tem um erro
   */
  ariaInvalid?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ariaLabel, ariaDescribedBy, ariaRequired, ariaInvalid, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          // Bordas vermelhas para campos inválidos (feedback visual)
          ariaInvalid && "border-red-500 focus-visible:ring-red-500",
          className
        )}
        ref={ref}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        aria-required={ariaRequired}
        aria-invalid={ariaInvalid}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
