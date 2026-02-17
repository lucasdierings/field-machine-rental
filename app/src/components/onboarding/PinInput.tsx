import { motion } from 'framer-motion';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { pinDigitPop } from '@/animations/onboarding';

interface PinInputProps {
    value: string;
    onChange: (pin: string) => void;
    onComplete?: (pin: string) => void;
    length?: number;
    disabled?: boolean;
}

export const PinInput = ({
    value,
    onChange,
    onComplete,
    length = 6,
    disabled = false
}: PinInputProps) => {
    const handleChange = (newValue: string) => {
        onChange(newValue);

        // Auto-submit when complete
        if (newValue.length === length && onComplete) {
            onComplete(newValue);
        }
    };

    return (
        <div className="flex w-full justify-center">
            <InputOTP
                maxLength={length}
                value={value}
                onChange={handleChange}
                disabled={disabled}
                className="gap-2 sm:gap-3"
            >
                <InputOTPGroup className="gap-2 sm:gap-3">
                    {Array.from({ length }).map((_, index) => (
                        <motion.div
                            key={index}
                            variants={pinDigitPop}
                            initial="initial"
                            animate={value[index] ? "filled" : "initial"}
                        >
                            <InputOTPSlot
                                index={index}
                                className="h-12 w-10 border-2 border-gray-300 text-lg font-bold transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20 data-[filled]:border-primary data-[filled]:bg-primary/5 sm:h-14 sm:w-12 sm:text-xl"
                            />
                        </motion.div>
                    ))}
                </InputOTPGroup>
            </InputOTP>
        </div>
    );
};
