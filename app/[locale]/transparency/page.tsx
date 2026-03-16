import { notFound } from 'next/navigation';
import { redirect } from '@/i18n/navigation';
import { isLocale } from '@/lib/i18n/locales';

export default async function LocalizedTransparencyRedirect({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }
  redirect({ href: '/philosophy', locale });
}
