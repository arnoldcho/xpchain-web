import { notFound } from 'next/navigation';
import { getTrackEventStats, type TrackEventCategory, type TrackEventStatRow } from '@/lib/analytics-db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

type SearchParams = Record<string, string | string[] | undefined>;

const EVENT_LABELS: Record<string, string> = {
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

const CATEGORY_LABELS: Record<TrackEventCategory, string> = {
  wallet_download: '지갑/다운로드',
  explorer_outbound: '익스플로러 이동'
};

function getSingleParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function sanitizeDays(value: string | undefined): number {
  const parsed = Number(value ?? '30');
  if (!Number.isFinite(parsed)) return 30;
  return Math.max(1, Math.min(365, Math.floor(parsed)));
}

function buildFilterHref(days: number, token?: string): string {
  const params = new URLSearchParams();
  params.set('days', String(days));
  if (token) {
    params.set('token', token);
  }
  return `/admin/track?${params.toString()}`;
}

function groupByCategory(rows: TrackEventStatRow[]) {
  return rows.reduce<Record<string, TrackEventStatRow[]>>((acc, row) => {
    if (!acc[row.category]) {
      acc[row.category] = [];
    }
    acc[row.category].push(row);
    return acc;
  }, {});
}

export default async function TrackAdminPage({ searchParams }: { searchParams: SearchParams }) {
  const token = getSingleParam(searchParams.token);
  const expectedToken = process.env.TRACKING_STATS_TOKEN;

  if (expectedToken && token !== expectedToken) {
    notFound();
  }

  const days = sanitizeDays(getSingleParam(searchParams.days));
  const rows = await getTrackEventStats(days);
  const grouped = groupByCategory(rows);
  const dayFilters = [1, 7, 30];

  return (
    <section className="container-width mt-12">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-text">다운로드/링크 트래킹 통계</h1>
        <p className="mt-2 text-sm text-mute">최근 {days}일 기준 집계입니다.</p>
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          {dayFilters.map((filterDays) => {
            const isActive = days === filterDays;
            return (
              <a
                key={filterDays}
                href={buildFilterHref(filterDays, token)}
                className={`rounded border px-3 py-1.5 ${
                  isActive
                    ? 'border-accent bg-accent/10 text-accent'
                    : 'border-line text-mute hover:border-accent/60 hover:text-text'
                }`}
              >
                {filterDays === 1 ? '오늘' : `${filterDays}일`}
              </a>
            );
          })}
        </div>
      </div>

      <div className="panel p-5 text-sm text-mute">
        <p>접속 경로: `/admin/track?days=30`</p>
        <p>토큰 보호 사용 시: `/admin/track?days=30&token=YOUR_TOKEN`</p>
      </div>

      <div className="mt-4 space-y-4">
        {(Object.keys(CATEGORY_LABELS) as TrackEventCategory[]).map((category) => {
          const categoryRows = grouped[category] ?? [];
          const total = categoryRows.reduce((sum, row) => sum + row.hits, 0);

          return (
            <div key={category} className="panel p-5">
              <h2 className="text-lg font-semibold text-text">{CATEGORY_LABELS[category]}</h2>
              <p className="mt-1 text-sm text-mute">총 클릭 수: {total.toLocaleString()}</p>

              {categoryRows.length === 0 ? (
                <p className="mt-3 text-sm text-mute">집계된 이벤트가 없습니다.</p>
              ) : (
                <div className="mt-3 overflow-x-auto">
                  <table className="min-w-full border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-line text-left text-mute">
                        <th className="py-2 pr-4 font-medium">이벤트</th>
                        <th className="py-2 pr-4 font-medium">키</th>
                        <th className="py-2 text-right font-medium">클릭 수</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categoryRows.map((row) => (
                        <tr key={`${row.category}:${row.eventKey}`} className="border-b border-line/60 text-text">
                          <td className="py-2 pr-4">{EVENT_LABELS[row.eventKey] ?? row.eventKey}</td>
                          <td className="py-2 pr-4 text-mute">{row.eventKey}</td>
                          <td className="py-2 text-right">{row.hits.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
