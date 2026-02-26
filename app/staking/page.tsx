import { Section } from '@/components/Section';

const commonSteps = [
  '지갑을 재실행하기 전에 현재 상태를 확인합니다. (동기화 진행률, 잠금 상태, 네트워크 연결 수)',
  '재가동 후에는 반드시 staking-only unlock을 다시 적용합니다.',
  '재가동 직후 1~2분 동안 `listmintings`, `getwalletinfo` 결과를 확인합니다.',
  '스테이킹은 수익 보장이 아닌 네트워크 분산 참여임을 전제로 운영합니다.'
];

const windowsSteps = [
  '작업 표시줄 트레이 또는 지갑 창에서 XPChain Qt를 정상 종료합니다.',
  '시작 메뉴에서 XPChain Core(Qt Wallet)를 다시 실행합니다.',
  '완전 동기화(최신 블록) 상태를 확인합니다.',
  '메뉴에서 staking-only unlock을 적용합니다.',
  '디버그 콘솔에서 `listmintings`를 실행해 staking 대상 UTXO 상태를 확인합니다.'
];

const macSteps = [
  '메뉴 바 또는 지갑 창에서 XPChain-Qt를 완전히 종료합니다.',
  'Applications에서 XPChain-Qt를 다시 실행합니다.',
  '잠금/동기화 상태를 확인한 뒤 staking-only unlock을 적용합니다.',
  '디버그 콘솔에서 `getwalletinfo`, `listmintings`를 순서대로 확인합니다.',
  '네트워크 연결이 안정화될 때까지 1~2분 대기 후 상태를 재확인합니다.'
];

const linuxSteps = [
  'GUI 사용 시 지갑을 정상 종료합니다. 데몬 사용 시 `xpchain-cli stop`으로 종료합니다.',
  'GUI는 `xpchain-qt`로, 데몬은 `xpchaind -daemon`으로 재시작합니다.',
  '동기화 상태를 `getblockchaininfo`로 확인합니다.',
  'staking-only unlock 또는 운영 정책에 맞는 잠금 해제 상태를 적용합니다.',
  '`listmintings`, `getnetworkinfo`로 staking 및 피어 연결 상태를 점검합니다.'
];

export default function StakingPage() {
  return (
    <>
      <h1 className="sr-only">스테이킹</h1>
      <Section title="스테이킹" subtitle="5분 재가동 가이드: 수익 목적이 아닌 분산 기여 중심">
        <ol className="panel list-decimal space-y-3 p-5 pl-10 text-sm text-text">
          {commonSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </Section>

      <Section title="OS별 5분 재가동 절차" subtitle="운영 환경에 맞는 최소 점검 절차를 따르세요.">
        <div className="grid gap-4 lg:grid-cols-3">
          <article className="panel p-5 text-sm text-mute">
            <p className="text-base font-semibold text-text">Windows</p>
            <ol className="mt-3 list-decimal space-y-1 pl-5">
              {windowsSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </article>

          <article className="panel p-5 text-sm text-mute">
            <p className="text-base font-semibold text-text">macOS</p>
            <ol className="mt-3 list-decimal space-y-1 pl-5">
              {macSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </article>

          <article className="panel p-5 text-sm text-mute">
            <p className="text-base font-semibold text-text">Linux</p>
            <ol className="mt-3 list-decimal space-y-1 pl-5">
              {linuxSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </article>
        </div>
      </Section>

      <Section title="상태 확인 명령" subtitle="재가동 후 아래 명령으로 점검하세요.">
        <div className="panel p-5 text-sm text-mute">
          <p className="mb-2">Qt 디버그 콘솔 또는 `xpchain-cli`에서 실행:</p>
          <pre className="overflow-x-auto rounded-md border border-border bg-bg px-3 py-2 text-xs text-text">
{`getblockchaininfo
getwalletinfo
listmintings
getmininginfo
getnetworkinfo`}
          </pre>
          <ul className="mt-3 list-disc space-y-1 pl-5">
            <li>동기화 완료: 최신 블록 높이가 네트워크와 유사한지 확인</li>
            <li>잠금 상태: staking-only unlock이 적용되었는지 확인</li>
            <li>스테이킹 상태: `listmintings`에서 age/probability/reward를 확인</li>
            <li>노드 상태: `getmininginfo`에서 blocks/difficulty/networkhashps 확인</li>
            <li>피어 연결: 연결 수가 0이 아닌지 확인</li>
          </ul>
        </div>
      </Section>

      <Section title="자주 묻는 질문" subtitle="운영 중 자주 발생하는 상황">
        <div className="panel space-y-4 p-5 text-sm text-mute">
          <p>스테이킹은 수익을 보장하는 기능이 아닙니다. 네트워크 분산성과 지속성에 참여하는 행위입니다.</p>
          <p>동기화가 완료되지 않으면 스테이킹은 활성화되지 않습니다. 먼저 블록 동기화 상태를 확인하세요.</p>
          <p>재가동 후 잠금 해제가 초기화될 수 있으므로 staking-only unlock 상태를 다시 적용해야 합니다.</p>
          <p>운영 리스크를 줄이기 위해 안정적인 네트워크/전원 환경에서 지갑을 유지하는 것을 권장합니다.</p>
        </div>
      </Section>
    </>
  );
}
