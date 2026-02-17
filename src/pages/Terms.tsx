
import { Header } from "@/components/ui/header";
import { EnhancedFooter } from "@/components/ui/enhanced-footer";
import { SEO } from "@/components/SEO";

const Terms = () => {
    return (
        <div className="min-h-screen bg-background">
            <SEO
                title="Termos de Uso"
                description="Leia nossos termos de uso e condições de serviço."
                canonical="/termos"
            />
            <Header />
            <main className="container mx-auto px-4 py-8 pt-24">
                <h1 className="text-3xl font-bold mb-4">Termos de Uso</h1>
                <p>Conteúdo da página de Termos de Uso...</p>
            </main>
            <EnhancedFooter />
        </div>
    );
};

export default Terms;
