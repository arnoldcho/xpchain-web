import { notFound } from 'next/navigation';
import { AdminTabs } from '@/components/AdminTabs';
import { StatusCard } from '@/components/StatusCard';
import { CATEGORY_LABELS, EVENT_LABELS, getTrackEventAnalytics } from '@/lib/analytics-db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

type SearchParams = Record<string, string | string[] | undefined>;

function getSingleParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function withToken(href: string, token?: string): string {
  if (!token) return href;
  const params = new URLSearchParams({ token });
  return `${href}?${params.toString()}`;
}

export default async function AdminHomePage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;
  const token = getSingleParam(sp.token);
  const expectedToken = process.env.TRACKING_STATS_TOKEN;

  if (expectedToken && token !== expectedToken) {
    notFound();
  }

  const analytics = await getTrackEventAnalytics(30);

  return (
    <section className="container-width mt-12">
      <AdminTabs active="home" token={token} />

      <div className="mt-6">
        <h1 className="text-2xl font-semibold text-text">XPChain 관리자</h1>
        <p className="mt-2 text-sm text-mute">사이트 운영 지표를 한눈에 확인합니다. 최근 30일 요약입니다.</p>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatusCard
          label="총 클릭"
          value={analytics.totals.total.toLocaleString()}
          hint="최근 30일 전체 추적 이벤트"
        />
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
          value={analytics.topEvent ? (EVENT_LABELS[analytics.topEvent.eventKey] ?? analytics.topEvent.eventKey) : '—'}
          hint={analytics.topEvent ? `${analytics.topEvent.hits.toLocaleString()}회` : '집계 없음'}
        />
      </div>

      <div className="panel mt-4 flex flex-wrap items-center justify-between gap-3 p-5">
        <div>
          <p className="text-base font-semibold text-text">📊 다운로드/링크 통계</p>
          <p className="mt-1 text-sm text-mute">이벤트별 클릭 수, 일별 추이, 기간별 집계를 확인하세요.</p>
        </div>
        <a
          href={withToken('/admin/track', token)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-accent/15 px-4 py-2 text-sm font-semibold text-accent transition-colors hover:bg-accent/25"
        >
          통계 자세히 보기 →
        </a>
      </div>
    </section>
  );
}
