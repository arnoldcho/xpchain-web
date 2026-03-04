import type { Metadata } from 'next';
import { Section } from '@/components/Section';
import type { Locale } from '@/lib/i18n/locales';
import { buildAlternates, buildLocalePath } from '@/lib/seo';

type Props = {
  params: Promise<{ locale: Locale }>;
};

type DoDCopy = {
  srTitle: string;
  title: string;
  subtitle: string;
  commonTitle: string;
  commonItems: string[];
  pageTitle: string;
  pageItems: string[];
  evidenceTitle: string;
  evidenceItems: string[];
};

const copyByLocale: Record<Locale, DoDCopy> = {
  ko: {
    srTitle: 'Definition of Done 체크리스트',
    title: 'Definition of Done 체크리스트',
    subtitle: '배포/문서 반영 시 완료 기준',
    commonTitle: '1) 공통 완료 기준',
    commonItems: [
      '금지 표현 점검 완료 (투자 권유/수익 보장/가격 유도 문구 없음)',
      '핵심 페이지 링크 및 외부 링크 동작 확인',
      '모바일/데스크톱 기본 렌더링 및 접근 동선 확인',
      '`npm run lint` 통과',
      '`npm run build` 통과',
      '변경 내용에 맞는 문서/공지 반영 완료'
    ],
    pageTitle: '2) 페이지별 완료 기준',
    pageItems: [
      'Staking: OS별 5분 재가동 절차와 점검 명령 최신화',
      'Wallets: vNext/Stable, SHA256, 검증 명령 최신화',
      'Network/Explorer: 상태 API 정상 응답 및 fallback 동작 확인',
      'Docs/Notices: 운영 원칙/공지 이력 최신화'
    ],
    evidenceTitle: '3) 완료 증빙',
    evidenceItems: ['검증일', '검증자', '관련 커밋 SHA', '비고/후속 작업']
  },
  en: {
    srTitle: 'Definition of Done Checklist',
    title: 'Definition of Done Checklist',
    subtitle: 'Completion criteria for deployment and documentation updates',
    commonTitle: '1) Common completion criteria',
    commonItems: [
      'Prohibited-expression scan completed (no investment solicitation/profit guarantee/price-inducing text)',
      'Core-page and external-link behavior verified',
      'Mobile/desktop rendering and navigation path verified',
      '`npm run lint` passes',
      '`npm run build` passes',
      'Docs/notices updated to reflect changes'
    ],
    pageTitle: '2) Per-page completion criteria',
    pageItems: [
      'Staking: OS restart steps and verification commands are up to date',
      'Wallets: vNext/Stable labels, SHA256, and verify commands are current',
      'Network/Explorer: status APIs and fallback behavior verified',
      'Docs/Notices: operating principles and notice history updated'
    ],
    evidenceTitle: '3) Completion evidence',
    evidenceItems: ['Verification date', 'Verifier', 'Related commit SHA', 'Notes/follow-up']
  },
  ja: {
    srTitle: 'Definition of Done チェックリスト',
    title: 'Definition of Done チェックリスト',
    subtitle: '配布/文書反映時の完了基準',
    commonTitle: '1) 共通完了基準',
    commonItems: [
      '禁止表現点検完了 (投資勧誘/収益保証/価格誘導文言なし)',
      '主要ページリンクおよび外部リンク動作確認',
      'モバイル/デスクトップ描画と導線確認',
      '`npm run lint` 通過',
      '`npm run build` 通過',
      '変更内容に応じた文書/告知反映完了'
    ],
    pageTitle: '2) ページ別完了基準',
    pageItems: [
      'Staking: OS別5分再起動手順と確認コマンド更新',
      'Wallets: vNext/Stable, SHA256, 検証コマンド更新',
      'Network/Explorer: 状態API応答とfallback動作確認',
      'Docs/Notices: 運用原則/告知履歴更新'
    ],
    evidenceTitle: '3) 完了証跡',
    evidenceItems: ['検証日', '検証者', '関連コミットSHA', '備考/後続作業']
  }
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: 'Definition of Done Checklist',
    alternates: {
      canonical: buildLocalePath(locale, '/docs/definition-of-done-checklist'),
      languages: buildAlternates('/docs/definition-of-done-checklist')
    }
  };
}

export default async function LocalizedDefinitionOfDonePage({ params }: Props) {
  const { locale } = await params;
  const c = copyByLocale[locale];

  return (
    <>
      <h1 className="sr-only">{c.srTitle}</h1>
      <Section title={c.title} subtitle={c.subtitle}>
        <div className="space-y-4 text-sm text-mute">
          <article className="panel p-5">
            <p className="font-medium text-text">{c.commonTitle}</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">{c.commonItems.map((i) => <li key={i}>{i}</li>)}</ul>
          </article>
          <article className="panel p-5">
            <p className="font-medium text-text">{c.pageTitle}</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">{c.pageItems.map((i) => <li key={i}>{i}</li>)}</ul>
          </article>
          <article className="panel p-5">
            <p className="font-medium text-text">{c.evidenceTitle}</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">{c.evidenceItems.map((i) => <li key={i}>{i}</li>)}</ul>
          </article>
        </div>
      </Section>
    </>
  );
}
