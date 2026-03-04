import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Section } from '@/components/Section';
import type { Locale } from '@/lib/i18n/locales';
import { buildAlternates, buildLocalePath } from '@/lib/seo';

type Props = {
  params: { locale: Locale };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'philosophy' });
  return {
    title: t('title'),
    description: t('subtitle'),
    alternates: {
      canonical: buildLocalePath(params.locale, '/philosophy'),
      languages: buildAlternates('/philosophy')
    }
  };
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mt-3 list-disc space-y-2 pl-5 text-mute">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export default async function LocalizedPhilosophyPage({ params }: Props) {
  const t = await getTranslations({ locale: params.locale, namespace: 'philosophy' });

  return (
    <>
      <h1 className="sr-only">{t('srTitle')}</h1>
      <Section title={t('title')} subtitle={t('subtitle')}>
        <div className="space-y-4 text-sm text-text">
          <div className="panel p-5">
            <h2 className="text-lg font-semibold text-text sm:text-xl">{t('purposeTitle')}</h2>
            <div className="mt-3 space-y-2 leading-relaxed text-mute">
              <p>{t('purposeBody1')}</p>
              <p>{t('purposeBody2')}</p>
            </div>
          </div>

          <div className="panel p-5">
            <h2 className="text-lg font-semibold text-text sm:text-xl">{t('coreTitle')}</h2>
            <BulletList items={[t('core1'), t('core2'), t('core3')]} />
          </div>

          <div className="panel p-5">
            <h2 className="text-lg font-semibold text-text sm:text-xl">{t('transparencyTitle')}</h2>
            <BulletList items={[t('transparency1'), t('transparency2'), t('transparency3'), t('transparency4'), t('transparency5')]} />
          </div>

          <div className="panel p-5">
            <h2 className="text-lg font-semibold text-text sm:text-xl">{t('communicationTitle')}</h2>
            <BulletList items={[t('communication1'), t('communication2'), t('communication3'), t('communication4')]} />
          </div>

          <div className="panel p-5">
            <h2 className="text-lg font-semibold text-text sm:text-xl">{t('servicesTitle')}</h2>
            <div className="mt-3 space-y-2 leading-relaxed text-mute">
              <p>{t('services1')}</p>
              <p>{t('services2')}</p>
              <p>{t('services3')}</p>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
