import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Section } from '@/components/Section';
import { isLocale } from '@/lib/i18n/locales';
import { buildAlternates, buildLocalePath } from '@/lib/seo';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) {
    return {};
  }
  const t = await getTranslations({ locale: locale, namespace: 'build' });
  return {
    title: t('title'),
    description: t('subtitle'),
    alternates: {
      canonical: buildLocalePath(locale, '/build'),
      languages: buildAlternates('/build')
    }
  };
}

export default async function LocalizedBuildPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }
  const t = await getTranslations({ locale: locale, namespace: 'build' });

  return (
    <>
      <h1 className="sr-only">{t('srTitle')}</h1>
      <Section title={t('title')} subtitle={t('subtitle')}>
        <div className="grid gap-4 md:grid-cols-2">
          <article className="panel p-5">
            <h3 className="text-lg font-semibold text-text">SmartPig</h3>
            <p className="mt-2 text-sm text-mute">{t('smartpig')}</p>
          </article>
          <article className="panel p-5">
            <h3 className="text-lg font-semibold text-text">XRoutine</h3>
            <p className="mt-2 text-sm text-mute">{t('xroutine')}</p>
          </article>
        </div>
      </Section>
    </>
  );
}
