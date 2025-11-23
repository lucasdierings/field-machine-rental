import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Mail, Phone, Upload, FileText } from "lucide-react";
import { RegisterFormData } from "@/hooks/useRegisterForm";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface VerificationStepProps {
  formData: RegisterFormData;
  errors: Record<string, string>;
  onUpdate: (updates: Partial<RegisterFormData>) => void;
  onVerifyEmail: (code: string) => Promise<void>;
  onVerifyPhone: (code: string) => Promise<void>;
  onFinalize: () => void;
  onPrev: () => void;
  isSubmitting?: boolean;
}

export const VerificationStep = ({
  formData,
  errors,
  onUpdate,
  onVerifyEmail,
  onVerifyPhone,
  onFinalize,
  onPrev,
  isSubmitting = false
}: VerificationStepProps) => {
  const { toast } = useToast();

  const handleVerifyEmail = async () => {
    if (formData.emailCode.length !== 6) return;

    try {
      await onVerifyEmail(formData.emailCode);
    } catch (error) {
      // Error handled in parent
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      onUpdate({ documentsUploaded: true });
    }
  };

  const canSubmit = formData.termsAccepted && formData.emailVerified;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-card">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Verificação</CardTitle>
          <p className="text-muted-foreground">
            Verifique seus dados para finalizar o cadastro
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-6">
            {/* Verificação de Email */}
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <div>
                    <h4 className="font-semibold">Verificar E-mail</h4>
                    <p className="text-sm text-muted-foreground">{formData.email}</p>
                  </div>
                </div>
                {formData.emailVerified ? (
                  <Badge variant="default" className="bg-primary">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Verificado
                  </Badge>
                ) : (
                  <Badge variant="secondary">Pendente</Badge>
                )}
              </div>

              {!formData.emailVerified && (
                <div className="space-y-3">
                  <div className="bg-blue-50 text-blue-700 p-3 rounded-md text-sm mb-3">
                    Enviamos um código para seu e-mail. Por favor, confira sua caixa de entrada (e spam).
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Código de 6 dígitos"
                      value={formData.emailCode}
                      onChange={(e) => onUpdate({ emailCode: e.target.value })}
                      maxLength={6}
                    />
                    <Button
                      variant="outline"
                      onClick={handleVerifyEmail}
                      disabled={formData.emailCode.length !== 6}
                    >
                      Verificar
                    </Button>
                  </div>
                </div>
              )}
            </Card>

            {/* Verificação de Telefone (Oculto por enquanto) */}
            {/* 
            <Card className="p-4 opacity-50 pointer-events-none hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary" />
                  <div>
                    <h4 className="font-semibold">Verificar Celular</h4>
                    <p className="text-sm text-muted-foreground">{formData.phone}</p>
                  </div>
                </div>
                <Badge variant="secondary">Em breve</Badge>
              </div>
            </Card>
            */}

            {/* Upload de Documentos */}
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Upload className="w-5 h-5 text-primary" />
                  <div>
                    <h4 className="font-semibold">Documentos</h4>
                    <p className="text-sm text-muted-foreground">CPF/CNPJ e comprovante de endereço</p>
                  </div>
                </div>
                {formData.documentsUploaded ? (
                  <Badge variant="default" className="bg-primary">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Enviado
                  </Badge>
                ) : (
                  <Badge variant="outline">Opcional</Badge>
                )}
              </div>

              {!formData.documentsUploaded && (
                <div className="space-y-3">
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    <FileText className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Arraste seus documentos aqui ou clique para selecionar
                    </p>
                    <Input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      id="documents"
                    />
                    <Label htmlFor="documents">
                      <Button variant="outline" size="sm" asChild>
                        <span>Selecionar Arquivos</span>
                      </Button>
                    </Label>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Formatos aceitos: PDF, JPG, PNG. Você pode enviar depois no seu perfil.
                  </p>
                </div>
              )}
            </Card>

            {/* Termos */}
            <div className="space-y-4">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={formData.termsAccepted}
                  onCheckedChange={(checked) => onUpdate({ termsAccepted: !!checked })}
                />
                <Label htmlFor="terms" className="text-sm leading-relaxed">
                  Aceito os{" "}
                  <Link to="#" className="text-primary hover:underline">
                    termos de uso
                  </Link>{" "}
                  e{" "}
                  <Link to="#" className="text-primary hover:underline">
                    política de privacidade
                  </Link>
                  , e autorizo o compartilhamento dos meus dados com prestadores/produtores para fins de contratação de serviços agrícolas.
                </Label>
              </div>
              {errors.termsAccepted && (
                <p className="text-sm text-destructive">{errors.termsAccepted}</p>
              )}
            </div>
          </div>

          <div className="flex justify-between pt-6">
            <Button variant="outline" onClick={onPrev}>
              Voltar
            </Button>
            <Button
              onClick={onFinalize}
              className="bg-gradient-primary"
              disabled={!canSubmit || isSubmitting}
            >
              {isSubmitting ? 'Criando conta...' : 'Finalizar Cadastro'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};