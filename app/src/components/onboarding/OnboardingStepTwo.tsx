import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, EyeOff, CheckCircle2, XCircle, User, Phone, Mail, Lock } from 'lucide-react';
import { useState } from 'react';
import { StepIndicator } from './StepIndicator';
import { fadeIn } from '@/animations/onboarding';
import { validateCPFCNPJ, validateEmail, formatCPFCNPJ, formatPhone } from '@/lib/validation';
import { RegisterFormData } from '@/hooks/useRegisterForm';

interface OnboardingStepTwoProps {
    formData: Partial<RegisterFormData>;
    errors: Record<string, string>;
    onUpdate: (updates: Partial<RegisterFormData>) => void;
    onNext: () => void;
    onPrev: () => void;
}

export const OnboardingStepTwo = ({
    formData,
    errors,
    onUpdate,
    onNext,
    onPrev
}: OnboardingStepTwoProps) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Real-time validation states
    const isCPFCNPJValid = formData.cpfCnpj ? validateCPFCNPJ(formData.cpfCnpj) : null;
    const isEmailValid = formData.email ? validateEmail(formData.email) : null;
    const passwordStrength = formData.password ? getPasswordStrength(formData.password) : 0;

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
                <StepIndicator currentStep={2} />
            </div>

            {/* Form Card */}
            <div className="flex flex-1 items-start justify-center">
                <Card className="w-full max-w-md shadow-lg">
                    <CardHeader className="space-y-1 pb-4">
                        <CardTitle className="text-2xl font-bold sm:text-3xl">
                            Criar sua conta
                        </CardTitle>
                        <CardDescription className="text-sm sm:text-base">
                            Preencha seus dados para começar
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        {/* User Type Selection */}
                        <div className="space-y-2">
                            <Label htmlFor="userType">
                                Tipo de Usuário *
                            </Label>
                            <Select
                                value={formData.userType || undefined}
                                onValueChange={(value: any) => onUpdate({ userType: value })}
                            >
                                <SelectTrigger className={errors.userType ? 'border-destructive' : ''}>
                                    <SelectValue placeholder="Selecione..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="producer">
                                        Produtor (Alugar Máquinas)
                                    </SelectItem>
                                    <SelectItem value="owner">
                                        Proprietário (Oferecer Máquinas)
                                    </SelectItem>
                                    <SelectItem value="both">
                                        Ambos
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.userType && (
                                <p className="text-xs text-destructive">{errors.userType}</p>
                            )}
                        </div>

                        {/* Full Name */}
                        <div className="space-y-2">
                            <Label htmlFor="fullName" className="flex items-center gap-2">
                                <User className="h-4 w-4 text-gray-500" />
                                Nome Completo *
                            </Label>
                            <Input
                                id="fullName"
                                value={formData.fullName || ''}
                                onChange={(e) => onUpdate({ fullName: e.target.value })}
                                placeholder="Seu nome completo"
                                className={errors.fullName ? 'border-destructive' : ''}
                            />
                            {errors.fullName && (
                                <p className="text-xs text-destructive">{errors.fullName}</p>
                            )}
                        </div>

                        {/* CPF/CNPJ */}
                        <div className="space-y-2">
                            <Label htmlFor="cpfCnpj">
                                CPF/CNPJ *
                            </Label>
                            <div className="relative">
                                <Input
                                    id="cpfCnpj"
                                    value={formData.cpfCnpj || ''}
                                    onChange={(e) => {
                                        const formatted = formatCPFCNPJ(e.target.value);
                                        onUpdate({ cpfCnpj: formatted });
                                    }}
                                    placeholder="000.000.000-00"
                                    className={errors.cpfCnpj ? 'border-destructive pr-10' : 'pr-10'}
                                    maxLength={18}
                                />
                                {/* Validation Icon */}
                                {formData.cpfCnpj && (
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                        {isCPFCNPJValid ? (
                                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                                        ) : (
                                            <XCircle className="h-5 w-5 text-red-500" />
                                        )}
                                    </div>
                                )}
                            </div>
                            {errors.cpfCnpj && (
                                <p className="text-xs text-destructive">{errors.cpfCnpj}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-gray-500" />
                                Email *
                            </Label>
                            <div className="relative">
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email || ''}
                                    onChange={(e) => onUpdate({ email: e.target.value })}
                                    placeholder="seu@email.com"
                                    className={errors.email ? 'border-destructive pr-10' : 'pr-10'}
                                />
                                {formData.email && (
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                        {isEmailValid ? (
                                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                                        ) : (
                                            <XCircle className="h-5 w-5 text-red-500" />
                                        )}
                                    </div>
                                )}
                            </div>
                            {errors.email && (
                                <p className="text-xs text-destructive">{errors.email}</p>
                            )}
                        </div>

                        {/* Phone */}
                        <div className="space-y-2">
                            <Label htmlFor="phone" className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-gray-500" />
                                Celular (WhatsApp) *
                            </Label>
                            <Input
                                id="phone"
                                type="tel"
                                value={formData.phone || ''}
                                onChange={(e) => {
                                    const formatted = formatPhone(e.target.value);
                                    onUpdate({ phone: formatted });
                                }}
                                placeholder="(00) 00000-0000"
                                className={errors.phone ? 'border-destructive' : ''}
                                maxLength={15}
                            />
                            {errors.phone && (
                                <p className="text-xs text-destructive">{errors.phone}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <Label htmlFor="password" className="flex items-center gap-2">
                                <Lock className="h-4 w-4 text-gray-500" />
                                Senha *
                            </Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password || ''}
                                    onChange={(e) => onUpdate({ password: e.target.value })}
                                    placeholder="Mínimo 6 caracteres"
                                    className={errors.password ? 'border-destructive pr-10' : 'pr-10'}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {/* Password Strength */}
                            {formData.password && (
                                <div className="space-y-1">
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4].map((level) => (
                                            <div
                                                key={level}
                                                className={`h-1 flex-1 rounded-full transition-all ${level <= passwordStrength
                                                        ? passwordStrength <= 2
                                                            ? 'bg-red-500'
                                                            : passwordStrength === 3
                                                                ? 'bg-yellow-500'
                                                                : 'bg-green-500'
                                                        : 'bg-gray-200'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-xs text-gray-600">
                                        {passwordStrength === 1 && 'Senha fraca'}
                                        {passwordStrength === 2 && 'Senha razoável'}
                                        {passwordStrength === 3 && 'Senha boa'}
                                        {passwordStrength === 4 && 'Senha forte'}
                                    </p>
                                </div>
                            )}
                            {errors.password && (
                                <p className="text-xs text-destructive">{errors.password}</p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">
                                Confirmar Senha *
                            </Label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={formData.confirmPassword || ''}
                                    onChange={(e) => onUpdate({ confirmPassword: e.target.value })}
                                    placeholder="Repita a senha"
                                    className={errors.confirmPassword ? 'border-destructive pr-10' : 'pr-10'}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                                >
                                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-xs text-destructive">{errors.confirmPassword}</p>
                            )}
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex gap-3 pt-4">
                            <Button
                                variant="outline"
                                onClick={onPrev}
                                className="flex-1"
                            >
                                Voltar
                            </Button>
                            <Button
                                onClick={onNext}
                                className="flex-1 bg-primary hover:bg-primary/90"
                            >
                                Continuar
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </motion.div>
    );
};

// Password strength calculator
function getPasswordStrength(password: string): number {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password) && /[^a-zA-Z0-9]/.test(password)) strength++;
    return strength;
}
