import { notFound } from 'next/navigation';
import { AdminTabs } from '@/components/AdminTabs';
import { StatusCard } from '@/components/StatusCard';
import {
  CATEGORY_LABELS,
  EVENT_LABELS,
  getTrackEventAnalytics,
  type TrackDailyPoint,
  type TrackEventCategory,
  type TrackEventStatRow
} from '@/lib/analytics-db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

type SearchParams = Record<string, string | string[] | undefined>;

const DAY_FILTERS = [1, 7, 30, 90];

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
  if (token) params.set('token', token);
  return `/admin/track?${params.toString()}`;
}

function dayFilterLabel(days: number): string {
  if (days === 1) return '오늘';
  if (days === 90) return '90일';
  return `${days}일`;
}

function DailyTrendChart({ daily }: { daily: TrackDailyPoint[] }) {
  const max = Math.max(1, ...daily.map((d) => d.total));
  const first = daily[0]?.date ?? '';
  const last = daily[daily.length - 1]?.date ?? '';

  return (
    <div>
      <div className="flex items-center gap-4 text-xs text-mute">
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-accent/80" aria-hidden />
          {CATEGORY_LABELS.wallet_download}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-warn/80" aria-hidden />
          {CATEGORY_LABELS.explorer_outbound}
        </span>
        <span className="ml-auto">최대 {max.toLocaleString()}회/일</span>
      </div>

      <div className="mt-3 flex h-40 items-end gap-[2px]">
        {daily.map((d) => (
          <div
            key={d.date}
            className="flex h-full min-w-0 flex-1 flex-col justify-end"
            title={`${d.date} · 총 ${d.total}회 (다운로드 ${d.wallet_download}, 익스플로러 ${d.explorer_outbound})`}
          >
            <div
              className="rounded-t-[2px] bg-warn/80"
              style={{ height: `${(d.explorer_outbound / max) * 100}%` }}
            />
            <div
              className="bg-accent/80"
              style={{ height: `${(d.wallet_download / max) * 100}%` }}
            />
          </div>
        ))}
      </div>

      <div className="mt-2 flex justify-between text-[11px] text-mute">
        <span>{first}</span>
        <span>{last}</span>
      </div>
    </div>
  );
}

function CategoryPanel({
  category,
  rows
}: {
  category: TrackEventCategory;
  rows: TrackEventStatRow[];
}) {
  const total = rows.reduce((sum, row) => sum + row.hits, 0);
  const barColor = category === 'wallet_download' ? 'bg-accent/70' : 'bg-warn/70';

  return (
    <div className="panel p-5">
      <div className="flex items-baseline justify-between">
        <h2 className="text-lg font-semibold text-text">{CATEGORY_LABELS[category]}</h2>
        <p className="text-sm text-mute">
          총 <span className="font-semibold text-text">{total.toLocaleString()}</span>회
        </p>
      </div>

      {rows.length === 0 ? (
        <p className="mt-3 text-sm text-mute">집계된 이벤트가 없습니다.</p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-line text-left text-[10px] uppercase tracking-[0.12em] text-mute">
                <th className="py-2 pr-4 font-semibold">이벤트</th>
                <th className="py-2 pr-4 text-right font-semibold">클릭 수</th>
                <th className="w-2/5 py-2 font-semibold">비중</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const pct = total > 0 ? (row.hits / total) * 100 : 0;
                return (
                  <tr key={`${row.category}:${row.eventKey}`} className="border-b border-line/60">
                    <td className="py-2.5 pr-4">
                      <div className="text-text">{EVENT_LABELS[row.eventKey] ?? row.eventKey}</div>
                      <div className="text-[11px] text-mute">{row.eventKey}</div>
                    </td>
                    <td className="py-2.5 pr-4 text-right font-semibold tabular-nums text-text">
                      {row.hits.toLocaleString()}
                    </td>
                    <td className="py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-line/50">
                          <div className={`h-full rounded-full ${barColor}`} style={{ width: `${pct}%` }} />
                        </div>
                        <span className="w-10 text-right text-[11px] tabular-nums text-mute">
                          {pct.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default async function TrackAdminPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;
  const token = getSingleParam(sp.token);
  const expectedToken = process.env.TRACKING_STATS_TOKEN;

  if (expectedToken && token !== expectedToken) {
    notFound();
  }

  const days = sanitizeDays(getSingleParam(sp.days));
  const analytics = await getTrackEventAnalytics(days);
  const walletRows = analytics.rows.filter((row) => row.category === 'wallet_download');
  const explorerRows = analytics.rows.filter((row) => row.category === 'explorer_outbound');
  const topEventLabel = analytics.topEvent
    ? (EVENT_LABELS[analytics.topEvent.eventKey] ?? analytics.topEvent.eventKey)
    : '—';

  return (
    <section className="container-width mt-12 pb-16">
      <AdminTabs active="stats" token={token} />

      <div className="mt-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-text">다운로드/링크 통계</h1>
          <p className="mt-2 text-sm text-mute">최근 {days}일 기준 집계입니다 (KST).</p>
        </div>
        <div className="flex gap-1">
          {DAY_FILTERS.map((filterDays) => {
            const isActive = days === filterDays;
            return (
              <a
                key={filterDays}
                href={buildFilterHref(filterDays, token)}
                aria-current={isActive ? 'true' : undefined}
                className={`rounded-lg border px-3 py-1.5 text-sm font-semibold transition-colors ${
                  isActive
                    ? 'border-accent bg-accent/10 text-accent'
                    : 'border-line text-mute hover:border-accent/60 hover:text-text'
                }`}
              >
                {dayFilterLabel(filterDays)}
              </a>
            );
          })}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatusCard label="총 클릭" value={analytics.totals.total.toLocaleString()} hint={`최근 ${days}일`} />
        <StatusCard
          label={CATEGORY_LABELS.wallet_download}
          value={analytics.totals.wallet_download.toLocaleString()}
          hint="지갑 다운로드 클릭"
          valueClassName="text-accent"
        />
        <StatusCard
          label={CATEGORY_LABELS.explorer_outbound}
          value={analytics.totals.explorer_outbound.toLocaleString()}
          hint="익스플로러 이동 클릭"
          valueClassName="text-warn"
        />
        <StatusCard
          label="최다 이벤트"
          value={topEventLabel}
          hint={analytics.topEvent ? `${analytics.topEvent.hits.toLocaleString()}회` : '집계 없음'}
        />
      </div>

      <div className="panel mt-4 p-5">
        <h2 className="text-lg font-semibold text-text">일별 추이</h2>
        <p className="mt-1 text-sm text-mute">날짜별 클릭 수 (막대에 마우스를 올리면 상세)</p>
        <div className="mt-4">
          {analytics.totals.total === 0 ? (
            <p className="text-sm text-mute">기간 내 집계된 이벤트가 없습니다.</p>
          ) : (
            <DailyTrendChart daily={analytics.daily} />
          )}
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <CategoryPanel category="wallet_download" rows={walletRows} />
        <CategoryPanel category="explorer_outbound" rows={explorerRows} />
      </div>
    </section>
  );
}
