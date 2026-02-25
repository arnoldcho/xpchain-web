import fs from 'node:fs';
import path from 'node:path';
import sqlite3 from 'sqlite3';

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

const DB_PATH = process.env.XPCHAIN_ANALYTICS_DB_PATH ?? path.join(process.cwd(), 'data', 'analytics.sqlite3');

let dbPromise: Promise<sqlite3.Database> | null = null;
let initPromise: Promise<void> | null = null;

function ensureDbDirectory() {
  const dbDir = path.dirname(DB_PATH);
  fs.mkdirSync(dbDir, { recursive: true });
}

function openDatabase(): Promise<sqlite3.Database> {
  if (dbPromise) {
    return dbPromise;
  }

  ensureDbDirectory();

  dbPromise = new Promise((resolve, reject) => {
    const db = new sqlite3.Database(DB_PATH, (error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(db);
    });
  });

  return dbPromise;
}

async function run(db: sqlite3.Database, sql: string, params: unknown[] = []): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    db.run(sql, params, (error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });
  });
}

async function all<T>(db: sqlite3.Database, sql: string, params: unknown[] = []): Promise<T[]> {
  return new Promise<T[]>((resolve, reject) => {
    db.all(sql, params, (error, rows) => {
      if (error) {
        reject(error);
        return;
      }
      resolve((rows ?? []) as T[]);
    });
  });
}

export async function initAnalyticsDb(): Promise<void> {
  if (initPromise) {
    return initPromise;
  }

  initPromise = (async () => {
    const db = await openDatabase();
    await run(
      db,
      `CREATE TABLE IF NOT EXISTS event_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category TEXT NOT NULL,
        event_key TEXT NOT NULL,
        target_url TEXT NOT NULL,
        source_path TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      )`
    );
    await run(db, 'CREATE INDEX IF NOT EXISTS idx_event_logs_key_time ON event_logs (event_key, created_at)');
    await run(db, 'CREATE INDEX IF NOT EXISTS idx_event_logs_category_time ON event_logs (category, created_at)');
  })();

  return initPromise;
}

export async function insertTrackEvent(input: TrackEventInput): Promise<void> {
  await initAnalyticsDb();
  const db = await openDatabase();
  await run(
    db,
    `INSERT INTO event_logs (category, event_key, target_url, source_path)
     VALUES (?, ?, ?, ?)`,
    [input.category, input.eventKey, input.targetUrl, input.sourcePath]
  );
}

export async function getTrackEventStats(days = 30): Promise<TrackEventStatRow[]> {
  await initAnalyticsDb();
  const db = await openDatabase();
  const safeDays = Number.isFinite(days) ? Math.max(1, Math.min(365, Math.floor(days))) : 30;
  return all<TrackEventStatRow>(
    db,
    `SELECT category as category, event_key as eventKey, COUNT(*) as hits
     FROM event_logs
     WHERE created_at >= datetime('now', ?)
     GROUP BY category, event_key
     ORDER BY hits DESC, category ASC, event_key ASC`,
    [`-${safeDays} days`]
  );
}
