import Image from 'next/image';
import { Section } from '@/components/Section';

export default function XpcPartTwoPage() {
  return (
    <>
      <h1 className="sr-only">XPC 1.0 소개 (2) ABPoS</h1>
      <Section
        title="XPC 1.0 소개 (2) – ABPoS (Age Burnable PoS)"
        subtitle="XPC 1.0 Blockchain (2) – Age Burnable PoS"
      >
        <div className="space-y-4">
        <div className="panel p-5 text-sm text-mute">
          <p className="text-text">목차</p>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>비트코인 0.17.0 기반</li>
            <li>ABPoS (Age Burnable PoS)</li>
            <li>XPC 블록체인 사양</li>
          </ol>
        </div>

        <div className="panel p-5 text-sm text-mute">
          <p className="text-text">핵심 요약</p>
          <p className="mt-2">
            XPC는 SegWit를 지원하는 비트코인 0.17.0 기반 구조 위에서 PoS를 채택했고, 여기에 Age Burnable PoS
            (ABPoS) 개념을 확장 적용했습니다.
          </p>
        </div>

        <div className="panel p-5 text-sm text-mute">
          <h3 className="text-base font-semibold text-text">2) ABPoS (Age Burnable PoS)</h3>

          <h4 className="mt-4 text-sm font-semibold text-text">독립 트랜잭션 기반 보상 배분</h4>
          <p className="mt-2">
            ABPoS에서는 스테이킹 트랜잭션 자체와 분리된 독립 트랜잭션으로 보상이 배분됩니다. 지급 비율은 코인 수량에
            따라 비례합니다.
          </p>

          <Image
            src="/docs/xpc-1-0/part-2-main.png"
            alt="ABPoS flow diagram"
            width={1600}
            height={994}
            className="mt-4 h-auto w-full rounded-lg border border-line"
          />

          <h4 className="mt-5 text-sm font-semibold text-text">채굴 보상의 즉시 분배 기능</h4>
          <p className="mt-2">
            ABPoS에는 스테이킹 성공 시 발생하는 보상 트랜잭션을 조건부 편집할 수 있는 기능이 포함됩니다. 이를 이용해
            운영비/서비스 유지비 배분 같은 운영 전략을 구성할 수 있습니다.
          </p>

          <Image
            src="/docs/xpc-1-0/part-2-reward-setting.png"
            alt="XPC wallet reward distribution setting"
            width={1600}
            height={945}
            className="mt-4 h-auto w-full rounded-lg border border-line"
          />
          <p className="mt-2 text-center text-xs text-mute/80">&lt;XPC 지갑에서의 채굴 보상 분배 설정&gt;</p>

          <h4 className="mt-5 text-sm font-semibold text-text">채굴 과정에서의 수수료 소각</h4>
          <p className="mt-2">
            트랜잭션 처리 시 발생하는 수수료는 소각되어 총 공급량 증가 압력을 줄이는 방향으로 작동합니다. ABPoS 기반의
            거래/스테이킹 수수료 소각은 PoS 계열 체인에서의 인플레이션 관리에 보조적인 역할을 수행할 수 있습니다.
          </p>
        </div>

        <div className="panel p-5 text-sm text-mute">
          <p className="text-text">2026 운영 주석</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>본 문서는 초기 기술 포스팅 기반 아카이브입니다.</li>
            <li>운영 수익/보상 관련 문구는 기술 개념 설명으로만 해석해 주세요.</li>
            <li>현재 릴리즈/운영 기준은 공지와 릴리즈 노트를 우선 참조해 주세요.</li>
          </ul>
        </div>
        </div>
      </Section>
    </>
  );
}
