import { NextResponse } from 'next/server';
import { insertTrackEvent, type TrackEventCategory } from '@/lib/analytics-db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

type EventPayload = {
  category?: TrackEventCategory;
  eventKey?: string;
  targetUrl?: string;
  sourcePath?: string;
};

const ALLOWED_CATEGORIES = new Set<TrackEventCategory>(['wallet_download', 'explorer_outbound']);

function isSafePath(pathValue: string): boolean {
  return pathValue.startsWith('/') && !pathValue.startsWith('//');
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as EventPayload;
    const category = payload.category;
    const eventKey = payload.eventKey?.trim();
    const targetUrl = payload.targetUrl?.trim();
    const sourcePath = payload.sourcePath?.trim();

    if (!category || !ALLOWED_CATEGORIES.has(category)) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
    }
    if (!eventKey || eventKey.length > 120) {
      return NextResponse.json({ error: 'Invalid eventKey' }, { status: 400 });
    }
    if (!targetUrl || targetUrl.length > 500) {
      return NextResponse.json({ error: 'Invalid targetUrl' }, { status: 400 });
    }
    if (!sourcePath || !isSafePath(sourcePath) || sourcePath.length > 200) {
      return NextResponse.json({ error: 'Invalid sourcePath' }, { status: 400 });
    }

    await insertTrackEvent({
      category,
      eventKey,
      targetUrl,
      sourcePath
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[track-event] failed: ${message}`);
    return NextResponse.json({ error: 'Failed to store event' }, { status: 500 });
  }
}
