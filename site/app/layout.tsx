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
        url: '/images/og-image.jpg',
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
    images: ['/images/og-image.jpg'],
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
        url: `${siteUrl}/images/og-image.jpg`,
      },
      description:
        'Plataforma de serviços para o agronegócio no Brasil. Conectamos produtores rurais e prestadores de serviço agrícola sem taxas e sem intermediários.',
      areaServed: 'BR',
      contactPoint: {
        '@type': 'ContactPoint',
        email: 'fieldmachinebrasil@gmail.com',
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
