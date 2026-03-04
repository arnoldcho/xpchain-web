import type { Metadata } from 'next';
import Image from 'next/image';
import { Section } from '@/components/Section';
import OriginalPage from '../../../../docs/xpc-1-0/part-1/page';
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
  bodyTitle: string;
  sectionTitle: string;
  segwitTitle: string;
  segwitBody: string;
  compatibilityTitle: string;
  compatibilityBody: string;
  posTitle: string;
  posBody: string;
  notesTitle: string;
  notes: string[];
};

const copyByLocale: Record<Exclude<Locale, 'ko'>, PartCopy> = {
  en: {
    srTitle: 'XPC 1.0 (1) - PoS based on Bitcoin 0.17.0',
    title: 'XPC 1.0 (1) - PoS based on Bitcoin 0.17.0',
    subtitle: 'XPC 1.0 Blockchain (1) - Based on Bitcoin 0.17.0',
    tocTitle: 'Contents',
    tocItems: ['Bitcoin 0.17.0 base', 'ABPoS (Age Burnable PoS)', 'XPC blockchain specification'],
    summaryTitle: 'Key summary',
    summaryBody:
      'XPC was developed on the Bitcoin 0.17.0 codebase with SegWit support, and adopts PoS (Proof-of-Stake) as its consensus model.',
    bodyTitle: 'Body',
    sectionTitle: '1) PoS consensus model on top of Bitcoin 0.17.0',
    segwitTitle: 'SegWit support',
    segwitBody:
      'SegWit separates signatures from transaction payloads, reducing transaction weight and allowing more transactions per block. This structure improves throughput and network efficiency.',
    compatibilityTitle: 'Compatibility with the Bitcoin ecosystem',
    compatibilityBody:
      'Because XPC is built on Bitcoin 0.17.0, it can leverage proven tools and implementation patterns from the Bitcoin ecosystem. This helps focus engineering efforts on service stability and long-term operations.',
    posTitle: 'Why PoS (Proof-of-Stake)',
    posBody:
      'While PoW is a proven consensus model, it can require high hardware/power costs and may increase concentration risk in small-participant environments. XPC adopted PoS to reduce operational cost while sustaining security through user participation.',
    notesTitle: '2026 operating notes',
    notes: [
      'This document is an archive based on early technical posts.',
      'For current release/operation standards, refer to notices and release notes first.',
      'This is a technical/operational record, not an investment-promotion document.'
    ]
  },
  ja: {
    srTitle: 'XPC 1.0 紹介 (1) - Bitcoin 0.17.0 ベース PoS',
    title: 'XPC 1.0 紹介 (1) - Bitcoin 0.17.0 ベース PoS',
    subtitle: 'XPC 1.0 Blockchain (1) - Based on Bitcoin 0.17.0',
    tocTitle: '目次',
    tocItems: ['Bitcoin 0.17.0 ベース', 'ABPoS (Age Burnable PoS)', 'XPC ブロックチェーン仕様'],
    summaryTitle: '要点',
    summaryBody:
      'XPC は SegWit を基本サポートする Bitcoin 0.17.0 ベースで開発され、コンセンサスには PoS (Proof-of-Stake) を採用しました。',
    bodyTitle: '本文',
    sectionTitle: '1) Bitcoin 0.17.0 ベースの PoS コンセンサス',
    segwitTitle: 'SegWit サポート',
    segwitBody:
      'SegWit は電子署名をトランザクション本体から分離し、トランザクション重量を削減して 1 ブロックあたりの処理件数を増やします。速度とネットワーク効率の改善が期待できます。',
    compatibilityTitle: 'Bitcoin エコシステムとの互換性',
    compatibilityBody:
      'XPC は Bitcoin 0.17.0 ベースで開発されているため、既存の検証済みコードやツールを参照しやすく、長期運用の安定化に集中しやすい利点があります。',
    posTitle: 'PoS (Proof-of-Stake) 採用背景',
    posBody:
      'PoW は実績ある方式ですが、電力/設備コストが高く、参加者が少ない環境では集中リスクが大きくなる場合があります。XPC は参加ベースでセキュリティを維持しつつ運用コストを下げるため PoS を採用しました。',
    notesTitle: '2026 運用注記',
    notes: [
      '本資料は初期技術投稿ベースのアーカイブです。',
      '現行のリリース/運用基準は告知およびリリースノートを優先してください。',
      '本資料は投資誘導ではなく技術/運用記録を目的とします。'
    ]
  }
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: 'XPC 1.0 Part 1',
    alternates: {
      canonical: buildLocalePath(locale, '/docs/xpc-1-0/part-1'),
      languages: buildAlternates('/docs/xpc-1-0/part-1')
    }
  };
}

export default async function LocalizedXpcPartOnePage({ params }: Props) {
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
            <p className="text-text">{c.bodyTitle}</p>
            <h3 className="mt-3 text-base font-semibold text-text">{c.sectionTitle}</h3>
            <Image
              src="/docs/xpc-1-0/part-1-main.png"
              alt="XPC 1.0 Blockchain Part 1 Diagram"
              width={1600}
              height={900}
              className="mt-4 h-auto w-full rounded-lg border border-line"
            />

            <h4 className="mt-4 text-sm font-semibold text-text">{c.segwitTitle}</h4>
            <p className="mt-2">{c.segwitBody}</p>

            <h4 className="mt-4 text-sm font-semibold text-text">{c.compatibilityTitle}</h4>
            <p className="mt-2">{c.compatibilityBody}</p>

            <h4 className="mt-4 text-sm font-semibold text-text">{c.posTitle}</h4>
            <p className="mt-2">{c.posBody}</p>
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
