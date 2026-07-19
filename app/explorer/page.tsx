import { Section } from '@/components/Section';
import { ExplorerRealtimeStatus } from '@/components/ExplorerRealtimeStatus';
import { TrackedLink } from '@/components/TrackedLink';
import { getExplorerDbStatus } from '@/lib/explorer-db';
import { links } from '@/lib/links';
import { getNetworkStatus } from '@/lib/rpc';

export const dynamic = 'force-dynamic';

export default async function ExplorerPage() {
  const [status, explorerDbStatus] = await Promise.all([getNetworkStatus(), getExplorerDbStatus()]);

  return (
    <>
      <h1 className="sr-only">익스플로러</h1>
      <Section title="익스플로러" subtitle="블록과 거래 내역을 확인할 수 있는 익스플로러 주소를 제공합니다.">
        <div className="panel space-y-3 p-5 text-sm">
          <ExplorerRealtimeStatus initialStatus={status} initialExplorerDbStatus={explorerDbStatus} />
          <p>
            <TrackedLink
              href={links.explorerPrimary}
              target="_blank"
              className="text-accent"
              category="explorer_outbound"
              eventKey="explorer_primary"
              sourcePath="/explorer"
            >
              explorer.xpchain.co.kr
            </TrackedLink>
          </p>
          <p className="text-mute">데이터 기준: /api/status (최대 1분 캐시, 최근 블록 시각/평균 블록 간격/노드 상태)</p>
        </div>
      </Section>
    </>
  );
}
