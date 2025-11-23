import { motion } from 'framer-motion';
import { OnboardingCarousel } from './OnboardingCarousel';
import { fadeIn } from '@/animations/onboarding';

interface OnboardingStepOneProps {
    onNext: () => void;
}

export const OnboardingStepOne = ({ onNext }: OnboardingStepOneProps) => {
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={fadeIn}
            className="h-full w-full"
        >
            <OnboardingCarousel onComplete={onNext} />
        </motion.div>
    );
};
