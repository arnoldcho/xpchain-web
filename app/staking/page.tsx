import { Section } from '@/components/Section';

const steps = [
  '공식 경로에서 최신 Qt Wallet을 설치합니다.',
  '블록체인 동기화가 100% 완료될 때까지 기다립니다.',
  "'staking only' 모드로 지갑을 unlock 합니다.",
  '지갑 상태/디버그 콘솔에서 staking ON 여부를 확인합니다.',
  '지갑을 안정적인 네트워크 환경에서 온라인 상태로 유지합니다.'
];

export default function StakingPage() {
  return (
    <>
      <h1 className="sr-only">스테이킹</h1>
      <Section title="스테이킹" subtitle="5분 재가동 가이드: 수익 목적이 아닌 분산 기여 중심">
        <ol className="panel list-decimal space-y-3 p-5 pl-10 text-sm text-text">
          {steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </Section>

      <Section title="자주 묻는 질문" subtitle="왜 스테이킹에 참여해야 하나요?">
        <div className="panel space-y-4 p-5 text-sm text-mute">
          <p>스테이킹은 수익을 보장하는 기능이 아닙니다. 네트워크 분산성과 지속성에 참여하는 행위입니다.</p>
          <p>동기화가 완료되지 않으면 스테이킹은 활성화되지 않습니다.</p>
          <p>운영 리스크를 줄이기 위해 staking-only unlock 사용을 권장합니다.</p>
        </div>
      </Section>
    </>
  );
}
