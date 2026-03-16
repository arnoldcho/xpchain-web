import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { NetworkChart } from '@/components/NetworkChart';
import { Section } from '@/components/Section';
import { StatusCard } from '@/components/StatusCard';
import { formatDateTime, formatNumber, formatPercent, formatSeconds } from '@/lib/format';
import { isLocale, localeToBCP47 } from '@/lib/i18n/locales';
import { getNetworkStatus } from '@/lib/rpc';
import { buildAlternates, buildLocalePath } from '@/lib/seo';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) {
    return {};
  }
  const t = await getTranslations({ locale: locale, namespace: 'network' });
  return {
    title: t('title'),
    description: t('subtitle'),
    alternates: {
      canonical: buildLocalePath(locale, '/network'),
      languages: buildAlternates('/network')
    }
  };
}

export default async function LocalizedNetworkPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }
  const t = await getTranslations({ locale, namespace: 'network' });
  const status = await getNetworkStatus();
  const sourceLabel = status.dataSource === 'rpc' ? t('rpcSource') : t('fallbackSource');
  const dateLocale = localeToBCP47[locale];
  const secondsUnit = t('secondsUnit');

  return (
    <>
      <h1 className="sr-only">{t('srTitle')}</h1>
      <Section title={t('title')} subtitle={t('subtitle')}>
        <div className="mb-4 flex flex-wrap gap-2 text-xs">
          <span className="rounded border border-line px-2 py-1 text-mute">
            {t('dataSource')}: {sourceLabel}
          </span>
          <span className="rounded border border-line px-2 py-1 text-mute">
            {t('updatedAt')}: {formatDateTime(status.generatedAt, { locale: dateLocale })}
          </span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          <StatusCard label={t('cards.currentBlock')} value={formatNumber(status.blockHeight, dateLocale)} />
          <StatusCard label={t('cards.avgBlockTime')} value={formatSeconds(status.avgBlockTimeLast60, secondsUnit)} />
          <StatusCard label={t('cards.peers')} value={formatNumber(status.peersCount, dateLocale)} />
          <StatusCard
            label={t('cards.lastBlockTime')}
            value={formatDateTime(status.lastBlockTime, { locale: dateLocale })}
            valueClassName="text-lg whitespace-nowrap"
          />
          <StatusCard
            label={t('cards.stakingEstimate')}
            value={formatPercent(status.stakingParticipationEstimate, dateLocale)}
            hint={`${t('cards.protocol')} ${status.protocolVersion ?? '-'}`}
          />
        </div>
      </Section>

      <Section title={t('chartTitle')} subtitle={t('chartSubtitle')}>
        <NetworkChart
          points={status.recentBlockIntervals}
          caption={t('chartCaption')}
          secondsUnitLabel={secondsUnit}
        />
      </Section>

      <Section title={t('participationTitle')} subtitle={t('participationSubtitle')}>
        <div className="panel p-5 text-sm text-mute">
          <p>{t('participationBody')}</p>
        </div>
      </Section>
    </>
  );
}
