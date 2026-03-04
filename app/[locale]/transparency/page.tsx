import { redirect } from '@/i18n/navigation';
import type { Locale } from '@/lib/i18n/locales';

export default function LocalizedTransparencyRedirect({ params }: { params: { locale: Locale } }) {
  redirect({ href: '/philosophy', locale: params.locale });
}
