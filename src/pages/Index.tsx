import { Header } from "@/components/ui/header";
import { HeroSection } from "@/components/ui/hero-section";
import { CategorySection } from "@/components/ui/category-section";
import { MachineGrid } from "@/components/ui/machine-grid";
import { Footer } from "@/components/ui/footer";
import { useState } from "react";
import { type FilterValues } from "@/components/ui/advanced-filters";

const Index = () => {
  const [searchFilters, setSearchFilters] = useState<FilterValues & {
    location?: string;
    startDate?: Date;
    endDate?: Date;
    time?: string;
    category?: string;
    culture?: string;
  }>();

  const handleSearch = (filters: FilterValues & {
    location: string;
    startDate?: Date;
    endDate?: Date;
    time: string;
    category: string;
    culture: string;
  }) => {
    setSearchFilters(filters);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection onSearch={handleSearch} />
        <CategorySection />
        <MachineGrid searchFilters={searchFilters} />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
