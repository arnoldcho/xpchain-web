# Public Repo Readiness Checklist

작성일: 2026-02-27  
대상 저장소: `xpchain-web`

## 1) 비밀값/민감정보 재스캔

- [x] 워킹트리 기준 민감 패턴 재스캔 완료
- [x] `.env` 파일이 Git 추적 대상이 아님 확인 (`.gitignore: .env*`)
- [x] `.env.example`는 샘플 값만 포함됨 확인
- [x] 현재 히스토리에서 대표 비밀 키 패턴(`AKIA`, `ghp_`, `github_pat_`, `PRIVATE KEY` 등) 미검출
- [x] `docs/internal`, `docs/old` 및 관련 파일은 히스토리 재작성으로 제거 완료

참고:
- `TRACKING_STATS_TOKEN`, `XPCHAIN_RPC_PASSWORD`는 코드에서 환경변수 이름으로만 사용됨
- 공개 문서/페이지의 `YOUR_TOKEN`은 예시 문자열임

## 2) GitHub 저장소 기본 설정 (수동 적용)

### Branch protection (`main`)
- [x] Require a pull request before merging
- [x] Require status checks to pass before merging
- [x] Block force pushes (관리자 포함 여부는 운영 정책에 따름)
- [x] Restrict who can push to matching branches (필요 시, 현재 단독 운영 기준 미적용)

### 보안/운영 설정
- [x] Private -> Public 전환 전 최종 리뷰자 지정
- [x] Security advisories 활성화
- [x] Secret scanning 활성화 (가능 플랜에서)
- [x] Dependabot alerts/security updates 활성화
- [x] Issue/Discussion 정책 확정 (열기/닫기)

#### 최종 리뷰 기록
- 리뷰자: `arnoldcho`
- 리뷰일: `2026-02-27`
- 범위: `public 전환`, `branch protection`, `security/dependabot 설정`, `민감 문서 분리/히스토리 정리`
- 비고: `Secret Protection(Secret scanning 계열)`은 저장소 설정 화면에서 `Enable` 버튼 상태로 남아 있어 필요 시 추가 활성화

### 저장소 메타
- [x] `README` 최신 상태 확인
- [x] `LICENSE` 추가 여부 확정
- [x] 기본 브랜치/기본 라벨/템플릿 정책 확정

메모:
- 기본 브랜치: `main`
- 라벨 정책: GitHub 기본 라벨 유지 + 필요 시 운영 중 추가
- 템플릿: PR 템플릿, Issue 템플릿(`bug`, `feature`) 적용

## 3) Public 전환 직전 최종 확인

- [ ] `npm run lint` 통과
- [ ] `npm run build` 통과
- [ ] 남은 작업 체크리스트 확인 (`REMAINING_WORK_ITEMS.md`)
- [ ] 공개 시점 공지 문구/릴리즈 노트 준비
