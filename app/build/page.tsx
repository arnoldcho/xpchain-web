import { Section } from '@/components/Section';

export default function BuildPage() {
  return (
    <>
      <h1 className="sr-only">빌드</h1>
      <Section title="빌드" subtitle="XPChain 위에서 동작하는 실사용 사례를 소개합니다.">
        <div className="grid gap-4 md:grid-cols-2">
          <article className="panel p-5">
            <h3 className="text-lg font-semibold text-text">SmartPig</h3>
            <p className="mt-2 text-sm text-mute">
              AI 리서치/브리핑 워크플로우로 핵심 기능 개발은 대부분 마무리되었습니다.
              XPC 결제는 크롬 확장프로그램 결제 연동/편의기능 업데이트 이후 단계적으로 반영할 예정입니다.
            </p>
          </article>
          <article className="panel p-5">
            <h3 className="text-lg font-semibold text-text">XRoutine</h3>
            <p className="mt-2 text-sm text-mute">
              루틴 기반 참여 모델로 현재 개발 진행 중입니다.
            </p>
          </article>
        </div>
      </Section>
    </>
  );
}
