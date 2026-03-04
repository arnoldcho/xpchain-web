# XPChain Web 반복 운영 체크리스트

작성일: 2026-03-04  
용도: 배포할 때마다 반복 점검하는 운영 항목

## A) 배포 직후 응답 점검

- [ ] 홈/언어 루트 응답 확인: `/`, `/ko`, `/en`, `/ja` (200/정상 렌더)
- [ ] 핵심 페이지 응답 확인: `/ko/docs`, `/ko/wallets`, `/ko/staking` (200/콘텐츠 정상)
- [ ] SEO 엔드포인트 확인: `/sitemap.xml`, `/robots.txt` (200)
- [ ] locale 경로 리라이트 확인: `/ko/robots.txt`, `/ko/sitemap.xml` (200)

## B) 검색 반영 모니터링

- [ ] Google Search Console에서 사이트맵 처리 상태 확인 (`성공`)
- [ ] Naver Search Advisor에서 사이트맵/수집 상태 확인
- [ ] 제외/오류 URL(404, 리다이렉트 문제, 미색인) 목록 업데이트

## C) GitHub 보호정책 점검

- [ ] `main` 브랜치 보호규칙 점검 (PR 필수, 강제 푸시 제한)
- [ ] 필수 상태 체크(예: CI/build) 적용 여부 확인
- [ ] 직접 push 우회가 허용되지 않는지 설정 재확인

## D) 주간/월간 루틴

- [ ] 주 1회: 색인 범위/크롤링 오류/모바일 사용성 점검
- [ ] 월 1회: Core Web Vitals 추이 점검 및 개선 항목 기록
