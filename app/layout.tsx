import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.xpchain.co.kr'),
  title: 'XPChain',
  description: '분산성과 장기 지속성을 중심으로 운영되는 독립 메인넷 블록체인 XPChain',
  icons: {
    icon: [
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-192.png', sizes: '192x192', type: 'image/png' }
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }]
  },
  openGraph: {
    title: 'XPChain',
    description: '분산성과 장기 지속성을 중심으로 운영되는 독립 메인넷 블록체인 XPChain',
    images: [{ url: '/xpc-logo.png', width: 512, height: 512, alt: 'XPChain Logo' }]
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body className="font-sans">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
