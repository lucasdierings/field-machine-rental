import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface StepIndicatorProps {
    currentStep: 1 | 2 | 3;
    totalSteps?: 3;
    className?: string;
}

export const StepIndicator = ({
    currentStep,
    totalSteps = 3,
    className
}: StepIndicatorProps) => {
    const progress = (currentStep / totalSteps) * 100;

    return (
        <div className={cn("w-full space-y-3", className)}>
            {/* Progress Bar */}
            <div className="relative h-1 w-full overflow-hidden rounded-full bg-gray-200">
                <motion.div
                    className="absolute left-0 top-0 h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                />
            </div>

            {/* Step Text */}
            <div className="flex items-center justify-between px-1">
                <p className="text-sm font-medium text-gray-600">
                    Etapa {currentStep} de {totalSteps}
                </p>
                <p className="text-xs text-gray-500">
                    {progress.toFixed(0)}% completo
                </p>
            </div>
        </div>
    );
};
