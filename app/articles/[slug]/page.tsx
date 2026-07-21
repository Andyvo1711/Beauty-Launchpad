import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import ArticleCard from "@/components/ArticleCard";
import Comments from "@/components/Comments";
import {
  getAllSlugs,
  getArticleBySlug,
  getRelatedArticles,
} from "@/lib/content";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.excerpt,
  };
}

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(`${dateString}T00:00:00`));
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const related = getRelatedArticles(article, 3);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <span className="w-fit rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-rose-800">
        {article.topic}
      </span>

      <h1 className="mt-4 font-serif text-3xl font-bold leading-tight text-ink-900 sm:text-4xl">
        {article.title}
      </h1>

      <p className="mt-3 text-sm font-medium text-ink-500">
        {formatDate(article.date)}
      </p>

      <div className="relative mt-6 aspect-[16/10] w-full overflow-hidden rounded-2xl bg-rose-100">
        <Image
          src={article.coverImage}
          alt={article.title}
          fill
          priority
          sizes="(min-width: 768px) 768px, 100vw"
          className="object-cover"
        />
      </div>
      {article.imageCredit && (
        <p className="mt-2 text-right text-xs text-ink-400">
          Photo: {article.imageCredit}
        </p>
      )}

      <div
        className="mt-8 max-w-none text-[17px] leading-relaxed text-ink-800 [&>h2]:mt-8 [&>h2]:mb-3 [&>h2]:font-serif [&>h2]:text-xl [&>h2]:font-bold [&>h2]:text-ink-900 [&>p]:mb-5"
        dangerouslySetInnerHTML={{ __html: article.contentHtml }}
      />

      <Comments slug={article.slug} />

      {related.length > 0 && (
        <section className="mt-16 border-t border-rose-200 pt-10">
          <h2 className="mb-5 font-serif text-2xl font-bold text-ink-900">
            More Articles
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {related.map((item) => (
              <ArticleCard key={item.slug} article={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
