// 추적 이벤트 엔드포인트(/api/track/event) 스팸·봇 방어.
// 실제 브라우저에서 발생한 클릭 비콘만 통과시키고,
// 크롤러·헤드리스·외부 스크립트의 대량 POST를 차단한다.
//
// 방어 3중:
//   1) 동일 출처(Origin/Referer)가 우리 도메인일 때만 허용
//   2) 봇/자동화 도구 User-Agent 차단
//   3) IP당 레이트 리밋 (pm2 단일 인스턴스 기준 인메모리)

// 허용 도메인 접미사. 서브도메인(www, wallet 등)까지 포함.
const ALLOWED_ORIGIN_SUFFIX = process.env.TRACKING_ALLOWED_ORIGIN_SUFFIX ?? 'xpchain.co.kr';

// 대표적인 크롤러·자동화 클라이언트. 빈/짧은 UA도 봇으로 간주.
const BOT_UA_PATTERN =
  /bot|crawler|spider|slurp|yandex|baidu|duckduck|facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegram|discord|applebot|petalbot|ahrefs|semrush|mj12|dotbot|headless|phantom|puppeteer|playwright|lighthouse|gpt|preview|fetch|curl|wget|python-requests|go-http|okhttp|java\/|libwww|scrapy|httpclient/i;

function hostOf(value: string | null): string | null {
  if (!value) return null;
  try {
    return new URL(value).hostname;
  } catch {
    return null;
  }
}

export function isBotUserAgent(userAgent: string | null): boolean {
  if (!userAgent || userAgent.trim().length < 8) return true;
  return BOT_UA_PATTERN.test(userAgent);
}

export function isAllowedOrigin(origin: string | null, referer: string | null): boolean {
  const host = hostOf(origin) ?? hostOf(referer);
  if (!host) return false;
  return host === ALLOWED_ORIGIN_SUFFIX || host.endsWith(`.${ALLOWED_ORIGIN_SUFFIX}`);
}

export function clientIp(forwardedFor: string | null): string {
  if (!forwardedFor) return 'unknown';
  return forwardedFor.split(',')[0]?.trim() || 'unknown';
}

// 고정 윈도우 레이트 리밋 — IP당 60초에 RATE_MAX회.
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 30;
type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export function isRateLimited(ip: string, now: number = Date.now()): boolean {
  // 만료된 버킷이 쌓이면 정리 (메모리 누수 방지)
  if (buckets.size > 5000) {
    for (const [key, bucket] of buckets) {
      if (bucket.resetAt <= now) buckets.delete(key);
    }
  }

  const existing = buckets.get(ip);
  if (!existing || existing.resetAt <= now) {
    buckets.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }

  existing.count += 1;
  return existing.count > RATE_MAX;
}
