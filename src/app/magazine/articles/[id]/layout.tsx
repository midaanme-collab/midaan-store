
import { ARTICLES } from '@/constants/articles';

export function generateStaticParams() {
  return ARTICLES.map((article) => ({
    id: article.id,
  }));
}

export default function ArticleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
