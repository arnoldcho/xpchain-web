export const locales = ['ko', 'en', 'ja'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'ko';

export const localeToBCP47: Record<Locale, string> = {
  ko: 'ko-KR',
  en: 'en-US',
  ja: 'ja-JP'
};

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}
