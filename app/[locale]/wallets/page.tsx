import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Section } from '@/components/Section';
import { TrackedLink } from '@/components/TrackedLink';
import { links } from '@/lib/links';
import type { Locale } from '@/lib/i18n/locales';
import { buildAlternates, buildLocalePath } from '@/lib/seo';

type Props = {
  params: { locale: Locale };
};

type WalletCopy = {
  srTitle: string;
  title: string;
  subtitle: string;
  qtDesc: string;
  webDesc: string;
  webOpen: string;
  extDesc: string;
  extOpen: string;
  win64: string;
  win32: string;
  mac: string;
  linux: string;
  securityTitle: string;
  channelTitle: string;
  channelItems: string[];
  backupNotice: string;
  downloadNotice: string;
  integrityTitle: string;
  commandPs: string;
  commandCmd: string;
  commandMac: string;
  commandLinux: string;
  checklistLink: string;
  checklistPrefix: string;
  releaseNextLabel: string;
  releaseStableLabel: string;
  verifyFileName: string;
  guideTitle: string;
  installTitle: string;
  installItems: string[];
  passwordTitle: string;
  passwordItems: string[];
  backupTitle: string;
  backupItems: string[];
  recoveryTitle: string;
  recoveryItems: string[];
  linuxRefTitle: string;
  linuxRefBody: string;
  linuxRefLink: string;
  cautionTitle: string;
  cautionItems: string[];
};

const walletCopy: Record<Locale, WalletCopy> = {
  ko: {
    srTitle: '지갑',
    title: '지갑',
    subtitle: '공식 다운로드 경로와 보안 권고를 제공합니다.',
    qtDesc: '풀노드 운영과 스테이킹에 적합한 데스크톱 지갑입니다.',
    webDesc: '모바일 환경에 최적화되어 빠르고 간편하게 사용할 수 있는 웹 지갑입니다.',
    webOpen: '웹 지갑 열기',
    extDesc: '브라우저에서 빠르게 접근 가능한 확장 지갑입니다. 현재 결제 연동 및 편의기능 업데이트를 진행 중입니다.',
    extOpen: '크롬 웹스토어 열기',
    win64: 'Windows 64bit 다운로드',
    win32: 'Windows 32bit 다운로드',
    mac: 'macOS 64bit 다운로드',
    linux: 'Linux x86_64 다운로드',
    securityTitle: '보안 체크리스트',
    channelTitle: '릴리즈 채널 기준',
    channelItems: [
      '`vNext`: 현재 사용자 배포/안내 기준. 본 페이지의 다운로드 링크와 SHA256은 vNext 기준으로 유지합니다.',
      '`Stable`: 롤백/비교 검증 기준. 운영 중 문제가 발생하면 Stable로 회귀 가능한 상태를 유지합니다.'
    ],
    backupNotice: '지갑 백업과 개인키/시드 문구는 반드시 오프라인 안전 보관을 권장합니다.',
    downloadNotice: '공식 경로에서만 다운로드하고 파일 무결성을 확인하세요.',
    integrityTitle: '무결성 확인 (XPChain Core v0.17.0-4)',
    commandPs: '검증 명령 (Windows PowerShell)',
    commandCmd: '검증 명령 (Windows cmd)',
    commandMac: '검증 명령 (macOS)',
    commandLinux: '검증 명령 (Linux)',
    checklistLink: 'Wallet 업데이트 체크리스트',
    checklistPrefix: '운영 체크리스트',
    releaseNextLabel: 'vNext',
    releaseStableLabel: 'Stable',
    verifyFileName: '파일명',
    guideTitle: '설치/백업/복구 가이드',
    installTitle: '1) 설치 (Qt Wallet)',
    installItems: [
      '운영체제 비트(64bit/32bit)를 확인하고 맞는 빌드를 선택합니다.',
      '공식 빌드를 다운로드하고 SHA256을 먼저 확인합니다.',
      '압축 해제 후 `xpchain-qt` 실행 파일을 실행합니다.',
      'macOS는 `.dmg`로 앱을 Applications 폴더로 복사 후 실행합니다.',
      '첫 실행 후 데이터 폴더를 생성하고 동기화 완료까지 충분히 대기합니다.'
    ],
    passwordTitle: '2) 암호 설정',
    passwordItems: [
      '지갑 암호화를 설정하고 추측이 어려운 비밀번호를 사용합니다.',
      '비밀번호 분실 시 복구가 어려울 수 있으므로 오프라인으로 보관합니다.',
      '암호 설정 후 잠금 상태/스테이킹 상태를 재확인합니다.'
    ],
    backupTitle: '3) 백업',
    backupItems: [
      '방법 A: 지갑 메뉴의 백업 기능으로 백업 파일 생성',
      '방법 B: 지갑 종료 후 데이터 폴더의 `wallet.dat` 직접 복사',
      'Windows 예시: `%APPDATA%\\xpchain\\wallet.dat`',
      'macOS 예시: `~/Library/Application Support/XPChain/wallet.dat`',
      '백업 파일은 2곳 이상(USB/외장/비공개 클라우드)에 분산 보관',
      '새 주소 생성 후에는 최신 상태로 재백업 권장'
    ],
    recoveryTitle: '4) 복구',
    recoveryItems: [
      '복구에는 백업된 `wallet.dat` 파일이 반드시 필요합니다.',
      '새 환경에 지갑 설치 후 1회 실행해 데이터 폴더를 생성하고 종료합니다.',
      '새로 생성된 `wallet.dat`를 삭제하고 백업 파일로 교체합니다.',
      '파일명을 `wallet.dat`로 맞춘 뒤 지갑을 재실행합니다.',
      '동기화 완료 후 잔액/거래내역 확인, 소액 송수신으로 동작 검증을 권장합니다.'
    ],
    linuxRefTitle: 'Linux 참고',
    linuxRefBody: 'Linux는 서비스 운영/노드 중심 절차를 기준으로 별도 정리되어 있습니다.',
    linuxRefLink: 'linux-node-setup-log-vultr.md 참고',
    cautionTitle: '주의',
    cautionItems: [
      '개인키/시드/지갑 파일/암호는 메신저나 클라우드 평문 공유 금지',
      '백업 파일이 없으면 복구가 불가능하며 비밀번호만으로 복원할 수 없음',
      '백신/OS 보안 업데이트가 적용된 신뢰 가능한 PC에서만 설치/복구 진행'
    ]
  },
  en: {
    srTitle: 'Wallets',
    title: 'Wallets',
    subtitle: 'Official download paths and security recommendations.',
    qtDesc: 'Desktop wallet suitable for full-node operations and staking.',
    webDesc: 'A web wallet optimized for mobile use and quick access.',
    webOpen: 'Open web wallet',
    extDesc: 'Browser extension wallet for quick access. Payment integration and UX updates are in progress.',
    extOpen: 'Open Chrome Web Store',
    win64: 'Download Windows 64bit',
    win32: 'Download Windows 32bit',
    mac: 'Download macOS 64bit',
    linux: 'Download Linux x86_64',
    securityTitle: 'Security Checklist',
    channelTitle: 'Release channels',
    channelItems: [
      '`vNext`: Current user distribution channel. Download links and SHA256 on this page follow vNext.',
      '`Stable`: Rollback/reference channel. Keep a recoverable baseline in case of operational issues.'
    ],
    backupNotice: 'Strongly recommend offline secure storage for wallet backups and private key/seed materials.',
    downloadNotice: 'Download only from official paths and verify file integrity.',
    integrityTitle: 'Integrity verification (XPChain Core v0.17.0-4)',
    commandPs: 'Verify command (Windows PowerShell)',
    commandCmd: 'Verify command (Windows cmd)',
    commandMac: 'Verify command (macOS)',
    commandLinux: 'Verify command (Linux)',
    checklistLink: 'Wallet update checklist',
    checklistPrefix: 'Operations checklist',
    releaseNextLabel: 'vNext',
    releaseStableLabel: 'Stable',
    verifyFileName: 'filename',
    guideTitle: 'Install / Backup / Recovery Guide',
    installTitle: '1) Install (Qt Wallet)',
    installItems: [
      'Check your OS architecture (64bit/32bit) and select the matching build.',
      'Download official build and verify SHA256 first.',
      'Extract and run `xpchain-qt`.',
      'On macOS, open `.dmg` and copy app to Applications.',
      'After first launch, wait until data directory creation and full sync are complete.'
    ],
    passwordTitle: '2) Set wallet passphrase',
    passwordItems: [
      'Enable wallet encryption and use a strong passphrase.',
      'If lost, recovery may be difficult. Keep it in offline secure storage.',
      'After setting passphrase, re-check lock/staking state.'
    ],
    backupTitle: '3) Backup',
    backupItems: [
      'Method A: Create backup from wallet menu.',
      'Method B: Close wallet and copy `wallet.dat` from data directory.',
      'Windows example: `%APPDATA%\\xpchain\\wallet.dat`',
      'macOS example: `~/Library/Application Support/XPChain/wallet.dat`',
      'Store backups in at least two separate locations.',
      'Re-backup after creating new addresses.'
    ],
    recoveryTitle: '4) Recovery',
    recoveryItems: [
      'Recovery requires a backed-up `wallet.dat` file.',
      'Install wallet on new environment, run once to create data directory, then close.',
      'Remove newly created `wallet.dat` and replace with backup file.',
      'Rename backup to `wallet.dat` and restart wallet.',
      'After sync, verify balance/history and test with small transfer first.'
    ],
    linuxRefTitle: 'Linux reference',
    linuxRefBody: 'Linux guidance is maintained separately with node/service-focused procedures.',
    linuxRefLink: 'See linux-node-setup-log-vultr.md',
    cautionTitle: 'Caution',
    cautionItems: [
      'Never share private keys/seed/wallet files/passphrases over plain-text channels.',
      'Without backup files, wallet recovery is impossible.',
      'Install/recover wallets only on trusted PCs with security updates applied.'
    ]
  },
  ja: {
    srTitle: 'ウォレット',
    title: 'ウォレット',
    subtitle: '公式ダウンロード経路とセキュリティ推奨事項を提供します。',
    qtDesc: 'フルノード運用とステーキングに適したデスクトップウォレットです。',
    webDesc: 'モバイル環境に最適化された高速・簡易なWebウォレットです。',
    webOpen: 'Webウォレットを開く',
    extDesc: 'ブラウザですぐ使える拡張ウォレットです。決済連携と利便機能の更新を進行中です。',
    extOpen: 'Chrome ウェブストアを開く',
    win64: 'Windows 64bit ダウンロード',
    win32: 'Windows 32bit ダウンロード',
    mac: 'macOS 64bit ダウンロード',
    linux: 'Linux x86_64 ダウンロード',
    securityTitle: 'セキュリティチェックリスト',
    channelTitle: 'リリースチャネル基準',
    channelItems: [
      '`vNext`: 現在の配布基準。リンクとSHA256はvNext基準で維持します。',
      '`Stable`: ロールバック/比較検証基準。問題時に復帰可能な状態を維持します。'
    ],
    backupNotice: 'ウォレットバックアップと秘密情報（鍵/シード）はオフライン安全保管を推奨します。',
    downloadNotice: '必ず公式経路からダウンロードし、整合性を確認してください。',
    integrityTitle: '整合性確認 (XPChain Core v0.17.0-4)',
    commandPs: '検証コマンド (Windows PowerShell)',
    commandCmd: '検証コマンド (Windows cmd)',
    commandMac: '検証コマンド (macOS)',
    commandLinux: '検証コマンド (Linux)',
    checklistLink: 'Wallet更新チェックリスト',
    checklistPrefix: '運用チェックリスト',
    releaseNextLabel: 'vNext',
    releaseStableLabel: 'Stable',
    verifyFileName: 'ファイル名',
    guideTitle: 'インストール/バックアップ/復旧ガイド',
    installTitle: '1) インストール (Qt Wallet)',
    installItems: [
      'OSビット数(64/32)を確認し、適切なビルドを選択します。',
      '公式ビルドを取得し、先にSHA256を確認します。',
      '解凍後に `xpchain-qt` を実行します。',
      'macOSは `.dmg` からApplicationsへコピーして実行します。',
      '初回起動後はデータフォルダ作成と同期完了まで待機します。'
    ],
    passwordTitle: '2) パスワード設定',
    passwordItems: [
      'ウォレット暗号化を設定し、推測困難なパスワードを使用します。',
      '紛失時に復旧困難になるため、オフラインで保管してください。',
      '設定後はロック状態/ステーキング状態を再確認します。'
    ],
    backupTitle: '3) バックアップ',
    backupItems: [
      '方法A: ウォレットメニューのバックアップ機能を使用',
      '方法B: 終了後にデータフォルダの `wallet.dat` を直接コピー',
      'Windows例: `%APPDATA%\\xpchain\\wallet.dat`',
      'macOS例: `~/Library/Application Support/XPChain/wallet.dat`',
      'バックアップは2か所以上に分散保管',
      '新規アドレス作成後は再バックアップ推奨'
    ],
    recoveryTitle: '4) 復旧',
    recoveryItems: [
      '復旧にはバックアップ済み `wallet.dat` が必須です。',
      '新環境にインストール後、1回起動してデータフォルダを作成し終了します。',
      '新規 `wallet.dat` を削除し、バックアップファイルに置き換えます。',
      'ファイル名を `wallet.dat` に合わせて再起動します。',
      '同期完了後に残高/履歴確認、少額送受信で動作検証を推奨します。'
    ],
    linuxRefTitle: 'Linux参考',
    linuxRefBody: 'Linuxはノード/サービス運用中心の手順として別途整理しています。',
    linuxRefLink: 'linux-node-setup-log-vultr.md 参照',
    cautionTitle: '注意',
    cautionItems: [
      '秘密鍵/シード/ウォレットファイル/パスワードを平文共有しないでください。',
      'バックアップが無い場合、復旧は不可能です。',
      'セキュリティ更新済みの信頼できるPCでのみ導入/復旧してください。'
    ]
  }
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale });
  const title = t('nav.primary.wallets');
  return {
    title,
    alternates: {
      canonical: buildLocalePath(params.locale, '/wallets'),
      languages: buildAlternates('/wallets')
    }
  };
}

export default function LocalizedWalletsPage({ params }: Props) {
  const c = walletCopy[params.locale];
  const sourcePath = `/${params.locale}/wallets`;

  return (
    <>
      <h1 className="sr-only">{c.srTitle}</h1>
      <Section title={c.title} subtitle={c.subtitle}>
        <div className="grid gap-4 md:grid-cols-3">
          <article className="panel p-5">
            <h3 className="text-lg font-semibold text-text">Qt Wallet</h3>
            <p className="mt-2 text-sm text-mute">{c.qtDesc}</p>
            <div className="mt-4 space-y-1 text-sm">
              <TrackedLink href={links.walletQtWin64} target="_blank" className="block text-accent" category="wallet_download" eventKey="wallet_qt_win64" sourcePath={sourcePath}>{c.win64}</TrackedLink>
              <TrackedLink href={links.walletQtWin32} target="_blank" className="block text-accent" category="wallet_download" eventKey="wallet_qt_win32" sourcePath={sourcePath}>{c.win32}</TrackedLink>
              <TrackedLink href={links.walletQtMac} target="_blank" className="block text-accent" category="wallet_download" eventKey="wallet_qt_macos_dmg" sourcePath={sourcePath}>{c.mac}</TrackedLink>
              <TrackedLink href={links.walletQtLinux} target="_blank" className="block text-accent" category="wallet_download" eventKey="wallet_qt_linux_x64" sourcePath={sourcePath}>{c.linux}</TrackedLink>
              <TrackedLink href={links.walletQtReleaseV4} target="_blank" className="block pt-1 text-mute" category="wallet_download" eventKey="wallet_release_v01704" sourcePath={sourcePath}>{c.releaseNextLabel}: XPChain Core v0.17.0-4</TrackedLink>
              <TrackedLink href={links.walletQtReleaseV3Stable} target="_blank" className="block text-mute" category="wallet_download" eventKey="wallet_release_stable_legacy" sourcePath={sourcePath}>{c.releaseStableLabel}: XPChain Core v0.17.0-3</TrackedLink>
            </div>
          </article>

          <article className="panel p-5">
            <h3 className="text-lg font-semibold text-text">Web Wallet</h3>
            <p className="mt-2 text-sm text-mute">{c.webDesc}</p>
            <TrackedLink href={links.walletWeb} target="_blank" className="mt-4 inline-block text-sm text-accent" category="wallet_download" eventKey="wallet_web" sourcePath={sourcePath}>
              {c.webOpen}
            </TrackedLink>
          </article>

          <article className="panel p-5">
            <h3 className="text-lg font-semibold text-text">Chrome Extension</h3>
            <p className="mt-2 text-sm text-mute">{c.extDesc}</p>
            <TrackedLink href={links.walletExtension} target="_blank" className="mt-4 inline-block text-sm text-accent" category="wallet_download" eventKey="wallet_chrome_extension" sourcePath={sourcePath}>
              {c.extOpen}
            </TrackedLink>
          </article>
        </div>
      </Section>

      <Section title={c.securityTitle}>
        <div className="panel p-5 text-sm text-mute">
          <p className="font-medium text-text">{c.channelTitle}</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {c.channelItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p>{c.backupNotice}</p>
          <p className="mt-2">{c.downloadNotice}</p>

          <div className="mt-3 rounded-md border border-border bg-bg px-3 py-2 text-xs">
            <p className="font-medium text-text">{c.integrityTitle}</p>
            <p className="mt-2 break-all">Windows 64bit (zip) SHA256: <span className="text-text">{links.walletQtWin64V4Sha256}</span></p>
            <p className="mt-1 break-all">Windows 32bit (zip) SHA256: <span className="text-text">{links.walletQtWin32V4Sha256}</span></p>
            <p className="mt-1 break-all">macOS (dmg) SHA256: <span className="text-text">{links.walletQtMacDmgV4Sha256}</span></p>
            <p className="mt-1 break-all">macOS (tar.gz) SHA256: <span className="text-text">{links.walletQtMacTarV4Sha256}</span></p>
            <p className="mt-1 break-all">Linux x86_64 (tar.gz) SHA256: <span className="text-text">{links.walletQtLinuxTarV4Sha256}</span></p>
            <p className="mt-2 break-all">{c.commandPs}: <span className="text-text">{`Get-FileHash .\\${c.verifyFileName} -Algorithm SHA256`}</span></p>
            <p className="mt-1 break-all">{c.commandCmd}: <span className="text-text">{`certutil -hashfile ${c.verifyFileName} SHA256`}</span></p>
            <p className="mt-1 break-all">{c.commandMac}: <span className="text-text">{`shasum -a 256 ${c.verifyFileName}`}</span></p>
            <p className="mt-1 break-all">{c.commandLinux}: <span className="text-text">{`sha256sum ${c.verifyFileName}`}</span></p>
            <p className="mt-2">
              {c.checklistPrefix}: <a href={`/${params.locale}/docs/wallet-release-checklist`} className="text-accent">{c.checklistLink}</a>
            </p>
          </div>
        </div>
      </Section>

      <Section title={c.guideTitle}>
        <div className="panel p-5 text-sm text-mute space-y-4">
          <div>
            <p className="font-medium text-text">{c.installTitle}</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">{c.installItems.map((i) => <li key={i}>{i}</li>)}</ul>
          </div>
          <div>
            <p className="font-medium text-text">{c.passwordTitle}</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">{c.passwordItems.map((i) => <li key={i}>{i}</li>)}</ul>
          </div>
          <div>
            <p className="font-medium text-text">{c.backupTitle}</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">{c.backupItems.map((i) => <li key={i}>{i}</li>)}</ul>
          </div>
          <div>
            <p className="font-medium text-text">{c.recoveryTitle}</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">{c.recoveryItems.map((i) => <li key={i}>{i}</li>)}</ul>
          </div>

          <div className="rounded-md border border-border bg-bg px-3 py-2 text-xs">
            <p className="font-medium text-text">{c.linuxRefTitle}</p>
            <p className="mt-1">{c.linuxRefBody}</p>
            <a href="https://github.com/arnoldcho/xpchain-community-core/blob/master/doc/linux-node-setup-log-vultr.md" target="_blank" rel="noreferrer" className="mt-2 inline-block text-accent">
              {c.linuxRefLink}
            </a>
          </div>

          <div className="rounded-md border border-border bg-bg px-3 py-2 text-xs">
            <p className="font-medium text-text">{c.cautionTitle}</p>
            {c.cautionItems.map((item) => (
              <p key={item} className="mt-1">{item}</p>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
