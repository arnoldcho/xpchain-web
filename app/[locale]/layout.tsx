import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { localeToBCP47, locales, type Locale } from '@/lib/i18n/locales';

type Props = {
  children: ReactNode;
  params: { locale: string };
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Pick<Props, 'params'>): Promise<Metadata> {
  if (!locales.includes(params.locale as Locale)) {
    return {};
  }

  const locale = params.locale as Locale;
  const t = await getTranslations({ locale, namespace: 'metadata' });

  return {
    title: {
      default: t('siteTitle'),
      template: `%s | ${t('siteTitle')}`
    },
    description: t('siteDescription'),
    openGraph: {
      title: t('siteTitle'),
      description: t('siteDescription'),
      locale: localeToBCP47[locale],
      images: [{ url: '/xpc-logo.png', width: 512, height: 512, alt: 'XPChain Logo' }]
    }
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  if (!locales.includes(params.locale as Locale)) {
    notFound();
  }

  const locale = params.locale as Locale;
  setRequestLocale(locale);
  const messages = await getMessages();
  const t = await getTranslations({ locale });

  return (
    <NextIntlClientProvider messages={messages}>
      <Navbar
        locale={locale}
        labels={{
          mobileMenuAriaLabel: t('nav.mobileMenuAriaLabel'),
          menu: t('nav.menu'),
          mainMenu: t('nav.mainMenu'),
          mobileMenu: t('nav.mobileMenu'),
          home: t('nav.home'),
          languageLabel: t('nav.languageLabel'),
          languageNames: {
            ko: t('nav.languages.ko'),
            en: t('nav.languages.en'),
            ja: t('nav.languages.ja')
          }
        }}
        primaryLinks={[
          { href: '/network', label: t('nav.primary.network') },
          { href: '/wallets', label: t('nav.primary.wallets') },
          { href: '/staking', label: t('nav.primary.staking') },
          { href: '/explorer', label: t('nav.primary.explorer') }
        ]}
        navGroups={[
          {
            title: t('nav.more.title'),
            links: [
              { href: '/notices', label: t('nav.more.notices') },
              { href: '/docs', label: t('nav.more.docs') },
              { href: '/roadmap', label: t('nav.more.roadmap') },
              { href: '/build', label: t('nav.more.build') },
              { href: '/community', label: t('nav.more.community') },
              { href: '/philosophy', label: t('nav.more.philosophy') }
            ]
          }
        ]}
      />
      <main>{children}</main>
      <Footer line1={t('footer.line1')} line2={t('footer.line2')} copyright={t('footer.copyright')} />
    </NextIntlClientProvider>
  );
}
