import { unstable_cache } from 'next/cache';
import { NextResponse } from 'next/server';
import { getExplorerDbStatusUncached } from '@/lib/explorer-db';
import { getLiveNetworkStatus } from '@/lib/rpc';

export const revalidate = 0;

const DEFAULT_EXPLORER_LIVE_CACHE_SECONDS = 10;
const parsedExplorerLiveCacheSeconds = Number(
  process.env.EXPLORER_LIVE_STATUS_CACHE_SECONDS ?? DEFAULT_EXPLORER_LIVE_CACHE_SECONDS
);
const EXPLORER_LIVE_CACHE_SECONDS = Math.max(
  2,
  Number.isFinite(parsedExplorerLiveCacheSeconds)
    ? parsedExplorerLiveCacheSeconds
    : DEFAULT_EXPLORER_LIVE_CACHE_SECONDS
);

const getCachedExplorerLivePayload = unstable_cache(
  async () => {
    const [status, explorerDbStatus] = await Promise.all([getLiveNetworkStatus(), getExplorerDbStatusUncached()]);
    return { status, explorerDbStatus };
  },
  ['explorer-live-status'],
  { revalidate: EXPLORER_LIVE_CACHE_SECONDS }
);

export async function GET() {
  const data = await getCachedExplorerLivePayload();

  return NextResponse.json(
    data,
    {
      status: 200,
      headers: {
        'Cache-Control': `s-maxage=${EXPLORER_LIVE_CACHE_SECONDS}, stale-while-revalidate=15`
      }
    }
  );
}
