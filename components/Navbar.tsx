'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Link, usePathname } from '@/i18n/navigation';
import { locales, type Locale } from '@/lib/i18n/locales';

type NavGroup = {
  title: string;
  links: Array<{ href: string; label: string }>;
};

type NavbarProps = {
  locale: Locale;
  labels: {
    mobileMenuAriaLabel: string;
    menu: string;
    mainMenu: string;
    mobileMenu: string;
    home: string;
    languageLabel: string;
    languageNames: Record<Locale, string>;
  };
  primaryLinks: Array<{ href: string; label: string }>;
  navGroups: NavGroup[];
};

export function Navbar({ locale, labels, primaryLinks, navGroups }: NavbarProps) {
  const pathname = usePathname() ?? '/';
  const [mobileOpen, setMobileOpen] = useState(false);
  const allLinks = [...primaryLinks, ...navGroups.flatMap((group) => group.links)];

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-bg/95 backdrop-blur">
      <div className="container-width flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold tracking-wide text-text">
          <Image src="/xpc-logo.png" alt="XPChain logo" width={28} height={28} priority />
          <span>XPChain</span>
        </Link>

        <button
          type="button"
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav-panel"
          aria-label={labels.mobileMenuAriaLabel}
          onClick={() => setMobileOpen((prev) => !prev)}
          className="inline-flex items-center justify-center rounded-md border border-line px-3 py-2 text-sm text-text md:hidden"
        >
          {labels.menu}
        </button>

        <nav className="hidden items-center gap-1 text-sm text-mute md:flex" aria-label={labels.mainMenu}>
          {primaryLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 font-medium hover:bg-panel hover:text-text"
            >
              {link.label}
            </Link>
          ))}
          {navGroups.map((group) => (
            <details key={group.title} className="group relative">
              <summary className="cursor-pointer list-none rounded-md px-3 py-2 hover:bg-panel hover:text-text">
                {group.title}
              </summary>
              <div className="absolute right-0 mt-2 min-w-48 rounded-lg border border-line bg-panel p-2 shadow-lg">
                {group.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block rounded-md px-3 py-2 text-sm text-mute hover:bg-bg hover:text-text"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </details>
          ))}
          <div className="ml-1 flex items-center gap-1">
            <span className="sr-only">{labels.languageLabel}</span>
            {locales.map((targetLocale) => (
              <Link
                key={targetLocale}
                href={pathname}
                locale={targetLocale}
                className={`rounded-md px-2 py-1 text-xs ${
                  locale === targetLocale ? 'bg-accent text-bg' : 'border border-line text-mute hover:text-text'
                }`}
              >
                {labels.languageNames[targetLocale]}
              </Link>
            ))}
          </div>
        </nav>
      </div>

      {mobileOpen && (
        <div id="mobile-nav-panel" className="border-t border-line bg-panel/95 md:hidden">
          <nav className="container-width py-3" aria-label={labels.mobileMenu}>
            <Link
              href="/"
              className="mb-3 block rounded-md px-3 py-2 text-sm text-mute hover:bg-bg hover:text-text"
              onClick={() => setMobileOpen(false)}
            >
              {labels.home}
            </Link>
            <div className="mb-3 grid grid-cols-2 gap-2">
              {primaryLinks.map((link) => (
                <Link
                  key={`primary-${link.href}`}
                  href={link.href}
                  className="rounded-md border border-line px-3 py-2 text-center text-sm font-medium text-text hover:bg-bg"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            {navGroups.map((group) => (
              <details key={group.title} className="mb-2 rounded-lg border border-line/80 bg-bg/40">
                <summary className="cursor-pointer list-none px-3 py-2 text-sm font-semibold text-text">
                  {group.title}
                </summary>
                <div className="px-2 pb-2">
                  {group.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block rounded-md px-3 py-2 text-sm text-mute hover:bg-bg hover:text-text"
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </details>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-2">
              {allLinks.map((link) => (
                <Link
                  key={`quick-${link.href}`}
                  href={link.href}
                  className="rounded-md border border-line px-3 py-2 text-center text-xs text-mute hover:text-text"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {locales.map((targetLocale) => (
                <Link
                  key={`mobile-locale-${targetLocale}`}
                  href={pathname}
                  locale={targetLocale}
                  className={`rounded-md px-3 py-2 text-center text-xs ${
                    locale === targetLocale ? 'bg-accent text-bg' : 'border border-line text-mute hover:text-text'
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {labels.languageNames[targetLocale]}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
