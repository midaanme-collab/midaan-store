import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'عن ميدان | About Midaan — Independent Collective Amman',
  description: 'مساحة للإبداع والتعبير والمناصرة من عمّان إلى فلسطين: مبادرة فكرية وثقافية ومجلة مستقلة وأزياء تعبيرية توثق نبض الشارع وتحرس الرواية.',
  alternates: {
    canonical: 'https://midaan.net/about',
  },
  openGraph: {
    title: 'عن ميدان | About Midaan — Independent Collective Amman',
    description: 'مساحة للإبداع والتعبير والمناصرة من عمّان إلى فلسطين: مبادرة فكرية ومجلة مستقلة.',
    url: 'https://midaan.net/about',
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
