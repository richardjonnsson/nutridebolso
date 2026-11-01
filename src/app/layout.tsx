import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#050505',
};

export const metadata: Metadata = {
  title: 'QG Seca Peitoral | Área de Operações & Entregáveis Oficiais Rjonnssonfit',
  description: 'Central Oficial de Entregáveis Kiwify: Ficha de Treino Seca Peitoral, Vídeo-Aula Prática, Calculadora de Dieta Anti-Aromatase, Guia de Trava da Aromatase e Bônus O Efeito Armadura.',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="theme-color" content="#050505" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&family=Montserrat:wght@800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen bg-[#050505] text-[#f5f5f5] selection:bg-[#00FF00] selection:text-black">
        {children}
      </body>
    </html>
  );
}
