import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { SplashScreen } from '@/components/onboarding/SplashScreen';
import { OnboardingStepOne } from '@/components/onboarding/OnboardingStepOne';
import { OnboardingStepTwo } from '@/components/onboarding/OnboardingStepTwo';
import { OnboardingStepThree } from '@/components/onboarding/OnboardingStepThree';
import { StepIndicator } from '@/components/onboarding/StepIndicator';
import { useOnboarding } from '@/hooks/useOnboarding';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { validateCPFCNPJ, validateEmail, formatPhone } from '@/lib/validation';
import { ToastAction } from "@/components/ui/toast";

// Logger helper - only log in development
const log = (msg: string, data?: any) => {
  if (import.meta.env.DEV) {
    console.log(`[Onboarding] ${msg}`, data || '');
  }
};

export const Onboarding = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const { state, nextStep, prevStep, updateFormData, setEmailVerified } = useOnboarding();

    // Validate Step 2 (Registration)
    const validateRegistration = (): { valid: boolean; errors: Record<string, string> } => {
        const errors: Record<string, string> = {};
        const { formData } = state;

        if (!formData.userType) errors.userType = 'Selecione o tipo de usuário';
        if (!formData.fullName?.trim()) errors.fullName = 'Digite seu nome completo';
        if (!formData.cpfCnpj) {
            errors.cpfCnpj = 'Digite seu CPF ou CNPJ';
        } else if (!validateCPFCNPJ(formData.cpfCnpj)) {
            errors.cpfCnpj = 'CPF/CNPJ inválido';
        }
        if (!formData.email) {
            errors.email = 'Digite seu email';
        } else if (!validateEmail(formData.email)) {
            errors.email = 'Email inválido';
        }
        if (!formData.phone) {
            errors.phone = 'Digite seu celular';
        } else if (formData.phone.replace(/\D/g, '').length !== 11) {
            errors.phone = 'Celular inválido';
        }
        if (!formData.password) {
            errors.password = 'Digite uma senha';
        } else if (formData.password.length < 6) {
            errors.password = 'Senha deve ter no mínimo 6 caracteres';
        }
        if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'As senhas não coincidem';
        }

        return {
            valid: Object.keys(errors).length === 0,
            errors
        };
    };



    // Handle Step 2 Next (Create Account)
    const handleRegisterNext = async () => {
        const validation = validateRegistration();

        if (!validation.valid) {
            const firstError = Object.values(validation.errors)[0];
            toast({
                title: 'Erro no formulário',
                description: firstError,
                variant: 'destructive',
            });
            return;
        }

        try {
            // Create user with Supabase Auth (this sets the password)
            const { data, error } = await supabase.auth.signUp({
                email: state.formData.email,
                password: state.formData.password,
                options: {
                    data: {
                        full_name: state.formData.fullName,
                        user_type: state.formData.userType,
                        phone: state.formData.phone,
                        cpf_cnpj: state.formData.cpfCnpj
                    }
                }
            });

            if (error) throw error;

            toast({
                title: 'Código enviado!',
                description: 'Verifique seu email para continuar.',
            });

            nextStep(); // Go to verification step
        } catch (error: any) {
            log('Signup error:', error);

            // Check for existing user error
            if (error.message?.includes('already registered') || error.code === 'user_already_exists') {
                toast({
                    title: 'Conta já existe',
                    description: 'Este email já está cadastrado no sistema.',
                    variant: 'destructive',
                    action: (
                        <ToastAction altText="Fazer Login" onClick={() => navigate('/login')}>
                            Fazer Login
                        </ToastAction>
                    ),
                });
                return;
            }

            toast({
                title: 'Erro ao criar conta',
                description: error.message,
                variant: 'destructive',
            });
        }
    };

    // Verify Email Code
    const handleVerifyEmail = async (code: string) => {
        try {
            const { data, error } = await supabase.auth.verifyOtp({
                email: state.formData.email,
                token: code,
                type: 'signup'
            });

            if (error) throw error;

            if (data.session) {
                setEmailVerified(true);
                toast({
                    title: 'Email verificado!',
                    description: 'Bem-vindo ao FieldMachine!',
                });
            }
        } catch (error: any) {
            throw new Error(error.message || 'Código inválido');
        }
    };

    // Resend Email
    const handleResendEmail = async () => {
        try {
            const { error } = await supabase.auth.resend({
                type: 'signup',
                email: state.formData.email
            });

            if (error) throw error;

            toast({
                title: 'Email reenviado!',
                description: 'Verifique sua caixa de entrada.',
            });
        } catch (error: any) {
            log('Resend error:', error);
            toast({
                title: 'Erro ao reenviar email',
                description: error.message,
                variant: 'destructive',
            });
            throw error;
        }
    };

    // Send SMS (placeholder for future Twilio integration)
    const handleSendSMS = async () => {
        toast({
            title: 'SMS não disponível',
            description: 'Em breve você poderá receber o código por SMS.',
            variant: 'default',
        });
    };

    // Change Email
    const handleChangeEmail = async (newEmail: string) => {
        try {
            // In a real scenario, you'd need to:
            // 1. Delete the old auth user
            // 2. Create a new one with the new email
            // For now, just update form data and resend

            updateFormData({ email: newEmail });

            // Resend verification to new email
            await handleResendEmail();

            toast({
                title: 'Email atualizado!',
                description: `Novo código enviado para ${newEmail}`,
            });
        } catch (error: any) {
            throw new Error(error.message || 'Erro ao atualizar email');
        }
    };

    // Finalize Onboarding
    const handleFinalize = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                throw new Error('Sessão não encontrada');
            }

            const userId = session.user.id;

            // Create user profile
            const { error: profileError } = await supabase
                .from('user_profiles')
                .upsert({
                    auth_user_id: userId,
                    full_name: state.formData.fullName,
                    phone: state.formData.phone,
                    cpf_cnpj: state.formData.cpfCnpj,
                    user_type: state.formData.userType,
                    user_types: state.formData.userType === 'both'
                        ? ['producer', 'owner']
                        : [state.formData.userType!],
                    profile_completed: true,
                    profile_completion_step: 5
                }, {
                    onConflict: 'auth_user_id'
                });

            if (profileError) throw profileError;

            toast({
                title: 'Cadastro concluído!',
                description: 'Bem-vindo ao FieldMachine!',
            });

            // Redirect based on user type
            if (state.formData.userType === 'producer') {
                navigate('/search');
            } else {
                navigate('/add-machine');
            }
        } catch (error: any) {
            log('Finalize error:', error);
            toast({
                title: 'Erro ao finalizar',
                description: error.message,
                variant: 'destructive',
            });
        }
    };

    // Map step names to step numbers for progress indicator
    const getStepNumber = (step: string): 1 | 2 | 3 => {
        switch (step) {
            case 'splash': return 1;
            case 'welcome': return 1;
            case 'register': return 2;
            case 'verify': return 3;
            default: return 1;
        }
    };

    const showProgressBar = state.currentStep !== 'splash';

    return (
        <div className="min-h-screen w-full overflow-x-hidden bg-background">
            {/* Progress Indicator - shown after splash screen */}
            {showProgressBar && (
                <div className="sticky top-0 z-10 bg-background px-4 py-4 sm:px-6 border-b">
                    <StepIndicator currentStep={getStepNumber(state.currentStep)} totalSteps={3} />
                </div>
            )}

            <AnimatePresence mode="wait">
                {state.currentStep === 'splash' && (
                    <SplashScreen key="splash" onComplete={nextStep} />
                )}

                {state.currentStep === 'welcome' && (
                    <OnboardingStepOne key="welcome" onNext={nextStep} />
                )}

                {state.currentStep === 'register' && (
                    <OnboardingStepTwo
                        key="register"
                        formData={state.formData}
                        errors={{}} // Will implement validation feedback
                        onUpdate={updateFormData}
                        onNext={handleRegisterNext}
                        onPrev={prevStep}
                    />
                )}

                {state.currentStep === 'verify' && (
                    <OnboardingStepThree
                        key="verify"
                        formData={state.formData}
                        onUpdate={updateFormData}
                        onVerifyEmail={handleVerifyEmail}
                        onResendEmail={handleResendEmail}
                        onSendSMS={handleSendSMS}
                        onChangeEmail={handleChangeEmail}
                        onFinalize={handleFinalize}
                        onPrev={prevStep}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};
