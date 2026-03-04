import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Section } from '@/components/Section';
import type { Locale } from '@/lib/i18n/locales';
import { buildAlternates, buildLocalePath } from '@/lib/seo';

type Props = {
  params: Promise<{ locale: Locale }>;
};

type StakingCopy = {
  srTitle: string;
  title: string;
  subtitle: string;
  commonSteps: string[];
  osTitle: string;
  osSubtitle: string;
  windows: string[];
  mac: string[];
  linux: string[];
  commandsTitle: string;
  commandsSubtitle: string;
  commandIntro: string;
  commandChecks: string[];
  faqTitle: string;
  faqSubtitle: string;
  faq: string[];
};

const copyByLocale: Record<Locale, StakingCopy> = {
  ko: {
    srTitle: '스테이킹',
    title: '스테이킹',
    subtitle: '5분 재가동 가이드: 수익 목적이 아닌 분산 기여 중심',
    commonSteps: [
      '지갑을 재실행하기 전에 현재 상태를 확인합니다. (동기화 진행률, 잠금 상태, 네트워크 연결 수)',
      '재가동 후에는 반드시 staking-only unlock을 다시 적용합니다.',
      '재가동 직후 1~2분 동안 `listmintings`, `getwalletinfo` 결과를 확인합니다.',
      '스테이킹은 수익 보장이 아닌 네트워크 분산 참여임을 전제로 운영합니다.'
    ],
    osTitle: 'OS별 5분 재가동 절차',
    osSubtitle: '운영 환경에 맞는 최소 점검 절차를 따르세요.',
    windows: [
      '작업 표시줄 트레이 또는 지갑 창에서 XPChain Qt를 정상 종료합니다.',
      '시작 메뉴에서 XPChain Core(Qt Wallet)를 다시 실행합니다.',
      '완전 동기화(최신 블록) 상태를 확인합니다.',
      '메뉴에서 staking-only unlock을 적용합니다.',
      '디버그 콘솔에서 `listmintings`를 실행해 staking 대상 UTXO 상태를 확인합니다.'
    ],
    mac: [
      '메뉴 바 또는 지갑 창에서 XPChain-Qt를 완전히 종료합니다.',
      'Applications에서 XPChain-Qt를 다시 실행합니다.',
      '잠금/동기화 상태를 확인한 뒤 staking-only unlock을 적용합니다.',
      '디버그 콘솔에서 `getwalletinfo`, `listmintings`를 순서대로 확인합니다.',
      '네트워크 연결이 안정화될 때까지 1~2분 대기 후 상태를 재확인합니다.'
    ],
    linux: [
      'GUI 사용 시 지갑을 정상 종료합니다. 데몬 사용 시 `xpchain-cli stop`으로 종료합니다.',
      'GUI는 `xpchain-qt`로, 데몬은 `xpchaind -daemon`으로 재시작합니다.',
      '동기화 상태를 `getblockchaininfo`로 확인합니다.',
      'staking-only unlock 또는 운영 정책에 맞는 잠금 해제 상태를 적용합니다.',
      '`listmintings`, `getnetworkinfo`로 staking 및 피어 연결 상태를 점검합니다.'
    ],
    commandsTitle: '상태 확인 명령',
    commandsSubtitle: '재가동 후 아래 명령으로 점검하세요.',
    commandIntro: 'Qt 디버그 콘솔 또는 `xpchain-cli`에서 실행:',
    commandChecks: [
      '동기화 완료: 최신 블록 높이가 네트워크와 유사한지 확인',
      '잠금 상태: staking-only unlock이 적용되었는지 확인',
      '스테이킹 상태: `listmintings`에서 age/probability/reward를 확인',
      '노드 상태: `getmininginfo`에서 blocks/difficulty/networkhashps 확인',
      '피어 연결: 연결 수가 0이 아닌지 확인'
    ],
    faqTitle: '자주 묻는 질문',
    faqSubtitle: '운영 중 자주 발생하는 상황',
    faq: [
      '스테이킹은 수익을 보장하는 기능이 아닙니다. 네트워크 분산성과 지속성에 참여하는 행위입니다.',
      '동기화가 완료되지 않으면 스테이킹은 활성화되지 않습니다. 먼저 블록 동기화 상태를 확인하세요.',
      '재가동 후 잠금 해제가 초기화될 수 있으므로 staking-only unlock 상태를 다시 적용해야 합니다.',
      '운영 리스크를 줄이기 위해 안정적인 네트워크/전원 환경에서 지갑을 유지하는 것을 권장합니다.'
    ]
  },
  en: {
    srTitle: 'Staking',
    title: 'Staking',
    subtitle: '5-minute restart guide focused on decentralized network participation',
    commonSteps: [
      'Before restart, check current status (sync progress, lock state, network connections).',
      'After restart, apply staking-only unlock again.',
      'For 1-2 minutes after restart, verify `listmintings` and `getwalletinfo`.',
      'Treat staking as network participation, not as a profit guarantee.'
    ],
    osTitle: '5-Minute Restart by OS',
    osSubtitle: 'Follow the minimum checklist for your operating environment.',
    windows: [
      'Close XPChain Qt normally from tray or wallet window.',
      'Restart XPChain Core (Qt Wallet) from Start menu.',
      'Confirm fully synced state (latest block).',
      'Apply staking-only unlock from wallet menu.',
      'Run `listmintings` in debug console and verify target UTXOs.'
    ],
    mac: [
      'Fully quit XPChain-Qt from menu bar or wallet window.',
      'Restart XPChain-Qt from Applications.',
      'Verify lock/sync status and apply staking-only unlock.',
      'Check `getwalletinfo` and then `listmintings` in debug console.',
      'Wait 1-2 minutes for peer stabilization and re-check.'
    ],
    linux: [
      'For GUI, close wallet cleanly. For daemon, stop with `xpchain-cli stop`.',
      'Restart GUI with `xpchain-qt` or daemon with `xpchaind -daemon`.',
      'Check sync status with `getblockchaininfo`.',
      'Apply staking-only unlock (or your operational unlock policy).',
      'Check staking and peers via `listmintings` and `getnetworkinfo`.'
    ],
    commandsTitle: 'Verification Commands',
    commandsSubtitle: 'Run the commands below after restart.',
    commandIntro: 'Run in Qt debug console or `xpchain-cli`:',
    commandChecks: [
      'Sync complete: latest block height is close to network height',
      'Lock state: staking-only unlock is active',
      'Staking state: verify age/probability/reward in `listmintings`',
      'Node state: verify blocks/difficulty/networkhashps in `getmininginfo`',
      'Peer connections: connection count is not zero'
    ],
    faqTitle: 'FAQ',
    faqSubtitle: 'Frequent operational questions',
    faq: [
      'Staking does not guarantee returns. It is a contribution to network decentralization and continuity.',
      'If sync is incomplete, staking will not activate. Check blockchain sync first.',
      'Unlock state may reset after restart, so re-apply staking-only unlock.',
      'Use a stable network and power environment to reduce operational risk.'
    ]
  },
  ja: {
    srTitle: 'ステーキング',
    title: 'ステーキング',
    subtitle: '収益目的ではなく分散参加を重視する5分再起動ガイド',
    commonSteps: [
      '再起動前に現在状態（同期進捗、ロック状態、ネットワーク接続数）を確認します。',
      '再起動後は必ず staking-only unlock を再適用します。',
      '再起動直後1〜2分は `listmintings` と `getwalletinfo` を確認します。',
      'ステーキングは収益保証ではなく、ネットワーク分散参加として運用します。'
    ],
    osTitle: 'OS別5分再起動手順',
    osSubtitle: '運用環境に合わせた最小チェック手順に従ってください。',
    windows: [
      'タスクトレイまたはウォレット画面から XPChain Qt を正常終了します。',
      'スタートメニューから XPChain Core (Qt Wallet) を再起動します。',
      '完全同期（最新ブロック）状態を確認します。',
      'メニューから staking-only unlock を適用します。',
      'デバッグコンソールで `listmintings` を実行し対象UTXOを確認します。'
    ],
    mac: [
      'メニューバーまたはウォレット画面から XPChain-Qt を完全終了します。',
      'Applications から XPChain-Qt を再起動します。',
      'ロック/同期状態を確認して staking-only unlock を適用します。',
      'デバッグコンソールで `getwalletinfo` と `listmintings` を順に確認します。',
      '接続安定まで1〜2分待機して再確認します。'
    ],
    linux: [
      'GUI運用は正常終了、デーモン運用は `xpchain-cli stop` で停止します。',
      'GUIは `xpchain-qt`、デーモンは `xpchaind -daemon` で再起動します。',
      '`getblockchaininfo` で同期状態を確認します。',
      'staking-only unlock または運用ポリシーに沿った解除状態を適用します。',
      '`listmintings`, `getnetworkinfo` でステーキングとピア状態を確認します。'
    ],
    commandsTitle: '状態確認コマンド',
    commandsSubtitle: '再起動後に以下コマンドで確認してください。',
    commandIntro: 'Qtデバッグコンソールまたは `xpchain-cli` で実行:',
    commandChecks: [
      '同期完了: 最新ブロック高がネットワークと近いか確認',
      'ロック状態: staking-only unlock が適用されているか確認',
      'ステーキング状態: `listmintings` で age/probability/reward を確認',
      'ノード状態: `getmininginfo` で blocks/difficulty/networkhashps を確認',
      'ピア接続: 接続数が0でないことを確認'
    ],
    faqTitle: 'よくある質問',
    faqSubtitle: '運用中によく発生する状況',
    faq: [
      'ステーキングは収益を保証する機能ではありません。ネットワーク分散性と持続性への参加です。',
      '同期が完了していない場合、ステーキングは有効化されません。まず同期状態を確認してください。',
      '再起動後に解除状態が初期化される場合があるため、staking-only unlock を再適用してください。',
      '運用リスク低減のため、安定したネットワーク/電源環境での運用を推奨します。'
    ]
  }
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale });
  const title = t('nav.primary.staking');
  return {
    title,
    alternates: {
      canonical: buildLocalePath(locale, '/staking'),
      languages: buildAlternates('/staking')
    }
  };
}

export default async function LocalizedStakingPage({ params }: Props) {
  const { locale } = await params;
  const c = copyByLocale[locale];

  return (
    <>
      <h1 className="sr-only">{c.srTitle}</h1>
      <Section title={c.title} subtitle={c.subtitle}>
        <ol className="panel list-decimal space-y-3 p-5 pl-10 text-sm text-text">
          {c.commonSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </Section>

      <Section title={c.osTitle} subtitle={c.osSubtitle}>
        <div className="grid gap-4 lg:grid-cols-3">
          <article className="panel p-5 text-sm text-mute">
            <p className="text-base font-semibold text-text">Windows</p>
            <ol className="mt-3 list-decimal space-y-1 pl-5">
              {c.windows.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </article>

          <article className="panel p-5 text-sm text-mute">
            <p className="text-base font-semibold text-text">macOS</p>
            <ol className="mt-3 list-decimal space-y-1 pl-5">
              {c.mac.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </article>

          <article className="panel p-5 text-sm text-mute">
            <p className="text-base font-semibold text-text">Linux</p>
            <ol className="mt-3 list-decimal space-y-1 pl-5">
              {c.linux.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </article>
        </div>
      </Section>

      <Section title={c.commandsTitle} subtitle={c.commandsSubtitle}>
        <div className="panel p-5 text-sm text-mute">
          <p className="mb-2">{c.commandIntro}</p>
          <pre className="overflow-x-auto rounded-md border border-border bg-bg px-3 py-2 text-xs text-text">
{`getblockchaininfo
getwalletinfo
listmintings
getmininginfo
getnetworkinfo`}
          </pre>
          <ul className="mt-3 list-disc space-y-1 pl-5">
            {c.commandChecks.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </Section>

      <Section title={c.faqTitle} subtitle={c.faqSubtitle}>
        <div className="panel space-y-4 p-5 text-sm text-mute">
          {c.faq.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </div>
      </Section>
    </>
  );
}
