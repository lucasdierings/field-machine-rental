import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Field Machine - Aluguel de Equipamentos Agrícolas',
  description: 'Plataforma de aluguel de máquinas e equipamentos agrícolas. Conectamos proprietários e locatários com segurança e praticidade.',
  keywords: 'aluguel, máquinas agrícolas, equipamentos, trator, colheitadeira',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
