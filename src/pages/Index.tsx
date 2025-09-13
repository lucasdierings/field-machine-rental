import { Header } from "@/components/ui/header";
import { EnhancedHero } from "@/components/ui/enhanced-hero";
import { StatsSection } from "@/components/ui/stats-section";
import { HowItWorks } from "@/components/ui/how-it-works";
import { CategoriesShowcase } from "@/components/ui/categories-showcase";
import { Testimonials } from "@/components/ui/testimonials";
import { EnhancedFooter } from "@/components/ui/enhanced-footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <EnhancedHero />
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
