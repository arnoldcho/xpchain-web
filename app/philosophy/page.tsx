import { Section } from '@/components/Section';

export default function PhilosophyPage() {
  return (
    <>
      <h1 className="sr-only">철학</h1>
      <Section title="철학" subtitle="XPChain이 유지되는 방식과 커뮤니티 운영 원칙">
        <div className="space-y-4 text-sm text-text">
        <div className="panel p-5">
          <h2 className="text-lg font-semibold text-text sm:text-xl">존재 이유</h2>
          <div className="mt-3 space-y-2 leading-relaxed text-mute">
            <p>XPChain은 장기적으로 기록과 신뢰를 축적하는 독립 메인넷을 지향합니다.</p>
            <p>시간이 지날수록 검증 가능한 운영 데이터를 쌓고, 참여 기반의 네트워크로 유지되는 것을 목표로 합니다.</p>
          </div>
        </div>

        <div className="panel p-5">
          <h2 className="text-lg font-semibold text-text sm:text-xl">핵심 철학</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-mute">
            <li>
              <span className="font-semibold text-text">분산</span>: 특정 주체의 통제가 아닌 다수 노드 참여를 통해 체인의
              안정성과 독립성을 강화합니다.
            </li>
            <li>
              <span className="font-semibold text-text">검증 가능성</span>: 네트워크 상태, API, 릴리즈 노트, 해시 값을
              공개하여 누구나 확인 가능한 구조를 유지합니다.
            </li>
            <li>
              <span className="font-semibold text-text">장기 지속성</span>: 단기 이벤트보다 유지 가능한 운영 절차와 문서
              축적을 우선합니다.
            </li>
          </ul>
        </div>

        <div className="panel p-5">
          <h2 className="text-lg font-semibold text-text sm:text-xl">운영 투명성 원칙</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-mute">
            <li>중요한 변경 사항은 릴리즈 노트를 통해 사유와 범위를 명확히 남깁니다.</li>
            <li>합의(Consensus)에 영향을 주는 변경은 별도로 구분하여 안내합니다.</li>
            <li>지갑 배포 파일은 SHA-256 해시와 검증 방법을 함께 제공합니다.</li>
            <li>네트워크 및 익스플로러 상태는 측정 가능한 지표 기반으로 표시합니다.</li>
            <li>과거 문서는 아카이브로 분리하고, 현재 기준과의 차이를 명시합니다.</li>
          </ul>
        </div>

        <div className="panel p-5">
          <h2 className="text-lg font-semibold text-text sm:text-xl">커뮤니케이션 경계</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-mute">
            <li>이 사이트의 모든 내용은 투자 권유가 아닙니다.</li>
            <li>수익, 가격, 환금성에 대한 어떠한 보장도 제공하지 않습니다.</li>
            <li>스테이킹은 수익 상품이 아니라 네트워크 참여 행위로 안내합니다.</li>
            <li>확인되지 않은 정보나 추정은 공식 문서 및 공지에서 사실로 단정하지 않습니다.</li>
          </ul>
        </div>

        <div className="panel p-5">
          <h2 className="text-lg font-semibold text-text sm:text-xl">XPChain과 응용 서비스</h2>
          <div className="mt-3 space-y-2 leading-relaxed text-mute">
            <p>SmartPig는 핵심 개발이 대부분 완료되었고, XRoutine은 현재 개발 중입니다.</p>
            <p>SmartPig의 XPC 결제 연동은 크롬 확장프로그램 결제/편의기능 업데이트 이후 적용할 예정입니다.</p>
            <p>XPChain은 특정 서비스에 종속되지 않으며, 여러 응용이 연결될 수 있는 독립 네트워크로 존재합니다.</p>
          </div>
        </div>
        </div>
      </Section>
    </>
  );
}
