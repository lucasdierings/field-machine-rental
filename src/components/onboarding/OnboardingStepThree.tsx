import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Mail, AlertCircle } from 'lucide-react';
import { StepIndicator } from './StepIndicator';
import { PinInput } from './PinInput';
import { ResendTimer } from './ResendTimer';
import { FallbackOptions } from './FallbackOptions';
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
    onSendSMS,
    onChangeEmail,
    onFinalize,
    onPrev,
    isSubmitting = false
}: OnboardingStepThreeProps) => {
    const [pinValue, setPinValue] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [isEmailChangeDialogOpen, setIsEmailChangeDialogOpen] = useState(false);
    const [verificationError, setVerificationError] = useState('');

    const handlePinComplete = async (pin: string) => {
        setIsVerifying(true);
        setVerificationError('');

        try {
            await onVerifyEmail(pin);
            onUpdate({ emailVerified: true });
        } catch (error: any) {
            setVerificationError(error.message || 'Código inválido. Tente novamente.');
            setPinValue(''); // Clear PIN on error
        } finally {
            setIsVerifying(false);
        }
    };

    const handleResend = async () => {
        setVerificationError('');
        await onResendEmail();
    };

    const handleSendSMS = async () => {
        if (onSendSMS) {
            setVerificationError('');
            await onSendSMS();
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
                                {/* Success State */}
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                                    <CheckCircle2 className="h-10 w-10 text-green-600" />
                                </div>
                                <CardTitle className="text-center text-2xl font-bold sm:text-3xl">
                                    Email Verificado!
                                </CardTitle>
                                <CardDescription className="text-center text-sm sm:text-base">
                                    Sua conta está pronta. Vamos começar?
                                </CardDescription>
                            </>
                        ) : (
                            <>
                                {/* Pending State */}
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                                    <Mail className="h-10 w-10 text-primary" />
                                </div>
                                <CardTitle className="text-center text-2xl font-bold sm:text-3xl">
                                    Verifique seu email
                                </CardTitle>
                                <CardDescription className="text-center text-sm sm:text-base">
                                    Enviamos um código de 6 dígitos para
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

                    <CardContent className="space-y-6">
                        {!formData.emailVerified ? (
                            <>
                                {/* Info Alert */}
                                <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-900">
                                    <p>Verifique sua caixa de entrada e pasta de spam.</p>
                                </div>

                                {/* PIN Input */}
                                <div className="space-y-4">
                                    <PinInput
                                        value={pinValue}
                                        onChange={setPinValue}
                                        onComplete={handlePinComplete}
                                        disabled={isVerifying}
                                    />

                                    {/* Error Message */}
                                    {verificationError && (
                                        <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-900">
                                            <AlertCircle className="h-4 w-4 flex-shrink-0" />
                                            <p>{verificationError}</p>
                                        </div>
                                    )}

                                    {/* Resend Timer */}
                                    <div className="flex justify-center">
                                        <ResendTimer onResend={handleResend} />
                                    </div>
                                </div>

                                {/* Fallback Options */}
                                {formData.phone && onSendSMS && (
                                    <FallbackOptions
                                        email={formData.email || ''}
                                        phone={formData.phone}
                                        onSendSMS={handleSendSMS}
                                    />
                                )}
                            </>
                        ) : (
                            <>
                                {/* Success Message */}
                                <div className="rounded-lg bg-green-50 p-4 text-center text-sm text-green-900">
                                    <p>Seu email foi confirmado com sucesso!</p>
                                </div>

                                {/* Finalize Button */}
                                <Button
                                    onClick={onFinalize}
                                    disabled={isSubmitting}
                                    className="w-full bg-primary text-lg font-medium py-6 hover:bg-primary/90"
                                    size="lg"
                                >
                                    {isSubmitting ? 'Finalizando...' : 'Começar a Usar FieldMachine'}
                                </Button>
                            </>
                        )}

                        {/* Back Button */}
                        {!formData.emailVerified && (
                            <Button
                                variant="outline"
                                onClick={onPrev}
                                className="w-full"
                                disabled={isVerifying}
                            >
                                Voltar
                            </Button>
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
