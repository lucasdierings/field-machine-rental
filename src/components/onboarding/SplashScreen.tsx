import { motion } from 'framer-motion';
import { fadeIn } from '@/animations/onboarding';
import { useEffect } from 'react';

interface SplashScreenProps {
    onComplete: () => void;
}

export const SplashScreen = ({ onComplete }: SplashScreenProps) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onComplete();
        }, 2500); // 2.5 seconds

        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-primary to-primary/80"
        >
            {/* Logo Container */}
            <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                    duration: 0.8,
                    ease: [0.4, 0, 0.2, 1]
                }}
                className="flex flex-col items-center gap-4"
            >
                {/* Logo Placeholder - Replace with actual logo */}
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-white shadow-2xl sm:h-32 sm:w-32">
                    <svg
                        className="h-16 w-16 text-primary sm:h-20 sm:w-20"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                    </svg>
                </div>

                {/* Title */}
                <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="text-3xl font-bold text-white sm:text-4xl"
                >
                    FieldMachine
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="text-sm text-white/90 sm:text-base"
                >
                    Máquinas agrícolas na sua região
                </motion.p>
            </motion.div>

            {/* Loading Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="mt-12"
            >
                <div className="flex space-x-2">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            className="h-2 w-2 rounded-full bg-white"
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.5, 1, 0.5]
                            }}
                            transition={{
                                duration: 1,
                                repeat: Infinity,
                                delay: i * 0.2
                            }}
                        />
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
};
