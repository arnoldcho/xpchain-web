import type { Locale } from '@/lib/i18n/locales';

export const siteBaseUrl = 'https://www.xpchain.co.kr';

export function buildLocalePath(locale: Locale, pagePath: string): string {
  return `/${locale}${pagePath}`;
}

export function buildAlternates(pagePath: string) {
  return {
    'ko-KR': `/ko${pagePath}`,
    en: `/en${pagePath}`,
    ja: `/ja${pagePath}`,
    'x-default': `/ko${pagePath}`
  };
}
