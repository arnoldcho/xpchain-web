import { Section } from '@/components/Section';

export default function RoadmapPage() {
  return (
    <Section title="로드맵" subtitle="방향성과 실행 항목을 함께 공개합니다.">
      <div className="space-y-5 text-sm text-text">
        <div className="panel p-5 sm:p-6">
          <h3 className="text-lg font-semibold text-text">A. 방향 로드맵 (대외 기준)</h3>
          <p className="mt-3 leading-relaxed text-mute">
            XPChain의 로드맵은 단기 이벤트 중심이 아니라, 네트워크 안정성과 지속 가능성을 기준으로 설계됩니다.
            과도한 확장보다 분산 구조 강화와 운영 절차 정교화를 우선합니다.
          </p>
          <div className="mt-4 space-y-4">
            <div>
              <p className="font-semibold text-text">1) 네트워크 안정성 유지</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-mute">
                <li>블록 생성 안정성 지속 점검</li>
                <li>노드 연결 상태 모니터링 및 개선</li>
                <li>네트워크 상태 지표 공개 범위 확대</li>
                <li>스테이킹 참여 환경 개선</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-text">2) 인프라 및 지갑 개선</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-mute">
                <li>Qt 지갑 유지보수 및 빌드 안정성 강화</li>
                <li>다중 OS 배포 자동화 유지</li>
                <li>배포 파일 무결성 검증 체계 강화 (SHA-256)</li>
                <li>UTXO 관리 편의성 개선 검토</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-text">3) 분산 구조 강화</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-mute">
                <li>자발적 노드 참여 확대</li>
                <li>스테이킹 참여율 점진적 개선</li>
                <li>블록 생성 분포 모니터링</li>
                <li>운영 의존도 점진적 완화</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-text">4) 실사용 사례 축적</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-mute">
                <li>SmartPig를 포함한 응용 사례 안정적 운영</li>
                <li>XRoutine 등 참여 기반 구조 정비</li>
                <li>네트워크를 활용하는 다양한 가능성 연구</li>
              </ul>
              <p className="mt-2 text-mute">
                XPChain은 특정 서비스에 종속되지 않으며, 여러 응용이 연결될 수 있는 독립 네트워크로 유지됩니다.
              </p>
            </div>
            <div>
              <p className="font-semibold text-text">5) 기록과 투명성</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-mute">
                <li>릴리즈 기록의 지속적 축적</li>
                <li>합의 변경 사항의 명확한 구분 공지</li>
                <li>운영 문서 및 아카이브 유지</li>
                <li>네트워크 상태의 지속적 공개</li>
              </ul>
            </div>
          </div>
          <p className="mt-4 leading-relaxed text-mute">
            방향성: XPChain은 빠른 변화보다 안정적인 유지와 점진적 개선을 선택하며, 시간을 통해 검증되는 네트워크를
            지향합니다.
          </p>
        </div>

        <div className="panel p-5 sm:p-6">
          <h3 className="text-lg font-semibold text-text">B. 실행 로드맵 (운영 항목)</h3>
          <p className="mt-3 text-mute">
            아래 항목은 실제 운영/개발 우선순위이며, 검증 결과와 네트워크 상태에 따라 순서가 조정될 수 있습니다.
          </p>

          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            <div className="rounded-lg border border-line bg-bg/40 p-4">
              <p className="text-sm font-semibold text-accent">Now</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-mute">
                <li>Windows x64/x86 지갑 최종 동작 검증</li>
                <li>지갑 사용자 가이드(설치/백업/복구) 공개본 정리</li>
                <li>Explorer 상태 갱신/캐시 정책 운영값 미세 조정</li>
              </ul>
            </div>
            <div className="rounded-lg border border-line bg-bg/40 p-4">
              <p className="text-sm font-semibold text-accent">Next</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-mute">
                <li>노드 운영 문서(Ubuntu) 공개본 확정</li>
                <li>공지/문서/릴리즈 업데이트 절차(runbook) 표준화</li>
                <li>지갑/릴리즈 검증 체크리스트 정기 운영</li>
              </ul>
            </div>
            <div className="rounded-lg border border-line bg-bg/40 p-4">
              <p className="text-sm font-semibold text-accent">Later</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-mute">
                <li>Seed 인프라(`seed1~seed3`) 운영 정책 확정 및 적용</li>
                <li>로드맵/철학/공지 연동 구조 및 업데이트 주기 고정</li>
                <li>운영 지표 공개 항목 고도화</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="panel p-5 text-mute">
          <p>
            본 로드맵은 운영 기준 문서이며 투자 판단 자료가 아닙니다. 일정은 네트워크 안정성과 검증 결과를 기준으로
            조정될 수 있습니다.
          </p>
        </div>
      </div>
    </Section>
  );
}
