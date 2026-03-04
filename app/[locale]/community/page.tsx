import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Section } from '@/components/Section';
import { links } from '@/lib/links';
import type { Locale } from '@/lib/i18n/locales';
import { buildAlternates, buildLocalePath } from '@/lib/seo';

type Props = {
  params: { locale: Locale };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'community' });
  return {
    title: t('title'),
    description: t('subtitle'),
    alternates: {
      canonical: buildLocalePath(params.locale, '/community'),
      languages: buildAlternates('/community')
    }
  };
}

export default async function LocalizedCommunityPage({ params }: Props) {
  const t = await getTranslations({ locale: params.locale, namespace: 'community' });

  return (
    <>
      <h1 className="sr-only">{t('srTitle')}</h1>
      <Section title={t('title')} subtitle={t('subtitle')}>
        <div className="panel space-y-2 p-5 text-sm text-text">
          <p>
            <a href={links.telegramNotice} target="_blank" rel="noreferrer" className="text-accent">
              {t('telegramNotice')}
            </a>
          </p>
          <p>
            <a href={links.telegramChat} target="_blank" rel="noreferrer" className="text-accent">
              {t('telegramChat')}
            </a>
          </p>
          <p>
            <a href={links.kakaoChannel} target="_blank" rel="noreferrer" className="text-accent">
              {t('kakao')}
            </a>
          </p>
          <p>
            <a href={links.japanDiscordLanding} target="_blank" rel="noreferrer" className="text-accent">
              {t('discordJapan')}
            </a>
          </p>
        </div>
      </Section>
    </>
  );
}
