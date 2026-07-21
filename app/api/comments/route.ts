import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";
import { SEED_COMMENTS } from "@/lib/seedComments";

export const dynamic = "force-dynamic";

let tableReady: Promise<unknown> | null = null;

function ensureTable() {
  if (!tableReady) {
    tableReady = sql`
      CREATE TABLE IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        slug TEXT NOT NULL,
        name TEXT NOT NULL,
        body TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `;
  }
  return tableReady;
}

async function seedIfEmpty(slug: string) {
  const seeds = SEED_COMMENTS[slug];
  if (!seeds || seeds.length === 0) return;

  const { rows } = await sql`
    SELECT COUNT(*)::int AS count FROM comments WHERE slug = ${slug};
  `;
  if (rows[0].count > 0) return;

  for (const seed of seeds) {
    await sql`
      INSERT INTO comments (slug, name, body, created_at)
      VALUES (${slug}, ${seed.name}, ${seed.text}, ${seed.date});
    `;
  }
}

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  await ensureTable();
  await seedIfEmpty(slug);

  const { rows } = await sql`
    SELECT name, body AS text, created_at AS date
    FROM comments
    WHERE slug = ${slug}
    ORDER BY created_at ASC;
  `;

  return NextResponse.json({ comments: rows });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const slug = typeof body?.slug === "string" ? body.slug.trim() : "";
  const name = typeof body?.name === "string" ? body.name.trim().slice(0, 60) : "";
  const text = typeof body?.text === "string" ? body.text.trim().slice(0, 1000) : "";

  if (!slug || !name || !text) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  await ensureTable();

  const { rows } = await sql`
    INSERT INTO comments (slug, name, body)
    VALUES (${slug}, ${name}, ${text})
    RETURNING name, body AS text, created_at AS date;
  `;

  return NextResponse.json({ comment: rows[0] });
}
