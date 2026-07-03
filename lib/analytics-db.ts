import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';

export type TrackEventCategory = 'wallet_download' | 'explorer_outbound';

export type TrackEventInput = {
  category: TrackEventCategory;
  eventKey: string;
  targetUrl: string;
  sourcePath: string;
};

export type TrackEventStatRow = {
  category: TrackEventCategory;
  eventKey: string;
  hits: number;
};

export type TrackDailyPoint = {
  date: string;
  wallet_download: number;
  explorer_outbound: number;
  total: number;
};

export type TrackAnalytics = {
  periodDays: number;
  rows: TrackEventStatRow[];
  daily: TrackDailyPoint[];
  totals: { total: number; wallet_download: number; explorer_outbound: number };
  topEvent: TrackEventStatRow | null;
};

export const CATEGORY_LABELS: Record<TrackEventCategory, string> = {
  wallet_download: '지갑/다운로드',
  explorer_outbound: '익스플로러 이동'
};

export const EVENT_LABELS: Record<string, string> = {
  wallet_qt_win64: 'Qt Wallet Windows 64bit',
  wallet_qt_win32: 'Qt Wallet Windows 32bit',
  wallet_qt_macos_dmg: 'Qt Wallet macOS dmg',
  wallet_qt_linux_x64: 'Qt Wallet Linux x86_64',
  wallet_release_v01704: 'Release v0.17.0-4',
  wallet_release_stable_legacy: 'Release Stable Legacy',
  wallet_web: 'Web Wallet',
  wallet_chrome_extension: 'Chrome Extension',
  explorer_primary: 'Explorer Primary',
  explorer_fallback: 'Explorer Fallback'
};

// 각 eventKey가 속한 카테고리 화이트리스트.
// 스캐너 봇이 임의 키(SQLi 탐침 문자열 등)를 넣어 통계를 오염시키지 못하도록
// 알려진 키만 기록/집계 대상으로 허용한다.
export const EVENT_KEY_CATEGORY: Record<string, TrackEventCategory> = {
  wallet_qt_win64: 'wallet_download',
  wallet_qt_win32: 'wallet_download',
  wallet_qt_macos_dmg: 'wallet_download',
  wallet_qt_linux_x64: 'wallet_download',
  wallet_release_v01704: 'wallet_download',
  wallet_release_stable_legacy: 'wallet_download',
  wallet_web: 'wallet_download',
  wallet_chrome_extension: 'wallet_download',
  explorer_primary: 'explorer_outbound',
  explorer_fallback: 'explorer_outbound'
};

export function isKnownEventKey(category: TrackEventCategory, eventKey: string): boolean {
  return EVENT_KEY_CATEGORY[eventKey] === category;
}

const DB_PATH = process.env.XPCHAIN_ANALYTICS_DB_PATH ?? path.join(process.cwd(), 'data', 'analytics-events.jsonl');
const DAY_MS = 24 * 60 * 60 * 1000;
const KST_OFFSET_MS = 9 * 60 * 60 * 1000;
type EventLogRecord = TrackEventInput & { createdAt: string };

function normalizeDays(days: number): number {
  return Number.isFinite(days) ? Math.max(1, Math.min(365, Math.floor(days))) : 30;
}

// createdAt(UTC) → KST(+9) 기준 YYYY-MM-DD. 일별 버킷 라벨용.
function kstDateString(ms: number): string {
  return new Date(ms + KST_OFFSET_MS).toISOString().slice(0, 10);
}

let initPromise: Promise<void> | null = null;

function ensureDbDirectory() {
  const dbDir = path.dirname(DB_PATH);
  fs.mkdirSync(dbDir, { recursive: true });
}

async function appendRecord(record: EventLogRecord): Promise<void> {
  ensureDbDirectory();
  await fs.promises.appendFile(DB_PATH, `${JSON.stringify(record)}\n`, 'utf8');
}

export async function initAnalyticsDb(): Promise<void> {
  if (initPromise) {
    return initPromise;
  }

  initPromise = (async () => {
    ensureDbDirectory();
    if (!fs.existsSync(DB_PATH)) {
      await fs.promises.writeFile(DB_PATH, '', 'utf8');
    }
  })();

  return initPromise;
}

export async function insertTrackEvent(input: TrackEventInput): Promise<void> {
  await initAnalyticsDb();
  await appendRecord({
    ...input,
    createdAt: new Date().toISOString()
  });
}

// 파일을 한 번만 스캔해 이벤트별 집계 + 일별 추이 + 요약을 함께 반환한다.
// 알려진 eventKey만 카운트하므로 봇이 남긴 오염 데이터는 자동 제외된다.
export async function getTrackEventAnalytics(days = 30): Promise<TrackAnalytics> {
  await initAnalyticsDb();
  const safeDays = normalizeDays(days);
  const nowMs = Date.now();
  const thresholdMs = nowMs - safeDays * DAY_MS;

  const counts = new Map<string, TrackEventStatRow>();
  const totals = { total: 0, wallet_download: 0, explorer_outbound: 0 };

  // 기간 내 모든 날짜를 0으로 미리 채워 빈 날도 차트에 표시되게 한다.
  const dayMap = new Map<string, TrackDailyPoint>();
  for (let i = safeDays - 1; i >= 0; i -= 1) {
    const date = kstDateString(nowMs - i * DAY_MS);
    dayMap.set(date, { date, wallet_download: 0, explorer_outbound: 0, total: 0 });
  }

  if (fs.existsSync(DB_PATH)) {
    const stream = fs.createReadStream(DB_PATH, { encoding: 'utf8' });
    const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });

    for await (const line of rl) {
      if (!line.trim()) continue;
      let record: EventLogRecord;
      try {
        record = JSON.parse(line) as EventLogRecord;
      } catch {
        continue;
      }
      if (!isKnownEventKey(record.category, record.eventKey)) continue;
      const createdAt = new Date(record.createdAt).getTime();
      if (!Number.isFinite(createdAt) || createdAt < thresholdMs) continue;

      const key = `${record.category}::${record.eventKey}`;
      const existing = counts.get(key);
      if (existing) {
        existing.hits += 1;
      } else {
        counts.set(key, { category: record.category, eventKey: record.eventKey, hits: 1 });
      }

      totals.total += 1;
      totals[record.category] += 1;

      const point = dayMap.get(kstDateString(createdAt));
      if (point) {
        point[record.category] += 1;
        point.total += 1;
      }
    }
  }

  const rows = Array.from(counts.values()).sort(
    (a, b) => b.hits - a.hits || a.category.localeCompare(b.category) || a.eventKey.localeCompare(b.eventKey)
  );

  return {
    periodDays: safeDays,
    rows,
    daily: Array.from(dayMap.values()),
    totals,
    topEvent: rows[0] ?? null
  };
}

export async function getTrackEventStats(days = 30): Promise<TrackEventStatRow[]> {
  return (await getTrackEventAnalytics(days)).rows;
}
