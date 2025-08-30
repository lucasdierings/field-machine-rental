import { Header } from "@/components/ui/header";
import { HeroSection } from "@/components/ui/hero-section";
import { CategorySection } from "@/components/ui/category-section";
import { MachineGrid } from "@/components/ui/machine-grid";
import { Footer } from "@/components/ui/footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <CategorySection />
        <MachineGrid />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
