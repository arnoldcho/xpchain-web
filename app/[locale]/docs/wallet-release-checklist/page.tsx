import type { Metadata } from 'next';
import { Section } from '@/components/Section';
import type { Locale } from '@/lib/i18n/locales';
import { buildAlternates, buildLocalePath } from '@/lib/seo';

type Props = {
  params: { locale: Locale };
};

type ChecklistCopy = {
  srTitle: string;
  title: string;
  subtitle: string;
  channelTitle: string;
  channelItems: string[];
  processTitle: string;
  processSteps: string[];
  dodTitle: string;
  dodItems: string[];
};

const copyByLocale: Record<Locale, ChecklistCopy> = {
  ko: {
    srTitle: 'Wallet 업데이트 체크리스트',
    title: 'Wallet 업데이트 체크리스트',
    subtitle: 'vNext/Stable, 해시, 검증 명령 운영 기준',
    channelTitle: '채널 정의',
    channelItems: [
      '`vNext`: 현재 사용자 배포 기준 버전 (Wallet 페이지 기본 링크 대상)',
      '`Stable`: 롤백/비교 검증 기준 버전 (직전 안정 릴리즈)'
    ],
    processTitle: '릴리즈 반영 절차',
    processSteps: [
      'vNext 릴리즈 태그와 다운로드 자산(win64/win32/macos dmg/tar/linux)을 확정합니다.',
      '`xpchain-web/lib/links.ts`의 vNext 다운로드 URL, 릴리즈 태그 링크를 갱신합니다.',
      '동일 파일의 각 OS SHA256 값을 갱신합니다.',
      '`xpchain-web/app/wallets/page.tsx`에서 vNext/Stable 표기 문구 최신 여부를 확인합니다.',
      '검증 명령(PowerShell/cmd/macOS/Linux) 노출 여부를 확인합니다.',
      'Wallet 페이지 링크 클릭과 `wallet_release_*` 이벤트 키 동작을 확인합니다.'
    ],
    dodTitle: 'Definition of Done (Wallet Release)',
    dodItems: [
      'vNext/Stable 표기가 페이지에서 명확히 노출됨',
      '4개 OS 자산 해시가 최신 릴리즈와 일치함',
      '검증 명령 4종(Windows PowerShell/cmd, macOS, Linux) 노출 확인',
      '릴리즈 링크/다운로드 링크/추적 이벤트 동작 확인'
    ]
  },
  en: {
    srTitle: 'Wallet Update Checklist',
    title: 'Wallet Update Checklist',
    subtitle: 'Operational criteria for vNext/Stable, hashes, and verification commands',
    channelTitle: 'Channel definitions',
    channelItems: [
      '`vNext`: current user distribution version (primary link target on Wallet page)',
      '`Stable`: rollback/reference validation version (previous stable release)'
    ],
    processTitle: 'Release update procedure',
    processSteps: [
      'Finalize vNext release tag and downloadable assets (win64/win32/macos dmg/tar/linux).',
      'Update vNext download URLs and release-tag links in `xpchain-web/lib/links.ts`.',
      'Update per-OS SHA256 values in the same file.',
      'Check vNext/Stable labels in Wallet page are up to date.',
      'Verify all verification commands are displayed (PowerShell/cmd/macOS/Linux).',
      'Confirm link-click behavior and `wallet_release_*` tracking events.'
    ],
    dodTitle: 'Definition of Done (Wallet Release)',
    dodItems: [
      'vNext/Stable labels are clearly exposed',
      'Hash values for all 4 OS assets match latest release',
      'All four verification command variants are visible',
      'Release links/download links/tracking events are functioning'
    ]
  },
  ja: {
    srTitle: 'Wallet更新チェックリスト',
    title: 'Wallet更新チェックリスト',
    subtitle: 'vNext/Stable、ハッシュ、検証コマンドの運用基準',
    channelTitle: 'チャネル定義',
    channelItems: [
      '`vNext`: 現在ユーザー配布基準バージョン (Walletページの基本リンク対象)',
      '`Stable`: ロールバック/比較検証基準バージョン (直前安定リリース)'
    ],
    processTitle: 'リリース反映手順',
    processSteps: [
      'vNextリリースタグと配布資産(win64/win32/macos dmg/tar/linux)を確定します。',
      '`xpchain-web/lib/links.ts` のvNext URLとリリースタグリンクを更新します。',
      '同ファイル内のOS別SHA256値を更新します。',
      'WalletページのvNext/Stable表記が最新か確認します。',
      '検証コマンド(PowerShell/cmd/macOS/Linux)表示を確認します。',
      'Walletページのリンク動作と `wallet_release_*` イベント動作を確認します。'
    ],
    dodTitle: 'Definition of Done (Wallet Release)',
    dodItems: [
      'vNext/Stable 表記が明確に表示される',
      '4 OS 資産ハッシュが最新リリースと一致',
      '4種検証コマンド表示を確認',
      'リリースリンク/ダウンロードリンク/追跡イベント動作を確認'
    ]
  }
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: 'Wallet Release Checklist',
    alternates: {
      canonical: buildLocalePath(params.locale, '/docs/wallet-release-checklist'),
      languages: buildAlternates('/docs/wallet-release-checklist')
    }
  };
}

export default function LocalizedWalletReleaseChecklistPage({ params }: Props) {
  const c = copyByLocale[params.locale];

  return (
    <>
      <h1 className="sr-only">{c.srTitle}</h1>
      <Section title={c.title} subtitle={c.subtitle}>
        <div className="space-y-4 text-sm text-mute">
          <article className="panel p-5">
            <p className="font-medium text-text">{c.channelTitle}</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">{c.channelItems.map((i) => <li key={i}>{i}</li>)}</ul>
          </article>
          <article className="panel p-5">
            <p className="font-medium text-text">{c.processTitle}</p>
            <ol className="mt-2 list-decimal space-y-1 pl-5">{c.processSteps.map((i) => <li key={i}>{i}</li>)}</ol>
          </article>
          <article className="panel p-5">
            <p className="font-medium text-text">{c.dodTitle}</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">{c.dodItems.map((i) => <li key={i}>{i}</li>)}</ul>
          </article>
        </div>
      </Section>
    </>
  );
}
