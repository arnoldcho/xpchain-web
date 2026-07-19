// 이 파일은 라우트가 아니라 본문 소스다. locale 경로 리다이렉트로 직접 열리지는
// 않지만 app/[locale]/docs/xpc-1-0/** 가 OriginalPage 로 import 해서 렌더링한다.
// 같이 있던 다른 non-locale 중복 페이지들과 달리 삭제하면 문서 본문이 사라진다.
import { Section } from '@/components/Section';

const series = [
  {
    slug: '/docs/xpc-1-0/part-1',
    title: 'Part 1. 비트코인 0.17.0 기반 PoS',
    description: 'SegWit 지원, 비트코인 0.17.0 기반 구조, PoS 채택 배경을 정리합니다.',
    status: '공개'
  },
  {
    slug: '/docs/xpc-1-0/part-2',
    title: 'Part 2. ABPoS 상세',
    description: 'ABPoS의 보상 배분 구조, 즉시 분배 설정, 수수료 소각 개념을 정리합니다.',
    status: '공개'
  },
  {
    slug: '/docs/xpc-1-0/part-3',
    title: 'Part 3. XPC 블록체인 사양',
    description: '체인 사양, ABPoS 이율, 초기 분배 문서와 현재 상태 주석을 함께 정리합니다.',
    status: '공개'
  }
];

export default function XpcSeriesPage() {
  return (
    <>
      <h1 className="sr-only">XPC 1.0 시리즈</h1>
      <Section title="XPC 1.0 시리즈" subtitle="초기 기술 포스팅을 현재 운영 기준으로 재정리한 문서입니다.">
        <div className="panel p-5 text-sm text-mute">
          <p className="text-text">시리즈 안내</p>
          <p className="mt-2">
            이 시리즈는 초기 작성본의 내용을 보존하면서, 현재 운영 기준과 차이가 있는 항목은 주석으로 분리해 제공합니다.
          </p>
        </div>

        <div className="mt-4 space-y-3">
          {series.map((item) => (
            <article key={item.title} className="panel p-5 text-sm text-mute">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-base text-text">{item.title}</p>
                <span className="rounded border border-line px-2 py-0.5 text-xs">{item.status}</span>
              </div>
              <p className="mt-2">{item.description}</p>
              {item.slug !== '#' ? (
                <a href={item.slug} className="mt-3 inline-block text-accent">
                  문서 보기
                </a>
              ) : null}
            </article>
          ))}
        </div>
      </Section>
    </>
  );
}
