import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Section } from '@/components/Section';
import { StatusCard } from '@/components/StatusCard';
import { Link } from '@/i18n/navigation';
import { formatNumber, formatSeconds } from '@/lib/format';
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
  const t = await getTranslations({ locale: locale, namespace: 'metadata' });
  return {
    title: t('siteTitle'),
    description: t('siteDescription'),
    alternates: {
      canonical: buildLocalePath(locale, ''),
      languages: buildAlternates('')
    }
  };
}

export default async function LocalizedHomePage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }
  const t = await getTranslations({ locale, namespace: 'home' });
  const status = await getNetworkStatus();

  const healthLabel = status.nodeHealth === 'healthy' ? t('status.healthy') : t('status.degraded');
  const dataSourceLabel = status.dataSource === 'rpc' ? t('rpcSource') : t('fallbackSource');
  const numberLocale = localeToBCP47[locale];
  const secondsUnit = locale === 'en' ? 's' : locale === 'ja' ? '秒' : '초';

  return (
    <>
      <section className="container-width pt-16">
        <div className="panel px-6 py-10 sm:px-10">
          <p className="text-sm tracking-wider text-accent">{t('eyebrow')}</p>
          <h1 className="mt-4 text-4xl font-semibold leading-[1.28] text-text sm:text-5xl">
            {t('titleLine1')}
            <br />
            {t('titleLine2')}
          </h1>
          <p className="mt-4 max-w-2xl text-mute">{t('description')}</p>
          <p className="mt-3 text-xs text-mute">
            {t('statusDataSource')}: {dataSourceLabel}
          </p>
          <div className="mt-8 flex flex-wrap gap-3 text-sm">
            <Link href="/network" className="rounded-md bg-accent px-4 py-2 font-medium text-bg">
              {t('ctaNetwork')}
            </Link>
            <Link href="/staking" className="rounded-md border border-line px-4 py-2 text-text">
              {t('ctaStaking')}
            </Link>
            <Link href="/wallets" className="rounded-md border border-line px-4 py-2 text-text">
              {t('ctaWallets')}
            </Link>
          </div>
        </div>
      </section>

      <Section title={t('snapshotTitle')} subtitle={t('snapshotSubtitle')}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatusCard label={t('status.blockHeight')} value={formatNumber(status.blockHeight, numberLocale)} />
          <StatusCard label={t('status.connections')} value={formatNumber(status.connections, numberLocale)} />
          <StatusCard label={t('status.avgBlockTime')} value={formatSeconds(status.avgBlockTimeLast60, secondsUnit)} />
          <StatusCard label={t('status.nodeHealth')} value={healthLabel} />
        </div>
      </Section>

      <Section title={t('showcaseTitle')} subtitle={t('showcaseSubtitle')}>
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
