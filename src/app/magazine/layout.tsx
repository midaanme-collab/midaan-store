import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'مجلة ميدان العدد صفر | Midaan Magazine Issue Zero',
  description: 'إصدار فكري وثقافي مستقل يبحث في قضايا الهوية والتعبير والمناصرة الفنية. تصفح مقالات العدد صفر وحمّل النسخة الكاملة PDF مجاناً.',
  alternates: {
    canonical: 'https://midaan.net/magazine',
  },
  openGraph: {
    title: 'مجلة ميدان العدد صفر | Midaan Magazine Issue Zero',
    description: 'إصدار فكري وثقافي مستقل يبحث في قضايا الهوية والتعبير والمناصرة الفنية من عمّان.',
    url: 'https://midaan.net/magazine',
    siteName: 'مجلة ميدان | Midaan Magazine',
    locale: 'ar',
    type: 'website',
    images: ['/magazine/issue-zero-cover-thumb.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'مجلة ميدان العدد صفر | Midaan Magazine',
    description: 'إصدار فكري وثقافي مستقل يبحث في قضايا الهوية والتعبير والمناصرة الفنية.',
    images: ['/magazine/issue-zero-cover-thumb.png'],
  },
};

export default function MagazineLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
