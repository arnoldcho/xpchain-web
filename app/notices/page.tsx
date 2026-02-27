import { Section } from '@/components/Section';

const notices = [
  { date: '2026-02-27', title: '문서 페이지에 “히스토리 + 현재 운영 범위” 공개 기준 문구를 게시했습니다.' },
  { date: '2026-02-26', title: '문서 페이지에 v0.17.0-4 릴리스 검증 결과(macOS/Linux/Windows x64/x86 PASS)를 반영했습니다.' },
  { date: '2026-02-26', title: '블록체인 익스플로러 검색/주소 조회 성능 및 로딩 표시 개선 작업을 완료했습니다.' },
  { date: '2026-02-25', title: '문서 페이지에 XPC 1.0 기술 시리즈 Part 3(체인 사양)를 등록했습니다.' },
  { date: '2026-02-25', title: '문서 페이지에 XPC 1.0 기술 시리즈 Part 2(ABPoS)를 등록했습니다.' },
  { date: '2026-02-24', title: '문서 페이지에 XPC 1.0 기술 시리즈(Part 1)를 등록했습니다.' },
  { date: '2026-02-24', title: '웹사이트 리뉴얼 개발을 시작하고 아키텍처 기준을 확정했습니다.' },
  { date: '2026-02-24', title: '네트워크 상태 API(/api/status) 기반 대시보드 구조를 반영했습니다.' },
  { date: '2026-02-24', title: '백서 3개 언어 파일을 서버 호스팅으로 전환하고 문서 페이지를 정리했습니다.' }
];

export default function NoticesPage() {
  return (
    <>
      <h1 className="sr-only">공지</h1>
      <Section title="공지" subtitle="운영 업데이트와 변경 내역을 공유합니다.">
        <div className="panel divide-y divide-line">
          {notices.map((item) => (
            <article key={item.title} className="p-4 text-sm">
              <p className="text-mute">{item.date}</p>
              <p className="mt-1 text-text">{item.title}</p>
            </article>
          ))}
        </div>
      </Section>
    </>
  );
}
