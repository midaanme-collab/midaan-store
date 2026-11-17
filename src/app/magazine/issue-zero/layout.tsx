import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'قراءة وتحميل مجلة ميدان العدد صفر | Midaan Issue Zero',
  description: 'تصفح وحمّل العدد صفر من مجلة ميدان الثقافية المستقلة (انتحاب / Entihab) بصيغة PDF كاملة باللغتين العربية والإنجليزية مجاناً.',
  alternates: {
    canonical: 'https://midaan.net/magazine/issue-zero',
  },
  openGraph: {
    title: 'قراءة وتحميل مجلة ميدان العدد صفر | Midaan Issue Zero',
    description: 'تصفح وحمّل العدد صفر من مجلة ميدان الثقافية المستقلة بصيغة PDF مجاناً.',
    url: 'https://midaan.net/magazine/issue-zero',
    siteName: 'مجلة ميدان | Midaan Magazine',
    locale: 'ar',
    type: 'article',
    images: ['/magazine/issue-zero-cover-thumb.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'مجلة ميدان — العدد صفر (انتحاب)',
    description: 'تصفح وحمّل العدد صفر من مجلة ميدان الثقافية المستقلة بصيغة PDF مجاناً.',
    images: ['/magazine/issue-zero-cover-thumb.png'],
  },
};

export default function IssueZeroLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
