import type { Metadata } from "next";
import ArticleCard from "@/components/ArticleCard";
import { getAllArticles } from "@/lib/content";

export const metadata: Metadata = {
  title: "Articles",
  description:
    "Guides and explainers on nail and beauty trends, pricing, safety, and the business of U.S. salons.",
};

export default function ArticlesPage() {
  const articles = getAllArticles();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8 border-b border-rose-200 pb-6">
        <h1 className="font-serif text-3xl font-bold text-ink-900 sm:text-4xl">
          Articles
        </h1>
        <p className="mt-2 text-ink-500">
          Guides and explainers on nail and beauty trends, pricing, safety,
          and the business of U.S. salons.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
    </div>
  );
}
