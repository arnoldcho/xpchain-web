import { Section } from '@/components/Section';

export default function WalletReleaseChecklistPage() {
  return (
    <>
      <h1 className="sr-only">Wallet 업데이트 체크리스트</h1>
      <Section title="Wallet 업데이트 체크리스트" subtitle="vNext/Stable, 해시, 검증 명령 운영 기준">
        <div className="space-y-4 text-sm text-mute">
          <article className="panel p-5">
            <p className="font-medium text-text">채널 정의</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>`vNext`: 현재 사용자 배포 기준 버전 (Wallet 페이지 기본 링크 대상)</li>
              <li>`Stable`: 롤백/비교 검증 기준 버전 (직전 안정 릴리즈)</li>
            </ul>
          </article>

          <article className="panel p-5">
            <p className="font-medium text-text">릴리즈 반영 절차</p>
            <ol className="mt-2 list-decimal space-y-1 pl-5">
              <li>vNext 릴리즈 태그와 다운로드 자산(win64/win32/macos dmg/tar/linux)을 확정합니다.</li>
              <li>`xpchain-web/lib/links.ts`의 vNext 다운로드 URL, 릴리즈 태그 링크를 갱신합니다.</li>
              <li>동일 파일의 각 OS SHA256 값을 갱신합니다.</li>
              <li>`xpchain-web/app/wallets/page.tsx`에서 vNext/Stable 표기 문구가 최신인지 확인합니다.</li>
              <li>검증 명령(PowerShell/cmd/macOS/Linux)이 누락 없이 표시되는지 확인합니다.</li>
              <li>Wallet 페이지에서 링크 클릭 동작과 이벤트 키(`wallet_release_*`)가 정상 동작하는지 확인합니다.</li>
            </ol>
          </article>

          <article className="panel p-5">
            <p className="font-medium text-text">Definition of Done (Wallet Release)</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>vNext/Stable 표기가 페이지에서 명확히 노출됨</li>
              <li>4개 OS 자산 해시가 최신 릴리즈와 일치함</li>
              <li>검증 명령 4종(Windows PowerShell/cmd, macOS, Linux) 노출 확인</li>
              <li>릴리즈 링크/다운로드 링크/추적 이벤트 동작 확인</li>
            </ul>
          </article>
        </div>
      </Section>
    </>
  );
}
