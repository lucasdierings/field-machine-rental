import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { SERVICE_CATEGORIES } from "@/data/categories";
import { supabase } from "@/integrations/supabase/client";

export const CategorySection = () => {
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    loadCounts();
  }, []);

  const loadCounts = async () => {
    try {
      const { data } = await supabase
        .from("machines")
        .select("category")
        .eq("status", "available");

      if (data) {
        const map: Record<string, number> = {};
        data.forEach((m: any) => {
          const cat = m.category || "";
          map[cat] = (map[cat] || 0) + 1;
        });
        setCounts(map);
      }
    } catch {
      // Silent — show categories without counts
    }
  };

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Serviços e Operações Agrícolas
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Encontre o serviço ideal para sua operação
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {SERVICE_CATEGORIES.map((category) => {
            const Icon = category.icon;
            const count = counts[category.name] || 0;
            return (
              <Link
                key={category.id}
                to={`/servicos-agricolas?categoria=${category.slug}`}
              >
                <Card className="group hover:shadow-card transition-all duration-300 cursor-pointer border-0 bg-gradient-card h-full">
                  <CardContent className="p-5 text-center flex flex-col items-center">
                    <div className={`w-16 h-16 ${category.color} rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>

                    <h3 className="text-sm md:text-base font-bold text-foreground mb-1">
                      {category.name}
                    </h3>

                    <p className="text-muted-foreground text-xs mb-3 line-clamp-2 hidden sm:block">
                      {category.description}
                    </p>

                    {count > 0 && (
                      <p className="text-primary font-semibold text-xs mb-2">
                        {count} disponíve{count === 1 ? "l" : "is"}
                      </p>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300 mt-auto"
                    >
                      Ver Serviços
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
