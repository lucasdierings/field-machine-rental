import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { CheckCircle, Loader2, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });

            if (error) {
                // Rate limit error often happens
                if (error.message.includes("rate limit")) {
                    toast({
                        title: "Muitas tentativas",
                        description: "Aguarde um momento antes de tentar novamente.",
                        variant: "destructive",
                    });
                } else {
                    toast({
                        title: "Erro ao enviar",
                        description: error.message,
                        variant: "destructive",
                    });
                }
            } else {
                setSubmitted(true);
                toast({
                    title: "Email enviado",
                    description: "Verifique sua caixa de entrada para redefinir a senha.",
                });
            }
        } catch (error: any) {
            toast({
                title: "Erro inesperado",
                description: "Ocorreu um erro ao processar sua solicitação.",
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
                                <CheckCircle className="w-8 h-8 text-primary" />
                            </div>
                        </div>
                        <CardTitle className="text-2xl font-bold text-center">
                            Recuperar Senha
                        </CardTitle>
                        <CardDescription className="text-center">
                            Digite seu email para receber um link de redefinição
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {submitted ? (
                            <div className="space-y-6 text-center animate-in fade-in duration-500">
                                <div className="p-4 bg-green-50 text-green-800 rounded-lg text-sm">
                                    Email enviado com sucesso para <strong>{email}</strong>.
                                    Verifique sua caixa de entrada e spam.
                                </div>

                                <Button asChild className="w-full" variant="outline">
                                    <Link to="/login">Voltar para o Login</Link>
                                </Button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email cadastrado</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="seu@email.com"
                                        required
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Enviando...
                                        </>
                                    ) : (
                                        'Enviar Link de Recuperação'
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
