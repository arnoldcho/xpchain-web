import { NextResponse } from 'next/server';
import { getTrackEventStats } from '@/lib/analytics-db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const daysParam = Number(url.searchParams.get('days') ?? '30');
    const token = url.searchParams.get('token');
    const expectedToken = process.env.TRACKING_STATS_TOKEN;

    if (expectedToken && token !== expectedToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const stats = await getTrackEventStats(daysParam);
    return NextResponse.json(
      {
        periodDays: Number.isFinite(daysParam) ? Math.max(1, Math.min(365, Math.floor(daysParam))) : 30,
        stats
      },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[track-stats] failed: ${message}`);
    return NextResponse.json({ error: 'Failed to load stats' }, { status: 500 });
  }
}
