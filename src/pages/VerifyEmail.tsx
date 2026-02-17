import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Loader2, ArrowLeft, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function VerifyEmail() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [token, setToken] = useState("");
    const { toast } = useToast();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        // If we have an email from redirect or query param
        const emailParam = searchParams.get('email');
        if (emailParam) {
            setEmail(emailParam);
        }
    }, [searchParams]);

    const handleResend = async () => {
        if (!email) {
            toast({
                title: "Email necessário",
                description: "Digite seu email para reenviar o código.",
                variant: "destructive",
            });
            return;
        }

        setResending(true);
        try {
            const { error } = await supabase.auth.resend({
                type: 'signup',
                email,
            });

            if (error) {
                toast({
                    title: "Erro ao reenviar",
                    description: error.message,
                    variant: "destructive",
                });
            } else {
                toast({
                    title: "Código reenviado",
                    description: "Verifique sua caixa de entrada e spam. O código expire em 60 segundos.",
                });
            }
        } catch (error) {
            toast({
                title: "Erro inesperado",
                description: "Tente novamente mais tarde.",
                variant: "destructive",
            });
        } finally {
            setResending(false);
        }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data, error } = await supabase.auth.verifyOtp({
                email,
                token,
                type: 'signup',
            });

            if (error) {
                toast({
                    title: "Código inválido",
                    description: "Verifique se digitou o código corretamente ou solicite um novo.",
                    variant: "destructive",
                });
            } else {
                toast({
                    title: "Email verificado!",
                    description: "Sua conta foi ativada com sucesso.",
                });
                navigate("/dashboard");
            }
        } catch (error) {
            toast({
                title: "Erro na verificação",
                description: "Ocorreu um erro ao verificar o código.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 flex items-center justify-center px-4 py-12">
                <Card className="w-full max-w-md">
                    <CardHeader className="space-y-1">
                        <div className="flex justify-center mb-4">
                            <div className="p-3 bg-primary/10 rounded-full">
                                <Mail className="w-8 h-8 text-primary" />
                            </div>
                        </div>
                        <CardTitle className="text-2xl font-bold text-center">
                            Verificar Email
                        </CardTitle>
                        <CardDescription className="text-center">
                            O código de 6 dígitos foi enviado para seu email.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <form onSubmit={handleVerify} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="seu@email.com"
                                    readOnly={!!searchParams.get('email')}
                                    className={searchParams.get('email') ? 'bg-muted' : ''}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="token">Código de Verificação</Label>
                                <Input
                                    id="token"
                                    value={token}
                                    onChange={(e) => setToken(e.target.value)}
                                    placeholder="123456"
                                    maxLength={6}
                                    className="text-center text-lg tracking-widest letter-spacing-2"
                                    required
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={loading || token.length !== 6}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Verificando...
                                    </>
                                ) : (
                                    'Confirmar Código'
                                )}
                            </Button>

                            <div className="text-center space-y-4 pt-2">
                                <p className="text-sm text-muted-foreground">
                                    Não recebeu o código?{' '}
                                    <button
                                        type="button"
                                        onClick={handleResend}
                                        disabled={resending || !email}
                                        className="text-primary hover:underline font-medium disabled:opacity-50"
                                    >
                                        {resending ? 'Reenviando...' : 'Reenviar código'}
                                    </button>
                                </p>

                                <Link
                                    to="/login"
                                    className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
                                >
                                    <ArrowLeft className="w-3 h-3 mr-1" /> Voltar para o login
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </main>

            <Footer />
        </div>
    );
}
