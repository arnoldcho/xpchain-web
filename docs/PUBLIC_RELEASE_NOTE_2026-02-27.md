# XPChain Web Public 전환 공지 / 릴리즈 노트

작성일: 2026-02-27

## 요약
- `xpchain-web` 저장소를 public 운영 기준으로 정리했습니다.
- 민감 문서는 별도 private 저장소(`xpchain-web-private-docs`)로 분리했습니다.
- 브랜치 보호, 보안 설정, Dependabot, 체크리스트 문서를 공개 운영 기준으로 정비했습니다.

## 포함된 주요 변경
- Wallet 운영 체크리스트 및 Definition of Done 문서 추가
- Public 전환 준비 체크리스트 문서화
- GitHub Actions CI(`lint`, `build`) 추가
- PR/Issue 템플릿 추가
- README 공개 기준 문구 업데이트
- LICENSE(MIT) 추가

## 운영 기준
- `main` 브랜치 보호 규칙 적용
- 필수 체크: `lint`, `build`
- 민감 운영 정보는 public 저장소에 커밋하지 않음

## 알려진 후속 작업
- `REMAINING_WORK_ITEMS.md` 기준: `주요 페이지 영문 패치 최종 점검` 1건 잔여
