import { Section } from '@/components/Section';

export default function DefinitionOfDoneChecklistPage() {
  return (
    <>
      <h1 className="sr-only">Definition of Done 체크리스트</h1>
      <Section title="Definition of Done 체크리스트" subtitle="배포/문서 반영 시 완료 기준">
        <div className="space-y-4 text-sm text-mute">
          <article className="panel p-5">
            <p className="font-medium text-text">1) 공통 완료 기준</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>금지 표현 점검 완료 (투자 권유/수익 보장/가격 유도 문구 없음)</li>
              <li>핵심 페이지 링크 및 외부 링크 동작 확인</li>
              <li>모바일/데스크톱 기본 렌더링 및 접근 동선 확인</li>
              <li>`npm run lint` 통과</li>
              <li>`npm run build` 통과</li>
              <li>변경 내용에 맞는 문서/공지 반영 완료</li>
            </ul>
          </article>

          <article className="panel p-5">
            <p className="font-medium text-text">2) 페이지별 완료 기준</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Staking: OS별 5분 재가동 절차와 점검 명령 최신화</li>
              <li>Wallets: vNext/Stable, SHA256, 검증 명령 최신화</li>
              <li>Network/Explorer: 상태 API 정상 응답 및 fallback 동작 확인</li>
              <li>Docs/Notices: 운영 원칙/공지 이력 최신화</li>
            </ul>
          </article>

          <article className="panel p-5">
            <p className="font-medium text-text">3) 완료 증빙</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>검증일</li>
              <li>검증자</li>
              <li>관련 커밋 SHA</li>
              <li>비고/후속 작업</li>
            </ul>
          </article>
        </div>
      </Section>
    </>
  );
}
