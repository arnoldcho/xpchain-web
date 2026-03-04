import { redirect } from '@/i18n/navigation';
import type { Locale } from '@/lib/i18n/locales';

export default async function LocalizedTransparencyRedirect({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  redirect({ href: '/philosophy', locale });
}
