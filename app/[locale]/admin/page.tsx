import type { Metadata } from 'next';
import OriginalPage from '../../admin/page';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false
  }
};

type SearchParams = Record<string, string | string[] | undefined>;

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

export default function AdminHomeWrapper({ searchParams }: { searchParams: Promise<SearchParams> }) {
  return <OriginalPage searchParams={searchParams} />;
}
