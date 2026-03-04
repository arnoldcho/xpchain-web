import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Section } from '@/components/Section';
import { ExplorerRealtimeStatus } from '@/components/ExplorerRealtimeStatus';
import { TrackedLink } from '@/components/TrackedLink';
import { getExplorerDbStatus } from '@/lib/explorer-db';
import { localeToBCP47, type Locale } from '@/lib/i18n/locales';
import { links } from '@/lib/links';
import { getNetworkStatus } from '@/lib/rpc';
import { buildAlternates, buildLocalePath } from '@/lib/seo';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale, namespace: 'explorer' });
  return {
    title: t('title'),
    description: t('subtitle'),
    alternates: {
      canonical: buildLocalePath(locale, '/explorer'),
      languages: buildAlternates('/explorer')
    }
  };
}

export default async function LocalizedExplorerPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'explorer' });
  const [status, explorerDbStatus] = await Promise.all([getNetworkStatus(), getExplorerDbStatus()]);

  return (
    <>
      <h1 className="sr-only">{t('srTitle')}</h1>
      <Section title={t('title')} subtitle={t('subtitle')}>
        <div className="panel space-y-3 p-5 text-sm">
          <ExplorerRealtimeStatus
            initialStatus={status}
            initialExplorerDbStatus={explorerDbStatus}
            dateTimeLocale={localeToBCP47[locale]}
            labels={{
              inspectTitle: t('status.inspectTitle'),
              inspectMessage: t('status.inspectMessage'),
              delayedTitle: t('status.delayedTitle'),
              delayedMessage: t('status.delayedMessage'),
              healthyTitle: t('status.healthyTitle'),
              healthyMessage: t('status.healthyMessage'),
              statusPrefix: t('status.statusPrefix'),
              lastBlockTimeLabel: t('status.lastBlockTimeLabel'),
              dbSyncTitle: t('status.dbSyncTitle'),
              dbNodeBlocksLabel: t('status.dbNodeBlocksLabel'),
              dbBlocksLabel: t('status.dbBlocksLabel'),
              dbLagLabel: t('status.dbLagLabel'),
              dbLastUpdatedLabel: t('status.dbLastUpdatedLabel')
            }}
          />
          <p>
            {t('primary')}:{' '}
            <TrackedLink
              href={links.explorerPrimary}
              target="_blank"
              className="text-accent"
              category="explorer_outbound"
              eventKey="explorer_primary"
              sourcePath={`/${locale}/explorer`}
            >
              explorer.xpchain.co.kr
            </TrackedLink>
          </p>
          <p>
            {t('fallback')}:{' '}
            <TrackedLink
              href={links.explorerFallback}
              target="_blank"
              className="text-accent"
              category="explorer_outbound"
              eventKey="explorer_fallback"
              sourcePath={`/${locale}/explorer`}
            >
              scan.xpchain.co.kr
            </TrackedLink>
          </p>
          <p className="text-mute">{t('dataRef')}</p>
        </div>
      </Section>
    </>
  );
}
