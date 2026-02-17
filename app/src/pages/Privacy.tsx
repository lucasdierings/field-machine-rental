
import { Header } from "@/components/ui/header";
import { EnhancedFooter } from "@/components/ui/enhanced-footer";
import { SEO } from "@/components/SEO";

const Privacy = () => {
    return (
        <div className="min-h-screen bg-background">
            <SEO
                title="Política de Privacidade"
                description="Entenda como coletamos e protegemos seus dados."
                canonical="/privacidade"
            />
            <Header />
            <main className="container mx-auto px-4 py-8 pt-24">
                <h1 className="text-3xl font-bold mb-4">Política de Privacidade</h1>
                <p>Conteúdo da página de Política de Privacidade...</p>
            </main>
            <EnhancedFooter />
        </div>
    );
};

export default Privacy;
