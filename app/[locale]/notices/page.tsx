import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Section } from '@/components/Section';
import { isLocale } from '@/lib/i18n/locales';
import { buildAlternates, buildLocalePath } from '@/lib/seo';

const noticeDates = ['2026-07-03', '2026-07-03', '2026-07-03', '2026-03-04', '2026-03-04', '2026-03-04', '2026-03-03', '2026-03-03', '2026-02-26', '2026-02-26', '2026-02-25', '2026-02-24'];

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) {
    return {};
  }
  const t = await getTranslations({ locale: locale, namespace: 'notices' });
  return {
    title: t('title'),
    description: t('subtitle'),
    alternates: {
      canonical: buildLocalePath(locale, '/notices'),
      languages: buildAlternates('/notices')
    }
  };
}

export default async function LocalizedNoticesPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }
  const t = await getTranslations({ locale: locale, namespace: 'notices' });

  return (
    <>
      <h1 className="sr-only">{t('srTitle')}</h1>
      <Section title={t('title')} subtitle={t('subtitle')}>
        <div className="panel divide-y divide-line">
          {noticeDates.map((date, idx) => (
            <article key={`${date}-${idx}`} className="p-4 text-sm">
              <p className="text-mute">{date}</p>
              <p className="mt-1 text-text">{t(`items.${idx}`)}</p>
            </article>
          ))}
        </div>
      </Section>
    </>
  );
}
