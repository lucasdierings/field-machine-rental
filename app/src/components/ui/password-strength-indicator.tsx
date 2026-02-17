import { cn } from "@/lib/utils";

interface PasswordStrengthIndicatorProps {
  strength: number;
  className?: string;
}

export const PasswordStrengthIndicator = ({ 
  strength, 
  className 
}: PasswordStrengthIndicatorProps) => {
  const getStrengthColor = (score: number) => {
    if (score === 0) return "bg-muted";
    if (score <= 2) return "bg-destructive";
    if (score === 3) return "bg-warning";
    if (score === 4) return "bg-primary";
    return "bg-success";
  };

  const getStrengthText = (score: number) => {
    if (score === 0) return "";
    if (score <= 2) return "Fraca";
    if (score === 3) return "Média";
    if (score === 4) return "Forte";
    return "Muito Forte";
  };

  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors",
              level <= strength ? getStrengthColor(strength) : "bg-muted"
            )}
          />
        ))}
      </div>
      {strength > 0 && (
        <p className="text-xs text-muted-foreground">
          Força da senha: <span className="font-medium">{getStrengthText(strength)}</span>
        </p>
      )}
    </div>
  );
};
