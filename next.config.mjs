import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/:locale(ko|en|ja)/robots.txt',
        destination: '/robots.txt'
      },
      {
        source: '/:locale(ko|en|ja)/sitemap.xml',
        destination: '/sitemap.xml'
      }
    ];
  }
};

export default withNextIntl(nextConfig);
