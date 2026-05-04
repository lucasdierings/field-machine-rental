import { Header } from "@/components/ui/header";
import { EnhancedHero } from "@/components/ui/enhanced-hero";
import { ProcessFlow } from "@/components/ui/process-flow";
import { StatsSection } from "@/components/ui/stats-section";
import { HowItWorks } from "@/components/ui/how-it-works";
import { CategoriesShowcase } from "@/components/ui/categories-showcase";
import { Testimonials } from "@/components/ui/testimonials";
import { EnhancedFooter } from "@/components/ui/enhanced-footer";

import { SEO } from "@/components/SEO";

const Index = () => {
  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <SEO
        title="Home"
        description="A maior plataforma de aluguel de máquinas agrícolas do Brasil. Conecte-se com prestadores de serviço sem taxas."
        canonical="/"
      />
      <Header />
      <main>
        <EnhancedHero />
        <ProcessFlow />
        <StatsSection />
        <HowItWorks />
        <CategoriesShowcase />
        <Testimonials />
      </main>
      <EnhancedFooter />
    </div>
  );
};

export default Index;
