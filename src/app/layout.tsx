import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Gerador de Dieta Personalizada | Nutrição & Performance',
  description: 'Gerador inteligente de dieta com 3 opções de cardápio personalizadas, pesagens exatas na balança e download em PDF.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
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
