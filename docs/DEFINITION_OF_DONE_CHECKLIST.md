# Definition of Done 체크리스트

작성일: 2026-02-27  
목적: 배포/공지/문서 반영 시 “완료” 기준을 일관되게 적용하기 위한 공통 체크리스트

## 1) 공통 완료 기준

- [ ] 금지 표현 점검 완료 (투자 권유/수익 보장/가격 유도 문구 없음)
- [ ] 핵심 페이지 링크 및 외부 링크 동작 확인
- [ ] 모바일/데스크톱 기본 렌더링 및 접근 동선 확인
- [ ] `npm run lint` 통과
- [ ] `npm run build` 통과
- [ ] 변경 내용에 맞는 문서/공지 반영 완료

## 2) 페이지별 완료 기준

### Staking
- [ ] Windows/macOS/Linux 5분 재가동 절차가 최신 운영 기준과 일치
- [ ] 상태 점검 명령(`getblockchaininfo`, `getwalletinfo`, `listmintings`, `getmininginfo`, `getnetworkinfo`) 안내 최신화
- [ ] staking-only unlock 재적용 안내 포함

### Wallets
- [ ] `vNext`/`Stable` 표기 최신화
- [ ] 다운로드 링크 및 SHA256 최신 릴리즈 기준 반영
- [ ] 검증 명령(Windows PowerShell/cmd, macOS, Linux) 노출 확인
- [ ] `/docs/wallet-release-checklist`와 기준 일치

### Network / Explorer
- [ ] `/api/status`, `/api/explorer/live` 정상 응답 확인
- [ ] fallback/오류 메시지 노출 정책 확인

### Docs / Notices
- [ ] 운영 범위/원칙 문구 최신 상태 반영
- [ ] 공지 이력 날짜/내용 반영

## 3) 완료 증빙

- [ ] 검증일:
- [ ] 검증자:
- [ ] 관련 커밋 SHA:
- [ ] 비고/후속 작업:
