import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Section } from '@/components/Section';
import type { Locale } from '@/lib/i18n/locales';
import { buildAlternates, buildLocalePath } from '@/lib/seo';

type Props = {
  params: { locale: Locale };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'build' });
  return {
    title: t('title'),
    description: t('subtitle'),
    alternates: {
      canonical: buildLocalePath(params.locale, '/build'),
      languages: buildAlternates('/build')
    }
  };
}

export default async function LocalizedBuildPage({ params }: Props) {
  const t = await getTranslations({ locale: params.locale, namespace: 'build' });

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
