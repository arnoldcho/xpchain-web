import { Section } from '@/components/Section';
import { links } from '@/lib/links';

export default function WalletsPage() {
  return (
    <>
      <Section title="지갑" subtitle="공식 다운로드 경로와 보안 권고를 제공합니다.">
        <div className="grid gap-4 md:grid-cols-3">
          <article className="panel p-5">
            <h3 className="text-lg font-semibold text-text">Qt Wallet</h3>
            <p className="mt-2 text-sm text-mute">풀노드 운영과 스테이킹에 적합한 데스크톱 지갑입니다.</p>
            <div className="mt-4 space-y-1 text-sm">
              <a href={links.walletQtWin64} target="_blank" rel="noreferrer" className="block text-accent">
                Windows 64bit 다운로드
              </a>
              <a href={links.walletQtWin32} target="_blank" rel="noreferrer" className="block text-accent">
                Windows 32bit 다운로드
              </a>
              <a href={links.walletQtMac} target="_blank" rel="noreferrer" className="block text-accent">
                macOS 64bit 다운로드
              </a>
              <a href={links.walletQtLinux} target="_blank" rel="noreferrer" className="block text-accent">
                Linux x86_64 다운로드
              </a>
              <a href={links.walletQtReleaseV4} target="_blank" rel="noreferrer" className="block pt-1 text-mute">
                릴리즈 XPChain Core v0.17.0-4
              </a>
              <a href={links.walletQtReleaseV3Stable} target="_blank" rel="noreferrer" className="block text-mute">
                릴리즈 목록 (이전/Stable 버전 확인)
              </a>
            </div>
          </article>
          <article className="panel p-5">
            <h3 className="text-lg font-semibold text-text">Web Wallet</h3>
            <p className="mt-2 text-sm text-mute">일상적 사용을 위한 웹 기반 지갑입니다.</p>
            <a href={links.walletWeb} target="_blank" rel="noreferrer" className="mt-4 inline-block text-sm text-accent">
              웹 지갑 열기
            </a>
          </article>
          <article className="panel p-5">
            <h3 className="text-lg font-semibold text-text">Chrome Extension</h3>
            <p className="mt-2 text-sm text-mute">브라우저에서 빠르게 접근 가능한 확장 지갑입니다.</p>
            <a href={links.walletExtension} target="_blank" rel="noreferrer" className="mt-4 inline-block text-sm text-accent">
              크롬 웹스토어 열기
            </a>
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
