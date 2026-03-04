import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Section } from '@/components/Section';
import { links } from '@/lib/links';
import type { Locale } from '@/lib/i18n/locales';
import { buildAlternates, buildLocalePath } from '@/lib/seo';

type Props = {
  params: { locale: Locale };
};

type DocsCopy = {
  srTitle: string;
  title: string;
  subtitle: string;
  seriesTitle: string;
  seriesBody: string;
  part1: string;
  part2: string;
  part3: string;
  viewAll: string;
  principlesTitle: string;
  principles: string[];
  opsSummaryTitle: string;
  opsSummary: string[];
  principleLink: string;
  roadmapLink: string;
  walletChecklistLink: string;
  dodLink: string;
  noticesLink: string;
  stakingLink: string;
  scopeTitle: string;
  scopeBody: string;
  publicScopeTitle: string;
  publicScope: string[];
  privateScopeTitle: string;
  privateScope: string[];
  validationTitle: string;
  validationBody: string;
  validationScope: string;
  validationReport: string;
  whitepaperTitle: string;
  whitepaperBody: string;
  whitepaperKr: string;
  whitepaperEn: string;
  whitepaperJa: string;
  writtenAt: string;
};

const docsCopy: Record<Locale, DocsCopy> = {
  ko: {
    srTitle: '문서',
    title: '문서',
    subtitle: '현재 운영 원칙과 아카이브 백서를 함께 제공합니다.',
    seriesTitle: 'XPC 1.0 기술 시리즈 (Archive + 정리본)',
    seriesBody: '초기 포스팅을 운영 관점으로 재정리한 문서입니다. 원문 설명을 보존하되 현재 기준과 차이가 있는 항목은 주석으로 구분합니다.',
    part1: 'Part 1. 비트코인 0.17.0 기반 PoS',
    part2: 'Part 2. ABPoS 상세',
    part3: 'Part 3. XPC 블록체인 사양',
    viewAll: '시리즈 전체 보기',
    principlesTitle: '최신 운영 원칙',
    principles: [
      '가격/상장/투자 유도보다 분산성과 장기 지속성을 우선합니다.',
      '스테이킹은 수익 보장 수단이 아니라 네트워크 참여 수단입니다.',
      '철학/투명성 원칙과 공지 이력은 사이트 내 페이지에서 계속 갱신됩니다.'
    ],
    opsSummaryTitle: '운영 문서(요약)',
    opsSummary: [
      '노드 설치(Ubuntu): 코어 설치 후 `rpcuser`, `rpcpassword`, `txindex=1` 설정 권장',
      '스테이킹 운영: 동기화 완료 후 staking-only unlock 사용',
      '모니터링: 블록 간격, 피어 연결 수, 마지막 블록 시각을 우선 확인'
    ],
    principleLink: '철학(운영 원칙/투명성) 보기',
    roadmapLink: '로드맵 보기',
    walletChecklistLink: 'Wallet 업데이트 체크리스트',
    dodLink: 'Definition of Done 체크리스트',
    noticesLink: '공지/업데이트 보기',
    stakingLink: '스테이킹 가이드 보기',
    scopeTitle: '히스토리 + 현재 운영 범위',
    scopeBody: 'XPChain 사이트는 초기 문서(아카이브)와 현재 운영 기준을 함께 공개합니다. 현재 의사결정과 운영 기준은 공지/운영 문서/온체인 데이터 기준으로 최신 항목을 우선합니다.',
    publicScopeTitle: '공개 범위 (포함)',
    publicScope: [
      '기술 아카이브 문서 및 릴리즈 검증 결과',
      '운영 정책/가이드(지갑, 스테이킹, 네트워크 상태 안내)',
      '공지 이력, 로드맵, 익스플로러 기반 공개 운영 정보'
    ],
    privateScopeTitle: '비공개 범위 (제외)',
    privateScope: [
      '내부 보안 문서, 인프라 민감 설정값, 접근 제어 정보',
      '개인 식별 정보 및 외부 공개 동의가 없는 운영 기록',
      '검증되지 않은 추정/의견성 이슈 기록'
    ],
    validationTitle: 'v0.17.0-4 릴리스 검증 결과',
    validationBody: '실사용 기준 런타임 스모크 + 지갑 기능(동기화/입출금/재시작) 검증을 완료했습니다.',
    validationScope: '범위: v0.17.0-4 / wallet functional test / restart resilience 포함',
    validationReport: '상세 검증 리포트 보기',
    whitepaperTitle: '아카이브 백서 (초기 버전)',
    whitepaperBody: '아래 문서는 XPChain 초기 백서입니다. 현재 운영 정책/커뮤니케이션 기준과 일부 차이가 있을 수 있으며, 최신 기준은 운영 원칙 페이지를 우선 참고해 주세요.',
    whitepaperKr: '국문 백서 (Archive)',
    whitepaperEn: '영문 백서 (Archive)',
    whitepaperJa: '일문 백서 (Archive)',
    writtenAt: '작성일: 2018년 12월'
  },
  en: {
    srTitle: 'Docs',
    title: 'Docs',
    subtitle: 'Current operational principles and archived whitepapers.',
    seriesTitle: 'XPC 1.0 Technical Series (Archive + Updated Notes)',
    seriesBody: 'Legacy technical posts reorganized from the current operations perspective. Original technical explanation is preserved, and differences from current policy are annotated.',
    part1: 'Part 1. PoS based on Bitcoin 0.17.0',
    part2: 'Part 2. ABPoS details',
    part3: 'Part 3. XPC blockchain specification',
    viewAll: 'View full series',
    principlesTitle: 'Current Operating Principles',
    principles: [
      'Prioritize decentralization and long-term sustainability over listing/price narratives.',
      'Staking is a network participation method, not a guaranteed return mechanism.',
      'Philosophy/transparency principles and notice history are continuously updated on this site.'
    ],
    opsSummaryTitle: 'Operational docs (summary)',
    opsSummary: [
      'Node setup (Ubuntu): configure `rpcuser`, `rpcpassword`, and recommend `txindex=1`',
      'Staking operations: use staking-only unlock after full synchronization',
      'Monitoring priority: block interval, peer count, last block time'
    ],
    principleLink: 'View philosophy (principles/transparency)',
    roadmapLink: 'View roadmap',
    walletChecklistLink: 'Wallet update checklist',
    dodLink: 'Definition of Done checklist',
    noticesLink: 'View notices/updates',
    stakingLink: 'View staking guide',
    scopeTitle: 'History + Current Operations Scope',
    scopeBody: 'XPChain publishes both initial archive documents and current operational standards. For decision-making, the latest notices, operation docs, and on-chain data take precedence.',
    publicScopeTitle: 'Public scope (included)',
    publicScope: [
      'Technical archive documents and release verification results',
      'Operational policy/guides (wallet, staking, network status)',
      'Notice history, roadmap, and explorer-based public operations info'
    ],
    privateScopeTitle: 'Private scope (excluded)',
    privateScope: [
      'Internal security docs, sensitive infra values, access control data',
      'Personal identifiable data and non-consented records',
      'Unverified assumptions/opinion-oriented issue logs'
    ],
    validationTitle: 'v0.17.0-4 Release Validation',
    validationBody: 'Runtime smoke tests and wallet functional checks (sync/send/receive/restart) were completed.',
    validationScope: 'Scope: v0.17.0-4 / wallet functional test / restart resilience',
    validationReport: 'View detailed validation report',
    whitepaperTitle: 'Archived Whitepapers (Early versions)',
    whitepaperBody: 'The documents below are early XPChain whitepapers. Some sections may differ from current policies and communication standards. Refer to current operations pages first.',
    whitepaperKr: 'Korean whitepaper (Archive)',
    whitepaperEn: 'English whitepaper (Archive)',
    whitepaperJa: 'Japanese whitepaper (Archive)',
    writtenAt: 'Written: December 2018'
  },
  ja: {
    srTitle: 'ドキュメント',
    title: 'ドキュメント',
    subtitle: '現在の運用原則とアーカイブ白書をあわせて提供します。',
    seriesTitle: 'XPC 1.0 技術シリーズ (Archive + 再整理版)',
    seriesBody: '過去の技術投稿を現在の運用観点で再整理した文書です。原文説明は維持し、現行基準との差異は注釈で区分します。',
    part1: 'Part 1. Bitcoin 0.17.0 ベース PoS',
    part2: 'Part 2. ABPoS 詳細',
    part3: 'Part 3. XPC ブロックチェーン仕様',
    viewAll: 'シリーズ全体を見る',
    principlesTitle: '最新の運用原則',
    principles: [
      '価格/上場/投資誘導より分散性と長期持続性を優先します。',
      'ステーキングは収益保証手段ではなくネットワーク参加手段です。',
      '哲学/透明性原則と告知履歴はサイト内で継続更新します。'
    ],
    opsSummaryTitle: '運用文書 (要約)',
    opsSummary: [
      'ノード導入(Ubuntu): `rpcuser`, `rpcpassword`, `txindex=1` 設定推奨',
      'ステーキング運用: 同期完了後に staking-only unlock 使用',
      '監視優先: ブロック間隔、ピア接続数、最終ブロック時刻'
    ],
    principleLink: '哲学(運用原則/透明性)を見る',
    roadmapLink: 'ロードマップを見る',
    walletChecklistLink: 'Wallet更新チェックリスト',
    dodLink: 'Definition of Done チェックリスト',
    noticesLink: 'お知らせ/更新を見る',
    stakingLink: 'ステーキングガイドを見る',
    scopeTitle: '履歴 + 現在の運用範囲',
    scopeBody: 'XPChainサイトは初期文書(アーカイブ)と現在の運用基準を併せて公開します。意思決定には告知/運用文書/オンチェーンデータの最新項目を優先します。',
    publicScopeTitle: '公開範囲 (含む)',
    publicScope: [
      '技術アーカイブ文書およびリリース検証結果',
      '運用方針/ガイド(ウォレット、ステーキング、ネットワーク状態)',
      '告知履歴、ロードマップ、エクスプローラー基盤の公開運用情報'
    ],
    privateScopeTitle: '非公開範囲 (除外)',
    privateScope: [
      '内部セキュリティ文書、インフラ機密値、アクセス制御情報',
      '個人識別情報および公開同意のない記録',
      '未検証の推定/意見性イシュー記録'
    ],
    validationTitle: 'v0.17.0-4 リリース検証結果',
    validationBody: '実運用基準のランタイムスモーク + ウォレット機能(同期/送受信/再起動)検証を完了しました。',
    validationScope: '範囲: v0.17.0-4 / wallet functional test / restart resilience',
    validationReport: '詳細検証レポートを見る',
    whitepaperTitle: 'アーカイブ白書 (初期版)',
    whitepaperBody: '以下の文書はXPChain初期白書です。現在の運用方針やコミュニケーション基準と差異がある可能性があります。最新基準は運用原則ページを優先してください。',
    whitepaperKr: '韓国語白書 (Archive)',
    whitepaperEn: '英語白書 (Archive)',
    whitepaperJa: '日本語白書 (Archive)',
    writtenAt: '作成日: 2018年12月'
  }
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale });
  const title = t('nav.more.docs');
  return {
    title,
    alternates: {
      canonical: buildLocalePath(params.locale, '/docs'),
      languages: buildAlternates('/docs')
    }
  };
}

export default function LocalizedDocsPage({ params }: Props) {
  const c = docsCopy[params.locale];
  const base = `/${params.locale}`;

  return (
    <>
      <h1 className="sr-only">{c.srTitle}</h1>
      <Section title={c.title} subtitle={c.subtitle}>
        <div className="space-y-4">
          <div className="panel p-5 text-sm text-mute">
            <p className="text-text">{c.seriesTitle}</p>
            <p className="mt-2">{c.seriesBody}</p>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              <li><a href={`${base}/docs/xpc-1-0/part-1`} className="text-accent">{c.part1}</a></li>
              <li><a href={`${base}/docs/xpc-1-0/part-2`} className="text-accent">{c.part2}</a></li>
              <li><a href={`${base}/docs/xpc-1-0/part-3`} className="text-accent">{c.part3}</a></li>
            </ul>
            <a href={`${base}/docs/xpc-1-0`} className="mt-4 inline-block text-accent">{c.viewAll}</a>
          </div>

          <div className="panel p-5 text-sm text-mute">
            <p className="text-text">{c.principlesTitle}</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">{c.principles.map((item) => <li key={item}>{item}</li>)}</ul>
            <p className="mt-4 text-text">{c.opsSummaryTitle}</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">{c.opsSummary.map((item) => <li key={item}>{item}</li>)}</ul>
            <div className="mt-4 flex flex-wrap gap-3">
              <a href={`${base}/philosophy`} className="text-accent">{c.principleLink}</a>
              <a href={`${base}/roadmap`} className="text-accent">{c.roadmapLink}</a>
              <a href={`${base}/docs/wallet-release-checklist`} className="text-accent">{c.walletChecklistLink}</a>
              <a href={`${base}/docs/definition-of-done-checklist`} className="text-accent">{c.dodLink}</a>
              <a href={`${base}/notices`} className="text-accent">{c.noticesLink}</a>
              <a href={`${base}/staking`} className="text-accent">{c.stakingLink}</a>
            </div>
          </div>

          <div className="panel p-5 text-sm text-mute">
            <p className="text-text">{c.scopeTitle}</p>
            <p className="mt-2">{c.scopeBody}</p>
            <p className="mt-4 text-text">{c.publicScopeTitle}</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">{c.publicScope.map((item) => <li key={item}>{item}</li>)}</ul>
            <p className="mt-4 text-text">{c.privateScopeTitle}</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">{c.privateScope.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>

          <div className="panel p-5 text-sm text-mute">
            <p className="text-text">{c.validationTitle}</p>
            <p className="mt-2">{c.validationBody}</p>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              <li>macOS: PASS</li>
              <li>Linux (Ubuntu 24.04): PASS</li>
              <li>Windows x64: PASS</li>
              <li>Windows x86: PASS</li>
            </ul>
            <p className="mt-3">{c.validationScope}</p>
            <a href="https://github.com/arnoldcho/xpchain-community-core/blob/master/doc/release-validation-v0.17.0-4.md" target="_blank" rel="noreferrer" className="mt-3 inline-block text-accent">{c.validationReport}</a>
          </div>

          <div className="panel p-5 text-sm text-mute">
            <p className="text-text">{c.whitepaperTitle}</p>
            <p className="mt-2">{c.whitepaperBody}</p>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              <li>
                <a href={links.whitepaperKr} target="_blank" rel="noreferrer" className="text-accent">{c.whitepaperKr}</a>
                <span className="ml-2 text-xs">{c.writtenAt}</span>
              </li>
              <li>
                <a href={links.whitepaperEn} target="_blank" rel="noreferrer" className="text-accent">{c.whitepaperEn}</a>
                <span className="ml-2 text-xs">{c.writtenAt}</span>
              </li>
              <li>
                <a href={links.whitepaperJp} target="_blank" rel="noreferrer" className="text-accent">{c.whitepaperJa}</a>
                <span className="ml-2 text-xs">{c.writtenAt}</span>
              </li>
            </ul>
          </div>
        </div>
      </Section>
    </>
  );
}
