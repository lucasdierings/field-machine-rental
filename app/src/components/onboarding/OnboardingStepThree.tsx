import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Mail, Loader2, RefreshCw } from 'lucide-react';
import { StepIndicator } from './StepIndicator';
import { EmailChangeDialog } from './EmailChangeDialog';
import { fadeIn } from '@/animations/onboarding';
import { RegisterFormData } from '@/hooks/useRegisterForm';

interface OnboardingStepThreeProps {
    formData: Partial<RegisterFormData>;
    onUpdate: (updates: Partial<RegisterFormData>) => void;
    onVerifyEmail: (code: string) => Promise<void>;
    onResendEmail: () => Promise<void>;
    onSendSMS?: () => Promise<void>;
    onChangeEmail: (newEmail: string) => Promise<void>;
    onFinalize: () => void;
    onPrev: () => void;
    isSubmitting?: boolean;
}

export const OnboardingStepThree = ({
    formData,
    onUpdate,
    onVerifyEmail,
    onResendEmail,
    onChangeEmail,
    onFinalize,
    onPrev,
    isSubmitting = false
}: OnboardingStepThreeProps) => {
    const [isEmailChangeDialogOpen, setIsEmailChangeDialogOpen] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [isChecking, setIsChecking] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);

    const startCooldown = useCallback(() => {
        setResendCooldown(60);
        const interval = setInterval(() => {
            setResendCooldown((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    }, []);

    const handleResend = async () => {
        setIsResending(true);
        try {
            await onResendEmail();
            startCooldown();
        } finally {
            setIsResending(false);
        }
    };

    const handleCheckVerification = async () => {
        setIsChecking(true);
        try {
            // Pass empty string — the parent will check session status
            await onVerifyEmail('');
            onUpdate({ emailVerified: true });
        } catch {
            // Not verified yet — parent handles the error
        } finally {
            setIsChecking(false);
        }
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={fadeIn}
            className="flex min-h-screen flex-col bg-background p-4 sm:p-6"
        >
            {/* Step Indicator */}
            <div className="mb-6 w-full max-w-md mx-auto">
                <StepIndicator currentStep={3} />
            </div>

            {/* Verification Card */}
            <div className="flex flex-1 items-start justify-center">
                <Card className="w-full max-w-md shadow-lg">
                    <CardHeader className="space-y-3 pb-4">
                        {formData.emailVerified ? (
                            <>
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                                    <CheckCircle2 className="h-10 w-10 text-green-600" />
                                </div>
                                <CardTitle className="text-center text-2xl font-bold sm:text-3xl">
                                    Email Verificado!
                                </CardTitle>
                                <CardDescription className="text-center text-sm sm:text-base">
                                    Sua conta esta pronta. Vamos comecar?
                                </CardDescription>
                            </>
                        ) : (
                            <>
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                                    <Mail className="h-10 w-10 text-primary" />
                                </div>
                                <CardTitle className="text-center text-2xl font-bold sm:text-3xl">
                                    Verifique seu email
                                </CardTitle>
                                <CardDescription className="text-center text-sm sm:text-base">
                                    Enviamos um link de verificacao para
                                </CardDescription>
                                <div className="flex items-center justify-center gap-2">
                                    <p className="font-medium text-sm sm:text-base">{formData.email}</p>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setIsEmailChangeDialogOpen(true)}
                                        className="h-auto p-1 text-xs text-primary hover:text-primary/80"
                                    >
                                        Alterar
                                    </Button>
                                </div>
                            </>
                        )}
                    </CardHeader>

                    <CardContent className="space-y-4">
                        {!formData.emailVerified ? (
                            <>
                                {/* Instructions */}
                                <div className="rounded-lg bg-blue-50 p-4 space-y-2">
                                    <p className="text-sm text-blue-900 font-medium">
                                        Clique no link no email para ativar sua conta
                                    </p>
                                    <p className="text-xs text-blue-700">
                                        Verifique tambem sua pasta de spam ou lixo eletronico
                                    </p>
                                </div>

                                {/* Check verification button */}
                                <Button
                                    onClick={handleCheckVerification}
                                    disabled={isChecking}
                                    className="w-full bg-primary hover:bg-primary/90"
                                >
                                    {isChecking ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Verificando...
                                        </>
                                    ) : (
                                        'Ja verifiquei, continuar'
                                    )}
                                </Button>

                                {/* Resend link */}
                                <div className="flex justify-center">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleResend}
                                        disabled={isResending || resendCooldown > 0}
                                        className="text-sm text-muted-foreground"
                                    >
                                        {isResending ? (
                                            <>
                                                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                                                Reenviando...
                                            </>
                                        ) : resendCooldown > 0 ? (
                                            `Reenviar link (${resendCooldown}s)`
                                        ) : (
                                            <>
                                                <RefreshCw className="mr-2 h-3 w-3" />
                                                Reenviar link
                                            </>
                                        )}
                                    </Button>
                                </div>

                                {/* Back button */}
                                <Button
                                    variant="outline"
                                    onClick={onPrev}
                                    className="w-full"
                                >
                                    Voltar
                                </Button>
                            </>
                        ) : (
                            <>
                                <div className="rounded-lg bg-green-50 p-4 text-center text-sm text-green-900">
                                    <p>Seu email foi confirmado com sucesso!</p>
                                </div>

                                <Button
                                    onClick={onFinalize}
                                    disabled={isSubmitting}
                                    className="w-full bg-primary text-lg font-medium py-6 hover:bg-primary/90"
                                    size="lg"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Finalizando...
                                        </>
                                    ) : (
                                        'Comecar a Usar FieldMachine'
                                    )}
                                </Button>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Email Change Dialog */}
            <EmailChangeDialog
                isOpen={isEmailChangeDialogOpen}
                onClose={() => setIsEmailChangeDialogOpen(false)}
                currentEmail={formData.email || ''}
                onChangeEmail={onChangeEmail}
            />
        </motion.div>
    );
};
