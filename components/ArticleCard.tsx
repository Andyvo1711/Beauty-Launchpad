import Image from "next/image";
import Link from "next/link";
import { ArticleMeta } from "@/lib/content";

export default function ArticleCard({ article }: { article: ArticleMeta }) {
  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-rose-100 bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-rose-100">
        <Image
          src={article.coverImage}
          alt={article.title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <span className="w-fit rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-rose-800">
          {article.topic}
        </span>
        <h3 className="font-serif text-lg font-bold leading-snug text-ink-900 group-hover:text-rose-700">
          {article.title}
        </h3>
        <p className="line-clamp-2 text-sm text-ink-600">{article.excerpt}</p>
      </div>
    </Link>
  );
}
