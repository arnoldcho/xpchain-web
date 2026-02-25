'use client';

import { useState } from 'react';
import Image from 'next/image';

type NavGroup = {
  title: string;
  links: Array<{ href: string; label: string }>;
};

const primaryLinks = [
  { href: '/network', label: '네트워크' },
  { href: '/wallets', label: '지갑' },
  { href: '/staking', label: '스테이킹' },
  { href: '/explorer', label: '익스플로러' }
];

const navGroups: NavGroup[] = [
  {
    title: '더보기',
    links: [
      { href: '/notices', label: '공지' },
      { href: '/docs', label: '문서' },
      { href: '/build', label: '빌드' },
      { href: '/community', label: '커뮤니티' },
      { href: '/transparency', label: '투명성' }
    ]
  }
];

const allLinks = [...primaryLinks, ...navGroups.flatMap((group) => group.links)];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-bg/95 backdrop-blur">
      <div className="container-width flex items-center justify-between py-4">
        <a href="/" className="flex items-center gap-2 text-lg font-semibold tracking-wide text-text">
          <Image src="/xpc-logo.png" alt="XPChain logo" width={28} height={28} priority />
          <span>XPChain</span>
        </a>

        <button
          type="button"
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav-panel"
          aria-label="모바일 메뉴 열기"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="inline-flex items-center justify-center rounded-md border border-line px-3 py-2 text-sm text-text md:hidden"
        >
          메뉴
        </button>

        <nav className="hidden items-center gap-1 text-sm text-mute md:flex" aria-label="주 메뉴">
          {primaryLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 font-medium hover:bg-panel hover:text-text"
            >
              {link.label}
            </a>
          ))}
          {navGroups.map((group) => (
            <details key={group.title} className="group relative">
              <summary className="cursor-pointer list-none rounded-md px-3 py-2 hover:bg-panel hover:text-text">
                {group.title}
              </summary>
              <div className="absolute right-0 mt-2 min-w-48 rounded-lg border border-line bg-panel p-2 shadow-lg">
                {group.links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="block rounded-md px-3 py-2 text-sm text-mute hover:bg-bg hover:text-text"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </details>
          ))}
        </nav>
      </div>

      {mobileOpen && (
        <div id="mobile-nav-panel" className="border-t border-line bg-panel/95 md:hidden">
          <nav className="container-width py-3" aria-label="모바일 메뉴">
            <a
              href="/"
              className="mb-3 block rounded-md px-3 py-2 text-sm text-mute hover:bg-bg hover:text-text"
              onClick={() => setMobileOpen(false)}
            >
              홈
            </a>
            <div className="mb-3 grid grid-cols-2 gap-2">
              {primaryLinks.map((link) => (
                <a
                  key={`primary-${link.href}`}
                  href={link.href}
                  className="rounded-md border border-line px-3 py-2 text-center text-sm font-medium text-text hover:bg-bg"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              ))}
            </div>
            {navGroups.map((group) => (
              <details key={group.title} className="mb-2 rounded-lg border border-line/80 bg-bg/40">
                <summary className="cursor-pointer list-none px-3 py-2 text-sm font-semibold text-text">
                  {group.title}
                </summary>
                <div className="px-2 pb-2">
                  {group.links.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className="block rounded-md px-3 py-2 text-sm text-mute hover:bg-bg hover:text-text"
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </details>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-2">
              {allLinks.map((link) => (
                <a
                  key={`quick-${link.href}`}
                  href={link.href}
                  className="rounded-md border border-line px-3 py-2 text-center text-xs text-mute hover:text-text"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
