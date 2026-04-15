import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { KeyRound, Loader2, ArrowLeft, AlertCircle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { validatePasswordStrength } from "@/lib/validation";

/**
 * Página de redefinição de senha.
 *
 * O fluxo completo:
 * 1. Usuário solicita reset em /recuperar-senha (ForgotPassword.tsx)
 * 2. Supabase envia email com link contendo tokens de recuperação
 * 3. Ao clicar, o usuário cai aqui — o Supabase SDK detecta o tipo=recovery
 *    no hash da URL e dispara onAuthStateChange("PASSWORD_RECOVERY")
 * 4. Usuário define nova senha, chamamos supabase.auth.updateUser({ password })
 * 5. Redireciona para /login
 */
export default function ResetPassword() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [recoverySessionReady, setRecoverySessionReady] = useState(false);
  const [sessionError, setSessionError] = useState<string | null>(null);

  useEffect(() => {
    // Escuta o evento PASSWORD_RECOVERY emitido pelo Supabase quando o usuário
    // clica no link de recuperação enviado por email.
    const { data: subscription } = supabase.auth.onAuthStateChange(
      (event) => {
        if (event === "PASSWORD_RECOVERY") {
          setRecoverySessionReady(true);
          setSessionError(null);
        }
      }
    );

    // Fallback: se o usuário chegar aqui e já houver uma sessão válida
    // (p.ex. recarregou a página depois de clicar no link), também permite a
    // troca de senha.
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setRecoverySessionReady(true);
      } else {
        // Sem sessão e sem evento PASSWORD_RECOVERY — provavelmente entrou
        // direto na URL sem vir pelo email.
        setSessionError(
          "Link de redefinição inválido ou expirado. Solicite um novo link."
        );
      }
    });

    return () => {
      subscription.subscription.unsubscribe();
    };
  }, []);

  const passwordStrength = validatePasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!passwordStrength.isValid) {
      toast({
        title: "Senha fraca",
        description: passwordStrength.feedback.join(", "),
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Senhas não coincidem",
        description: "Digite a mesma senha nos dois campos.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) throw error;

      toast({
        title: "Senha redefinida!",
        description: "Você já pode entrar com sua nova senha.",
      });

      // Desloga para forçar novo login com a senha atualizada
      await supabase.auth.signOut();
      navigate("/login");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Erro ao redefinir a senha.";
      toast({
        title: "Erro",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-12 pt-24">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <KeyRound className="w-8 h-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center">
              Redefinir Senha
            </CardTitle>
            <CardDescription className="text-center">
              Defina uma nova senha forte para sua conta
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {sessionError && !recoverySessionReady ? (
              <div className="space-y-6">
                <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-900">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <p>{sessionError}</p>
                </div>
                <Button asChild className="w-full">
                  <Link to="/recuperar-senha">Solicitar novo link</Link>
                </Button>
                <div className="text-center">
                  <Link
                    to="/login"
                    className="text-sm text-muted-foreground hover:text-foreground flex items-center justify-center gap-1"
                  >
                    <ArrowLeft className="w-3 h-3" /> Voltar para o login
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Nova senha</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 8 caracteres"
                    required
                    autoComplete="new-password"
                    aria-describedby="password-hints"
                  />
                  {password && (
                    <ul id="password-hints" className="text-xs space-y-1 mt-2">
                      {passwordStrength.feedback.map((hint) => (
                        <li
                          key={hint}
                          className="flex items-center gap-2 text-amber-700"
                        >
                          <AlertCircle className="h-3 w-3" />
                          {hint}
                        </li>
                      ))}
                      {passwordStrength.isValid && (
                        <li className="flex items-center gap-2 text-green-700">
                          <CheckCircle className="h-3 w-3" />
                          Senha forte
                        </li>
                      )}
                    </ul>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar senha</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Digite a senha novamente"
                    required
                    autoComplete="new-password"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading || !recoverySessionReady}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    "Salvar nova senha"
                  )}
                </Button>

                <div className="text-center">
                  <Link
                    to="/login"
                    className="text-sm text-muted-foreground hover:text-foreground flex items-center justify-center gap-1"
                  >
                    <ArrowLeft className="w-3 h-3" /> Voltar para o login
                  </Link>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
