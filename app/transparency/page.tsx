import { Section } from '@/components/Section';

export default function TransparencyPage() {
  return (
    <Section title="투명성" subtitle="운영 원칙 및 커뮤니케이션 경계">
      <div className="panel p-5 text-sm text-text">
        <ul className="list-disc space-y-2 pl-5">
          <li>이 사이트의 모든 내용은 투자 권유가 아닙니다.</li>
          <li>수익, 가격, 환금성에 대한 어떠한 보장도 제공하지 않습니다.</li>
          <li>XPChain은 커뮤니티 기반으로 유지/개선됩니다.</li>
          <li>핵심 우선순위는 분산성과 네트워크 안정성입니다.</li>
        </ul>
      </div>
    </Section>
  );
}
