import type { Metadata } from 'next';
import Image from 'next/image';
import { Section } from '@/components/Section';
import OriginalPage from '../../../../docs/xpc-1-0/part-2/page';
import type { Locale } from '@/lib/i18n/locales';
import { buildAlternates, buildLocalePath } from '@/lib/seo';

type Props = { params: { locale: Locale } };

type PartCopy = {
  srTitle: string;
  title: string;
  subtitle: string;
  tocTitle: string;
  tocItems: string[];
  summaryTitle: string;
  summaryBody: string;
  sectionTitle: string;
  distributionTitle: string;
  distributionBody: string;
  instantTitle: string;
  instantBody: string;
  rewardCaption: string;
  burnTitle: string;
  burnBody: string;
  notesTitle: string;
  notes: string[];
};

const copyByLocale: Record<Exclude<Locale, 'ko'>, PartCopy> = {
  en: {
    srTitle: 'XPC 1.0 (2) - ABPoS',
    title: 'XPC 1.0 (2) - ABPoS (Age Burnable PoS)',
    subtitle: 'XPC 1.0 Blockchain (2) - Age Burnable PoS',
    tocTitle: 'Contents',
    tocItems: ['Bitcoin 0.17.0 base', 'ABPoS (Age Burnable PoS)', 'XPC blockchain specification'],
    summaryTitle: 'Key summary',
    summaryBody:
      'XPC adopts PoS on top of a Bitcoin 0.17.0 base with SegWit support, and extends this model with the ABPoS (Age Burnable PoS) concept.',
    sectionTitle: '2) ABPoS (Age Burnable PoS)',
    distributionTitle: 'Independent transaction-based reward distribution',
    distributionBody:
      'In ABPoS, rewards are distributed through an independent transaction separated from the staking transaction itself. Distribution amount is proportional to coin balance.',
    instantTitle: 'Immediate distribution setting for block rewards',
    instantBody:
      'ABPoS includes a mechanism to conditionally edit reward-output behavior at staking success. This can be used to implement operational strategies such as service/maintenance allocation.',
    rewardCaption: '<Reward distribution setting in XPC wallet>',
    burnTitle: 'Fee burning during block production',
    burnBody:
      'Transaction fees are described as burned, reducing upward pressure on total supply growth. In this model, fee burning is treated as a supporting factor for inflation control in PoS-style chains.',
    notesTitle: '2026 operating notes',
    notes: [
      'This document is an archive based on early technical posts.',
      'Descriptions of rewards/revenue should be interpreted as technical concepts only.',
      'For current release/operation standards, refer to notices and release notes first.'
    ]
  },
  ja: {
    srTitle: 'XPC 1.0 紹介 (2) ABPoS',
    title: 'XPC 1.0 紹介 (2) - ABPoS (Age Burnable PoS)',
    subtitle: 'XPC 1.0 Blockchain (2) - Age Burnable PoS',
    tocTitle: '目次',
    tocItems: ['Bitcoin 0.17.0 ベース', 'ABPoS (Age Burnable PoS)', 'XPC ブロックチェーン仕様'],
    summaryTitle: '要点',
    summaryBody:
      'XPC は SegWit 対応の Bitcoin 0.17.0 ベースで PoS を採用し、さらに ABPoS (Age Burnable PoS) の概念を拡張適用しています。',
    sectionTitle: '2) ABPoS (Age Burnable PoS)',
    distributionTitle: '独立トランザクション型の報酬分配',
    distributionBody:
      'ABPoS では、ステーキング本体と分離した独立トランザクションで報酬が分配されます。分配比率はコイン数量に比例します。',
    instantTitle: '報酬の即時分配設定機能',
    instantBody:
      'ABPoS には、ステーキング成功時の報酬トランザクション出力を条件付きで編集できる機能が含まれます。運用費やサービス維持費の分配戦略に活用できます。',
    rewardCaption: '<XPC ウォレットでの報酬分配設定>',
    burnTitle: 'マイニング過程での手数料バーン',
    burnBody:
      'トランザクション手数料はバーンされ、総供給量の増加圧力を抑える方向で作用すると説明されています。PoS 系チェーンのインフレ管理を補助する概念として位置づけられます。',
    notesTitle: '2026 運用注記',
    notes: [
      '本資料は初期技術投稿ベースのアーカイブです。',
      '収益/報酬関連の文言は技術概念説明として解釈してください。',
      '現行のリリース/運用基準は告知およびリリースノートを優先してください。'
    ]
  }
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: 'XPC 1.0 Part 2',
    alternates: {
      canonical: buildLocalePath(params.locale, '/docs/xpc-1-0/part-2'),
      languages: buildAlternates('/docs/xpc-1-0/part-2')
    }
  };
}

export default function LocalizedXpcPartTwoPage({ params }: Props) {
  if (params.locale === 'ko') {
    return <OriginalPage />;
  }

  const c = copyByLocale[params.locale];

  return (
    <>
      <h1 className="sr-only">{c.srTitle}</h1>
      <Section title={c.title} subtitle={c.subtitle}>
        <div className="space-y-4">
          <div className="panel p-5 text-sm text-mute">
            <p className="text-text">{c.tocTitle}</p>
            <ol className="mt-2 list-decimal space-y-1 pl-5">
              {c.tocItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </div>

          <div className="panel p-5 text-sm text-mute">
            <p className="text-text">{c.summaryTitle}</p>
            <p className="mt-2">{c.summaryBody}</p>
          </div>

          <div className="panel p-5 text-sm text-mute">
            <h3 className="text-base font-semibold text-text">{c.sectionTitle}</h3>

            <h4 className="mt-4 text-sm font-semibold text-text">{c.distributionTitle}</h4>
            <p className="mt-2">{c.distributionBody}</p>

            <Image
              src="/docs/xpc-1-0/part-2-main.png"
              alt="ABPoS flow diagram"
              width={1600}
              height={994}
              className="mt-4 h-auto w-full rounded-lg border border-line"
            />

            <h4 className="mt-5 text-sm font-semibold text-text">{c.instantTitle}</h4>
            <p className="mt-2">{c.instantBody}</p>

            <Image
              src="/docs/xpc-1-0/part-2-reward-setting.png"
              alt="XPC wallet reward distribution setting"
              width={1600}
              height={945}
              className="mt-4 h-auto w-full rounded-lg border border-line"
            />
            <p className="mt-2 text-center text-xs text-mute/80">{c.rewardCaption}</p>

            <h4 className="mt-5 text-sm font-semibold text-text">{c.burnTitle}</h4>
            <p className="mt-2">{c.burnBody}</p>
          </div>

          <div className="panel p-5 text-sm text-mute">
            <p className="text-text">{c.notesTitle}</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {c.notes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </Section>
    </>
  );
}
