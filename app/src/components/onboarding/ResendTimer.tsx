import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCw } from 'lucide-react';
import { motion } from 'framer-motion';

interface ResendTimerProps {
    initialSeconds?: number;
    onResend: () => Promise<void>;
    disabled?: boolean;
}

export const ResendTimer = ({
    initialSeconds = 60,
    onResend,
    disabled = false
}: ResendTimerProps) => {
    const [seconds, setSeconds] = useState(initialSeconds);
    const [isResending, setIsResending] = useState(false);

    useEffect(() => {
        if (seconds > 0) {
            const timer = setTimeout(() => {
                setSeconds(seconds - 1);
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [seconds]);

    const handleResend = async () => {
        if (seconds > 0 || disabled || isResending) return;

        setIsResending(true);
        try {
            await onResend();
            setSeconds(initialSeconds); // Reset timer
        } catch (error) {
            console.error('Error resending code:', error);
        } finally {
            setIsResending(false);
        }
    };

    const isDisabled = seconds > 0 || disabled || isResending;

    return (
        <Button
            variant="link"
            onClick={handleResend}
            disabled={isDisabled}
            className="flex items-center gap-2 text-sm sm:text-base"
        >
            <motion.div
                animate={{ rotate: isResending ? 360 : 0 }}
                transition={{ duration: 1, repeat: isResending ? Infinity : 0 }}
            >
                <RotateCw className="h-4 w-4" />
            </motion.div>

            {isResending ? (
                'Enviando...'
            ) : seconds > 0 ? (
                `Reenviar código em ${seconds}s`
            ) : (
                'Reenviar código'
            )}
        </Button>
    );
};
