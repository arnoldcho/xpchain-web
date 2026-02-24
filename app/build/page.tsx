import { Section } from '@/components/Section';

export default function BuildPage() {
  return (
    <Section title="빌드" subtitle="XPChain 위에서 동작하는 실사용 사례를 소개합니다.">
      <div className="grid gap-4 md:grid-cols-2">
        <article className="panel p-5">
          <h3 className="text-lg font-semibold text-text">SmartPig</h3>
          <p className="mt-2 text-sm text-mute">
            AI 리서치/브리핑 워크플로우입니다. XPChain은 선택 가능한 유틸리티 레이어로 연결됩니다.
          </p>
        </article>
        <article className="panel p-5">
          <h3 className="text-lg font-semibold text-text">XRoutine</h3>
          <p className="mt-2 text-sm text-mute">
            루틴 기반 참여 모델입니다. 가격/거래 중심이 아닌 지속 가능한 참여 구조를 지향합니다.
          </p>
        </article>
      </div>
    </Section>
  );
}
