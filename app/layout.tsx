import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { getLocale } from 'next-intl/server';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.xpchain.co.kr'),
  verification: {
    other: {
      'naver-site-verification': 'a741f75b930241bc082a83ddbe5bb71aacd55281'
    }
  },
  icons: {
    icon: [
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-192.png', sizes: '192x192', type: 'image/png' }
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }]
  }
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale();
  return (
    <html lang={locale}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
