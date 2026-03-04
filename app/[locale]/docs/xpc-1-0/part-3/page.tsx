import type { Metadata } from 'next';
import Image from 'next/image';
import { Section } from '@/components/Section';
import OriginalPage from '../../../../docs/xpc-1-0/part-3/page';
import type { Locale } from '@/lib/i18n/locales';
import { buildAlternates, buildLocalePath } from '@/lib/seo';

type Props = { params: Promise<{ locale: Locale }> };

type PartCopy = {
  srTitle: string;
  title: string;
  subtitle: string;
  tocTitle: string;
  tocItems: string[];
  summaryTitle: string;
  summaryBody: string;
  sectionTitle: string;
  specsTitle: string;
  specs: string[];
  specCaption: string;
  rateTitle: string;
  rateBody: string;
  rateCaption: string;
  distributionTitle: string;
  distributionItems: string[];
  currentStatusNote: string;
};

const copyByLocale: Record<Exclude<Locale, 'ko'>, PartCopy> = {
  en: {
    srTitle: 'XPC 1.0 (3) XPC specification',
    title: 'XPC 1.0 (3) - XPC blockchain specification',
    subtitle: 'XPC 1.0 Blockchain (3) - XPC Specification',
    tocTitle: 'Contents',
    tocItems: ['Bitcoin 0.17.0 base', 'ABPoS (Age Burnable PoS)', 'XPC blockchain specification'],
    summaryTitle: 'Key summary',
    summaryBody:
      'XPC was developed on a Bitcoin 0.17.0 base and designed with compatibility to that version and library set. Total issuance is not fixed-cap, and ABPoS annual reward rate is described with a programmed upper bound.',
    sectionTitle: '3) XPC blockchain specification',
    specsTitle: 'Core specifications',
    specs: [
      'Base: Bitcoin 0.17.0',
      'Algorithm: SHA-256d / PoW+PoS (PoW used only in premine context)',
      'Block interval: 60 seconds',
      'Transaction fee: minimum 0.1 XPC/kB',
      'Initial issuance: 113 billion XPC',
      'Initial distribution record: Airdrop 77.86%, Foundation 19.46%, Initial dev/listing 2.68%'
    ],
    specCaption: '<XPC coin distribution chart (%)>',
    rateTitle: 'ABPoS annual rate',
    rateBody:
      'The archive explains that annual maximum ABPoS rate starts at 10%, decreases by 1 percentage point each year, and is fixed at 5% from year 6 onward.',
    rateCaption: '<Annual maximum ABPoS rate by block height>',
    distributionTitle: 'Token distribution and operations (historical record)',
    distributionItems: [
      'Initial dev/listing budget: part of initial issuance described for early marketing/listing expenses',
      'Airdrop: snapshot/application/distribution records for XP holders',
      'Foundation operations: early document includes usage plans for operating funds'
    ],
    currentStatusNote:
      'Current status note: distribution/foundation items above are historical records from early documents. Current holdings/operations may differ and should be verified through on-chain data and latest notices.'
  },
  ja: {
    srTitle: 'XPC 1.0 紹介 (3) XPC 仕様',
    title: 'XPC 1.0 紹介 (3) - XPC ブロックチェーン仕様',
    subtitle: 'XPC 1.0 Blockchain (3) - XPC Specification',
    tocTitle: '目次',
    tocItems: ['Bitcoin 0.17.0 ベース', 'ABPoS (Age Burnable PoS)', 'XPC ブロックチェーン仕様'],
    summaryTitle: '要点',
    summaryBody:
      'XPC は Bitcoin 0.17.0 ベースで開発され、当該バージョンの機能およびライブラリ互換性を踏まえて設計されています。最大発行量は固定上限型ではなく、ABPoS 年率にはプログラム上の上限が適用される構造と説明されています。',
    sectionTitle: '3) XPC ブロックチェーン仕様',
    specsTitle: '主要仕様',
    specs: [
      '基盤: Bitcoin 0.17.0',
      'アルゴリズム: SHA-256d / PoW+PoS (PoW はプレマイン文脈のみ使用)',
      'ブロック間隔: 60秒',
      '取引手数料: 最低 0.1 XPC/kB',
      '初期発行量: 1130億 XPC',
      '初期分配記録: エアドロップ 77.86%、財団 19.46%、初期開発/上場費 2.68%'
    ],
    specCaption: '<XPC コイン分配チャート (%)>',
    rateTitle: 'ABPoS 年率',
    rateBody:
      'アーカイブでは ABPoS の年間最大年率が 10% から始まり、毎年 1%p ずつ減少し、6年目以降 5% 固定と説明されています。',
    rateCaption: '<ABPoS 報酬に基づく年間最大年率 (ブロック高ベース)>',
    distributionTitle: 'トークン分配と運用 (初期記録)',
    distributionItems: [
      '初期開発/上場費: 初期発行量の一部が初期マーケティング/上場費として説明されています。',
      'エアドロップ: XP 保有者向けスナップショット/申請/分配手順の記録',
      '財団運用: 初期文書には運用資金の使用計画が含まれています。'
    ],
    currentStatusNote:
      '現在状態注記: 上記分配/財団項目は初期文書の歴史記録です。現在運用では当時と異なる実保有/運用状態である可能性があり、最新状態はオンチェーンデータと最新告知で確認してください。'
  }
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: 'XPC 1.0 Part 3',
    alternates: {
      canonical: buildLocalePath(locale, '/docs/xpc-1-0/part-3'),
      languages: buildAlternates('/docs/xpc-1-0/part-3')
    }
  };
}

export default async function LocalizedXpcPartThreePage({ params }: Props) {
  const { locale } = await params;
  if (locale === 'ko') {
    return <OriginalPage />;
  }

  const c = copyByLocale[locale];

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
            <p className="mt-3 font-semibold text-text">{c.specsTitle}</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {c.specs.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <Image
              src="/docs/xpc-1-0/part-3-spec.png"
              alt="XPC coin distribution chart"
              width={1600}
              height={800}
              className="mt-4 h-auto w-full rounded-lg border border-line"
            />
            <p className="mt-2 text-center text-xs text-mute/80">{c.specCaption}</p>

            <h4 className="mt-5 text-sm font-semibold text-text">{c.rateTitle}</h4>
            <p className="mt-2">{c.rateBody}</p>
            <Image
              src="/docs/xpc-1-0/part-3-abpos-rate.png"
              alt="ABPoS annual max reward rate by block height"
              width={1600}
              height={718}
              className="mt-4 h-auto w-full rounded-lg border border-line"
            />
            <p className="mt-2 text-center text-xs text-mute/80">{c.rateCaption}</p>
          </div>

          <div className="panel p-5 text-sm text-mute">
            <h4 className="text-sm font-semibold text-text">{c.distributionTitle}</h4>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {c.distributionItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="mt-3 rounded border border-warn/40 bg-warn/10 px-3 py-2 text-warn">{c.currentStatusNote}</p>
          </div>
        </div>
      </Section>
    </>
  );
}
