type AdminTab = 'home' | 'stats';

type AdminTabsProps = {
  active: AdminTab;
  token?: string;
};

const TABS: { key: AdminTab; label: string; icon: string; href: string }[] = [
  { key: 'home', label: '홈', icon: '🏠', href: '/admin' },
  { key: 'stats', label: '통계', icon: '📊', href: '/admin/track' }
];

function withToken(href: string, token?: string): string {
  if (!token) return href;
  const params = new URLSearchParams({ token });
  return `${href}?${params.toString()}`;
}

export function AdminTabs({ active, token }: AdminTabsProps) {
  return (
    <nav className="inline-flex gap-1 rounded-xl border border-line bg-panel p-1" aria-label="관리자 탭">
      {TABS.map((tab) => {
        const isActive = tab.key === active;
        return (
          <a
            key={tab.key}
            href={withToken(tab.href, token)}
            aria-current={isActive ? 'page' : undefined}
            className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
              isActive
                ? 'bg-accent/15 text-accent'
                : 'text-mute hover:bg-line/40 hover:text-text'
            }`}
          >
            <span aria-hidden>{tab.icon}</span>
            {tab.label}
          </a>
        );
      })}
    </nav>
  );
}
