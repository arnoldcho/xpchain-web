// 이 파일은 라우트가 아니라 본문 소스다. locale 경로 리다이렉트로 직접 열리지는
// 않지만 app/[locale]/docs/xpc-1-0/** 가 OriginalPage 로 import 해서 렌더링한다.
// 같이 있던 다른 non-locale 중복 페이지들과 달리 삭제하면 문서 본문이 사라진다.
import Image from 'next/image';
import { Section } from '@/components/Section';

export default function XpcPartThreePage() {
  return (
    <>
      <h1 className="sr-only">XPC 1.0 소개 (3) XPC 블록체인 사양</h1>
      <Section
        title="XPC 1.0 소개 (3) – XPC 블록체인 사양"
        subtitle="XPC 1.0 Blockchain (3) – XPC Specification"
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
            XPC는 비트코인 0.17.0 기반으로 개발되었고, 해당 버전의 기능 및 라이브러리 호환성을 바탕으로 설계되었습니다.
            최대 발행량은 고정형이 아니며, ABPoS 보상 이율은 프로그래밍적으로 상한이 적용됩니다.
          </p>
        </div>

        <div className="panel p-5 text-sm text-mute">
          <h3 className="text-base font-semibold text-text">3) XPC 블록체인 사양</h3>
          <p className="mt-3 font-semibold text-text">XPC 주요 사양</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>기반: 비트코인 0.17.0</li>
            <li>알고리즘: SHA-256d / PoW+PoS (PoW는 프리마인에만 사용됨)</li>
            <li>블록 간격: 60초</li>
            <li>거래 수수료: 최소 0.1 XPC/kB</li>
            <li>초기 발행량: 1130억 XPC</li>
            <li>분배(초기 문서 기준): 에어드랍 77.86%, 재단 19.46%, 초기개발/상장비 2.68%</li>
          </ul>

          <Image
            src="/docs/xpc-1-0/part-3-spec.png"
            alt="XPC coin distribution chart"
            width={1600}
            height={800}
            className="mt-4 h-auto w-full rounded-lg border border-line"
          />
          <p className="mt-2 text-center text-xs text-mute/80">&lt;XPC 코인 분배 차트 (%)&gt;</p>

          <h4 className="mt-5 text-sm font-semibold text-text">ABPoS 이율</h4>
          <p className="mt-2">
            ABPoS 연간 최대 이율은 10%에서 시작해 매년 1%p씩 감소하며, 6년 차 이후 5%로 고정되는 구조로 설명되었습니다.
          </p>
          <Image
            src="/docs/xpc-1-0/part-3-abpos-rate.png"
            alt="ABPoS annual max reward rate by block height"
            width={1600}
            height={718}
            className="mt-4 h-auto w-full rounded-lg border border-line"
          />
          <p className="mt-2 text-center text-xs text-mute/80">
            &lt;XPC ABPoS 보상에 따른 연간 최대 이율(블록번호에 따른 연간 이율)&gt;
          </p>
        </div>

        <div className="panel p-5 text-sm text-mute">
          <h4 className="text-sm font-semibold text-text">토큰 분배 및 운영(초기 기록)</h4>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>초기 개발/상장비: 초기 발행 물량 중 일부가 초기 마케팅/상장 비용 항목으로 설명됨</li>
            <li>에어드랍: XP 보유자 대상 스냅샷 및 신청/분배 절차 기록</li>
            <li>재단 운영: 초기 문서에는 운영 자금 사용 계획이 포함되어 있음</li>
          </ul>
          <p className="mt-3 rounded border border-warn/40 bg-warn/10 px-3 py-2 text-warn">
            현재 상태 주석: 위 분배/재단 항목은 초기 문서의 역사 기록입니다. 현재 운영에서는 과거 문서와 다른 실제
            보유/운영 상태가 있을 수 있으며, 최신 상태는 온체인 데이터와 최신 공지 기준으로 확인해 주세요.
          </p>
        </div>
        </div>
      </Section>
    </>
  );
}
