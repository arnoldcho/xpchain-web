import { Section } from '@/components/Section';
import { ExplorerRealtimeStatus } from '@/components/ExplorerRealtimeStatus';
import { getExplorerDbStatus } from '@/lib/explorer-db';
import { links } from '@/lib/links';
import { getNetworkStatus } from '@/lib/rpc';

export const dynamic = 'force-dynamic';

export default async function ExplorerPage() {
  const [status, explorerDbStatus] = await Promise.all([getNetworkStatus(), getExplorerDbStatus()]);

  return (
    <Section title="익스플로러" subtitle="체인 조회용 기본/백업 엔드포인트를 제공합니다.">
      <div className="panel space-y-3 p-5 text-sm">
        <ExplorerRealtimeStatus initialStatus={status} initialExplorerDbStatus={explorerDbStatus} />
        <p>
          기본: <a href={links.explorerPrimary} target="_blank" rel="noreferrer" className="text-accent">explorer.xpchain.co.kr</a>
        </p>
        <p>
          백업: <a href={links.explorerFallback} target="_blank" rel="noreferrer" className="text-accent">scan.xpchain.co.kr</a>
        </p>
        <p className="text-mute">데이터 기준: /api/status (최대 5분 캐시, 최근 블록 시각/평균 블록 간격/노드 상태)</p>
      </div>
    </Section>
  );
}
