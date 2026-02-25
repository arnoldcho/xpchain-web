import { Section } from '@/components/Section';
import { StatusCard } from '@/components/StatusCard';
import { formatNumber, formatSeconds } from '@/lib/format';
import { getNetworkStatus } from '@/lib/rpc';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const status = await getNetworkStatus();
  const healthLabel = status.nodeHealth === 'healthy' ? '정상' : '점검 필요';
  const dataSourceLabel = status.dataSource === 'rpc' ? 'RPC(최대 5분 캐시)' : '임시 데이터';

  return (
    <>
      <section className="container-width pt-16">
        <div className="panel px-6 py-10 sm:px-10">
          <p className="text-sm tracking-wider text-accent">Independent Mainnet</p>
          <h1 className="mt-4 text-4xl font-semibold leading-[1.28] text-text sm:text-5xl">
            XPChain runs every day.
            <br />
            Quietly. Consistently.
          </h1>
          <p className="mt-4 max-w-2xl text-mute">
            XPChain is operated around decentralization, network stability, and long-term sustainability.
          </p>
          <p className="mt-3 text-xs text-mute">상태 데이터 소스: {dataSourceLabel}</p>
          <div className="mt-8 flex flex-wrap gap-3 text-sm">
            <a href="/network" className="rounded-md bg-accent px-4 py-2 font-medium text-bg">
              네트워크 상태 보기
            </a>
            <a href="/staking" className="rounded-md border border-line px-4 py-2 text-text">
              스테이킹 가이드
            </a>
            <a href="/wallets" className="rounded-md border border-line px-4 py-2 text-text">
              지갑 다운로드
            </a>
          </div>
        </div>
      </section>

      <Section title="네트워크 스냅샷" subtitle="체인 생존 상태를 데이터로 확인합니다.">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatusCard label="블록 높이" value={formatNumber(status.blockHeight)} />
          <StatusCard label="연결 수" value={formatNumber(status.connections)} />
          <StatusCard label="평균 블록 간격" value={formatSeconds(status.avgBlockTimeLast60)} />
          <StatusCard label="노드 상태" value={healthLabel} />
        </div>
      </Section>

      <Section title="첫 실사용 사례" subtitle="XPChain 종속이 아닌 응용 사례 소개입니다.">
        <div className="grid gap-4 md:grid-cols-2">
          <article className="panel p-5">
            <h3 className="text-lg font-semibold text-text">SmartPig</h3>
            <p className="mt-2 text-sm text-mute">
              AI 기반 리서치/브리핑 서비스입니다. XPChain은 선택 가능한 유틸리티 레이어로 활용됩니다.
            </p>
          </article>
          <article className="panel p-5">
            <h3 className="text-lg font-semibold text-text">XRoutine</h3>
            <p className="mt-2 text-sm text-mute">
              루틴 참여 기반 서비스입니다. 가격/거래소 중심이 아닌 내부 참여 구조를 지향합니다.
            </p>
          </article>
        </div>
      </Section>
    </>
  );
}
