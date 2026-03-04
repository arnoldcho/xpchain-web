import type { Metadata } from 'next';
import { Section } from '@/components/Section';
import OriginalPage from '../../../docs/xpc-1-0/page';
import type { Locale } from '@/lib/i18n/locales';
import { buildAlternates, buildLocalePath } from '@/lib/seo';

type Props = {
  params: { locale: Locale };
};

type SeriesItem = { href: string; title: string; description: string };

type Copy = {
  srTitle: string;
  title: string;
  subtitle: string;
  introTitle: string;
  introBody: string;
  status: string;
  viewDoc: string;
  items: SeriesItem[];
};

const copyByLocale: Record<Exclude<Locale, 'ko'>, Copy> = {
  en: {
    srTitle: 'XPC 1.0 Series',
    title: 'XPC 1.0 Series',
    subtitle: 'Archived technical posts reorganized under current operational standards.',
    introTitle: 'Series note',
    introBody: 'This series preserves early technical context. If any item differs from current standards, treat it as historical archive context and cross-check with current notices and release notes.',
    status: 'Published',
    viewDoc: 'View document',
    items: [
      {
        href: '/en/docs/xpc-1-0/part-1',
        title: 'Part 1. PoS based on Bitcoin 0.17.0',
        description: 'Background of SegWit support, Bitcoin 0.17.0 base architecture, and PoS adoption.'
      },
      {
        href: '/en/docs/xpc-1-0/part-2',
        title: 'Part 2. ABPoS details',
        description: 'ABPoS reward distribution structure, immediate split setting, and fee-burn concept.'
      },
      {
        href: '/en/docs/xpc-1-0/part-3',
        title: 'Part 3. XPC blockchain specification',
        description: 'Chain specs, ABPoS annual-rate model, and notes on initial distribution records.'
      }
    ]
  },
  ja: {
    srTitle: 'XPC 1.0 シリーズ',
    title: 'XPC 1.0 シリーズ',
    subtitle: '初期技術投稿を現在の運用基準で再整理したアーカイブです。',
    introTitle: 'シリーズ案内',
    introBody: '本シリーズは初期技術文脈を保存するアーカイブです。現行基準との差異がある項目は、最新の告知/リリースノートと合わせて確認してください。',
    status: '公開',
    viewDoc: '文書を見る',
    items: [
      {
        href: '/ja/docs/xpc-1-0/part-1',
        title: 'Part 1. Bitcoin 0.17.0 ベース PoS',
        description: 'SegWit対応、Bitcoin 0.17.0 ベース構造、PoS採用背景を整理します。'
      },
      {
        href: '/ja/docs/xpc-1-0/part-2',
        title: 'Part 2. ABPoS 詳細',
        description: 'ABPoS の報酬分配、即時分配設定、手数料バーン概念を整理します。'
      },
      {
        href: '/ja/docs/xpc-1-0/part-3',
        title: 'Part 3. XPC ブロックチェーン仕様',
        description: 'チェーン仕様、ABPoS年率モデル、初期分配記録の注釈を整理します。'
      }
    ]
  }
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: 'XPC 1.0 Series',
    alternates: {
      canonical: buildLocalePath(params.locale, '/docs/xpc-1-0'),
      languages: buildAlternates('/docs/xpc-1-0')
    }
  };
}

export default function LocalizedXpcSeriesPage({ params }: Props) {
  if (params.locale === 'ko') {
    return <OriginalPage />;
  }

  const c = copyByLocale[params.locale];

  return (
    <>
      <h1 className="sr-only">{c.srTitle}</h1>
      <Section title={c.title} subtitle={c.subtitle}>
        <div className="panel p-5 text-sm text-mute">
          <p className="text-text">{c.introTitle}</p>
          <p className="mt-2">{c.introBody}</p>
        </div>
        <div className="mt-4 space-y-3">
          {c.items.map((item) => (
            <article key={item.href} className="panel p-5 text-sm text-mute">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-base text-text">{item.title}</p>
                <span className="rounded border border-line px-2 py-0.5 text-xs">{c.status}</span>
              </div>
              <p className="mt-2">{item.description}</p>
              <a href={item.href} className="mt-3 inline-block text-accent">{c.viewDoc}</a>
            </article>
          ))}
        </div>
      </Section>
    </>
  );
}
