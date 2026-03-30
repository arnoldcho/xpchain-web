import { notFound } from 'next/navigation';
import { redirect } from '@/i18n/navigation';
import { isLocale } from '@/lib/i18n/locales';

const legacyPostRedirects: Record<string, string> = {
  'xpc-1-0-blockchain-1-based-on-bitcoin-0-17-0': '/docs/xpc-1-0/part-1'
};

export default async function LocalizedLegacyPostRedirectPage({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const target = legacyPostRedirects[slug];

  if (!target) {
    notFound();
  }

  redirect({ href: target, locale });
}
