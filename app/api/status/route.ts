import { NextResponse } from 'next/server';
import { getNetworkStatus, NETWORK_STATUS_CACHE_SECONDS } from '@/lib/rpc';

export const dynamic = 'force-dynamic';

export async function GET() {
  const data = await getNetworkStatus();
  return NextResponse.json(data, {
    status: 200,
    headers: {
      'Cache-Control': `s-maxage=${NETWORK_STATUS_CACHE_SECONDS}, stale-while-revalidate=60`
    }
  });
}
