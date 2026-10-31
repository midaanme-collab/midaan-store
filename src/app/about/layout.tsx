import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'عن ميدان | About Midaan',
  description: 'مساحة للإبداع والتعبير والمناصرة • مبادرة فكرية وثقافية ومجلة مستقلة من عمّان إلى فلسطين. An independent intellectual, cultural, and streetwear collective.',
  alternates: {
    canonical: 'https://midaan-store.midaanme.workers.dev/about',
  },
  openGraph: {
    title: 'عن ميدان | About Midaan',
    description: 'مساحة للإبداع والتعبير والمناصرة • من عمّان إلى فلسطين.',
    url: 'https://midaan-store.midaanme.workers.dev/about',
    siteName: 'ميدان | Midaan',
    images: ['/magazine/issue-zero-cover-thumb.png'],
    type: 'website',
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
