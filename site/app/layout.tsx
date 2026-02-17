import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

const siteUrl = 'https://fieldmachine.com.br';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Field Machine — Aluguel de Equipamentos Agrícolas',
    template: '%s | Field Machine',
  },
  description:
    'Plataforma online para alugar e locar máquinas agrícolas no Brasil. Tratores, colheitadeiras, pulverizadores e plantadeiras com segurança e praticidade.',
  keywords: [
    'aluguel máquinas agrícolas',
    'locação equipamentos agrícolas',
    'aluguel trator',
    'aluguel colheitadeira',
    'aluguel pulverizador',
    'aluguel plantadeira',
    'plataforma agrícola',
    'agronegócio',
  ],
  authors: [{ name: 'Field Machine', url: siteUrl }],
  creator: 'Field Machine',
  publisher: 'Field Machine Rental',
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
    title: 'Field Machine — Aluguel de Equipamentos Agrícolas',
    description:
      'Plataforma online para alugar e locar máquinas agrícolas no Brasil. Reserva online, pagamento seguro e suporte dedicado.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Field Machine — Aluguel de Equipamentos Agrícolas',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Field Machine — Aluguel de Equipamentos Agrícolas',
    description:
      'Plataforma online para alugar e locar máquinas agrícolas no Brasil.',
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
        'Plataforma de aluguel de máquinas e equipamentos agrícolas no Brasil.',
      areaServed: 'BR',
      knowsAbout: [
        'Aluguel de máquinas agrícolas',
        'Locação de tratores',
        'Locação de colheitadeiras',
        'Agronegócio',
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
          urlTemplate: 'https://app.fieldmachine.com.br/search?q={search_term_string}',
        },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'WebPage',
      '@id': `${siteUrl}/#webpage`,
      url: siteUrl,
      name: 'Field Machine — Aluguel de Equipamentos Agrícolas',
      isPartOf: { '@id': `${siteUrl}/#website` },
      about: { '@id': `${siteUrl}/#organization` },
      description:
        'Plataforma online para alugar e locar máquinas agrícolas no Brasil.',
    },
    {
      '@type': 'Service',
      '@id': `${siteUrl}/#service`,
      name: 'Aluguel de Equipamentos Agrícolas',
      provider: { '@id': `${siteUrl}/#organization` },
      areaServed: {
        '@type': 'Country',
        name: 'Brasil',
      },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Equipamentos para Aluguel',
        itemListElement: [
          { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Trator Agrícola' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Colheitadeira' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Pulverizador Autopropelido' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Plantadeira' } },
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
