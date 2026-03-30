import { notFound, redirect } from 'next/navigation';

const legacyPostRedirects: Record<string, string> = {
  'xpc-1-0-blockchain-1-based-on-bitcoin-0-17-0': '/docs/xpc-1-0/part-1'
};

export default async function LegacyPostRedirectPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const target = legacyPostRedirects[slug];

  if (!target) {
    notFound();
  }

  redirect(target);
}
