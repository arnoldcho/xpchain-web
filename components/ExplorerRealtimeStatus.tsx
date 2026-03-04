'use client';

import { useEffect, useMemo, useState } from 'react';
import { formatDateTime } from '@/lib/format';
import type { ExplorerDbStatus } from '@/lib/explorer-db';
import type { NetworkStatus } from '@/lib/rpc';

type Props = {
  initialStatus: NetworkStatus;
  initialExplorerDbStatus: ExplorerDbStatus | null;
  labels?: {
    inspectTitle: string;
    inspectMessage: string;
    delayedTitle: string;
    delayedMessage: string;
    healthyTitle: string;
    healthyMessage: string;
    statusPrefix: string;
    lastBlockTimeLabel: string;
    dbSyncTitle: string;
    dbNodeBlocksLabel: string;
    dbBlocksLabel: string;
    dbLagLabel: string;
    dbLastUpdatedLabel: string;
  };
  dateTimeLocale?: string;
};

const REFRESH_INTERVAL_MS = 60000;
const MIN_REFRESH_GAP_MS = 5000;
const BLOCK_LAG_ALERT_THRESHOLD = 2;
const TIME_LAG_ALERT_MIN_SECONDS = 300;

type LiveExplorerPayload = {
  status: NetworkStatus;
  explorerDbStatus: ExplorerDbStatus | null;
};

let lastLiveFetchAt = 0;
let inflightLiveFetch: Promise<LiveExplorerPayload | null> | null = null;

function shouldRefreshImmediately(status: NetworkStatus, explorerDbStatus: ExplorerDbStatus | null) {
  const isRpcStale = status.dataSource !== 'rpc' || status.nodeHealth === 'degraded';
  const dbLag = explorerDbStatus?.lag ?? 0;
  const isDbIndexing =
    explorerDbStatus != null &&
    (explorerDbStatus.status === 'indexing' || explorerDbStatus.status === 'syncing') &&
    dbLag > BLOCK_LAG_ALERT_THRESHOLD;
  return isRpcStale || isDbIndexing;
}

async function fetchLiveExplorerPayload(): Promise<LiveExplorerPayload | null> {
  const now = Date.now();
  if (inflightLiveFetch) {
    return inflightLiveFetch;
  }
  if (now - lastLiveFetchAt < MIN_REFRESH_GAP_MS) {
    return null;
  }

  inflightLiveFetch = (async () => {
    try {
      const response = await fetch('/api/explorer/live', { cache: 'no-store' });
      if (!response.ok) {
        return null;
      }
      const payload = (await response.json()) as LiveExplorerPayload;
      if (!payload || !payload.status) {
        return null;
      }
      return payload;
    } catch {
      return null;
    } finally {
      lastLiveFetchAt = Date.now();
      inflightLiveFetch = null;
    }
  })();

  return inflightLiveFetch;
}

const defaultLabels = {
    inspectTitle: '점검',
    inspectMessage: '실시간 RPC 데이터를 가져오지 못해 임시 데이터로 표시 중입니다. 노드/RPC 상태를 점검해 주세요.',
    delayedTitle: '지연',
    delayedMessage: '최근 블록 반영이 지연되고 있습니다. 마지막 블록 기준 {lagSeconds}초 경과.',
    healthyTitle: '정상',
    healthyMessage: '익스플로러 동기화 상태가 정상입니다.',
    statusPrefix: '상태',
    lastBlockTimeLabel: '마지막 블록 시각',
    dbSyncTitle: '안내: 익스플로러 DB 적재 진행 중',
    dbNodeBlocksLabel: '노드 블록',
    dbBlocksLabel: 'DB 블록',
    dbLagLabel: '지연',
    dbLastUpdatedLabel: 'DB 마지막 갱신'
  };

export function ExplorerRealtimeStatus({
  initialStatus,
  initialExplorerDbStatus,
  labels = defaultLabels,
  dateTimeLocale = 'ko-KR'
}: Props) {
  const [status, setStatus] = useState<NetworkStatus>(initialStatus);
  const [explorerDbStatus, setExplorerDbStatus] = useState<ExplorerDbStatus | null>(initialExplorerDbStatus);

  useEffect(() => {
    let mounted = true;

    const refresh = async () => {
      if (typeof document !== 'undefined' && document.visibilityState !== 'visible') {
        return;
      }
      const payload = await fetchLiveExplorerPayload();
      if (!payload || !mounted) return;
      setStatus(payload.status);
      setExplorerDbStatus(payload.explorerDbStatus);
    };

    if (shouldRefreshImmediately(initialStatus, initialExplorerDbStatus)) {
      refresh();
    }

    const timer = setInterval(refresh, REFRESH_INTERVAL_MS);
    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, [initialExplorerDbStatus, initialStatus]);

  const { banner, showDbIndexingBanner } = useMemo(() => {
    const nowMs = Date.now();
    const lastBlockMs = new Date(status.lastBlockTime).getTime();
    const lagSeconds = Number.isFinite(lastBlockMs) ? Math.max(0, Math.floor((nowMs - lastBlockMs) / 1000)) : 9999;
    const delayedThreshold = Math.max(TIME_LAG_ALERT_MIN_SECONDS, Math.floor(status.avgBlockTimeLast60 * 4));
    const dbLag = explorerDbStatus?.lag ?? 0;
    const isDbIndexing =
      explorerDbStatus != null &&
      (explorerDbStatus.status === 'indexing' || explorerDbStatus.status === 'syncing') &&
      dbLag > BLOCK_LAG_ALERT_THRESHOLD;

    const nextBanner =
      status.dataSource !== 'rpc'
        ? {
            title: labels.inspectTitle,
            className: 'border-warn/50 bg-warn/10 text-warn',
            message: labels.inspectMessage
          }
        : lagSeconds > delayedThreshold || status.nodeHealth === 'degraded'
          ? {
              title: labels.delayedTitle,
              className: 'border-warn/50 bg-warn/10 text-warn',
              message: labels.delayedMessage
                .replace('{lagSeconds}', String(lagSeconds))
                .replace('__LAG_SECONDS__', String(lagSeconds))
            }
          : {
              title: labels.healthyTitle,
              className: 'border-accent/50 bg-accent/10 text-accent',
              message: labels.healthyMessage
            };

    return {
      banner: nextBanner,
      showDbIndexingBanner: isDbIndexing
    };
  }, [labels, status, explorerDbStatus]);

  return (
    <>
      <div className={`rounded border px-3 py-2 ${banner.className}`}>
        <p className="font-semibold">
          {labels.statusPrefix}: {banner.title} ({status.blockHeight.toLocaleString()})
        </p>
        <p className="mt-1">{banner.message}</p>
        <p className="mt-1 text-xs opacity-90">
          {labels.lastBlockTimeLabel}: {formatDateTime(status.lastBlockTime, { locale: dateTimeLocale })}
        </p>
      </div>

      {showDbIndexingBanner ? (
        <div className="rounded border border-warn/50 bg-warn/10 px-3 py-2 text-warn">
          <p className="font-semibold">{labels.dbSyncTitle}</p>
          <p className="mt-1">
            {labels.dbNodeBlocksLabel} {explorerDbStatus?.node_blockcount?.toLocaleString() ?? '-'} / {labels.dbBlocksLabel}{' '}
            {explorerDbStatus?.db_blockcount?.toLocaleString() ?? '-'} ({labels.dbLagLabel}:{' '}
            {explorerDbStatus?.lag?.toLocaleString() ?? '-'})
          </p>
          <p className="mt-1 text-xs opacity-90">
            {labels.dbLastUpdatedLabel}:{' '}
            {explorerDbStatus?.last_updated_date
              ? formatDateTime(explorerDbStatus.last_updated_date, { locale: dateTimeLocale })
              : '-'}
          </p>
        </div>
      ) : null}
    </>
  );
}
