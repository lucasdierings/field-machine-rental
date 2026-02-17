import { useState } from 'react';

export type OnboardingStep =
    | 'splash'
    | 'welcome'
    | 'register'
    | 'verify';

export interface OnboardingState {
    currentStep: OnboardingStep;
    email: string;
    phone: string;
    emailVerified: boolean;
    formData: {
        userType: 'producer' | 'owner' | 'both' | null;
        fullName: string;
        cpfCnpj: string;
        email: string;
        phone: string;
        password: string;
        confirmPassword: string;
    };
}

const initialState: OnboardingState = {
    currentStep: 'splash',
    email: '',
    phone: '',
    emailVerified: false,
    formData: {
        userType: null,
        fullName: '',
        cpfCnpj: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    }
};

export const useOnboarding = () => {
    const [state, setState] = useState<OnboardingState>(initialState);

    const nextStep = () => {
        const stepOrder: OnboardingStep[] = ['splash', 'welcome', 'register', 'verify'];
        const currentIndex = stepOrder.indexOf(state.currentStep);

        if (currentIndex < stepOrder.length - 1) {
            setState(prev => ({
                ...prev,
                currentStep: stepOrder[currentIndex + 1]
            }));
        }
    };

    const prevStep = () => {
        const stepOrder: OnboardingStep[] = ['splash', 'welcome', 'register', 'verify'];
        const currentIndex = stepOrder.indexOf(state.currentStep);

        if (currentIndex > 0) {
            setState(prev => ({
                ...prev,
                currentStep: stepOrder[currentIndex - 1]
            }));
        }
    };

    const updateFormData = (updates: Partial<OnboardingState['formData']>) => {
        setState(prev => ({
            ...prev,
            formData: {
                ...prev.formData,
                ...updates
            }
        }));
    };

    const setEmailVerified = (verified: boolean) => {
        setState(prev => ({
            ...prev,
            emailVerified: verified
        }));
    };

    const reset = () => {
        setState(initialState);
    };

    return {
        state,
        nextStep,
        prevStep,
        updateFormData,
        setEmailVerified,
        reset
    };
};
