import { Section } from '@/components/Section';
import { links } from '@/lib/links';

export default function DocsPage() {
  return (
    <>
      <h1 className="sr-only">문서</h1>
      <Section title="문서" subtitle="현재 운영 원칙과 아카이브 백서를 함께 제공합니다.">
        <div className="space-y-4">
        <div className="panel p-5 text-sm text-mute">
          <p className="text-text">XPC 1.0 기술 시리즈 (Archive + 정리본)</p>
          <p className="mt-2">
            과거 포스팅을 운영 관점에서 재정리한 문서입니다. 원문의 기술 설명을 보존하되, 현재 운영 기준과 차이가 있는
            항목은 별도 주석으로 구분합니다.
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-5">
            <li>
              <a href="/docs/xpc-1-0/part-1" className="text-accent">
                Part 1. 비트코인 0.17.0 기반 PoS
              </a>
            </li>
            <li>
              <a href="/docs/xpc-1-0/part-2" className="text-accent">
                Part 2. ABPoS 상세
              </a>
            </li>
            <li>
              <a href="/docs/xpc-1-0/part-3" className="text-accent">
                Part 3. XPC 블록체인 사양
              </a>
            </li>
          </ul>
          <a href="/docs/xpc-1-0" className="mt-4 inline-block text-accent">
            시리즈 전체 보기
          </a>
        </div>

        <div className="panel p-5 text-sm text-mute">
          <p className="text-text">최신 운영 원칙</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>가격/상장/투자 유도보다 분산성과 장기 지속성을 우선합니다.</li>
            <li>스테이킹은 수익 보장 수단이 아니라 네트워크 참여 수단입니다.</li>
            <li>철학/투명성 원칙과 공지 이력은 사이트 내 페이지에서 계속 갱신됩니다.</li>
          </ul>
          <p className="mt-4 text-text">운영 문서(요약)</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>노드 설치(Ubuntu): 코어 설치 후 `rpcuser`, `rpcpassword`, `txindex=1` 설정 권장</li>
            <li>스테이킹 운영: 동기화 완료 후 staking-only unlock 사용</li>
            <li>모니터링: 블록 간격, 피어 연결 수, 마지막 블록 시각을 우선 확인</li>
          </ul>
          <div className="mt-4 flex flex-wrap gap-3">
            <a href="/philosophy" className="text-accent">
              철학(운영 원칙/투명성) 보기
            </a>
            <a href="/roadmap" className="text-accent">
              로드맵 보기
            </a>
            <a href="/notices" className="text-accent">
              공지/업데이트 보기
            </a>
            <a href="/staking" className="text-accent">
              스테이킹 가이드 보기
            </a>
          </div>
        </div>

        <div className="panel p-5 text-sm text-mute">
          <p className="text-text">v0.17.0-4 릴리스 검증 결과</p>
          <p className="mt-2">
            실사용 기준 런타임 스모크 + 지갑 기능(동기화/입출금/재시작) 검증을 완료했습니다.
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-5">
            <li>macOS: PASS</li>
            <li>Linux (Ubuntu 24.04): PASS</li>
            <li>Windows x64: PASS</li>
            <li>Windows x86: PASS</li>
          </ul>
          <p className="mt-3">
            범위: v0.17.0-4 / wallet functional test / restart resilience 포함
          </p>
          <a
            href="https://github.com/arnoldcho/xpchain-community-core/blob/master/doc/release-validation-v0.17.0-4.md"
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-block text-accent"
          >
            상세 검증 리포트 보기
          </a>
        </div>

        <div className="panel p-5 text-sm text-mute">
          <p className="text-text">아카이브 백서 (초기 버전)</p>
          <p className="mt-2">
            아래 문서는 XPChain 초창기 백서입니다. 현재 운영 정책/커뮤니케이션 기준과 일부 차이가 있을 수 있습니다.
            최신 기준은 위의 운영 원칙 페이지를 우선 참고해 주세요.
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-5">
            <li>
              <a href={links.whitepaperKr} target="_blank" rel="noreferrer" className="text-accent">
                국문 백서 (Archive)
              </a>
              <span className="ml-2 text-xs">작성일: 2018년 12월</span>
            </li>
            <li>
              <a href={links.whitepaperEn} target="_blank" rel="noreferrer" className="text-accent">
                영문 백서 (Archive)
              </a>
              <span className="ml-2 text-xs">작성일: 2018년 12월</span>
            </li>
            <li>
              <a href={links.whitepaperJp} target="_blank" rel="noreferrer" className="text-accent">
                일문 백서 (Archive)
              </a>
              <span className="ml-2 text-xs">작성일: 2018년 12월</span>
            </li>
          </ul>
        </div>
        </div>
      </Section>
    </>
  );
}
