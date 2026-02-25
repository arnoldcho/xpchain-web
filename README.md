# XPChain 웹사이트

XPChain 공식 웹사이트(`www.xpchain.co.kr`) 프로젝트입니다.

## 기술 스택

- Next.js 14
- TypeScript
- Tailwind CSS

## 사전 준비

- Node.js 18 이상 권장
- npm 사용

## 설치 및 로컬 실행

```bash
npm install
cp .env.example .env
npm run dev
```

브라우저에서 `http://localhost:3000`으로 접속합니다.

## 프로덕션 빌드 및 실행

```bash
npm run build
npm run start
```

기본 실행 포트는 `3000`입니다.

## PM2 운영 예시

`ecosystem.config.cjs`를 사용해 PM2로 운영할 수 있습니다.

```bash
npm run build
pm2 start ecosystem.config.cjs
pm2 list
pm2 logs xpchain-web --lines 100
```

변경 반영 시에는 아래처럼 재시작합니다.

```bash
pm2 restart xpchain-web
pm2 restart xpchain-web-monitor
```

## 환경 변수

`.env.example`을 `.env`로 복사한 뒤 환경에 맞게 설정합니다.

- `XPCHAIN_RPC_URL`: XPChain 노드 RPC 주소
- `XPCHAIN_RPC_USER`: RPC 인증 사용자
- `XPCHAIN_RPC_PASSWORD`: RPC 인증 비밀번호
- `XPCHAIN_NETWORK_NAME`: 네트워크 이름(예: `mainnet`)
- `XPCHAIN_RPC_TIMEOUT_MS`: RPC 타임아웃(ms)
- `EXPLORER_DB_STATUS_URL`: 익스플로러 DB 상태 API 주소
- `EXPLORER_DB_STATUS_TIMEOUT_MS`: 익스플로러 DB 상태 조회 타임아웃(ms)

## 주요 스크립트

- `npm run dev`: 개발 서버 실행
- `npm run build`: 프로덕션 빌드 생성
- `npm run start`: 프로덕션 서버 실행
- `npm run lint`: 린트 실행
- `npm run monitor:api`: API 상태 모니터 스크립트 실행

## 디렉터리 구조

- `app/`: Next.js App Router 페이지 및 API 라우트
- `components/`: 공용 UI 컴포넌트
- `lib/`: 링크/설정/유틸리티
- `public/`: 정적 에셋(문서, 백서, 이미지)
- `docs/`: 기획 문서, 내부 노트, 마이그레이션 기록

## 참고

- `docs/internal`에 운영 문서가 포함되어 있어 현재 저장소는 비공개 운영을 전제로 합니다.
- 오픈소스 전환이 필요하면 공개 가능한 문서/코드를 별도 분리하는 방식을 권장합니다.
