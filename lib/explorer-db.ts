import { unstable_cache } from 'next/cache';
import { links } from '@/lib/links';

export type ExplorerDbStatus = {
  status: 'ready' | 'indexing' | 'syncing' | 'unknown';
  db_blockcount?: number;
  node_blockcount?: number;
  lag?: number;
  last_updated_date?: string | null;
};

const DEFAULT_EXPLORER_DB_CACHE_SECONDS = 300;
const parsedExplorerDbCacheSeconds = Number(process.env.EXPLORER_DB_STATUS_CACHE_SECONDS ?? DEFAULT_EXPLORER_DB_CACHE_SECONDS);
export const EXPLORER_DB_STATUS_CACHE_SECONDS = Math.max(
  30,
  Number.isFinite(parsedExplorerDbCacheSeconds) ? parsedExplorerDbCacheSeconds : DEFAULT_EXPLORER_DB_CACHE_SECONDS
);

function normalizeLastUpdatedDate(value: unknown): string | null {
  if (value == null) {
    return null;
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    const ms = value < 1_000_000_000_000 ? value * 1000 : value;
    return new Date(ms).toISOString();
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) {
      return null;
    }

    // ext/getdbstatus may return unix seconds as numeric string.
    if (/^\d+$/.test(trimmed)) {
      const numeric = Number(trimmed);
      if (Number.isFinite(numeric)) {
        const ms = numeric < 1_000_000_000_000 ? numeric * 1000 : numeric;
        return new Date(ms).toISOString();
      }
    }

    const parsed = new Date(trimmed);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toISOString();
    }
  }

  return null;
}

function normalizeExplorerDbStatus(data: ExplorerDbStatus): ExplorerDbStatus {
  return {
    ...data,
    last_updated_date: normalizeLastUpdatedDate((data as ExplorerDbStatus & { last_updated_date?: unknown }).last_updated_date)
  };
}

export async function getExplorerDbStatusUncached(): Promise<ExplorerDbStatus | null> {
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
    return normalizeExplorerDbStatus(data);
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

const getCachedExplorerDbStatus = unstable_cache(
  async () => getExplorerDbStatusUncached(),
  ['explorer-db-status'],
  { revalidate: EXPLORER_DB_STATUS_CACHE_SECONDS }
);

export async function getExplorerDbStatus(): Promise<ExplorerDbStatus | null> {
  return getCachedExplorerDbStatus();
}
