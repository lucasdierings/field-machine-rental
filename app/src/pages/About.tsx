
import { Header } from "@/components/ui/header";
import { EnhancedFooter } from "@/components/ui/enhanced-footer";
import { SEO } from "@/components/SEO";

const About = () => {
    return (
        <div className="min-h-screen bg-background">
            <SEO
                title="Sobre Nós"
                description="Saiba mais sobre a FieldMachine e nossa missão de conectar produtores rurais."
                canonical="/sobre"
            />
            <Header />
            <main className="container mx-auto px-4 py-8 pt-24">
                <h1 className="text-3xl font-bold mb-4">Sobre Nós</h1>
                <p>Conteúdo da página Sobre Nós...</p>
            </main>
            <EnhancedFooter />
        </div>
    );
};

export default About;
