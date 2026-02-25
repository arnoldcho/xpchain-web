import { Section } from '@/components/Section';
import { TrackedLink } from '@/components/TrackedLink';
import { links } from '@/lib/links';

export default function WalletsPage() {
  return (
    <>
      <h1 className="sr-only">지갑</h1>
      <Section title="지갑" subtitle="공식 다운로드 경로와 보안 권고를 제공합니다.">
        <div className="grid gap-4 md:grid-cols-3">
          <article className="panel p-5">
            <h3 className="text-lg font-semibold text-text">Qt Wallet</h3>
            <p className="mt-2 text-sm text-mute">풀노드 운영과 스테이킹에 적합한 데스크톱 지갑입니다.</p>
            <div className="mt-4 space-y-1 text-sm">
              <TrackedLink
                href={links.walletQtWin64}
                target="_blank"
                className="block text-accent"
                category="wallet_download"
                eventKey="wallet_qt_win64"
                sourcePath="/wallets"
              >
                Windows 64bit 다운로드
              </TrackedLink>
              <TrackedLink
                href={links.walletQtWin32}
                target="_blank"
                className="block text-accent"
                category="wallet_download"
                eventKey="wallet_qt_win32"
                sourcePath="/wallets"
              >
                Windows 32bit 다운로드
              </TrackedLink>
              <TrackedLink
                href={links.walletQtMac}
                target="_blank"
                className="block text-accent"
                category="wallet_download"
                eventKey="wallet_qt_macos_dmg"
                sourcePath="/wallets"
              >
                macOS 64bit 다운로드
              </TrackedLink>
              <TrackedLink
                href={links.walletQtLinux}
                target="_blank"
                className="block text-accent"
                category="wallet_download"
                eventKey="wallet_qt_linux_x64"
                sourcePath="/wallets"
              >
                Linux x86_64 다운로드
              </TrackedLink>
              <TrackedLink
                href={links.walletQtReleaseV4}
                target="_blank"
                className="block pt-1 text-mute"
                category="wallet_download"
                eventKey="wallet_release_v01704"
                sourcePath="/wallets"
              >
                릴리즈 XPChain Core v0.17.0-4
              </TrackedLink>
              <TrackedLink
                href={links.walletQtReleaseV3Stable}
                target="_blank"
                className="block text-mute"
                category="wallet_download"
                eventKey="wallet_release_stable_legacy"
                sourcePath="/wallets"
              >
                릴리즈 목록 (이전/Stable 버전 확인)
              </TrackedLink>
            </div>
          </article>
          <article className="panel p-5">
            <h3 className="text-lg font-semibold text-text">Web Wallet</h3>
            <p className="mt-2 text-sm text-mute">모바일 환경에 최적화되어 빠르고 간편하게 사용할 수 있는 웹 지갑입니다.</p>
            <TrackedLink
              href={links.walletWeb}
              target="_blank"
              className="mt-4 inline-block text-sm text-accent"
              category="wallet_download"
              eventKey="wallet_web"
              sourcePath="/wallets"
            >
              웹 지갑 열기
            </TrackedLink>
          </article>
          <article className="panel p-5">
            <h3 className="text-lg font-semibold text-text">Chrome Extension</h3>
            <p className="mt-2 text-sm text-mute">
              브라우저에서 빠르게 접근 가능한 확장 지갑입니다.
              현재 결제 연동 및 각종 편의기능 업데이트를 진행 중입니다.
            </p>
            <TrackedLink
              href={links.walletExtension}
              target="_blank"
              className="mt-4 inline-block text-sm text-accent"
              category="wallet_download"
              eventKey="wallet_chrome_extension"
              sourcePath="/wallets"
            >
              크롬 웹스토어 열기
            </TrackedLink>
          </article>
        </div>
      </Section>

      <Section title="보안 체크리스트">
        <div className="panel p-5 text-sm text-mute">
          <p>지갑 백업과 개인키/시드 문구는 반드시 오프라인 안전 보관을 권장합니다.</p>
          <p className="mt-2">공식 경로에서만 다운로드하고 파일 무결성을 확인하세요.</p>
          <div className="mt-3 rounded-md border border-border bg-bg px-3 py-2 text-xs">
            <p className="font-medium text-text">무결성 확인 (XPChain Core v0.17.0-4)</p>
            <p className="mt-2 break-all">
              Windows 64bit (zip) SHA256: <span className="text-text">{links.walletQtWin64V4Sha256}</span>
            </p>
            <p className="mt-1 break-all">
              Windows 32bit (zip) SHA256: <span className="text-text">{links.walletQtWin32V4Sha256}</span>
            </p>
            <p className="mt-1 break-all">
              macOS (dmg) SHA256: <span className="text-text">{links.walletQtMacDmgV4Sha256}</span>
            </p>
            <p className="mt-1 break-all">
              macOS (tar.gz) SHA256: <span className="text-text">{links.walletQtMacTarV4Sha256}</span>
            </p>
            <p className="mt-1 break-all">
              Linux x86_64 (tar.gz) SHA256: <span className="text-text">{links.walletQtLinuxTarV4Sha256}</span>
            </p>
            <p className="mt-2 break-all">
              검증 명령 (macOS/Linux): <span className="text-text">shasum -a 256 파일명</span>
            </p>
            <p className="mt-1 break-all">
              검증 명령 (Linux): <span className="text-text">sha256sum 파일명</span>
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
