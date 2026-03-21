import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

const siteUrl = 'https://fieldmachine.com.br';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Field Machine — Plataforma de Serviços para o Agronegócio',
    template: '%s | Field Machine',
  },
  description:
    'Plataforma de serviços para o agronegócio no Brasil. Conectamos produtores rurais e prestadores de serviço agrícola — tratores, colheitadeiras, pulverizadores e plantadeiras. Sem taxas, sem intermediários.',
  keywords: [
    'plataforma serviços agronegócio',
    'serviços agrícolas',
    'aluguel máquinas agrícolas',
    'locação equipamentos agrícolas',
    'aluguel trator',
    'aluguel colheitadeira',
    'aluguel pulverizador',
    'aluguel plantadeira',
    'plataforma agrícola Brasil',
    'agronegócio',
    'prestador de serviço agrícola',
    'produtores rurais',
    'contratação serviços rurais',
    'colheita soja milho',
    'preparo de solo',
    'pulverização lavoura',
  ],
  authors: [{ name: 'Field Machine', url: siteUrl }],
  creator: 'Field Machine',
  publisher: 'Field Machine',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: siteUrl,
    siteName: 'Field Machine',
    title: 'Field Machine — Plataforma de Serviços para o Agronegócio',
    description:
      'Conectamos produtores rurais e prestadores de serviço agrícola no Brasil. Sem taxas, sem intermediários — combine direto e acerte entre vocês.',
    images: [
      {
        url: '/og',
        width: 1200,
        height: 630,
        alt: 'Field Machine — Plataforma de Serviços para o Agronegócio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Field Machine — Plataforma de Serviços para o Agronegócio',
    description:
      'Conectamos produtores rurais e prestadores de serviço agrícola no Brasil. Sem taxas, sem intermediários.',
    images: ['/og'],
  },
  alternates: {
    canonical: siteUrl,
  },
};

// JSON-LD — structured data for Google & AI search engines
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${siteUrl}/#organization`,
      name: 'Field Machine',
      url: siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/og`,
      },
      description:
        'Plataforma de serviços para o agronegócio no Brasil. Conectamos produtores rurais e prestadores de serviço agrícola sem taxas e sem intermediários.',
      areaServed: 'BR',
      contactPoint: {
        '@type': 'ContactPoint',
        email: 'contato@fieldmachine.com.br',
        telephone: '+55-45-99144-7004',
        contactType: 'customer support',
        areaServed: 'BR',
        availableLanguage: 'Portuguese',
      },
      knowsAbout: [
        'Serviços para o agronegócio',
        'Plataforma agrícola',
        'Aluguel de máquinas agrícolas',
        'Locação de tratores',
        'Colheita de soja e milho',
        'Pulverização agrícola',
        'Plantio direto',
        'Preparo de solo',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: siteUrl,
      name: 'Field Machine',
      publisher: { '@id': `${siteUrl}/#organization` },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://app.fieldmachine.com.br/servicos-agricolas?location={search_term_string}',
        },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'WebPage',
      '@id': `${siteUrl}/#webpage`,
      url: siteUrl,
      name: 'Field Machine — Plataforma de Serviços para o Agronegócio',
      isPartOf: { '@id': `${siteUrl}/#website` },
      about: { '@id': `${siteUrl}/#organization` },
      description:
        'Plataforma de serviços para o agronegócio. Conectamos produtores rurais e prestadores de serviço agrícola no Brasil.',
    },
    {
      '@type': 'Service',
      '@id': `${siteUrl}/#service`,
      name: 'Plataforma de Serviços para o Agronegócio',
      provider: { '@id': `${siteUrl}/#organization` },
      description: 'Marketplace de serviços agrícolas peer-to-peer. Produtores e prestadores negociam diretamente, sem taxas de comissão.',
      areaServed: {
        '@type': 'Country',
        name: 'Brasil',
      },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Serviços Agrícolas Disponíveis',
        itemListElement: [
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Serviço de Trator Agrícola' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Colheita com Colheitadeira' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Pulverização Agrícola' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Plantio com Plantadeira' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Preparo de Solo' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Transporte Agrícola' } },
        ],
      },
    },
    {
      '@type': 'FAQPage',
      '@id': `${siteUrl}/#faq`,
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Como funciona o pagamento?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'O pagamento é combinado diretamente entre você e o proprietário/operador. A plataforma facilita a conexão e a negociação — vocês decidem a forma de pagamento (PIX, dinheiro, transferência, etc.).',
          },
        },
        {
          '@type': 'Question',
          name: 'A plataforma cobra alguma taxa?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Não! O FieldMachine é gratuito para uso. Não cobramos comissão sobre os serviços contratados. Nosso objetivo é conectar a comunidade agrícola.',
          },
        },
        {
          '@type': 'Question',
          name: 'Como garantir que o serviço será bem feito?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Nosso sistema de avaliações permite que tanto o contratante quanto o prestador avaliem a experiência. São avaliados: qualidade do serviço, operador, máquina e o próprio cliente.',
          },
        },
        {
          '@type': 'Question',
          name: 'Como posso me tornar um prestador de serviço?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Cadastre-se na plataforma, complete seu perfil e cadastre suas máquinas. Produtores da sua região poderão encontrar e contratar seus serviços automaticamente.',
          },
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
