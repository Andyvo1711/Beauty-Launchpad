import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";

const ARTICLES_DIR = path.join(process.cwd(), "content", "articles");

export interface ArticleFrontmatter {
  title: string;
  slug: string;
  topic: string;
  date: string;
  excerpt: string;
  coverImage: string;
  imageCredit?: string;
  featured?: boolean;
}

export interface ArticleMeta extends ArticleFrontmatter {
  filename: string;
}

export interface Article extends ArticleMeta {
  contentHtml: string;
}

function loadAllMeta(): ArticleMeta[] {
  const filenames = fs.readdirSync(ARTICLES_DIR).filter((f) => f.endsWith(".md"));

  const articles = filenames.map((filename) => {
    const fullPath = path.join(ARTICLES_DIR, filename);
    const raw = fs.readFileSync(fullPath, "utf8");
    const { data } = matter(raw);
    return { ...(data as ArticleFrontmatter), filename };
  });

  articles.sort((a, b) => (a.date < b.date ? 1 : -1));

  return articles;
}

export function getAllArticles(): ArticleMeta[] {
  return loadAllMeta();
}

export function getFeaturedArticle(): ArticleMeta {
  const all = loadAllMeta();
  return all.find((a) => a.featured) ?? all[0];
}

export function getArticleBySlug(slug: string): Article | null {
  const meta = loadAllMeta().find((a) => a.slug === slug);
  if (!meta) return null;

  const fullPath = path.join(ARTICLES_DIR, meta.filename);
  const raw = fs.readFileSync(fullPath, "utf8");
  const { content } = matter(raw);

  const processed = remark().use(remarkGfm).use(remarkHtml).processSync(content);

  return { ...meta, contentHtml: processed.toString() };
}

export function getRelatedArticles(article: ArticleMeta, limit = 3): ArticleMeta[] {
  return loadAllMeta()
    .filter((a) => a.slug !== article.slug)
    .slice(0, limit);
}

export function getAllSlugs(): string[] {
  return loadAllMeta().map((a) => a.slug);
}
