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

const DB_PATH = process.env.XPCHAIN_ANALYTICS_DB_PATH ?? path.join(process.cwd(), 'data', 'analytics-events.jsonl');
type EventLogRecord = TrackEventInput & { createdAt: string };

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

export async function getTrackEventStats(days = 30): Promise<TrackEventStatRow[]> {
  await initAnalyticsDb();
  const safeDays = Number.isFinite(days) ? Math.max(1, Math.min(365, Math.floor(days))) : 30;
  const thresholdMs = Date.now() - safeDays * 24 * 60 * 60 * 1000;
  const counts = new Map<string, TrackEventStatRow>();

  if (!fs.existsSync(DB_PATH)) {
    return [];
  }

  const stream = fs.createReadStream(DB_PATH, { encoding: 'utf8' });
  const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });

  for await (const line of rl) {
    if (!line.trim()) continue;
    try {
      const record = JSON.parse(line) as EventLogRecord;
      const createdAt = new Date(record.createdAt).getTime();
      if (!Number.isFinite(createdAt) || createdAt < thresholdMs) continue;
      const key = `${record.category}::${record.eventKey}`;
      const existing = counts.get(key);
      if (existing) {
        existing.hits += 1;
      } else {
        counts.set(key, { category: record.category, eventKey: record.eventKey, hits: 1 });
      }
    } catch {
      continue;
    }
  }

  return Array.from(counts.values()).sort(
    (a, b) => b.hits - a.hits || a.category.localeCompare(b.category) || a.eventKey.localeCompare(b.eventKey)
  );
}
