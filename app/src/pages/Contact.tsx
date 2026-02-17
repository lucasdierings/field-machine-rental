
import { Header } from "@/components/ui/header";
import { EnhancedFooter } from "@/components/ui/enhanced-footer";
import { SEO } from "@/components/SEO";

const Contact = () => {
    return (
        <div className="min-h-screen bg-background">
            <SEO
                title="Contato"
                description="Entre em contato conosco para dúvidas, suporte ou parcerias."
                canonical="/contato"
            />
            <Header />
            <main className="container mx-auto px-4 py-8 pt-24">
                <h1 className="text-3xl font-bold mb-4">Contato</h1>
                <p>Conteúdo da página de Contato...</p>
            </main>
            <EnhancedFooter />
        </div>
    );
};

export default Contact;
