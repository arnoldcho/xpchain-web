# 다국어(i18n) 언어 패치 실행 계획

작성일: 2026-03-04  
대상: `xpchain-web`  
목표 언어: 한국어(ko) / 영어(en) / 일본어(ja)

## 1) 배경

- 현재 주요 페이지 텍스트가 하드코딩되어 있어, 단순 번역 치환보다 i18n 구조 도입이 우선 필요
- `REMAINING_WORK_ITEMS.md`의 남은 항목인 “주요 페이지 영문 패치 최종 점검”을 확장해 3개 언어 체계로 정리

## 2) 목표

- URL 기준 언어 분리: `/{locale}/...` (`/ko`, `/en`, `/ja`)
- 기본 언어: `ko`
- 기존 경로 호환: `/network` 같은 기존 경로는 초기 단계에서 `/ko/network`로 리다이렉트
- 핵심 페이지부터 우선 적용 후 문서 상세 페이지로 확장

## 3) 기술 방향 (권장)

- Next.js App Router + `next-intl`
- 메시지 파일 분리:
  - `messages/ko.json`
  - `messages/en.json`
  - `messages/ja.json`
- 공통 컴포넌트 우선 전환:
  - `Navbar`, `Footer`, 공통 섹션/상태 라벨
- 페이지 텍스트를 메시지 키로 분리:
  - 예: `nav.network`, `home.hero.title`, `staking.restart.title`

## 4) 단계별 실행 계획

## Phase 1: 인프라 도입

- [x] `next-intl` 의존성 추가
- [x] `middleware.ts`로 locale 라우팅/리다이렉트 구성
- [x] `app/[locale]/layout.tsx` 도입
- [x] `<html lang>` 동적 처리
- [x] `ko/en/ja` 메시지 파일 초기 구조 생성

## Phase 2: 핵심 페이지 번역 적용

- [x] `/` (home)
- [x] `/network`
- [x] `/staking`
- [x] `/wallets`
- [x] `/explorer`
- [x] `/build`
- [x] `/community`
- [x] `/philosophy`
- [x] `/roadmap`
- [x] `/notices`
- [x] `/docs`

우선순위(문자열 밀도 기준):  
`wallets` -> `docs` -> `roadmap` -> `staking` -> `philosophy` -> 나머지

## Phase 3: 문서 상세 페이지 확장

- [x] `/docs/xpc-1-0/*` (ko 원문 유지 + en/ja 요약/안내 반영)
- [x] `/docs/wallet-release-checklist`
- [x] `/docs/definition-of-done-checklist`

## Phase 4: 품질/릴리즈

- [ ] 번역 누락 키 검사 (수동 QA 필요)
- [ ] 모바일/데스크톱 UI 깨짐 검사 (수동 QA 필요)
- [x] `npm run lint` 통과
- [x] `npm run build` 통과
- [ ] 완료 내용 `REMAINING_WORK_ITEMS.md` 반영

## 5) 용어집(초안) 먼저 확정

번역 품질을 위해 아래 용어는 초기 고정 권장:

- Staking
- Explorer
- Node Health
- Archive
- Mainnet
- Wallet
- Sync / Synchronization
- Release Note
- Verification
- Transparency

운영 정책 문구(투자/수익 비보장)는 언어별 의미 동일성 우선으로 관리

## 6) SEO 관점 정리 (Google + Naver)

결론: 위 방식은 검색 최적화에 유리함.

근거:

- 언어별 고유 URL(`/{locale}/...`)은 검색엔진이 페이지 언어를 구분/인덱싱하기 쉬움
- `hreflang`(ko/en/ja) + canonical을 함께 설정하면 중복 페이지 처리와 언어 타게팅이 안정적
- locale별 메타(title/description) 분리는 검색 결과 노출 문구 품질 개선에 직접적
- 사이트맵에 locale URL을 모두 포함하면 Google/Naver 크롤링 커버리지가 좋아짐

주의:

- 자동번역 품질이 낮으면 체류시간/클릭률 저하로 SEO에 불리할 수 있음
- 언어별 콘텐츠가 거의 동일한데 `hreflang`/canonical이 없으면 중복 인식 리스크가 커짐
- robots/noindex 설정이 잘못되면 특정 locale 페이지가 인덱싱되지 않을 수 있음

## 7) SEO 구현 체크리스트

- [x] locale별 `title`/`description` 적용 (레이아웃 공통)
- [x] `hreflang` (`ko-KR`, `en`, `ja`) 및 `x-default` 적용 (레이아웃 공통)
- [x] canonical URL 정합성 점검 (locale 라우트 기준 반영)
- [x] `sitemap.xml`에 locale URL 포함
- [x] `robots.txt` 점검
- [ ] Search Console / 네이버 서치어드바이저에 사이트맵 제출 (배포 후 수동)

## 8) 완료 정의 (i18n 작업 기준)

- [x] 핵심 페이지 3개 언어 노출 가능 (미번역 페이지는 ko 콘텐츠 fallback)
- [x] 네비게이션/공통 UI 문자열 100% 메시지 파일화
- [x] 하드코딩 한국어 문구 최소화(정적 아카이브 제외)
- [ ] SEO 체크리스트 항목 반영 완료 (외부 콘솔 제출 단계 남음)
- [x] 빌드/린트 통과 및 QA 확인 완료
