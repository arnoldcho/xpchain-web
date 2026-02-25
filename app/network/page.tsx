import { NetworkChart } from '@/components/NetworkChart';
import { Section } from '@/components/Section';
import { StatusCard } from '@/components/StatusCard';
import { formatDateTime, formatNumber, formatPercent, formatSeconds } from '@/lib/format';
import { getNetworkStatus } from '@/lib/rpc';

export const dynamic = 'force-dynamic';

export default async function NetworkPage() {
  const status = await getNetworkStatus();
  const sourceLabel = status.dataSource === 'rpc' ? 'RPC 데이터(최대 5분 캐시)' : '임시 데이터(폴백)';

  return (
    <>
      <h1 className="sr-only">네트워크 상태</h1>
      <Section title="네트워크 상태" subtitle="체인은 데이터가 보일 때 신뢰됩니다.">
        <div className="mb-4 flex flex-wrap gap-2 text-xs">
          <span className="rounded border border-line px-2 py-1 text-mute">데이터 소스: {sourceLabel}</span>
          <span className="rounded border border-line px-2 py-1 text-mute">갱신 시각: {formatDateTime(status.generatedAt)}</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          <StatusCard label="현재 블록" value={formatNumber(status.blockHeight)} />
          <StatusCard label="평균 블록 간격" value={formatSeconds(status.avgBlockTimeLast60)} />
          <StatusCard label="피어 연결" value={formatNumber(status.peersCount)} />
          <StatusCard
            label="마지막 블록 시간"
            value={formatDateTime(status.lastBlockTime)}
            valueClassName="text-lg whitespace-nowrap"
          />
          <StatusCard
            label="스테이킹 참여 추정"
            value={formatPercent(status.stakingParticipationEstimate)}
            hint={`프로토콜 ${status.protocolVersion ?? '-'}`}
          />
        </div>
      </Section>

      <Section title="블록 간격 추이" subtitle="최근 1시간 동안의 블록 생성 간격(최근 60개 블록 기준)을 시각화했습니다.">
        <NetworkChart points={status.recentBlockIntervals} />
      </Section>

      <Section title="참여" subtitle="장기 생존은 참여가 쌓일 때 강화됩니다.">
        <div className="panel p-5 text-sm text-mute">
          <p>
            스테이킹 참여는 네트워크 분산성을 높입니다. 지갑 동기화 완료 후 staking 전용 unlock 상태로 운영하면
            체인 안정성 강화에 기여할 수 있습니다.
          </p>
        </div>
      </Section>
    </>
  );
}
