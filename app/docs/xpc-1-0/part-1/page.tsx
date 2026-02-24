import Image from 'next/image';
import { Section } from '@/components/Section';

export default function XpcPartOnePage() {
  return (
    <Section title="XPC 1.0 소개 (1) – 비트코인 0.17.0 기반 PoS" subtitle="XPC 1.0 Blockchain (1) – Based on Bitcoin 0.17.0">
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
            XPC는 SegWit 기능을 기본적으로 지원하는 비트코인 0.17.0 기반으로 개발되었고, 합의 알고리즘은 PoS
            (Proof-of-Stake) 방식을 채택했습니다.
          </p>
        </div>

        <div className="panel p-5 text-sm text-mute">
          <p className="text-text">본문</p>
          <h3 className="mt-3 text-base font-semibold text-text">1) 비트코인 0.17.0 기반의 PoS 합의알고리즘</h3>
          <Image
            src="/docs/xpc-1-0/part-1-main.png"
            alt="XPC 1.0 Blockchain Part 1 Diagram"
            width={1600}
            height={900}
            className="mt-4 h-auto w-full rounded-lg border border-line"
          />

          <h4 className="mt-4 text-sm font-semibold text-text">세그윗(SegWit) 지원</h4>
          <p className="mt-2">
            세그윗은 전자서명을 트랜잭션 데이터와 분리하여 트랜잭션 무게를 줄이고, 블록에 더 많은 거래를 담을 수 있게
            합니다. 이 구조는 속도와 네트워크 효율 측면에서 긍정적인 효과를 기대하게 합니다.
          </p>

          <h4 className="mt-4 text-sm font-semibold text-text">비트코인 생태계 호환성</h4>
          <p className="mt-2">
            XPC 체인은 비트코인 0.17.0 기반으로 개발되어, 기존 비트코인 생태계의 검증된 코드와 도구를 참고하고
            활용하기 좋은 장점이 있습니다. 장기간 검증된 코드베이스를 바탕으로 서비스 개발과 운영 안정화에 집중할 수
            있습니다.
          </p>

          <h4 className="mt-4 text-sm font-semibold text-text">PoS(Proof-of-Stake) 채택 배경</h4>
          <p className="mt-2">
            PoW는 검증된 합의 방식이지만, 전력/장비 비용이 크고 참여자가 적은 체인에서는 보안 집중 위험이 커질 수
            있습니다. XPC는 사용자 참여 기반으로 보안을 유지하면서 운영 비용을 줄이는 목적에서 PoS를 채택했습니다.
          </p>
        </div>

        <div className="panel p-5 text-sm text-mute">
          <p className="text-text">2026 운영 주석</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>본 문서는 초기 기술 포스팅 기반 아카이브입니다.</li>
            <li>현재 릴리즈/운영 기준은 공지 및 릴리즈 노트를 우선 참조해 주세요.</li>
            <li>투자 유도 목적이 아닌 기술/운영 기록 목적 문서입니다.</li>
          </ul>
        </div>
      </div>
    </Section>
  );
}
