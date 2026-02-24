import { unstable_cache } from 'next/cache';
import { Section } from '@/components/Section';
import { links } from '@/lib/links';
import { formatDateTime } from '@/lib/format';
import { getNetworkStatus } from '@/lib/rpc';

type ExplorerDbStatus = {
  status: 'ready' | 'indexing' | 'syncing' | 'unknown';
  db_blockcount?: number;
  node_blockcount?: number;
  lag?: number;
  last_updated_date?: string | null;
};

const DEFAULT_EXPLORER_DB_CACHE_SECONDS = 300;
const parsedExplorerDbCacheSeconds = Number(process.env.EXPLORER_DB_STATUS_CACHE_SECONDS ?? DEFAULT_EXPLORER_DB_CACHE_SECONDS);
const EXPLORER_DB_STATUS_CACHE_SECONDS = Math.max(
  30,
  Number.isFinite(parsedExplorerDbCacheSeconds) ? parsedExplorerDbCacheSeconds : DEFAULT_EXPLORER_DB_CACHE_SECONDS
);

async function getExplorerDbStatusUncached(): Promise<ExplorerDbStatus | null> {
  const url = process.env.EXPLORER_DB_STATUS_URL ?? `${links.explorerPrimary}ext/getdbstatus`;
  const timeoutMs = Number(process.env.EXPLORER_DB_STATUS_TIMEOUT_MS ?? '4000');
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { cache: 'no-store', signal: controller.signal });
    if (!response.ok) {
      return null;
    }
    const data = (await response.json()) as ExplorerDbStatus;
    if (!data || typeof data.status !== 'string') {
      return null;
    }
    return data;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

const getExplorerDbStatus = unstable_cache(
  async () => getExplorerDbStatusUncached(),
  ['explorer-db-status'],
  { revalidate: EXPLORER_DB_STATUS_CACHE_SECONDS }
);

export default async function ExplorerPage() {
  const [status, explorerDbStatus] = await Promise.all([getNetworkStatus(), getExplorerDbStatus()]);
  const nowMs = Date.now();
  const lastBlockMs = new Date(status.lastBlockTime).getTime();
  const lagSeconds = Number.isFinite(lastBlockMs) ? Math.max(0, Math.floor((nowMs - lastBlockMs) / 1000)) : 9999;
  const delayedThreshold = Math.max(180, Math.floor(status.avgBlockTimeLast60 * 4));

  const banner =
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
  const showDbIndexingBanner =
    explorerDbStatus != null && (explorerDbStatus.status === 'indexing' || explorerDbStatus.status === 'syncing');

  return (
    <Section title="익스플로러" subtitle="체인 조회용 기본/백업 엔드포인트를 제공합니다.">
      <div className="panel space-y-3 p-5 text-sm">
        <div className={`rounded border px-3 py-2 ${banner.className}`}>
          <p className="font-semibold">상태: {banner.title}</p>
          <p className="mt-1">{banner.message}</p>
          <p className="mt-1 text-xs opacity-90">마지막 블록 시각: {formatDateTime(status.lastBlockTime)}</p>
        </div>
        {showDbIndexingBanner ? (
          <div className="rounded border border-warn/50 bg-warn/10 px-3 py-2 text-warn">
            <p className="font-semibold">안내: 익스플로러 DB 적재 진행 중</p>
            <p className="mt-1">
              노드 블록 {explorerDbStatus?.node_blockcount?.toLocaleString() ?? '-'} / DB 블록{' '}
              {explorerDbStatus?.db_blockcount?.toLocaleString() ?? '-'} (지연:{' '}
              {explorerDbStatus?.lag?.toLocaleString() ?? '-'})
            </p>
            <p className="mt-1 text-xs opacity-90">
              DB 마지막 갱신: {explorerDbStatus?.last_updated_date ? formatDateTime(explorerDbStatus.last_updated_date) : '-'}
            </p>
          </div>
        ) : null}
        <p>
          기본: <a href={links.explorerPrimary} target="_blank" rel="noreferrer" className="text-accent">explorer.xpchain.co.kr</a>
        </p>
        <p>
          백업: <a href={links.explorerFallback} target="_blank" rel="noreferrer" className="text-accent">scan.xpchain.co.kr</a>
        </p>
        <p className="text-mute">데이터 기준: /api/status (최대 5분 캐시, 최근 블록 시각/평균 블록 간격/노드 상태)</p>
      </div>
    </Section>
  );
}
