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

      <Section title="설치/백업/복구 가이드">
        <div className="panel p-5 text-sm text-mute space-y-4">
          <div>
            <p className="font-medium text-text">1) 설치 (Qt Wallet)</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>먼저 운영체제 비트(64bit/32bit)를 확인하고, 본인 환경에 맞는 빌드를 선택합니다.</li>
              <li>운영체제에 맞는 공식 빌드를 다운로드하고 SHA256을 먼저 확인합니다.</li>
              <li>다운로드한 압축 파일을 해제한 뒤 `xpchain-qt` 실행 파일을 직접 실행합니다.</li>
              <li>macOS는 `.dmg` 파일을 열어 앱을 Applications 폴더로 복사한 뒤 실행합니다.</li>
              <li>macOS 첫 실행 시 차단 경고가 나오면 시스템 설정 &gt; 개인정보 보호 및 보안에서 `그래도 열기`를 선택합니다.</li>
              <li>최초 실행 후 데이터 폴더를 생성하고, 동기화 완료까지 충분히 대기합니다.</li>
              <li>동기화/암호설정/백업이 끝나기 전에는 큰 금액 입금을 피하고 소액으로 먼저 테스트하세요.</li>
            </ul>
          </div>

          <div>
            <p className="font-medium text-text">2) 암호 설정</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>메뉴에서 지갑 암호화를 설정하고, 추측이 어려운 비밀번호를 사용합니다.</li>
              <li>비밀번호를 잃어버리면 지갑 복구가 어려울 수 있으므로 오프라인으로 별도 기록해 보관합니다.</li>
              <li>암호 설정 후 지갑이 재시작되면 잠금 상태/채굴(스테이킹) 상태를 다시 확인합니다.</li>
            </ul>
          </div>

          <div>
            <p className="font-medium text-text">3) 백업</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>방법 A: 지갑 메뉴의 백업 기능으로 백업 파일을 생성합니다.</li>
              <li>방법 B: 지갑 종료 후 데이터 폴더의 `wallet.dat`를 직접 복사합니다.</li>
              <li>Windows 기준 경로 예시: `%APPDATA%\xpchain\wallet.dat`</li>
              <li>macOS 기준 경로 예시: `~/Library/Application Support/XPChain/wallet.dat` 또는 `~/Library/Application Support/XPChain/wallets/wallet.dat`</li>
              <li>백업 파일은 USB/외장 저장소/비공개 클라우드 등 2곳 이상에 분산 보관하세요.</li>
              <li>백업 파일명은 날짜를 포함해 관리하면 좋습니다. 예: `wallet_20260226.dat`</li>
              <li>새 주소를 추가로 생성한 뒤에는 최신 상태를 반영해 다시 백업하는 것을 권장합니다.</li>
              <li>지갑이 설치된 같은 PC에만 백업을 두는 것은 장애 대비가 되지 않으므로 권장하지 않습니다.</li>
            </ul>
          </div>

          <div>
            <p className="font-medium text-text">4) 복구</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>복구 전제: 백업된 `wallet.dat` 파일이 반드시 필요합니다.</li>
              <li>새 PC/환경에 지갑을 설치하고 1회 실행하여 데이터 폴더를 생성한 뒤, 지갑을 종료합니다.</li>
              <li>Windows 기준으로 데이터 폴더(`%APPDATA%\xpchain`)로 이동해 새로 생성된 `wallet.dat`를 삭제합니다.</li>
              <li>macOS 기준 경로는 환경에 따라 `~/Library/Application Support/XPChain/wallet.dat` 또는 `~/Library/Application Support/XPChain/wallets/wallet.dat`일 수 있습니다.</li>
              <li>macOS에서도 위 경로의 새로 생성된 `wallet.dat`를 삭제한 뒤 백업 파일로 교체합니다.</li>
              <li>보관 중인 백업 파일을 같은 폴더에 복사하고 파일명을 `wallet.dat`로 맞춥니다.</li>
              <li>지갑 재실행 후 동기화가 완료될 때까지 기다리고, 잔액/거래내역을 확인합니다.</li>
              <li>복구 직후에는 소액 송수신으로 정상 동작을 먼저 검증하는 것을 권장합니다.</li>
            </ul>
          </div>

          <div className="rounded-md border border-border bg-bg px-3 py-2 text-xs">
            <p className="font-medium text-text">Linux 참고</p>
            <p className="mt-1">
              Linux는 서비스 운영/노드 중심 절차를 기준으로 별도 정리되어 있습니다.
            </p>
            <a
              href="https://github.com/arnoldcho/xpchain-community-core/blob/master/doc/linux-node-setup-log-vultr.md"
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-block text-accent"
            >
              linux-node-setup-log-vultr.md 참고
            </a>
          </div>

          <div className="rounded-md border border-border bg-bg px-3 py-2 text-xs">
            <p className="font-medium text-text">주의</p>
            <p className="mt-1">개인키/시드/지갑 파일/암호는 절대 메신저나 클라우드 평문으로 공유하지 마세요.</p>
            <p className="mt-1">백업 파일이 없으면 복구가 불가능하며, 비밀번호만으로는 지갑을 복원할 수 없습니다.</p>
            <p className="mt-1">백신/OS 보안 업데이트가 적용된 신뢰 가능한 PC에서만 지갑 설치/복구를 진행하세요.</p>
          </div>
        </div>
      </Section>
    </>
  );
}
