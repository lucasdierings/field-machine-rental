import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Tractor, Shield, DollarSign } from 'lucide-react';
import { slideIn } from '@/animations/onboarding';

interface CarouselSlide {
    icon: React.ReactNode;
    title: string;
    description: string;
}

const slides: CarouselSlide[] = [
    {
        icon: <Tractor className="h-12 w-12 text-primary sm:h-16 sm:w-16" />,
        title: 'Encontre máquinas perto de você',
        description: 'Acesse tratores, colheitadeiras e implementos agrícolas na sua região'
    },
    {
        icon: <Shield className="h-12 w-12 text-primary sm:h-16 sm:w-16" />,
        title: 'Alugue com segurança',
        description: 'Todos os equipamentos são verificados e os proprietários validados'
    },
    {
        icon: <DollarSign className="h-12 w-12 text-primary sm:h-16 sm:w-16" />,
        title: 'Ganhe dinheiro com suas máquinas',
        description: 'Alugue seus equipamentos ociosos e gere renda extra'
    }
];

interface OnboardingCarouselProps {
    onComplete: () => void;
}

export const OnboardingCarousel = ({ onComplete }: OnboardingCarouselProps) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [direction, setDirection] = useState(0);

    const nextSlide = () => {
        if (currentSlide < slides.length - 1) {
            setDirection(1);
            setCurrentSlide(currentSlide + 1);
        } else {
            onComplete();
        }
    };

    const prevSlide = () => {
        if (currentSlide > 0) {
            setDirection(-1);
            setCurrentSlide(currentSlide - 1);
        }
    };

    const goToSlide = (index: number) => {
        setDirection(index > currentSlide ? 1 : -1);
        setCurrentSlide(index);
    };

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? '100%' : '-100%',
            opacity: 0
        }),
        center: {
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            x: direction > 0 ? '-100%' : '100%',
            opacity: 0
        })
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-between bg-background p-4 pb-8 pt-12 sm:p-8">
            {/* Skip Button */}
            <div className="w-full max-w-md">
                <Button
                    variant="ghost"
                    onClick={onComplete}
                    className="ml-auto flex text-gray-600"
                >
                    Pular
                </Button>
            </div>

            {/* Carousel Content */}
            <div className="flex w-full max-w-md flex-1 flex-col items-center justify-center">
                <div className="relative h-96 w-full overflow-hidden sm:h-[28rem]">
                    <AnimatePresence initial={false} custom={direction} mode="wait">
                        <motion.div
                            key={currentSlide}
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                                x: { type: 'spring', stiffness: 300, damping: 30 },
                                opacity: { duration: 0.2 }
                            }}
                            className="absolute inset-0"
                        >
                            <Card className="flex h-full flex-col items-center justify-center gap-6 p-8 shadow-lg sm:gap-8 sm:p-12">
                                {/* Icon */}
                                <div className="rounded-full bg-primary/10 p-6 sm:p-8">
                                    {slides[currentSlide].icon}
                                </div>

                                {/* Title */}
                                <h2 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">
                                    {slides[currentSlide].title}
                                </h2>

                                {/* Description */}
                                <p className="text-center text-base text-gray-600 sm:text-lg">
                                    {slides[currentSlide].description}
                                </p>
                            </Card>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Dots Indicator */}
                <div className="mt-8 flex gap-2">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`h-2 rounded-full transition-all duration-300 ${index === currentSlide
                                    ? 'w-8 bg-primary'
                                    : 'w-2 bg-gray-300 hover:bg-gray-400'
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex w-full max-w-md items-center justify-between gap-4">
                <Button
                    variant="outline"
                    onClick={prevSlide}
                    disabled={currentSlide === 0}
                    className="flex items-center gap-2"
                >
                    <ChevronLeft className="h-4 w-4" />
                    Anterior
                </Button>

                <Button
                    onClick={nextSlide}
                    className="flex items-center gap-2 bg-primary hover:bg-primary/90"
                >
                    {currentSlide === slides.length - 1 ? (
                        'Começar'
                    ) : (
                        <>
                            Próximo
                            <ChevronRight className="h-4 w-4" />
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
};
