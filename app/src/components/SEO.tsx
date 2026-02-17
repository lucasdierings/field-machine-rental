
import { Helmet } from "react-helmet-async";

interface SEOProps {
    title?: string;
    description?: string;
    canonical?: string;
}

export const SEO = ({ title, description, canonical }: SEOProps) => {
    const siteTitle = "FieldMachine - Aluguel de Máquinas Agrícolas";
    const defaultDescription = "Conecte-se diretamente com prestadores de serviços agrícolas. Alugue tratores, colheitadeiras e muito mais sem taxas.";
    const baseUrl = window.location.origin;

    const fullTitle = title ? `${title} | FieldMachine` : siteTitle;
    const fullDescription = description || defaultDescription;
    const fullCanonical = canonical ? `${baseUrl}${canonical}` : window.location.href;

    return (
        <Helmet>
            <title>{fullTitle}</title>
            <meta name="description" content={fullDescription} />
            <link rel="canonical" href={fullCanonical} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={fullDescription} />
            <meta property="og:url" content={fullCanonical} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={fullDescription} />
        </Helmet>
    );
};
