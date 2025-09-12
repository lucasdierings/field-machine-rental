import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Search } from "lucide-react";
import { Link } from "react-router-dom";

const Favorites = () => {
  // Mock data - in real app this would come from state/API
  const favorites = [];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-8">
                <Heart className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold">Meus Favoritos</h1>
              </div>

              {favorites.length === 0 ? (
                <Card className="text-center py-16">
                  <CardContent>
                    <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-6" />
                    <h2 className="text-2xl font-semibold mb-4">Nenhum favorito ainda</h2>
                    <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                      Comece a favoritar equipamentos para vê-los aqui. 
                      Clique no ícone de coração nos equipamentos que mais gostar.
                    </p>
                    <Button asChild className="bg-gradient-primary">
                      <Link to="/buscar">
                        <Search className="h-4 w-4 mr-2" />
                        Explorar Equipamentos
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Favorited machines would be rendered here */}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Favorites;