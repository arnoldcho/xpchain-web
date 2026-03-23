import { notFound } from 'next/navigation';
import { redirect } from '@/i18n/navigation';
import { isLocale } from '@/lib/i18n/locales';

export default async function LocalizedLegacyMainRedirect({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  redirect({ href: '/', locale });
}
