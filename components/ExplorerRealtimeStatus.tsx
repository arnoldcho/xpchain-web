'use client';

import { useEffect, useMemo, useState } from 'react';
import { formatDateTime } from '@/lib/format';
import type { ExplorerDbStatus } from '@/lib/explorer-db';
import type { NetworkStatus } from '@/lib/rpc';

type Props = {
  initialStatus: NetworkStatus;
  initialExplorerDbStatus: ExplorerDbStatus | null;
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

export function ExplorerRealtimeStatus({ initialStatus, initialExplorerDbStatus }: Props) {
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
            title: '점검',
            className: 'border-warn/50 bg-warn/10 text-warn',
            message: '실시간 RPC 데이터를 가져오지 못해 임시 데이터로 표시 중입니다. 노드/RPC 상태를 점검해 주세요.'
          }
        : lagSeconds > delayedThreshold || status.nodeHealth === 'degraded'
          ? {
              title: '지연',
              className: 'border-warn/50 bg-warn/10 text-warn',
              message: `최근 블록 반영이 지연되고 있습니다. 마지막 블록 기준 ${lagSeconds}초 경과.`
            }
          : {
              title: '정상',
              className: 'border-accent/50 bg-accent/10 text-accent',
              message: '익스플로러 동기화 상태가 정상입니다.'
            };

    return {
      banner: nextBanner,
      showDbIndexingBanner: isDbIndexing
    };
  }, [status, explorerDbStatus]);

  return (
    <>
      <div className={`rounded border px-3 py-2 ${banner.className}`}>
        <p className="font-semibold">
          상태: {banner.title} ({status.blockHeight.toLocaleString()})
        </p>
        <p className="mt-1">{banner.message}</p>
        <p className="mt-1 text-xs opacity-90">마지막 블록 시각: {formatDateTime(status.lastBlockTime)}</p>
      </div>

      {showDbIndexingBanner ? (
        <div className="rounded border border-warn/50 bg-warn/10 px-3 py-2 text-warn">
          <p className="font-semibold">안내: 익스플로러 DB 적재 진행 중</p>
          <p className="mt-1">
            노드 블록 {explorerDbStatus?.node_blockcount?.toLocaleString() ?? '-'} / DB 블록{' '}
            {explorerDbStatus?.db_blockcount?.toLocaleString() ?? '-'} (지연: {explorerDbStatus?.lag?.toLocaleString() ?? '-'})
          </p>
          <p className="mt-1 text-xs opacity-90">
            DB 마지막 갱신: {explorerDbStatus?.last_updated_date ? formatDateTime(explorerDbStatus.last_updated_date) : '-'}
          </p>
        </div>
      ) : null}
    </>
  );
}
