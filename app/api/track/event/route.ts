import { NextResponse } from 'next/server';
import { insertTrackEvent, isKnownEventKey, type TrackEventCategory } from '@/lib/analytics-db';
import { clientIp, isAllowedOrigin, isBotUserAgent, isRateLimited } from '@/lib/track-guard';

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
    // 1. 동일 출처(우리 도메인)에서 온 요청만 허용 — 외부 스크립트의 대량 POST 차단.
    if (!isAllowedOrigin(request.headers.get('origin'), request.headers.get('referer'))) {
      return NextResponse.json({ error: 'Forbidden origin' }, { status: 403 });
    }
    // 2. 봇/자동화 도구 User-Agent 차단.
    if (isBotUserAgent(request.headers.get('user-agent'))) {
      return NextResponse.json({ error: 'Bot blocked' }, { status: 403 });
    }
    // 3. IP당 레이트 리밋 — 짧은 시간 대량 스팸 차단.
    if (isRateLimited(clientIp(request.headers.get('x-forwarded-for')))) {
      return NextResponse.json({ error: 'Rate limited' }, { status: 429 });
    }

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
    // 알려진 이벤트 키만 허용 — 스캐너 봇의 임의 키 주입으로 통계가 오염되는 것을 원천 차단.
    if (!isKnownEventKey(category, eventKey)) {
      return NextResponse.json({ error: 'Unknown eventKey' }, { status: 400 });
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
