import { useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const testimonials = [
  {
    name: "João Silva",
    city: "Cascavel, PR",
    rating: 5,
    text: "Consegui contratar um serviço de colheita quando minha máquina quebrou na safra. Salvou meu plantio e economizei muito comparado ao preço de uma nova.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
  },
  {
    name: "Maria Santos", 
    city: "Londrina, PR",
    rating: 5,
    text: "Como proprietária, consegui rentabilizar meu trator que ficava parado. A plataforma é segura e o processo é muito simples.",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b7fd?w=150&h=150&fit=crop&crop=face"
  },
  {
    name: "Pedro Oliveira",
    city: "Maringá, PR", 
    rating: 5,
    text: "Excelente plataforma! Encontrei rapidamente um pulverizador na minha região. O processo foi transparente e seguro do início ao fim.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
  }
];

export const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            O que Nossos Usuários Dizem
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Depoimentos reais de produtores e proprietários que confiam no FieldMachine
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="bg-card rounded-2xl p-8 md:p-12 shadow-elegant">
              <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
                <div className="flex-shrink-0">
                  <img
                    src={testimonials[currentIndex].avatar}
                    alt={testimonials[currentIndex].name}
                    className="w-20 h-20 rounded-full object-cover"
                    loading="lazy"
                  />
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  <div className="flex justify-center md:justify-start mb-4">
                    {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  
                  <blockquote className="text-lg md:text-xl text-foreground mb-4 italic">
                    "{testimonials[currentIndex].text}"
                  </blockquote>
                  
                  <div className="text-sm text-muted-foreground">
                    <div className="font-semibold">{testimonials[currentIndex].name}</div>
                    <div>{testimonials[currentIndex].city}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation buttons */}
            <Button
              variant="outline"
              size="icon"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-background/80 backdrop-blur-sm"
              onClick={prevTestimonial}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-background/80 backdrop-blur-sm"
              onClick={nextTestimonial}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex ? "bg-primary" : "bg-muted"
                }`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};