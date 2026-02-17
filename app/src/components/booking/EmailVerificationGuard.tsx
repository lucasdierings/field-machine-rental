import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EmailVerificationGuardProps {
    children: React.ReactNode;
    requireVerification?: boolean;
}

/**
 * Componente que verifica se o email do usuário está verificado antes de permitir
 * acesso a funcionalidades que requerem verificação (como criar bookings)
 */
export const EmailVerificationGuard = ({
    children,
    requireVerification = true
}: EmailVerificationGuardProps) => {
    const [isVerified, setIsVerified] = useState<boolean | null>(null);
    const [showDialog, setShowDialog] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const { toast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        checkEmailVerification();
    }, []);

    const checkEmailVerification = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                setIsVerified(false);
                return;
            }

            const verified = !!user.email_confirmed_at;
            setIsVerified(verified);

            if (!verified && requireVerification) {
                setShowDialog(true);
            }
        } catch (error) {
            console.error('Erro ao verificar email:', error);
            setIsVerified(false);
        }
    };

    const handleResendVerification = async () => {
        setIsResending(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user?.email) {
                throw new Error('Email não encontrado');
            }

            const { error } = await supabase.auth.resend({
                type: 'signup',
                email: user.email
            });

            if (error) throw error;

            toast({
                title: 'Email enviado!',
                description: 'Verifique sua caixa de entrada para confirmar seu email.',
            });
        } catch (error: any) {
            console.error('Erro ao reenviar email:', error);
            toast({
                title: 'Erro ao reenviar email',
                description: error.message,
                variant: 'destructive',
            });
        } finally {
            setIsResending(false);
        }
    };

    // Ainda carregando
    if (isVerified === null) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    // Email não verificado e verificação é obrigatória
    if (!isVerified && requireVerification) {
        return (
            <>
                <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        Você precisa verificar seu email antes de criar uma reserva.
                        <Button
                            variant="link"
                            className="ml-2 h-auto p-0"
                            onClick={() => setShowDialog(true)}
                        >
                            Verificar agora
                        </Button>
                    </AlertDescription>
                </Alert>

                <Dialog open={showDialog} onOpenChange={setShowDialog}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <Mail className="h-5 w-5" />
                                Verificação de Email Necessária
                            </DialogTitle>
                            <DialogDescription className="space-y-2">
                                <p>
                                    Para criar reservas, você precisa verificar seu endereço de email.
                                </p>
                                <p className="text-sm">
                                    Enviamos um email de confirmação quando você criou sua conta.
                                    Verifique sua caixa de entrada (e spam) e clique no link de confirmação.
                                </p>
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="flex-col sm:flex-row gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setShowDialog(false)}
                            >
                                Fechar
                            </Button>
                            <Button
                                onClick={handleResendVerification}
                                disabled={isResending}
                                className="bg-gradient-primary"
                            >
                                {isResending ? 'Enviando...' : 'Reenviar Email de Verificação'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Mostra o conteúdo mas desabilitado visualmente */}
                <div className="opacity-50 pointer-events-none">
                    {children}
                </div>
            </>
        );
    }

    // Email verificado ou verificação não obrigatória
    return <>{children}</>;
};
