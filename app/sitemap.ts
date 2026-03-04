import type { MetadataRoute } from 'next';
import { locales } from '@/lib/i18n/locales';

const baseUrl = 'https://www.xpchain.co.kr';

const routes = [
  '',
  '/network',
  '/wallets',
  '/staking',
  '/explorer',
  '/notices',
  '/docs',
  '/roadmap',
  '/build',
  '/community',
  '/philosophy',
  '/docs/xpc-1-0',
  '/docs/xpc-1-0/part-1',
  '/docs/xpc-1-0/part-2',
  '/docs/xpc-1-0/part-3',
  '/docs/wallet-release-checklist',
  '/docs/definition-of-done-checklist'
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return locales.flatMap((locale) =>
    routes.map((route) => ({
      url: `${baseUrl}/${locale}${route}`,
      lastModified: now,
      changeFrequency: route === '' ? 'daily' : 'weekly',
      priority: route === '' ? 1 : 0.7
    }))
  );
}
