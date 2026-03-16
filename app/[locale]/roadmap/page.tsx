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
  const t = await getTranslations({ locale: locale, namespace: 'roadmap' });
  return {
    title: t('title'),
    description: t('subtitle'),
    alternates: {
      canonical: buildLocalePath(locale, '/roadmap'),
      languages: buildAlternates('/roadmap')
    }
  };
}

function RoadmapList({ items }: { items: string[] }) {
  return (
    <ul className="mt-2 list-disc space-y-1 pl-5 text-mute">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export default async function LocalizedRoadmapPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }
  const t = await getTranslations({ locale: locale, namespace: 'roadmap' });

  return (
    <>
      <h1 className="sr-only">{t('srTitle')}</h1>
      <Section title={t('title')} subtitle={t('subtitle')}>
        <div className="space-y-5 text-sm text-text">
          <div className="panel p-5 sm:p-6">
            <h3 className="text-lg font-semibold text-text">{t('directionTitle')}</h3>
            <p className="mt-3 leading-relaxed text-mute">{t('directionBody')}</p>

            <div className="mt-4 space-y-4">
              <div>
                <p className="font-semibold text-text">1) {t('direction1')}</p>
                <RoadmapList items={[t('direction1Items.0'), t('direction1Items.1'), t('direction1Items.2'), t('direction1Items.3')]} />
              </div>
              <div>
                <p className="font-semibold text-text">2) {t('direction2')}</p>
                <RoadmapList items={[t('direction2Items.0'), t('direction2Items.1'), t('direction2Items.2'), t('direction2Items.3')]} />
              </div>
              <div>
                <p className="font-semibold text-text">3) {t('direction3')}</p>
                <RoadmapList items={[t('direction3Items.0'), t('direction3Items.1'), t('direction3Items.2'), t('direction3Items.3')]} />
              </div>
              <div>
                <p className="font-semibold text-text">4) {t('direction4')}</p>
                <RoadmapList items={[t('direction4Items.0'), t('direction4Items.1'), t('direction4Items.2')]} />
                <p className="mt-2 text-mute">{t('direction4Note')}</p>
              </div>
              <div>
                <p className="font-semibold text-text">5) {t('direction5')}</p>
                <RoadmapList items={[t('direction5Items.0'), t('direction5Items.1'), t('direction5Items.2'), t('direction5Items.3')]} />
              </div>
            </div>
            <p className="mt-4 leading-relaxed text-mute">{t('directionSummary')}</p>
          </div>

          <div className="panel p-5 sm:p-6">
            <h3 className="text-lg font-semibold text-text">{t('executionTitle')}</h3>
            <p className="mt-3 text-mute">{t('executionBody')}</p>

            <div className="mt-4 grid gap-4 lg:grid-cols-3">
              <div className="rounded-lg border border-line bg-bg/40 p-4">
                <p className="text-sm font-semibold text-accent">{t('now')}</p>
                <RoadmapList items={[t('nowItems.0'), t('nowItems.1'), t('nowItems.2')]} />
              </div>
              <div className="rounded-lg border border-line bg-bg/40 p-4">
                <p className="text-sm font-semibold text-accent">{t('next')}</p>
                <RoadmapList items={[t('nextItems.0'), t('nextItems.1'), t('nextItems.2')]} />
              </div>
              <div className="rounded-lg border border-line bg-bg/40 p-4">
                <p className="text-sm font-semibold text-accent">{t('later')}</p>
                <RoadmapList items={[t('laterItems.0'), t('laterItems.1'), t('laterItems.2')]} />
              </div>
            </div>
          </div>

          <div className="panel p-5 text-mute">
            <p>{t('disclaimer')}</p>
          </div>
        </div>
      </Section>
    </>
  );
}
