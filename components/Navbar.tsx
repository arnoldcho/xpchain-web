import Image from 'next/image';

const links = [
  { href: '/network', label: '네트워크' },
  { href: '/staking', label: '스테이킹' },
  { href: '/wallets', label: '지갑' },
  { href: '/explorer', label: '익스플로러' },
  { href: '/build', label: '빌드' },
  { href: '/community', label: '커뮤니티' },
  { href: '/docs', label: '문서' },
  { href: '/notices', label: '공지' },
  { href: '/transparency', label: '투명성' }
];

export function Navbar() {
  return (
    <header className="border-b border-line/80 bg-bg/90 backdrop-blur">
      <div className="container-width flex items-center justify-between py-4">
        <a href="/" className="flex items-center gap-2 text-lg font-semibold tracking-wide text-text">
          <Image src="/xpc-logo.png" alt="XPChain logo" width={28} height={28} priority />
          <span>XPChain</span>
        </a>
        <nav className="flex flex-wrap items-center gap-4 text-sm text-mute">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="hover:text-text">
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
