import { Variants } from 'framer-motion';

/**
 * Animation variants for Onboarding flow
 * Mobile-first with smooth transitions
 */

export const fadeIn: Variants = {
    hidden: {
        opacity: 0,
        y: 20
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            ease: [0.4, 0, 0.2, 1] as const // easeOut
        }
    },
    exit: {
        opacity: 0,
        y: -20,
        transition: {
            duration: 0.3
        }
    }
};

export const slideIn: Variants = {
    hidden: {
        x: '100%',
        opacity: 0
    },
    visible: {
        x: 0,
        opacity: 1,
        transition: {
            type: 'spring',
            stiffness: 300,
            damping: 30
        }
    },
    exit: {
        x: '-100%',
        opacity: 0,
        transition: {
            duration: 0.3
        }
    }
};

export const scaleIn: Variants = {
    hidden: {
        scale: 0.8,
        opacity: 0
    },
    visible: {
        scale: 1,
        opacity: 1,
        transition: {
            type: 'spring',
            stiffness: 400,
            damping: 25
        }
    }
};

export const pinDigitPop: Variants = {
    initial: { scale: 1 },
    filled: {
        scale: [1, 1.1, 1],
        transition: {
            duration: 0.2,
            times: [0, 0.5, 1]
        }
    }
};

export const progressBar = {
    initial: { scaleX: 0 },
    animate: (progress: number) => ({
        scaleX: progress,
        transition: {
            duration: 0.5,
            ease: 'easeOut'
        }
    })
};

export const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

export const logoSpin: Variants = {
    initial: { rotate: 0, scale: 0.5, opacity: 0 },
    animate: {
        rotate: 360,
        scale: 1,
        opacity: 1,
        transition: {
            duration: 1,
            ease: 'easeOut'
        }
    }
};
